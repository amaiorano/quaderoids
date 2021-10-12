import { GameObject, Line, Scale, Offset } from './game_object'
import { vec3 } from 'gl-matrix'

export class Asteroid extends GameObject {
    private moveDir = vec3.create();
    private moveSpeed = 10.0;
    private maxTurnSpeed = 1;
    private maxSize = 4;
    private size: number;

    constructor(pos: vec3, moveDir: vec3, size: number) {
        super();

        this.position = pos;
        this.size = size;

        this.renderData = {
            lines: Scale(this.size * 15,
                Offset(-0.5, -0.5, [
                    new Line(0, 0, 1, 0),
                    new Line(1, 0, 1, 1),
                    new Line(1, 1, 0, 1),
                    new Line(0, 1, 0, 0),
                ])),
            color: Float32Array.from([1.0, 1.0, 1.0]),
        };

        this.rotation = Math.random() * 2 * Math.PI;

        if (moveDir) {
            this.moveDir = moveDir;
        } else {
            // Set random move direction
            vec3.rotateZ(this.moveDir, [1, 0, 0], [0, 0, 0], Math.random() * 2 * Math.PI);
        }
    }

    Size(): number { return this.size; }

    Update(dt: number) {
        let offset = vec3.create();
        vec3.scale(offset, this.moveDir, this.moveSpeed * dt);
        this.Move(this.moveDir);

        let turnSpeed = this.maxTurnSpeed * (this.maxSize / this.size);
        this.rotation += turnSpeed * dt;
    }
}
