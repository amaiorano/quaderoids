import { Line } from './game_object'
import { linesToMesh } from './render_helpers'
import { DrawLinesPipeline } from './draw_lines_pipeline'
import { CopyTexturePipeline } from './copy_texture_pipeline'
import { DarkenTexturePipeline } from './darken_texture_pipeline'
import { GlowTexturePipeline } from './glow_texture'
import { CombineTexturesPipeline } from './combine_textures_pipeline'
import maxTexturesFragShaderCode from './shaders/max_textures.frag.wgsl';
import overlayTextureFragShaderCode from './shaders/overlay_texture.frag.wgsl'

// Tweakable HTML element vars
let glowEnabled: boolean = true;
let glowRadius: number = 1.2;
let darkenRate: number = 0.999;
export function windowOnLoad() {
    document.getElementById('glow_enabled').addEventListener('change', () => {
        glowEnabled = !glowEnabled;
    });

    document.getElementById('glow_radius').oninput = () => {
        const input = document.getElementById('glow_radius') as HTMLInputElement;
        console.log('glow_radius:', input.value);
        glowRadius = +input.value;
    }

    document.getElementById('darken_rate').oninput = () => {
        const input = document.getElementById('darken_rate') as HTMLInputElement;
        console.log('darken_rate:', input.value);
        darkenRate = +input.value;
    }
}

export default class Renderer {
    canvas: HTMLCanvasElement;

    // ⚙️ API Data Structures
    adapter: GPUAdapter;
    device: GPUDevice;
    queue: GPUQueue;

    // 🎞️ Frame Backings
    context: GPUCanvasContext;

    // Textures
    linesTextureViews = new Array<GPUTextureView>();
    currLineTextureIdx = 0;

    scratchTextureView: GPUTextureView;
    glowTextureView: GPUTextureView;
    overlayTextureView: GPUTextureView;

    // Pipelines
    drawLinesPipeline: DrawLinesPipeline;
    copyTexturePipeline: CopyTexturePipeline;
    darkenTexturePipeline: DarkenTexturePipeline;
    glowTexturePipeline: GlowTexturePipeline;
    combineLinesAndGlowPipline: CombineTexturesPipeline;
    overlayTexturePipeline: CombineTexturesPipeline;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    async init() {
        if (await this.initializeAPI()) {
            await this.onResize();
        }
    }

    async initializeAPI(): Promise<boolean> {
        try {
            const entry: GPU = navigator.gpu;
            if (!entry) {
                console.log("WebGPU may not be supported in your browser");
                return false;
            }

            this.adapter = await entry.requestAdapter();
            this.device = await this.adapter.requestDevice();
            this.queue = this.device.queue;

            this.drawLinesPipeline = new DrawLinesPipeline(this.canvas, this.device);
            this.copyTexturePipeline = new CopyTexturePipeline(this.canvas, this.device);
            this.darkenTexturePipeline = new DarkenTexturePipeline(this.canvas, this.device);
            this.glowTexturePipeline = new GlowTexturePipeline(this.canvas, this.device);
            this.combineLinesAndGlowPipline = new CombineTexturesPipeline(this.canvas, this.device, maxTexturesFragShaderCode);
            this.overlayTexturePipeline = new CombineTexturesPipeline(this.canvas, this.device, overlayTextureFragShaderCode);

        } catch (e) {
            console.error(e);
            return false;
        }

        return true;
    }

    async loadTextureFile(imgSrc: any): Promise<GPUTexture> {
        const img = document.createElement('img');
        img.src = imgSrc;
        await img.decode();
        const imageBitmap = await createImageBitmap(img);

        let texture = this.device.createTexture({
            size: [imageBitmap.width, imageBitmap.height, 1],
            format: 'rgba8unorm',
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        });
        this.queue.copyExternalImageToTexture(
            { source: imageBitmap },
            { texture: texture },
            [imageBitmap.width, imageBitmap.height]
        );
        return texture;
    }

    async onResize() {
        if (!this.context) {
            this.context = this.canvas.getContext('webgpu');
            const canvasConfig: GPUCanvasConfiguration = {
                device: this.device,
                format: 'bgra8unorm',
                usage:
                    GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
            };
            this.context.configure(canvasConfig);
        }

        const textureDesc: GPUTextureDescriptor = {
            size: [this.canvas.width, this.canvas.height, 1],
            dimension: '2d',
            format: 'bgra8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
                | GPUTextureUsage.TEXTURE_BINDING // Texture binding required to be used as a render target
        };

        // Create two textures to ping-pong between
        this.linesTextureViews.push(this.device.createTexture(textureDesc).createView());
        this.linesTextureViews.push(this.device.createTexture(textureDesc).createView());
        this.linesTextureViews.push(this.device.createTexture(textureDesc).createView());
        this.linesTextureViews.push(this.device.createTexture(textureDesc).createView());

        this.scratchTextureView = this.device.createTexture(textureDesc).createView();
        this.glowTextureView = this.device.createTexture(textureDesc).createView();
        this.overlayTextureView = (await this.loadTextureFile(require('../images/quaderoids_overlay.png'))).createView();
    }

    // Called once per frame
    render(dt: number, lines: Array<Line>) {
        // ⏭ Acquire next image from context
        const colorTexture = this.context.getCurrentTexture();
        const colorTextureView = colorTexture.createView();

        const mesh = linesToMesh(lines, 1);
        const meshThick = linesToMesh(lines, 2);

        this.currLineTextureIdx = (this.currLineTextureIdx + 1) % 2;
        const nextLineTextureIdx = (this.currLineTextureIdx + 1) % 2;

        const firstLineTextureView = this.linesTextureViews[this.currLineTextureIdx];
        const nextLineTextureView = this.linesTextureViews[(this.currLineTextureIdx + 1) % 2];

        const firstThickLineTextureView = this.linesTextureViews[this.currLineTextureIdx + 2];
        const nextThickLineTextureView = this.linesTextureViews[nextLineTextureIdx + 2];

        let commandBuffers = Array<GPUCommandBuffer>();

        // Draw lines
        commandBuffers.push(
            this.drawLinesPipeline.encodeCommands(mesh, firstLineTextureView)
        );

        // Darken
        commandBuffers.push(
            this.darkenTexturePipeline.encodeCommands(firstLineTextureView, nextLineTextureView, true, dt, darkenRate)
        );

        if (glowEnabled) {
            // Draw thick lines
            commandBuffers.push(
                this.drawLinesPipeline.encodeCommands(meshThick, firstThickLineTextureView)
            );

            // Darken thick lines
            commandBuffers.push(
                this.darkenTexturePipeline.encodeCommands(firstThickLineTextureView, nextThickLineTextureView, true, dt, darkenRate)
            );

            // Glow
            commandBuffers.push(...
                this.glowTexturePipeline.encodeCommands(firstThickLineTextureView, this.scratchTextureView, this.glowTextureView, true, glowRadius)
            );

            // Combine lines and glow to scratch
            commandBuffers.push(
                this.combineLinesAndGlowPipline.encodeCommands(nextLineTextureView, this.glowTextureView, this.scratchTextureView, false)
            );
        } else {
            // Copy to scratch
            commandBuffers.push(
                this.copyTexturePipeline.encodeCommands(nextLineTextureView, this.scratchTextureView)
            );
        }

        // Apply overlay on top of scratch to canvas
        commandBuffers.push(
            this.overlayTexturePipeline.encodeCommands(this.scratchTextureView, this.overlayTextureView, colorTextureView, true)
        );

        this.queue.submit(commandBuffers);
    };
}
