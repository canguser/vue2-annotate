export function VueComponent(params?: { name?: string } | string): Object;

export function Computed(): void;

export function Extra(): void;

export function NativeApi(): void;

export function Props(
    params?: {
        model?: boolean,
        changeEvent?: string
    } | boolean
): void;

export function Watch(params?: { property?: string, deep?: boolean, immediate?: boolean } | string): void;

export function Model(
    params?: {
        model?: boolean,
        changeEvent?: string
    } | string
): void;
