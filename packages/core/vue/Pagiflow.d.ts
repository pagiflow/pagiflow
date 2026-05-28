import { type PropType } from 'vue';
import type { PagiflowOptions } from './types';
export declare const Pagiflow: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    options: {
        type: PropType<PagiflowOptions>;
        default: () => {};
    };
    tag: {
        type: StringConstructor;
        default: string;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("slideChange" | "ready")[], "slideChange" | "ready", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    options: {
        type: PropType<PagiflowOptions>;
        default: () => {};
    };
    tag: {
        type: StringConstructor;
        default: string;
    };
}>> & Readonly<{
    onSlideChange?: ((...args: any[]) => any) | undefined;
    onReady?: ((...args: any[]) => any) | undefined;
}>, {
    options: PagiflowOptions;
    tag: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
