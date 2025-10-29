import type {MountOptions, MountResult} from '@playwright/experimental-ct-react';
import type {
    Locator,
    PageScreenshotOptions,
    PlaywrightTestArgs,
    PlaywrightTestOptions,
    PlaywrightWorkerArgs,
    PlaywrightWorkerOptions,
    TestFixture,
} from '@playwright/test';

interface ComponentFixtures {
    mount<HooksConfig extends any>(
        component: JSX.Element,
        options?: MountOptions<HooksConfig>,
        style?: React.CSSProperties,
    ): Promise<MountResult>;
}

type PlaywrightTestFixtures = PlaywrightTestArgs & PlaywrightTestOptions & ComponentFixtures;
type PlaywrightWorkerFixtures = PlaywrightWorkerArgs & PlaywrightWorkerOptions;
type PlaywrightFixtures = PlaywrightTestFixtures & PlaywrightWorkerFixtures;
export type PlaywrightFixture<T> = TestFixture<T, PlaywrightFixtures>;

export type MountFixture = ComponentFixtures['mount'];

export interface ExpectScreenshotFixture {
    (props?: CaptureScreenshotParams): Promise<void>;
}

interface CaptureScreenshotParams extends PageScreenshotOptions {
    screenshotName?: string;
    component?: Locator;
}

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
type JsonArray = JsonValue[];
type JsonObject = {[Key in string]?: JsonValue};

export type Fixtures = {
    mount: MountFixture;
    expectScreenshot: ExpectScreenshotFixture;
    defaultDelay: () => Promise<void>;
};
