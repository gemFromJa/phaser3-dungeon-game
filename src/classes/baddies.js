import { EVENTS_NAME } from "../constants";
import { Actor } from "./actor";

export class Enemy extends Actor {
	/* @type {Player} targt */
	target = null;
	AGRESSOR_RADIUS = 100;

	/**
	 *
	 * @param {Phaser.Scene} scene
	 * @param {*} x
	 * @param {*} y
	 * @param {*} texture
	 * @param {*} target
	 * @param {*} frame
	 */
	constructor(scene, x, y, texture, target, frame) {
		super(scene, x, y, texture, frame);
		this.target = target;

		// add to scene
		scene.add.existing(this);
		scene.physics.add.existing(this);

		//  Physics Model
		this.getBody().setSize(16, 16);
		this.getBody().setOffset(0, 0);

		// EVENTS
		this.scene.game.events.on(EVENTS_NAME.attack, this.attackHandler, this);
		this.on("destroy", () => {
			this.scene.game.events.removeListener(
				EVENTS_NAME.attack,
				this.attackHandler,
				this
			);
		});
	}

	preUpdate() {
		if (
			Phaser.Math.Distance.BetweenPoints(
				{ x: this.x, y: this.y },
				{ x: this.target.x, y: this.target.y }
			) < this.AGRESSOR_RADIUS
		) {
			// if a player come within 100px chase them
			this.getBody().setVelocityX(this.target.x - this.x);
			this.getBody().setVelocityY(this.target.y - this.y);
		} else {
			// just stay there
			this.getBody().setVelocity(0);
		}
	}

	attackHandler() {
		if (
			Phaser.Math.Distance.BetweenPoints(
				{ x: this.x, y: this.y },
				{ x: this.target.x, y: this.target.y }
			) < this.target.width
		) {
			this.getDamage(30);
			this.disableBody(true, false);

			this.scene.time.delayedCall(300, () => this.destroy());
		}
	}

	setTarget(target) {
		this.target = target;
	}
}
