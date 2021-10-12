import { GameObject, Line, Scale, Offset } from './game_object'
import { vec3 } from 'gl-matrix'

export class Ship extends GameObject {
    constructor() {
        super();
        this.renderData = {
            lines: Scale(10,
                Offset(-1, 0, [
                    new Line(0, 0, -1, 1),
                    new Line(-1, 1, 3, 0),
                    new Line(3, 0, -1, -1),
                    new Line(-1, -1, 0, 0),
                ])),
            color: Float32Array.from([1.0, 1.0, 1.0]),
        };
        this.rotation = Math.PI / 2;
    }

    private maxSpeed = 9.0;
    private accelRate = 1;
    private breakRate = 4;

    private speed: number = 0;
    private velocity: vec3 = vec3.create();
    private accelerate: boolean = false;

    Accelerate() {
        // Initial speed boost on accelerate
        if (!this.accelerate) {
            this.speed = 0.5;
        }
        this.accelerate = true;
    }

    Decelerate() {
        this.accelerate = false;
    }

    Update(dt: number) {
        if (this.accelerate) {
            this.speed += this.accelRate * dt;
            this.speed = Math.min(this.speed, this.maxSpeed);
        } else {
            this.speed = 0;
        }

        if (this.speed > 0) {
            let newVelocity = this.ForwardVec();
            vec3.scale(newVelocity, newVelocity, this.speed);
            vec3.add(this.velocity, this.velocity, newVelocity);

            // Clamp to max speed
            if (vec3.length(this.velocity) > this.maxSpeed) {
                vec3.normalize(this.velocity, this.velocity);
                vec3.scale(this.velocity, this.velocity, this.maxSpeed);
            }
        } else {
            // When speed hits 0, bring velocity to 0
            let newVelocity = vec3.create();
            vec3.negate(newVelocity, this.velocity);
            vec3.scale(newVelocity, newVelocity, this.breakRate * dt);
            const oldVelocity = [...this.velocity] as vec3;
            vec3.add(this.velocity, this.velocity, newVelocity);

            // Detect undershoot and clamp to 0
            if (vec3.dot(oldVelocity, newVelocity) < 0) {
                newVelocity = [0, 0, 0];
            }
        }

        this.Move(this.velocity);
    }
}
