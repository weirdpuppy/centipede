angular.module("gameApp")
    .constant("globalSettings", {
        spriteSize: 31,
        spriteSheetWidth: 4,
        playerAreaHeight: 6,

        scoreBoardArea: 60,

        scoreMarkerFont: "26px Slackey",
        scoreBoardFont: "16px Slackey",
        scoreBoardTitleFontColour: "#22513d",
        scoreBoardContentFontColour: "white",
        scoreBoardLivesXPositionText: 60,
        scoreBoardLivesXPositionImage: 45,
        scoreBoardScoreXPosition: 200,
        scoreBoardLevelXPosition: 350,
        scoreBoardHighScoreXPosition: 450,
        scoreBoardTitleYPosition: 30,
        scoreBoardContentYPosition: 45,
        scoreBoardLivesYPosition: 30,
        scoreBoardLivesOffset: 20,

        gameOverXPosition: 350,
        gameOverYPosition: 300,
        gameOverFontColour: "#dfc223",
        gameOverFont: "48px Slackey",

        gameBoardWidth: 50,
        gameBoardHeight: 20,
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