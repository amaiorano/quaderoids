import { vec3 } from "gl-matrix";
import { Line } from "./game_object";

export class Mesh {
    vertices: Float32Array;
    colors: Float32Array;
    indices: Uint16Array;
}

// Returns normalized vector that is orthogonal to the vector from a to b in XY plane
export function orthoNormal(a: vec3, b: vec3): vec3 {
    let temp = vec3.create();
    let n = vec3.create();
    const up = vec3.fromValues(0, 0, 1);
    vec3.cross(n, vec3.sub(temp, a, b), up);
    return vec3.normalize(n, n);
}

export function linesToMesh(lines: Array<Line>, lineWidth: number): Mesh {
    let vertices = new Array<number>();
    let indices = new Array<number>();
    let colors = new Array<number>();
    lines.forEach((line, i) => {
        const p1 = line.p1;
        const p2 = line.p2;

        // Compute orthogonal vector to line to create a thin quad
        // Do this in 3D for cross product, then store result as 2D vector
        let n = orthoNormal(p1, p2);

        // Scale to line width
        n = vec3.scale(n, n, lineWidth);

        // Compute 4 quad vertices
        let p1u: vec3 = vec3.create();
        let p1d: vec3 = vec3.create();
        let p2u: vec3 = vec3.create();
        let p2d: vec3 = vec3.create();
        vec3.add(p1u, p1, n);
        vec3.sub(p1d, p1, n);
        vec3.add(p2u, p2, n);
        vec3.sub(p2d, p2, n);

        // Now create two triangles out of the 4 corners of our line
        // p1u (0) --------------- p2u (3)
        //  |                       |
        // p1d (1) --------------- p2d (2)
        vertices.push(
            p1u[0], p1u[1], p1u[2],
            p1d[0], p1d[1], p1u[2],
            p2d[0], p2d[1], p1u[2],
            p2u[0], p2u[1], p1u[2]
        );

        // Add 6 indices (2x3 triangles), indexing 4 verts above
        const off = i * 4;
        indices.push(off + 0, off + 1, off + 2, off + 2, off + 3, off + 0);

        // Set vertex colors
        const allWhite = true;
        if (allWhite) {
            colors.push(
                1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,
            );
        } else {
            colors.push(
                1.0, 1.0, 1.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                1.0, 1.0, 1.0
            );
        }

    });

    return {
        vertices: new Float32Array(vertices),
        colors: new Float32Array(colors),
        indices: new Uint16Array(indices)
    } as Mesh;
}
