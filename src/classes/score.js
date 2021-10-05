import { Text } from "./texts";

export const ScoreActions = { INCREASE: 1, DECREASE: 2, SET_VALUE: 3 };

export class Score extends Text {
	score = null;

	constructor(scene, x, y, score = 0) {
		super(scene, x, y, `Score: ${score}`);

		scene.add.existing(this);

		this.score = score;
		console.log(this.score);
	}

	changeValue(operation, value) {
		switch (operation) {
			case ScoreActions.INCREASE:
				this.score += value;
				break;
			case ScoreActions.DECREASE:
				this.score -= value;
				break;
			case ScoreActions.SET_VALUE:
				this.score = value;
				break;
			default:
				break;
		}

		this.setText(`Score: ${this.score}`);
	}

	getValue() {
		return this.score;
	}
}
