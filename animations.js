export const createAnimations = (game) => {
    game.anims.create({
        key: 'mario-walk',
        frames: game.anims.generateFrameNumbers( //generateFrame number generates the array for you 
            //You could've used {key: 'mario}, frame: 1},
            // {key: 'mario', frame: 2}... etc
            'mario', {start: 3, end: 2}
        ),
        frameRate: 12, //frame rate how much time each animation runs in each frame
        repeat: -1 //This makes the animation repeat infit
        //If you need to repat the animation only two time you do repeat: 2
    });


    game.anims.create({
        key: 'mario-idle',
        frames: [{key: 'mario', frame: 0}]
    })

    game.anims.create({
        key: 'mario-grown-idle',
        frames: [{key: 'mario-grown', frame: 0}]
    })

    game.anims.create({
        key: 'mario-grown-jump',
        frames: [{key: 'mario-grown', frame: 5}]
    })

    game.anims.create({
        key: 'mario-grown-down',
        frames: [{key: 'mario-grown', frames: 3}]
    })

    game.anims.create({
        key: 'mario-grown-walk',
        frames: game.anims.generateFrameNumbers(
            'mario-grown',
            {start:1, end: 3}
        ),
        frameRate: 12,
        repeat: -1
    })

    game.anims.create({
        key: 'mario-jump',
        frames: [{key: 'mario', frame: 5}]
    })

    game.anims.create({
        key: 'mario-dead',
        frames: [{key: 'mario', frame: 4}]
    })


    game.anims.create({
        key: 'goomba-walk',
        frames: game.anims.generateFrameNumbers(
           'goomba', 
           {start: 0, end: 1}
        ),
        frameRate: 12,
        repeat: -1
    })

    game.anims.create({
        key: 'goomba-hurt',
        frame: [{key: 'goomba', frame: 2}]
    })

    game.anims.create({
        key: 'coin-idle',
        frames: game.anims.generateFrameNumbers(
            'coin',
            {start: 0, end: 3}
        ),
        frameRate: 12,
        repeat: -1
    })

    game.anims.create({
        key: 'misteryBlock-anims',
        frames: game.anims.generateFrameNumbers(
            'misteryBlock',
            {start: 0, end:2},
        ),
        frameRate: 12,
        repeat: -1
    })

    game.anims.create({
        key: 'emptyBlock-idle',
        frames: [{key: 'emptyBlock', frame: 0}]
    })

}
