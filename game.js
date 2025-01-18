// Global const
"use strict";

import { createAnimations } from "./animations.js"
import { initAudio, playAudio} from "./audio.js";
import { checkControls } from "./controls.js"
import { initSpritesheet } from "./spriteSheet.js";




const config = {
    autoFocus: false,
    type: Phaser.AUTO,
    width: 256, //original 256
    height: 244, //original 244
    backgroundColor: '#049cd8',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    },
    scene: {
        preload, // execute to load sources 
        create, // execute when you strat the game
        update // each frame
    }
}

new Phaser.Game(config)
//THIs game this means its calling the game itself to access variables, conf, etc

function preload () { 
    console.log("preload Image")
    this.load.image(
        'cloud1', 
        'assets/scenery/overworld/cloud1.png'
    )

    this.load.image(
        'floorbricks',
        'assets/scenery/overworld/floorbricks.png'
    )

    this.load.image(
        'firstMountain',
        'assets/scenery/overworld/mountain2.png'
    )

    this.load.image(
        'firstBush',
        'assets/scenery/overworld/bush1.png'
    )

    this.load.image(
        'secondMountain',
        'assets/scenery/overworld/mountain1.png'
    )

    this.load.image(
        'emptyBlock',
        "assets/blocks/overworld/emptyBlock.png"
    )
    
    this.load.image(
        'block',
        'assets/blocks/overworld/block.png'
    )

    this.load.image (
        'supermushroom',
        'assets/collectibles/super-mushroom.png'
    )
    //Spritesheet is the mario (it's one image with different positions to make the effect of movement)
    initSpritesheet(this)
    initAudio(this)

} // First

function create () {
    createAnimations(this) //argument send to animation.js
    //image(x-y , id asset)
    this.add.image(190, 50, 'cloud1')
    .setOrigin(0, 0)
    .setScale(0.15)

    this.add.image(70, 180, 'firstMountain')
    this.add.image(455, 190, 'secondMountain')

    this.add.image(330, 195, 'firstBush')


    this.floor = this.physics.add.staticGroup() //group that does not move static for the floor

    this.floor
    .create(0, config.height  - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody() //Syncs the body's position to detect physics

    this.floor
    .create(128, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody()
    

    this.floor
    .create(256, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody()

    this.floor
    .create(384, config.height - 16, 'floorbricks')
    .setOrigin(0, 0.5)
    .refreshBody()


    //TileSprite is like a texture that is going to expand 
    
    //First Floor we added 

    // this.add.tileSprite(0, config.height - 32, config.width, 32, 'floorbricks')
    // .setOrigin(0, 0)

    // this.mario = this.add.sprite(50, 210, 'mario')
    // .setOrigin(0,1)

    //When we add physics we have to change the way we add the sprite
    this.mario = this.physics.add.sprite(50, 100, 'mario')
    .setOrigin(0, 1)
    .setGravityY(600) // with this you can change the gravity for each sprite or element 
    .setCollideWorldBounds(true)

    this.enemy = this.physics.add.sprite(420, config.height - 30, 'goomba')
    .setOrigin(0, 1)
    .setGravityY(300)
    .setVelocityX(-50)
    .setCollideWorldBounds(true)

    this.misteryBlock = this.physics.add.sprite(400, config.height - 85, 'misteryBlock')
    .setOrigin(0, 1)
    .setGravityY(0, 0)
    .setImmovable(true)
    .setCollideWorldBounds(true)

    this.misteryBlockSuperMushroom = this.physics.add.sprite(250, config.height - 35, 'misteryBlock')
    .setOrigin(0, 1)
    .setGravityY(0, 0)
    .setImmovable(true)
    .setCollideWorldBounds(true)
    .setDepth(1)

    this.block = this.physics.add.sprite(150, config.height - 35, 'block')
    .setOrigin(0, 1)
    .setGravityY(0, 0)
    .setImmovable(true)
    .setCollideWorldBounds(true)



    this.collectibles = this.physics.add.staticGroup()
    this.collectibles.create(150, 150, 'coin').anims.play
    ('coin-idle', true)
    this.collectibles.create(300, 150, 'coin').anims.play
    ('coin-idle', true)
    this.collectibles.create(200, config.height -40, 'supermushroom').anims.play
    ('supermushroom-idle', true)
    this.physics.add.overlap(this.mario, this.collectibles, collectItem, null, this)


    this.physics.world.setBounds(0, 0, 2000, config.height) // set this start and the end limits of the wolrd
    this.physics.add.collider(this.mario, this.floor)
    this.physics.add.collider(this.enemy, this.floor)
    this.physics.add.collider(this.mario, this.enemy
        ,onHitEnemy, null, this) // this is a function (function) 
        //We use null to  see if it has to process the collision or not -- and this to pass the game
    this.physics.add.collider(this.mario, this.misteryBlock
            ,hitMisteryBlockCoin, null, this)
    
    this.physics.add.collider(this.mario, this.misteryBlockSuperMushroom
            ,hitMisteryBlockSuperMushroom, null, this)

    this.physics.add.collider(this.mario, this.block
            ,hitBlock, null, this)

    
    
    //Animation for the mistery block
    this.misteryBlock.anims.play('misteryBlock-anims', true)
    this.misteryBlockSuperMushroom.anims.play('misteryBlock-anims', true)


    this.block.body.setSize(32, 32); 

    this.cameras.main.setBounds(0, 0, 2000, config.height)
    this.cameras.main.startFollow(this.mario)



    this.enemy.anims.play('goomba-walk', true)
    
    //Move Mario
    this.keys = this.input.keyboard.createCursorKeys()//method that will check moves into the update function

} // second

function hitBlock(mario, block) {

    if (mario.isGrown && mario.body.touching.up && block.body.touching.down) {
        console.log("Hit Block")
        
        //particle animations Phaser
        const emitter = this.add.particles(this.block.x, this.block.y, 'brick-debris', {
            
            lifespan: 5000,
            speed: { min: 50, max: 150 },
            scale: { start: 1, end: 0 },
            gravityY: 150,
            emitting: false
        });

        playAudio('break-block', this, {voume: 0.1 })
        emitter.explode(4); //Number display the amount of anims 
        block.destroy()
        
        
    } else if (mario.body.touching.up && block.body.touching.down) {
        console.log("Block-up")
        
        // deactivated collisiom so the block does not go up

        const ORIGINALY = block.y
        playAudio('block-bump', this, {voume: 0.1 })

        this.tweens.add({
            targets: block,
            y: ORIGINALY -5,
            duration: 100,
            yoyo: true, 
        })
    } else if (mario.body.touching.left && block.body.touching.right) {
        block.setCollideWorldBounds(true)
    }
}


function hitMisteryBlockCoin (mario, misteryBlock) {
    if (misteryBlock.isHit) return

    if (mario.body.touching.up && misteryBlock.body.touching.down) {
        misteryBlock.isHit = true;
        

        const coin = this.physics.add.sprite(
            misteryBlock.x + misteryBlock.displayWidth / 2, // Center in X
            misteryBlock.y - misteryBlock.displayHeight / 2, // Appears above the block
            'coin' //This conts makes sure the animation coin goes where the misteryBlock is 
        )
        
        coin.anims.play('coin-idle')
        coin.setVelocityY(-200)
        coin.setDepth(-1)
        coin.setGravityY(300)
        playAudio('coin-pickup', this, {voume: 0.1 })
        
        
        setTimeout(() => {
                coin.destroy()
        },900)


        //Tween method let you modified the properties of an object
        this.tweens.add({
            targets: misteryBlock,
            y: misteryBlock.y -10, //height of the jump
            duration: 100,
            yoyo: true, //make it go back to the original position
            onComplete: () => {

                misteryBlock.anims.stop()
                misteryBlock.setTexture('emptyBlock', true)

            }
        })
    }     
    
}

function hitMisteryBlockSuperMushroom (mario, misteryBlockSuperMushroom) {

    
    if(misteryBlockSuperMushroom.isHit) return


    if (mario.body.touching.up && misteryBlockSuperMushroom.body.touching.down) {
        misteryBlockSuperMushroom.isHit = true
        
        const superMushroom = this.physics.add.sprite(
            misteryBlockSuperMushroom.x + misteryBlockSuperMushroom.displayWidth /2,
            misteryBlockSuperMushroom.y - misteryBlockSuperMushroom.displayHeight /2,
            'supermushroom'
        )

        superMushroom.anims.play('supermushroom-idle', true)
        superMushroom.setVelocityY(-43)
        superMushroom.setGravityY(50)
        superMushroom.setDepth(0)
        superMushroom.setCollideWorldBounds(true)
        
        
        
        setTimeout(() => {
            superMushroom.setVelocityX(-30)
        },700)


        this.physics.add.overlap(mario, superMushroom, collectItem, null, this)
        this.physics.add.collider(superMushroom, this.floor)
        this.physics.add.collider(superMushroom, this.misteryBlockSuperMushroom)


        this.tweens.add({
            targets: misteryBlockSuperMushroom,
            y: misteryBlockSuperMushroom.y -10,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                misteryBlockSuperMushroom.anims.stop()
                misteryBlockSuperMushroom.setTexture('emptyBlock', true)
            }
        })
    }
}

function collectItem (mario, item) {
    const { texture: { key} } = item
    item.destroy()

    if (key === 'coin') {
    
        playAudio('coin-pickup', this)
        addToScore(100, item, this)
    } else if (key === 'supermushroom') {
        this.physics.world.pause()
        // this.anims.pauseALL()


        
        playAudio('powerup', this, {voume: 0.1 })
        let i = 0;
        const interval = setInterval(() => {
            i++
            mario.anims.play(i % 2 === 0
            ? 'mario-grown-idle'
            : 'mario-idle'
        )
    },100)

    mario.isBlocked = true
    mario.isGrown = true

    setTimeout(() => {
        mario.setDisplaySize(18, 32)
        mario.body.setSize(18, 32)
        mario.isBlocked = false
        clearInterval(interval)
        this.physics.world.resume()
        this.anims.resumeAll()
        
    }, 1000)
    }
}


function addToScore (scoreToAdd, origin, game){

    const scoreText = game.add.text(
        origin.x,
        origin.y,
        scoreToAdd,
        {
            fontFamily: 'pixel',
            fontSize: config.width / 40
        }
    )

    game.tweens.add ({
        targets: scoreText,
        duration: 500,
        y: scoreText.y -20,
        onComplete: () => {
            game.tweens.add({
                targets: scoreText,
                duration: 100,
                alpha: 0,
                onComplete: () => {
                    scoreText.destroy()
                }
            })
        }
    })
}

function onHitEnemy (mario, enemy) {
    if (mario.body.touching.down && enemy.body.touching.up) {
        
        // enemy.anims.play('goomba-hurt', true)
        enemy.setVelocityX(0)
        mario.setVelocityY(-200)
        playAudio('goomba-stomp', this, {voume: 0.1 })
        addToScore(200, enemy, this)

        setTimeout(() => {
            enemy.destroy()
        }, 200)
        
        
    } else {
        killMario(this)
    }
}

function update () {
    // console.log('update');
    
    const { mario } = this
    
    checkControls(this)
    //Check if Mario is Dead
    if (mario.y >= config.height) {
        killMario(this)
    }

} //eac frame


function killMario (game) {
    const { mario, scene } = game 

        if (mario.isDead) return
    
        mario.isDead = true
        mario.anims.play('mario-dead', true)
        mario.setCollideWorldBounds(false)
        
        // playAudio('gameover', game, {voume: 0.2 })
        
        mario.body.checkCollision.none = true
        mario.setVelocityX(0) 

        setTimeout(() => {
            mario.setVelocityY(-350)
        }, 100)

        setTimeout(() => {
            scene.restart()
        }, 7000)
}