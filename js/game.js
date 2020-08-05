// create a new scene named "Game"
const gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  // scorestreaks
  this.streak = 0;
  this.highscore = 0;

  // word database
  this.words = ([
    { 
      key: 'building',
      setXY: {
        x: 100,
        y: 240
      },
      spanish: 'edificio'
    },
    { 
      key: 'house',
      setXY: {
        x: 240,
        y: 280
      },
      setScale: {
        x: 0.8,
        y: 0.8
      },
      spanish: 'casa'
    },
    { 
      key: 'car',
      setXY: {
        x: 400,
        y: 300
      },
      setScale: {
        x: 0.8,
        y: 0.8
      },
      spanish: 'automovil'
    },
    { 
      key: 'tree',
      setXY: {
        x: 550,
        y: 250
      },
      spanish: 'arbol'
    }
  ]);
}

// load asset files for our game
gameScene.preload = function() {
  // load images
  this.load.image('background', 'assets/images/background-city.png');
  this.load.image('building', 'assets/images/building.png');
  this.load.image('car', 'assets/images/car.png');
  this.load.image('house', 'assets/images/house.png');
  this.load.image('tree', 'assets/images/tree.png');

  this.load.audio('treeAudio', 'assets/audio/arbol.mp3');
  this.load.audio('carAudio', 'assets/audio/auto.mp3');
  this.load.audio('houseAudio', 'assets/audio/casa.mp3');
  this.load.audio('buildingAudio', 'assets/audio/edificio.mp3');
  this.load.audio('correct', 'assets/audio/correct.mp3');
  this.load.audio('wrong', 'assets/audio/wrong.mp3');
};

// executed once, after assets were loaded
gameScene.create = function() {
  this.items = this.add.group(this.words);

  // load background
  const bg = this.add.sprite(0, 0, 'background').setOrigin(0,0);

  // show items on top of background
  this.items.setDepth(1);
  
  // get group array
  const items = this.items.getChildren();

  // loop through each word item
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // make item interactive
    item.setInteractive();

    // resize tweens
    item.correctTween = this.tweens.add({
      targets: item,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 300,
      paused: true,
      yoyo: true,
      ease: 'Quad.easeInOut'
    });

    item.wrongTween = this.tweens.add({
      targets: item,
      scaleX: 1.2,
      scaleY: 1.2,
      angle: 90,
      duration: 300,
      paused: true,
      yoyo: true,
      ease: 'Quad.easeInOut'
    });

    // transparency tween
    item.alphaTween = this.tweens.add({
      targets: item,
      alpha: 0.6,
      duration: 200,
      paused: true,
      ease: 'Quad.easeInOut'
    });

    // listen for pointerdown event
    item.on('pointerdown', function(pointer) {
      console.log('clicked on the ' + item.texture.key);
      
      const result = this.processAnswer(this.words[i].spanish);

      if (result) {
        item.correctTween.restart();
      } else {
        item.wrongTween.restart();
      }

      this.showNextQuestion();
    }, this);
    // listen for pointerover event
    item.on('pointerover', function(pointer) {
      item.alphaTween.restart();
    });
    // listen for pointerout event
    item.on('pointerout', function(pointer) {
      // stop alphaTween
      item.alphaTween.stop();
      item.alpha = 1;
    });

    // create sound for each item
    this.words[i].sound = this.sound.add(this.words[i].key + 'Audio');
  }

  // text objects
  this.wordText = this.add.text(30, 20, ' ', {
    font: '28px Open Sans',
    fill: '#ffffff' 
  })
  this.highscoreText = this.add.text(this.sys.game.config.width - 140, 25, `High Score: ${this.highscore}`, {
    font: '18px Open Sans',
    fill: '#ffffff' 
  })
  this.streakText = this.add.text(this.sys.game.config.width - 103, 55, `Streak: ${this.streak}`, {
    font: '18px Open Sans',
    fill: '#ffffff' 
  })

  // correct / wrong sounds
  this.correctSound = this.sound.add('correct');
  this.wrongSound = this.sound.add('wrong');

  // show the first question
  this.showNextQuestion();
};

// show next question
gameScene.showNextQuestion = function() {
  // select random word
  this.nextWord = Phaser.Math.RND.pick(this.words);

  // show text of word in Spanish
  this.wordText.setText(this.nextWord.spanish);

  // play sound for that word
  this.nextWord.sound.play();
};

// check answer and play corresponding sound
gameScene.processAnswer = function(userResponse) {
  // compare user response with correct response
  if (userResponse === this.nextWord.spanish) {
    // correct
    this.correctSound.play();

    this.streak += 1;
    this.streakText.setText(`Streak: ${this.streak}`);
    
    if (this.streak > this.highscore) {
      this.highscore = this.streak;
    }
    this.highscoreText.setText(`High Score: ${this.highscore}`);
    return true; 
  } else {
    // wrong
    this.wrongSound.play();

    this.streak = 0;
    this.streakText.setText(`Streak: ${this.streak}`);
    return false;
  }
};

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
  title: 'Spanish Learning Game',
  pixelArt: false,
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
