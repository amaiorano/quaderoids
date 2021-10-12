[[binding(0), group(0)]] var mySampler: sampler;
[[binding(1), group(0)]] var myTexture: texture_2d<f32>;

[[block]] struct Uniforms {
  dir : vec2<f32>;
  resolution: f32;
  radius: f32;
};
[[binding(2), group(0)]] var<uniform> uniforms : Uniforms;

[[stage(fragment)]]
fn main([[location(0)]] fragUV: vec2<f32>) -> [[location(0)]] vec4<f32> {
    // the amount to blur, i.e. how far off center to sample from 
    // 1.0 -> blur by one pixel
    // 2.0 -> blur by two pixels, eUV.
    let blur = uniforms.radius / uniforms.resolution; 

    // the direction of our blur
    // (1.0, 0.0) -> x-axis blur
    // (0.0, 1.0) -> y-axis blur
    let hstep = uniforms.dir.x * blur;
    let vstep = uniforms.dir.y * blur;

    // Apply blurring, using a 9-tap filter with predefined gaussian weights
    var sum = vec4<f32>(0.0);

    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x - 4.0 * hstep, fragUV.y - 4.0 * vstep)) * 0.0162162162;
    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x - 3.0 * hstep, fragUV.y - 3.0 * vstep)) * 0.0540540541;
    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x - 2.0 * hstep, fragUV.y - 2.0 * vstep)) * 0.1216216216;
    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x - 1.0 * hstep, fragUV.y - 1.0 * vstep)) * 0.1945945946;
    
    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x, fragUV.y)) * 0.2270270270;

    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x + 1.0 * hstep, fragUV.y + 1.0 * vstep)) * 0.1945945946;
    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x + 2.0 * hstep, fragUV.y + 2.0 * vstep)) * 0.1216216216;
    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x + 3.0 * hstep, fragUV.y + 3.0 * vstep)) * 0.0540540541;
    sum = sum + textureSample(myTexture, mySampler, vec2<f32>(fragUV.x + 4.0 * hstep, fragUV.y + 4.0 * vstep)) * 0.0162162162;

    return vec4<f32>(sum.rgb, 1.0);
}
