import { Physics } from "phaser";

export class Actor extends Physics.Arcade.Sprite {
	hp = 100; // health level

	/**
	 *
	 * @param {Phaser.Scene} scene
	 * @param {Number} x
	 * @param {Number} y
	 * @param {String} texture
	 * @param {String | Number =} frame
	 */
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture, frame);

		scene.add.existing(this); // add sprite to scene
		scene.physics.add.existing(this); // setup basic physics of the world on object

		this.getBody().setCollideWorldBounds(true);
	}

	// create blinking animation and apply damage to actor
	getDamage(value) {
		this.scene.tweens.add({
			targets: this, // apply animation to this actor
			duration: 100, // do it for 100ms
			repeat: 3,
			yoyo: true, // return to initial
			alpha: 0.5, // half as visible
			onStart: () => {
				if (value) {
					this.hp = this.hp - value; // start of animation subtract the damage
				}
			},
			onComplete: () => {
				this.setAlpha(1); // set opacity back to one
			},
		});
	}

	getHPValue() {
		return this.hp;
	}

	// flip the actor
	checkFlip() {
		if (this.body.velocity.x < 0) {
			this.scaleX = -1;
		} else {
			this.scaleX = 1;
		}
	}

	getBody() {
		return this.body;
	}
}
