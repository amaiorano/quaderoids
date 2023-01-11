@binding(0) @group(0) var mySampler: sampler;
@binding(1) @group(0) var myTexture: texture_2d<f32>;

@fragment
fn main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
  return textureSample(myTexture, mySampler, fragUV);
}
