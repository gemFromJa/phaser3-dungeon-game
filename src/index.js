import { Game } from "phaser";
import { Level1 } from "./scenes";

import { LoadingScene } from "./scenes/loading";
import { UIScene } from "./scenes/ui";

export const gameConfig = {
	title: "Phaser Game - first game",
	type: Phaser.AUTO, // render type AUTO, CANVAS, WEBGL
	parent: "game", // dome element id
	background: "#351f1b",
	scale: {
		mode: Phaser.Scale.ScaleModes.NONE,
		width: window.innerWidth,
		height: window.innerHeight,
	},
	physics: {
		default: "arcade",
		arcade: {
			debug: false,
		},
	},
	render: {
		antialiasGL: false,
		pixelArt: true,
	},
	callbacks: {
		postBoot: () => {
			window.sizeChanged();
		},
	},
	canvasStyle: `display: block; width: 100%; height: 100%;`,
	autoFocus: true,
	audio: {
		disableWebAudio: false,
	},
	scene: [LoadingScene, Level1, UIScene],
	windScore: 100, // store info for use in game
};

window.sizeChanged = () => {
	if (window.game?.isBooted) {
		setTimeout(() => {
			window.game.scale.resize(window.innerWidth, window.innerHeight);

			window.game.canvas.setAttribute(
				"style",
				`display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`
			);
		}, 100);
	}
};

window.onresize = () => window.sizeChanged();
window.game = new Game(gameConfig);
