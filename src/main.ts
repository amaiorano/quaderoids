import Game from './game';
import { windowOnLoad as rendererWindowOnLoad } from './renderer';
import { windowOnLoad as gameWindowOnLoad } from './game';

const canvas = document.getElementById('gfx') as HTMLCanvasElement;
const game = new Game(canvas);

window.addEventListener("keydown", (event: KeyboardEvent) => {
    game.onKeyDown(event);
}, true);

window.addEventListener("keyup", (event: KeyboardEvent) => {
    game.onKeyUp(event);
}, true);

window.onload = () => {
    rendererWindowOnLoad();
    gameWindowOnLoad();
}

game.run();
