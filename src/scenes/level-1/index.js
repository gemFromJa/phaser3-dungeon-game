import { Scene } from "phaser";
import { Enemy } from "../../classes/baddies";
import { Player } from "../../classes/player";
import { EVENTS_NAME } from "../../constants";

export class Level1 extends Scene {
	player = null;
	/** @type {Phaser.Tilemaps.Tilemap} map */
	map = null;
	tileset = null;
	/** @type {Phaser.TileMap.BynamicTilemapLayer} wallsLayer */
	wallsLayer = null;
	groundLayer = null;
	chests = null;
	enemies = null;

	constructor() {
		super("level-1-scene");
	}

	create() {
		// load the game map
		this.initMap();

		this.player = new Player(this, 120, 120); // add player to the world at position x: 100, y: 100

		// allow collision with gamewalls
		this.physics.add.collider(this.player, this.wallsLayer);

		this.insertChests();
		this.initCamera();
		this.initEnemies();
	}

	// update player every scene refresh
	update() {
		this.player.update(); // move player
	}

	initMap() {
		this.map = this.make.tilemap({
			key: "dungeon",
			tileWidth: 16,
			tileHeight: 16,
		});
		this.tileset = this.map.addTilesetImage("dungeon", "tiles");
		this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);

		this.wallsLayer = this.map.createLayer("Walls", this.tileset, 0, 0);
		this.wallsLayer.setCollisionByProperty({ collides: true });

		this.physics.world.setBounds(
			0,
			0,
			this.wallsLayer.width,
			this.wallsLayer.height
		);
	}

	insertChests() {
		// get chestpoint from the layer
		const chestPoints = this.map.filterObjects(
			"Chests",
			(obj) => obj.name === "chestPoints"
		);

		// add chest to the  scene
		this.chests = chestPoints.map((chestPoint) =>
			this.physics.add
				.sprite(chestPoint.x, chestPoint.y, "tiles_spr", 595)
				.setScale(1.5)
		);

		// flash to show eating
		this.chests.forEach((chest) => {
			this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
				// trigger collection event
				this.game.events.emit(EVENTS_NAME.chestLoot);

				// destroy chest
				obj2.destroy();

				this.cameras.main.flash();
			});
		});
	}

	initCamera() {
		this.cameras.main.setSize(
			this.game.scale.width,
			this.game.scale.height
		);
		this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
		this.cameras.main.setZoom(2);
	}

	initEnemies() {
		const enemyPoints = this.map.filterObjects(
			"Enemies",
			(obj) => obj.name === "enemyPoint"
		);

		this.enemies = enemyPoints.map((enemyPoint) =>
			new Enemy(
				this,
				enemyPoint.x,
				enemyPoint.y,
				"tiles_spr",
				this.player,
				503
			)
				.setName(enemyPoint.id.toString())
				.setScale(1.5)
		);

		// don't go outside game
		this.physics.add.collider(this.enemies, this.wallsLayer);
		// don't phase through other bots
		this.physics.add.collider(this.enemies, this.enemies);
		// when you collide with a player, deduct life
		this.physics.add.collider(
			this.player,
			this.enemies,
			/**
			 *
			 * @param {Player} obj1
			 * @param {*} obj2
			 */
			(obj1, obj2) => {
				obj1.getDamage(1);
			}
		);
	}
}
