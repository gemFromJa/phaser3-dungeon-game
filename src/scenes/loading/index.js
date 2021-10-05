import { Scene } from "phaser";

// initial scene, loads everything
export class LoadingScene extends Scene {
	constructor() {
		super("loading-scene");
	}

	create() {
		this.scene.start("level-1-scene");
		this.scene.start("ui-scene");
	}

	/** Runs before the  create function is called */
	preload() {
		this.load.baseURL = "assets/";

		// the player texture
		this.load.image("king", "sprites/king.png");

		// the player spritesheet/atlas
		this.load.atlas(
			"a-king",
			"spritesheets/a-king.png",
			"spritesheets/a-king_atlas.json"
		);

		// load map
		this.load.image({
			key: "tiles",
			url: "tilemaps/tiles/dungeon-16-16.png",
		});

		// load various game objects sprite
		this.load.spritesheet("tiles_spr", "tilemaps/tiles/dungeon-16-16.png", {
			frameWidth: 16,
			frameHeight: 16,
		});

		this.load.tilemapTiledJSON("dungeon", "tilemaps/json/dungeon.json");
	}
}
