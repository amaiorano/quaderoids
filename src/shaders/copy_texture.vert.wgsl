struct VSOut {
    @builtin(position) Position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@vertex
fn main(@location(0) inPos: vec3<f32>,
        @location(1) inUV: vec2<f32>) -> VSOut {
    var vsOut: VSOut;
    //vsOut.Position = uniforms.modelViewProjectionMatrix * vec4<f32>(inPos, 1.0);
    vsOut.Position = vec4<f32>(inPos, 1.0);
    vsOut.uv = inUV;
    return vsOut;
}