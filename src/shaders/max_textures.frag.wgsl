[[binding(0), group(0)]] var sampler0: sampler;
[[binding(1), group(0)]] var texture0: texture_2d<f32>;
[[binding(2), group(0)]] var sampler1: sampler;
[[binding(3), group(0)]] var texture1: texture_2d<f32>;

[[stage(fragment)]]
fn main([[location(0)]] fragUV: vec2<f32>) -> [[location(0)]] vec4<f32> {
  let c0 = textureSample(texture0, sampler0, fragUV);
  let c1 = textureSample(texture1, sampler1, fragUV);
  return max(c0, c1);
}
