import copyTextureVertShaderCode from './shaders/copy_texture.vert.wgsl'
import glowTextureFragShaderCode from './shaders/glow_texture.frag.wgsl';
import { Pipeline } from './pipeline';
import { vec2 } from 'gl-matrix';

export class GlowTexturePipeline extends Pipeline {
    private pipeline: GPURenderPipeline;
    private uniformBuffer: GPUBuffer;
    private uniformBindGroupDescriptor: GPUBindGroupDescriptor;

    constructor(canvas: HTMLCanvasElement, device: GPUDevice) {
        super(canvas, device);
        this.init();
    }

    private init() {
        this.pipeline = this.device.createRenderPipeline(
            // GPURenderPipelineDescription
            {
                // GPUVertexState
                vertex: {
                    module: this.device.createShaderModule({
                        code: copyTextureVertShaderCode
                    }),
                    entryPoint: 'main',
                    buffers: [
                        // Two buffers, one positions, one for uvs

                        // Position buffer
                        {
                            arrayStride: 4 * 3, // sizeof(float) * 3
                            attributes: [
                                // GPUVertexAttribute
                                {
                                    shaderLocation: 0, // [[location(0)]]
                                    offset: 0,
                                    format: 'float32x3',
                                }
                            ],
                        },
                        // UV buffer
                        {
                            arrayStride: 4 * 2, // sizeof(float) * 2
                            attributes: [
                                // GPUVertexAttribute
                                {
                                    // uv
                                    shaderLocation: 1, // [[location(1)]]
                                    offset: 0,
                                    format: 'float32x2',
                                },
                            ],
                        },
                    ],
                },

                // GPUFragmentState
                fragment: {
                    module: this.device.createShaderModule({
                        code: glowTextureFragShaderCode
                    }),
                    entryPoint: 'main',
                    targets: [
                        // GPUColorTargetState
                        { format: 'bgra8unorm' }
                    ]
                },

                // GPUPrimitiveState (probably not needed)
                primitive: {
                    frontFace: 'cw',
                    topology: 'triangle-list',
                    cullMode: 'none',
                }
            }
        );

        const sampler = this.device.createSampler({
            magFilter: 'nearest',
            minFilter: 'nearest',
        });

        // Uniform buffer layout
        const uniformBufferSize =
            4 * 2   // dir : vec2<f32>;
            + 4     // resolution: f32;
            + 4;    // radius: f32;
        this.uniformBuffer = this.device.createBuffer({
            size: uniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.uniformBindGroupDescriptor = {
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: sampler,
                },
                {
                    binding: 1,
                    resource: undefined, // Is set dynamically during encodeCommands
                },
                {
                    binding: 2,
                    resource: { buffer: this.uniformBuffer },
                },
            ],
        };
    }

    encodeCommands(sourceTextureView: GPUTextureView, scratchTextureView: GPUTextureView, targetTextureView: GPUTextureView, flipY: boolean, glowRadius: number): GPUCommandBuffer[] {
        return [
            this.doEncodeCommands(sourceTextureView, scratchTextureView, flipY, glowRadius, [1.0, 0.0]),
            this.doEncodeCommands(scratchTextureView, targetTextureView, flipY, glowRadius, [0.0, 1.0])
        ];
    }

    private doEncodeCommands(sourceTextureView: GPUTextureView, targetTextureView: GPUTextureView, flipY: boolean, glowRadius: number, dir: vec2): GPUCommandBuffer {
        // Attachment is the canvas texture view
        let colorAttachment: GPURenderPassColorAttachment = {
            view: targetTextureView,
            loadValue: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
            storeOp: 'store'
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

        // Set which texture to copy from
        this.uniformBindGroupDescriptor.entries[1].resource = sourceTextureView;
        const uniformBindGroup = this.device.createBindGroup(this.uniformBindGroupDescriptor);

        const uniforms = Float32Array.from([
            1.0, 0.0, // dir : vec2<f32>;
            this.canvas.width, // resolution: f32;
            glowRadius, // radius: f32;
        ]);
        this.queue.writeBuffer(this.uniformBuffer, 0, uniforms.buffer, uniforms.byteOffset, uniforms.byteLength);

        passEncoder.setBindGroup(0, uniformBindGroup);

        // Create buffers dynamically every frame

        // Full screen quad
        const hw = 1;// this.canvas.width / 2;
        const hh = 1;//this.canvas.height / 2;
        let bottomLeft = [-hw, -hh, 0];
        let bottomRight = [hw, -hh, 0];
        let topRight = [hw, hh, 0];
        let topLeft = [-hw, hh, 0];
        if (flipY) {
            [bottomLeft, topLeft] = [topLeft, bottomLeft];
            [bottomRight, topRight] = [topRight, bottomRight];
        }

        let vertices = [
            bottomLeft, bottomRight, topRight,
            topRight, topLeft, bottomLeft
        ].flat();

        const bottomLeftUV = [0, 0];
        const bottomRightUV = [1, 0];
        const topRightUV = [1, 1];
        const topLeftUV = [0, 1];
        let uvs = [
            bottomLeftUV, bottomRightUV, topRightUV,
            topRightUV, topLeftUV, bottomLeftUV
        ].flat();

        const positionBuffer = this.createBuffer(new Float32Array(vertices), GPUBufferUsage.VERTEX);
        const uvBuffer = this.createBuffer(new Float32Array(uvs), GPUBufferUsage.VERTEX);

        passEncoder.setVertexBuffer(0, positionBuffer);
        passEncoder.setVertexBuffer(1, uvBuffer);
        passEncoder.draw(vertices.length / 3, 1, 0, 0);
        passEncoder.endPass();

        return commandEncoder.finish();
    }
}