angular.module("gameApp")
    .constant("globalSettings", {
        spriteSize: 40,
        spriteSheetWidth: 4,
        playerAreaHeight: 6,

        scoreBoardArea: 40,

        scoreMarkerFont: "10px Lucida Console",
        scoreBoardFont: "16px Lucida Console",
        scoreBoardTitleFontColour: "red",
        scoreBoardContentFontColour: "purple",
        scoreBoardLivesXPositionText: 50,
        scoreBoardLivesXPositionImage: 45,
        scoreBoardScoreXPosition: 200,
        scoreBoardLevelXPosition: 350,
        scoreBoardHighScoreXPosition: 500,
        scoreBoardTitleYPosition: 15,
        scoreBoardContentYPosition: 35,
        scoreBoardLivesYPosition: 20,
        scoreBoardLivesOffset: 15,

        gameOverXPosition: 210,
        gameOverYPosition: 300,
        gameOverFontColour: "yellow",
        gameOverFont: "48px Lucida Console",

        gameBoardWidth: 30,
        gameBoardHeight: 30,
        gameBoardBackgroundColour: "black",

        centipedeFramesPerMoveNormalSpeed: 2,
        centipedeFramesPerMoveHighSpeed: 1,

        // board creation
        mushroomChanceNonPlayerArea: 10,
        mushroomChancePlayerArea: 40,

        minMushroomsBeforeFleaCreated: 40,
        maxMushroomsAllowed: 140,
        minMushroomsInPlayerAreaBeforeFleaCreated: 5,

        maxCentipedes: 9,
        centipedeMinimumLength: 10,

        delayAfterDeathBeforePlayerRegeneration: 1000,
        delayAfterDeathBeforeNewGameStart: 1500,

        delayAfterDeathBeforeBulletDispose: 2,

        fleaCreationChance: 100,
        spiderCreationChance: 25,
        snailCreationChance: 200,

        maxBulletsOnScreen: 5,
        lives: 3,

        scoreHitMushroom: 10,
        scoreHitPoisonMushroom: 25,
        scoreHitCentipede: 100,
        scoreHitSpider: 1000,
        scoreHitFlea: 500,
        scoreHitSnail: 2000
    });