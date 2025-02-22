class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

        //adding scores
        this.shotTotal = 0
        this.shotScored = 0
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width /4 )
        this.cup.body.setImmovable(true)

        // add ball
        this.startingBallX = width / 2
        this.startingBallY = height - height / 2
        this.ball = this.physics.add.sprite(this.startingBallX, this.startingBallY, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)

        //Score UI
        this.shotText = this.add.text(
            10, 10, 'Ball Hits: 0',
            {
                fontFamily: 'Courier',
                fontSize: '16px',
                color: '#000000',
                backgroundColor: '#FFFFFF',
                align: 'right',
                fixedWidth: 300,
            }

        );

        this.scoreText = this.add.text(
            10, 30, 'Hole Scored: 0' , {
            
                fontFamily: 'Courier',
                fontSize: '16px',
                color: '#000000',
                backgroundColor: '#FFFFFF',
                align: 'right',
                fixedWidth: 300,
            }

        );

        this.percentageText = this.add.text(
            10 , 50, 'Shot Accuracy: 0%',
            {
                fontFamily: 'Courier',
                fontSize: '16px',
                color: '#000000',
                backgroundColor: '#FFFFFF',
                align: 'right',
                fixedWidth: 300,
            });


        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            this.shotTotal++
            this.scoreUpdate()

        //directions of x and y pointer values from ball
            let shotDirectionX = pointer.x - this.ball.x 
            let shotDirectionY = pointer.y - this.ball.y

        //normalizing pointer 
        let magnitude = Math.sqrt(shotDirectionX * shotDirectionX + shotDirectionY * shotDirectionY)
        if (magnitude > 0 ){
            shotDirectionX = shotDirectionX / magnitude
            shotDirectionY = shotDirectionY / magnitude
        }
        //shot velocity 
            let velocityX = shotDirectionX * this.SHOT_VELOCITY_X
            let velocityY = shotDirectionY * Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX)
       
        //Applying to ball 
        this.ball.body.setVelocity(velocityX, velocityY) 

        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball,cup) => {
            this.shotScored++
            this.ballResets()
        })

        // ball/wall collision

        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneway)

    }
        // resetting ball 
        ballResets() {
            this.ball.setPosition(this.startingBallX, this.startingBallY)
            this.ball.body.setVelocity(0,0)
            this.scoreUpdate()
   
    }

        // updating shot counter UI
        scoreUpdate(){
            this.shotText.setText(`Ball Hits: ${this.shotTotal}`)
            this.scoreText.setText(`Holes Scored: ${this.shotScored}`)
            let accuracy = this.shotTotal > 0 ? (this.shotScored / this.shotTotal * 100).toFixed(1) : 0;
            this.percentageText.setText(`Accuracy Rate: ${accuracy}`)
            }

    update() {

    }
}


/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ ] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/