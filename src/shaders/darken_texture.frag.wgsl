@binding(0) @group(0) var mySampler: sampler;
@binding(1) @group(0) var myTexture: texture_2d<f32>;

struct Uniforms {
  deltaTime : f32,
  darkenRate : f32,
};
@binding(2) @group(0) var<uniform> uniforms : Uniforms;

// Integate current to target_val using a damped approach. Rate of 0.99 means we'd reach
// 99% of the way to target_val in 1 second.
fn integrateDamped(current: vec3<f32>, target_val: vec3<f32>, rate: f32, deltaTime: f32) -> vec3<f32> {
    let ratio = 1.0 - pow(1.0 - rate, deltaTime);
    return mix(current, target_val, ratio);
}

@fragment
fn main(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
  let current4 : vec4<f32> = textureSample(myTexture, mySampler, fragUV);

  var current = current4.rgb;
  if (any(current > vec3<f32>(0.1))) {
    let rate = uniforms.darkenRate; //0.999;
    let target_val = vec3<f32>(0.0);
    current = integrateDamped(current, target_val, rate, uniforms.deltaTime);    
  } else {
    current = vec3<f32>(0.0);
  }

  return vec4<f32>(current, current4.a);
}
