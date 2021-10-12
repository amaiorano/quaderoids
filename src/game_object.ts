import { mat4, vec3 } from 'gl-matrix'

export class Line {
    constructor(p1x?: number, p1y?: number, p2x?: number, p2y?: number) {
        this.p1 = vec3.fromValues(p1x, p1y, 0);
        this.p2 = vec3.fromValues(p2x, p2y, 0);
    }

    p1: vec3;
    p2: vec3;
}

export class RenderData {
    lines: Array<Line>;
    color: Float32Array; // RGB
}

const zeroVec3: vec3 = [0, 0, 0];

type Lines = Array<Line>;

export function Scale(s: number, lines: Lines): Lines {
    lines.forEach(line => {
        vec3.scale(line.p1, line.p1, s);
        vec3.scale(line.p2, line.p2, s);
    });
    return lines;
}

export function Offset(x: number, y: number, lines: Lines) {
    lines.forEach(line => {
        line.p1[0] += x;
        line.p1[1] += y;
        line.p2[0] += x;
        line.p2[1] += y;
    });
    return lines;
}

export abstract class GameObject {
    renderData: RenderData;
    position: vec3 = vec3.create();
    rotation: number = 0; // degrees
    dead: boolean = false;

    // TODO: use a transform matrix
    // transform: mat4 = mat4.create();

    abstract Update(dt: number): void;

    PositionVec(): vec3 {
        return [...this.position] as vec3;
    }

    ForwardVec(): vec3 {
        let fwd: vec3 = [1, 0, 0];
        return vec3.rotateZ(fwd, fwd, zeroVec3, this.rotation);
    }

    MoveForward(offset: number) {
        let fwd = this.ForwardVec();
        vec3.scale(fwd, fwd, offset);
        vec3.add(this.position, this.position, fwd);
    }

    Move(offset: vec3) {
        vec3.add(this.position, this.position, offset);
    }

    TurnLeft(rads: number) {
        this.rotation += rads;
    }

    TurnRight(rads: number) {
        this.rotation -= rads;
    }

    Lines(): Array<Line> {
        const lines = this.renderData.lines;
        return lines.map((line, i) => {

            let t = mat4.create();
            mat4.fromTranslation(t, this.position);
            mat4.rotate(t, t, this.rotation, vec3.fromValues(0, 0, 1));

            let newLine = new Line();
            vec3.transformMat4(newLine.p1, line.p1, t);
            vec3.transformMat4(newLine.p2, line.p2, t);
            return newLine;
        });
    }

    extents: vec3; // Cached extents, computed lazily
    Extents(): vec3 {
        if (this.extents) {
            return this.extents;
        }

        let left = 0;
        let right = 0;
        let up = 0;
        let down = 0;

        const lines = this.renderData.lines;
        lines.forEach(line => {
            left = Math.min(left, line.p1[0]);
            left = Math.min(left, line.p2[0]);
            right = Math.max(right, line.p1[0]);
            right = Math.max(right, line.p2[0]);

            down = Math.min(down, line.p1[1]);
            down = Math.min(down, line.p2[1]);
            up = Math.max(up, line.p1[1]);
            up = Math.max(up, line.p2[1]);
        });

        this.extents = vec3.fromValues(right - left, down - up, 0);
        return this.extents;
    }

    Radius(): number {
        const e = this.Extents();
        return Math.max(e[0], e[1]) / 2;
    }
}
