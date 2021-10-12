import drawLinesVertShaderCode from './shaders/draw_lines.vert.wgsl';
import drawLinseFragShaderCode from './shaders/draw_lines.frag.wgsl';
import { Pipeline } from './pipeline'
import { Mesh } from './render_helpers'
import { mat4 } from 'gl-matrix'

export class DrawLinesPipeline extends Pipeline {
    private pipeline: GPURenderPipeline;
    private uniformBuffer: GPUBuffer;
    private uniformBindGroup: GPUBindGroup;

    constructor(canvas: HTMLCanvasElement, device: GPUDevice) {
        super(canvas, device);
        this.init();
    }

    private init() {
        const device = this.device;

        const vertModule = device.createShaderModule({ code: drawLinesVertShaderCode });
        const fragModule = device.createShaderModule({ code: drawLinseFragShaderCode });

        // 🔣 Input Assembly
        const positionAttribDesc: GPUVertexAttribute = {
            shaderLocation: 0, // [[location(0)]]
            offset: 0,
            format: 'float32x3'
        };
        const colorAttribDesc: GPUVertexAttribute = {
            shaderLocation: 1, // [[location(1)]]
            offset: 0,
            format: 'float32x3'
        };
        const positionBufferDesc: GPUVertexBufferLayout = {
            attributes: [positionAttribDesc],
            arrayStride: 4 * 3, // sizeof(float) * 3
            stepMode: 'vertex'
        };
        const colorBufferDesc: GPUVertexBufferLayout = {
            attributes: [colorAttribDesc],
            arrayStride: 4 * 3, // sizeof(float) * 3
            stepMode: 'vertex'
        };

        const vertex: GPUVertexState = {
            module: vertModule,
            entryPoint: 'main',
            buffers: [positionBufferDesc, colorBufferDesc]
        };

        // Color/Blend State
        const colorState: GPUColorTargetState = {
            format: 'bgra8unorm'
        };

        const fragment: GPUFragmentState = {
            module: fragModule,
            entryPoint: 'main',
            targets: [colorState]
        };

        // Rasterization
        const primitive: GPUPrimitiveState = {
            frontFace: 'cw',
            cullMode: 'none',
            topology: 'triangle-list'
        };

        const pipelineDesc: GPURenderPipelineDescriptor = {
            vertex,
            fragment,
            primitive,
        };
        this.pipeline = device.createRenderPipeline(pipelineDesc);

        // Uniform buffer layout
        const uniformBufferSize = 4 * 16; // 4x4 matrix
        this.uniformBuffer = device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.uniformBindGroup = device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.uniformBuffer,
                    },
                },
            ],
        });
    }

    encodeCommands(mesh: Mesh, targetTextureView: GPUTextureView): GPUCommandBuffer {
        let clear = false;

        let colorAttachment: GPURenderPassColorAttachment = {
            view: targetTextureView,
            // loadValue: { r: 0.1, g: 0.1, b: 0.1, a: 1 }, // Clear
            loadValue: clear ? { r: 0.1, g: 0.1, b: 0.1, a: 1 } : 'load',
            storeOp: 'store',
        };

        const renderPassDesc: GPURenderPassDescriptor = {
            colorAttachments: [colorAttachment],
        };

        const commandEncoder = this.device.createCommandEncoder();

        // 🖌️ Encode drawing commands
        const passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setViewport(0, 0, this.canvas.width, this.canvas.height, 0, 1);
        passEncoder.setScissorRect(0, 0, this.canvas.width, this.canvas.height);

        // Orthographic projection
        let mvp = mat4.create();
        const halfW = this.canvas.width / 2;
        const halfH = this.canvas.height / 2;
        const flipY = -1;
        mat4.ortho(mvp, -halfW, halfW, -halfH * flipY, halfH * flipY, -1, 1);

        mvp = mvp as Float32Array;
        this.queue.writeBuffer(this.uniformBuffer, 0, mvp.buffer, mvp.byteOffset, mvp.byteLength);
        passEncoder.setBindGroup(0, this.uniformBindGroup);

        // Create buffers dynamically every frame
        const positionBuffer = this.createBuffer(mesh.vertices, GPUBufferUsage.VERTEX);
        const colorBuffer = this.createBuffer(mesh.colors, GPUBufferUsage.VERTEX);
        const indexBuffer = this.createBuffer(mesh.indices, GPUBufferUsage.INDEX);

        passEncoder.setVertexBuffer(0, positionBuffer);
        passEncoder.setVertexBuffer(1, colorBuffer);
        passEncoder.setIndexBuffer(indexBuffer, 'uint16');
        passEncoder.drawIndexed(mesh.indices.length, 1);
        passEncoder.endPass();

        return commandEncoder.finish();
    }
}
