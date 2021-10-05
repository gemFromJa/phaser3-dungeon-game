import { Scene } from "phaser";
import { gameConfig } from "../..";
import { Score, ScoreActions } from "../../classes/score";
import { Text } from "../../classes/texts";
import { EVENTS_NAME, GameStatus } from "../../constants";

export class UIScene extends Scene {
	/** @type {Score} score */
	score = null;
	/** @type {Score} score */
	gameEndPhrase = null;

	constructor() {
		super("ui-scene");
	}

	create() {
		this.score = new Score(this, 20, 0, 0);
		this.initListeners();
	}

	chestLootHandler() {
		console.log("Lootedt");
		this.score.changeValue(ScoreActions.INCREASE, 10);

		if (this.score.getValue() === gameConfig.windScore) {
			this.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.WIN);
		}
	}

	initListeners() {
		this.game.events.on(EVENTS_NAME.chestLoot, this.chestLootHandler, this);
		this.game.events.once(EVENTS_NAME.gameEnd, this.gameEndHandler, this);
	}

	gameEndHandler(status) {
		this.cameras.main.setBackgroundColor("rgba(0,0,0,0.6");
		this.game.scene.pause("level-1-scene");
		const lost = status === GameStatus.LOSE;

		this.gameEndPhrase = new Text(
			this,
			this.game.scale.width / 2,
			this.game.scale.height * 0.4,
			lost ? `WASTED\nCICK TO RESTART` : `YOU ROCK!\nCLICK TO RESTART`
		)
			.setAlign("center")
			.setColor(lost ? "#ff0000" : "#fff");

		this.gameEndPhrase.setPosition(
			this.game.scale.width / 2 - this.gameEndPhrase.width / 2,
			this.game.scale.height * 0.4
		);

		this.input.on("pointerdown", () => {
			// reset the game
			this.game.events.off(EVENTS_NAME.chestLoot, this.chestLootHandler);
			this.game.events.off(EVENTS_NAME.gameEnd, this.gameEndHandler);
			this.scene.get("level-1-scene").scene.restart();
			this.scene.restart();
		});
	}
}
