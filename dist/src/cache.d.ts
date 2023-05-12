export declare class TracerCache {
    tokenDecimals: Map<string, number>;
    contractNames: Map<string, string>;
    fourByteDir: Map<string, string>;
    cachePath: string | undefined;
    setCachePath(cachePath: string): void;
    load(): void;
    save(): void;
    getTracerCachePath(): string;
}
//# sourceMappingURL=cache.d.ts.map