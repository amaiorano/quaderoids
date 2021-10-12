export abstract class Pipeline {
    protected canvas: HTMLCanvasElement;
    protected device: GPUDevice;
    protected queue: GPUQueue;

    constructor(canvas: HTMLCanvasElement, device: GPUDevice) {
        this.canvas = canvas;
        this.device = device;
        this.queue = device.queue;
    }

    protected createBuffer(
        arr: Float32Array | Uint16Array,
        usage: number
    ): GPUBuffer {
        // 📏 Align to 4 bytes (thanks @chrimsonite)
        let desc = {
            size: (arr.byteLength + 3) & ~3,
            usage,
            mappedAtCreation: true
        };
        let buffer = this.device.createBuffer(desc);
        const writeArray =
            arr instanceof Uint16Array
                ? new Uint16Array(buffer.getMappedRange())
                : new Float32Array(buffer.getMappedRange());
        writeArray.set(arr);
        buffer.unmap();
        return buffer;
    };
};
