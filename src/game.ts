import Renderer from './renderer';
import { GameObject, Line } from './game_object'
import { Ship } from './ship'
import { Missile } from './missile';
import { Asteroid } from './asteroid'
import { vec3 } from 'gl-matrix';

// Tweakable HTML element vars
let invincible: boolean = false;
export function windowOnLoad() {
    document.getElementById('invincible').addEventListener('change', () => {
        invincible = !invincible;
    });
}

function screenWrap(gameObj: GameObject, canvas: HTMLCanvasElement) {
    const halfW = canvas.width / 2;
    const halfH = canvas.height / 2;
    if (gameObj.position[0] < -halfW) {
        gameObj.position[0] = halfW;
    } else if (gameObj.position[0] > halfW) {
        gameObj.position[0] = -halfW;
    }
    if (gameObj.position[1] < -halfH) {
        gameObj.position[1] = halfH;
    } else if (gameObj.position[1] > halfH) {
        gameObj.position[1] = -halfH;
    }
}

function rand(max: number) {
    return Math.random() * max;
}

function rotatedZ(v: vec3, rads: number) {
    let result = vec3.create();
    return vec3.rotateZ(result, v, [0, 0, 0], rads);
}


export default class Game {
    canvas: HTMLCanvasElement;
    renderer: Renderer
    lastTimeStampMs: DOMHighResTimeStamp;

    ships = new Array<Ship>(new Ship());
    asteroids = new Array<Asteroid>();
    missiles = new Array<Missile>();

    elapsedTime = 0;
    lastFireTime = 0;
    lastShipAliveTime = 0;
    lastAsteroidsAliveTime = 0;

    constructor(canvas: HTMLCanvasElement) {
        canvas.width = canvas.height = 640;
        this.canvas = canvas;
        this.renderer = new Renderer(canvas);
    }

    async run() {
        this.init();
        await this.renderer.init();

        const updateLoop = (timeStampMs: DOMHighResTimeStamp) => {
            // Compute delta time in seconds
            const dt = (timeStampMs - this.lastTimeStampMs) / 1000;
            this.lastTimeStampMs = timeStampMs;

            this.update(dt);
            this.render(dt);

            requestAnimationFrame(updateLoop);
        }

        // Start the update loop
        this.lastTimeStampMs = performance.now();
        updateLoop(this.lastTimeStampMs);
    }

    init() {
    }

    spawnLevelAsteroids() {
        const spread = 250;
        for (let i = 0; i < 5; ++i) {
            let pos = rotatedZ([1, 0, 0], 2 * Math.PI / 5 * i);
            vec3.scale(pos, pos, spread);

            let moveDir = rotatedZ([1, 0, 0], rand(2) * Math.PI)
            let size = 4;
            this.asteroids.push(new Asteroid(pos, moveDir, size));
        }
    }

    static spawnBabyAsteroids(parent: Asteroid): Array<Asteroid> {
        const numChildSpawns = 3;
        const randDir = rotatedZ([1, 0, 0] as vec3, rand(2 * Math.PI));
        let result = new Array<Asteroid>();
        for (let i = 0; i < numChildSpawns; ++i) {
            const moveDir = rotatedZ(randDir, (2 * Math.PI / numChildSpawns) * i);
            result.push(new Asteroid(parent.PositionVec(), moveDir, parent.Size() - 1));
        }
        return result;
    }

    update(dt: number) {
        this.elapsedTime += dt;

        // Respawn ship
        if (this.ships.length == 0) {
            if (this.elapsedTime - this.lastShipAliveTime > 3) {
                this.ships.push(new Ship());
            }
        } else {
            this.lastShipAliveTime = this.elapsedTime;
        }

        // Respawn asteroids
        if (this.asteroids.length == 0) {
            if (this.elapsedTime - this.lastAsteroidsAliveTime > 3) {
                this.spawnLevelAsteroids();
            }
        } else {
            this.lastAsteroidsAliveTime = this.elapsedTime;
        }

        this.ships.forEach(ship => {
            // TODO: move turning physics into Ship
            const turnRate = 5;
            if ("ArrowLeft" in this.keysPressed) {
                ship.TurnLeft(turnRate * dt);
            }

            if ("ArrowRight" in this.keysPressed) {
                ship.TurnRight(turnRate * dt);
            }

            if ("ArrowUp" in this.keysPressed) {
                ship.Accelerate();
            } else {
                ship.Decelerate();
            }

            let fireInterval = 0.1;
            if ("Space" in this.keysPressed) {
                if ((this.elapsedTime - this.lastFireTime) > fireInterval) {
                    let pos = ship.PositionVec();
                    let dir = ship.ForwardVec();
                    vec3.scaleAndAdd(pos, pos, dir, ship.Radius() - 5);
                    this.missiles.push(new Missile(pos, dir));
                    this.lastFireTime = this.elapsedTime;
                }
            }
        });


        // Collision detection
        this.asteroids.forEach(a => {
            if (a.dead) return;

            // Asteroids - Missiles
            this.missiles.forEach(m => {
                if (m.dead) return;

                let d = vec3.dist(m.position, a.position);
                if (d < m.Radius() + a.Radius()) {
                    m.dead = true;
                    a.dead = true;

                    if (a.Size() > 1) {
                        let babies = Game.spawnBabyAsteroids(a);
                        babies.forEach(b => this.asteroids.push(b));
                    }
                }
            });

            // Asteroids - Ship
            this.ships.forEach(ship => {
                if (ship.dead) return;

                let d = vec3.dist(a.position, ship.position);
                if (d < ship.Radius() + a.Radius()) {
                    if (!invincible) {
                        ship.dead = true;
                    }
                    a.dead = true;

                    if (a.Size() > 1) {
                        let babies = Game.spawnBabyAsteroids(a);
                        babies.forEach(b => this.asteroids.push(b));
                    }
                }
            });
        });

        const canvas = this.canvas;
        function updateGameObjects<Type extends GameObject>(objects: Array<Type>): Array<Type> {
            objects.forEach((o, i) => {
                o.Update(dt);
                screenWrap(o, canvas);
            });

            // Remove dead objects
            return objects.filter(o => !o.dead);
        };

        this.ships = updateGameObjects(this.ships);
        this.asteroids = updateGameObjects(this.asteroids);
        this.missiles = updateGameObjects(this.missiles);
    }

    render(dt: number) {
        // Render
        let lines = new Array<Line>();
        this.ships.forEach(ship => {
            lines.push(...ship.Lines());
        })
        this.asteroids.forEach(a => {
            lines.push(...a.Lines());
        });
        this.missiles.forEach(m => {
            lines.push(...m.Lines());
        });
        this.renderer.render(dt, lines);
    }

    keysPressed = {};

    onKeyDown(event: KeyboardEvent) {
        this.keysPressed[event.code] = true;
    }

    onKeyUp(event: KeyboardEvent) {
        delete this.keysPressed[event.code];
    }
}

