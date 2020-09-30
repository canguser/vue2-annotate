export function VueComponent(params?: { name?: string } | string): Object;

export function Computed(): void;

export function Extra(): void;

export function NativeApi(): void;

export function Props(
    params?: {
        name?: string,
        model?: boolean,
        changeEvent?: string
    } | string
): void;

export function Watch(params?: { property?: string, deep?: boolean, immediate?: boolean } | string): void;

export function Model(
    params?: {
        name?: string,
        model?: boolean,
        changeEvent?: string
    } | string
): void;

export {
    Surround,
    Annotate,
    BasicAnnotationDescribe,
    AnnotationGenerator,
    DynamicParam,
    DefaultParam
} from '@palerock/annotate-js'