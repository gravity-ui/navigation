import type {Page} from '@playwright/test';

export type PaintBox = {x: number; y: number; width: number; height: number};

// Compare two actual, paused browser screenshots. This intentionally recognizes
// every RGB change, including translucent selection paint blended with a theme.
export async function comparePaint(page: Page, before: Buffer, after: Buffer, regions: PaintBox[]) {
    return page.evaluate(
        async ({first, second, areas}) => {
            const decode = async (png: string) => {
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
            };
            const a = await decode(first);
            const b = await decode(second);
            return areas.map((area) => {
                const x = Math.max(0, Math.floor(area.x));
                const y = Math.max(0, Math.floor(area.y));
                const width = Math.min(a.width, Math.ceil(area.x + area.width)) - x;
                const height = Math.min(a.height, Math.ceil(area.y + area.height)) - y;
                if (width <= 0 || height <= 0)
                    return {changedPixels: 0, inkPixels: 0, retainedInkPixels: 0};
                const left = a.context.getImageData(x, y, width, height).data;
                const right = b.context.getImageData(x, y, width, height).data;
                let changedPixels = 0;
                let inkPixels = 0;
                let retainedInkPixels = 0;
                for (let offset = 0; offset < left.length; offset += 4) {
                    if (
                        [0, 1, 2].some(
                            (channel) =>
                                Math.abs(left[offset + channel] - right[offset + channel]) > 3,
                        )
                    )
                        changedPixels++;
                    // Named glyph regions include the theme's translucent gray
                    // icons: on yellow their dark core can reach red=74. These
                    // thresholds retain gray ink but exclude solid blue (B=221).
                    if ([0, 1, 2].every((channel) => left[offset + channel] < 110)) {
                        inkPixels++;
                        if ([0, 1, 2].every((channel) => right[offset + channel] < 120))
                            retainedInkPixels++;
                    }
                }
                return {changedPixels, inkPixels, retainedInkPixels};
            });
        },
        {first: before.toString('base64'), second: after.toString('base64'), areas: regions},
    );
}

// Decode the actual browser screenshot, not a DOM/canvas reconstruction of the
// component. Keeping this in the browser avoids a new PNG-decoder dependency.
export async function selectionPaint(page: Page, area: PaintBox) {
    const screenshot = await page.screenshot({animations: 'allow', scale: 'css'});
    return page.evaluate(
        async ({png, box}) => {
            const image = new Image();
            image.src = `data:image/png;base64,${png}`;
            await image.decode();
            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Screenshot pixel context unavailable');
            context.drawImage(image, 0, 0);
            const left = Math.max(0, Math.floor(box.x));
            const top = Math.max(0, Math.floor(box.y));
            const width = Math.min(canvas.width, Math.ceil(box.x + box.width)) - left;
            const height = Math.min(canvas.height, Math.ceil(box.y + box.height)) - top;
            if (width <= 0 || height <= 0) throw new Error('Screenshot sample is outside viewport');
            const pixels = context.getImageData(left, top, width, height).data;
            let minX = width;
            let minY = height;
            let maxX = -1;
            let maxY = -1;
            let selectionPixels = 0;
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const offset = (y * width + x) * 4;
                    const red = pixels[offset];
                    const green = pixels[offset + 1];
                    const blue = pixels[offset + 2];
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
        },
        {png: screenshot.toString('base64'), box: area},
    );
}
