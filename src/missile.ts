import { GameObject, Line, Scale, Offset } from './game_object'
import { vec3 } from 'gl-matrix'

export class Missile extends GameObject {
    private moveSpeed = 10;
    private maxAge = 1.0;

    private dir: vec3;
    private age: number = 0;
    private size: number = 5;

    constructor(pos: vec3, dir: vec3) {
        super();
        this.renderData = {
            lines: Scale(this.size,
                Offset(-0.5, -0.5, [
                    new Line(0, 0, 1, 0),
                    new Line(1, 0, 1, 1),
                    new Line(1, 1, 0, 1),
                    new Line(0, 1, 0, 0),
                ])),
            color: Float32Array.from([1.0, 1.0, 1.0]),
        };
        this.rotation = 0;

        this.position = pos;
        this.dir = dir;
    }

    Update(dt: number) {
        this.age += dt;
        if (this.age > this.maxAge) {
            this.dead = true;
        }

        this.rotation += 100 * dt;

        let off = vec3.create();
        vec3.scale(off, this.dir, this.moveSpeed);
        this.Move(off);
    }
}
