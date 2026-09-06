import type {Page} from '@playwright/test';

export type PaintBox = {x: number; y: number; width: number; height: number};

async function sampleScreenshotRegions(
    page: Page,
    screenshots: Buffer[],
    regions: PaintBox[],
    operation: 'compare' | 'selection',
) {
    return page.evaluate(
        async ({pngs, areas, sampleOperation}) => {
            const decoded = await Promise.all(
                pngs.map(async (png) => {
                    const image = new Image();
                    image.src = `data:image/png;base64,${png}`;
                    await image.decode();
                    const canvas = document.createElement('canvas');
                    canvas.width = image.naturalWidth;
                    canvas.height = image.naturalHeight;
                    const context = canvas.getContext('2d');
                    if (!context) throw new Error('Screenshot pixel context unavailable');
                    context.drawImage(image, 0, 0);
                    return {context, width: canvas.width, height: canvas.height};
                }),
            );
            const first = decoded[0];
            if (!first) throw new Error('Screenshot sample is missing an image');
            const second = decoded[1];

            return areas.map((area) => {
                const left = Math.max(0, Math.floor(area.x));
                const top = Math.max(0, Math.floor(area.y));
                const width = Math.min(first.width, Math.ceil(area.x + area.width)) - left;
                const height = Math.min(first.height, Math.ceil(area.y + area.height)) - top;
                if (width <= 0 || height <= 0) {
                    if (sampleOperation === 'selection')
                        throw new Error('Screenshot sample is outside viewport');
                    // An empty comparison region has no painted pixels. Selection
                    // callers use the strict branch above so required paint checks
                    // cannot pass through an empty intersection.
                    return {
                        operation: 'compare' as const,
                        changedPixels: 0,
                        inkPixels: 0,
                        retainedInkPixels: 0,
                    };
                }

                const firstPixels = first.context.getImageData(left, top, width, height).data;
                if (sampleOperation === 'compare') {
                    if (!second)
                        throw new Error('Screenshot comparison is missing its second image');
                    const secondPixels = second.context.getImageData(left, top, width, height).data;
                    let changedPixels = 0;
                    let inkPixels = 0;
                    let retainedInkPixels = 0;
                    for (let offset = 0; offset < firstPixels.length; offset += 4) {
                        if (
                            [0, 1, 2].some(
                                (channel) =>
                                    Math.abs(
                                        firstPixels[offset + channel] -
                                            secondPixels[offset + channel],
                                    ) > 3,
                            )
                        )
                            changedPixels++;
                        // Named glyph regions include the theme's translucent gray
                        // icons: on yellow their dark core can reach red=74. These
                        // thresholds retain gray ink but exclude solid blue (B=221).
                        if ([0, 1, 2].every((channel) => firstPixels[offset + channel] < 110)) {
                            inkPixels++;
                            if ([0, 1, 2].every((channel) => secondPixels[offset + channel] < 120))
                                retainedInkPixels++;
                        }
                    }
                    return {
                        operation: 'compare' as const,
                        changedPixels,
                        inkPixels,
                        retainedInkPixels,
                    };
                }

                let minX = width;
                let minY = height;
                let maxX = -1;
                let maxY = -1;
                let selectionPixels = 0;
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const offset = (y * width + x) * 4;
                        const red = firstPixels[offset];
                        const green = firstPixels[offset + 1];
                        const blue = firstPixels[offset + 2];
                        if (
                            Math.abs(red - 17) <= 2 &&
                            Math.abs(green - 85) <= 2 &&
                            Math.abs(blue - 221) <= 2
                        ) {
                            minX = Math.min(minX, x);
                            minY = Math.min(minY, y);
                            maxX = Math.max(maxX, x);
                            maxY = Math.max(maxY, y);
                            selectionPixels++;
                        }
                    }
                }
                return {
                    operation: 'selection' as const,
                    selectionPixels,
                    bounds: selectionPixels
                        ? {
                              x: left + minX,
                              y: top + minY,
                              width: maxX - minX + 1,
                              height: maxY - minY + 1,
                          }
                        : null,
                };
            });
        },
        {
            pngs: screenshots.map((screenshot) => screenshot.toString('base64')),
            areas: regions,
            sampleOperation: operation,
        },
    );
}

// Compare two actual, paused browser screenshots. This intentionally recognizes
// every RGB change, including translucent selection paint blended with a theme.
export async function comparePaint(page: Page, before: Buffer, after: Buffer, regions: PaintBox[]) {
    const results = await sampleScreenshotRegions(page, [before, after], regions, 'compare');
    return results.map((result) => {
        if (result.operation !== 'compare')
            throw new Error('Screenshot comparison returned a selection sample');
        return {
            changedPixels: result.changedPixels,
            inkPixels: result.inkPixels,
            retainedInkPixels: result.retainedInkPixels,
        };
    });
}

// Decode the actual browser screenshot, not a DOM/canvas reconstruction of the
// component. Keeping this in the browser avoids a new PNG-decoder dependency.
export async function selectionPaint(page: Page, area: PaintBox) {
    const screenshot = await page.screenshot({animations: 'allow', scale: 'css'});
    const [result] = await sampleScreenshotRegions(page, [screenshot], [area], 'selection');
    if (!result || result.operation !== 'selection')
        throw new Error('Screenshot selection returned a comparison sample');
    return {selectionPixels: result.selectionPixels, bounds: result.bounds};
}
