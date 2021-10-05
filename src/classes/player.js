import { EVENTS_NAME, GameStatus } from "../constants";
import { Actor } from "./actor";
import { Text } from "./texts";

export class Player extends Actor {
	keyW = null;
	keyA = null;
	keyS = null;
	keyD = null;
	keySpace = null;
	/** @type {Text} hpValue */
	hpValue = null;

	constructor(scene, x, y) {
		super(scene, x, y, "king");

		// key bindings
		this.keyW = this.scene.input.keyboard.addKey("W");
		this.keyA = this.scene.input.keyboard.addKey("A");
		this.keyS = this.scene.input.keyboard.addKey("S");
		this.keyD = this.scene.input.keyboard.addKey("D");
		this.keySpace = this.scene.input.keyboard.addKey(32);
		this.keySpace.on("down", (event) => {
			this.anims.play("attack", true);
			this.scene.game.events.emit(EVENTS_NAME.attack);
		});

		this.hpValue = new Text(
			this.scene,
			this.x,
			this.y - this.height,
			this.hp.toString()
		)
			.setFontSize(12)
			.setOrigin(0.8, 0.5);

		// physics
		this.getBody().setSize(30, 30);
		this.getBody().setOffset(8, 0);

		// add animations to the character
		this.initAnimations();
	}

	// called about 60 times per second
	update() {
		this.getBody().setVelocity(0); // stationary

		const run = () => !this.anims.isPlaying && this.anims.play("run", true);
		if (this.keyW?.isDown) {
			this.body.velocity.y = -110;
			!this.anims.isPlaying && this.anims.play("run", true);
		}

		if (this.keyA?.isDown) {
			this.body.velocity.x = -110;
			this.checkFlip();
			this.getBody().setOffset(48, 15);
			run();
		}

		if (this.keyS?.isDown) {
			this.body.velocity.y = 110;
			run();
		}

		if (this.keyD?.isDown) {
			this.body.velocity.x = 110;
			this.checkFlip();
			this.getBody().setOffset(15, 15);
			run();
		}

		this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
		this.hpValue.setOrigin(0.8, 0.5);
		// this.hpValue.setAlign("center");
	}

	initAnimations() {
		// create run animation
		this.scene.anims.create({
			key: "run",
			frames: this.scene.anims.generateFrameNames("a-king", {
				prefix: "run-",
				end: 7,
			}),
			frameRate: 8,
		});

		// create attack animation
		this.scene.anims.create({
			key: "attack",
			frames: this.scene.anims.generateFrameNames("a-king", {
				prefix: "attack-",
				end: 2,
			}),
			frameRate: 8,
		});
	}

	getDamage(value) {
		super.getDamage(value);
		this.hpValue.setText(this.hp.toString());

		if (this.hp <= 0) {
			this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE);
		}
	}
}
