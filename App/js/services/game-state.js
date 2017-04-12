/*Original Game File - functions to keep track of game variables, like if player is alive*/
angular.module("gameApp")
    .factory("gameStateService", ["globalSettings", "gameState", function(globalSettings, gameState) {
        "use strict";
        return {
          //set base information for new game
            score: 0,
            highScore: 0,
            level: 1,
            lives: globalSettings.lives,
            gameState: gameState.gameActive,
            levelTransitionLineCount: 0,
            playerDieTime: null,

            currentLevel: function() {
                return this.level;
            },
            //check transition complete
            hasGameOverTransitionComplete: function() {
                var nowTime = new Date();

                return nowTime - this.playerDieTime > globalSettings.delayAfterDeathBeforeNewGameStart;
            },
            //check transition complete
            hasPlayerDeathTransitionComplete: function() {
                var nowTime = new Date();

                return nowTime - this.playerDieTime > globalSettings.delayAfterDeathBeforePlayerRegeneration;
            },
            //check if player is out of lives
            isGameOver: function() {
                return this.gameState === gameState.gameOver;
            },
            //check if in transition
            isCurrentlyInLevelTransition: function() {
                return this.gameState === gameState.levelTransition;
            },

            hasLevelTransitionResetAllLines: function() {
                return this.gameState === gameState.levelTransition && this.levelTransitionLineCount >= globalSettings.gameBoardHeight;
            },

            isCurrentLevelHighSpeed: function() {
                return this.level % 2 == 0;
            },
            //count level
            levelTransitionCount: function() {
                return this.levelTransitionLineCount;
            },
            //keep track of current level
            incrementLevelTransitionLineCount: function() {
                this.levelTransitionLineCount++;
            },
            //start transition
            startLevelTransition: function() {
                this.gameState = gameState.levelTransition;
                this.levelTransitionLineCount = 0;
                this.level++;
            },
            //end transition
            completeLevelTransition: function() {
                this.gameState = gameState.gameActive;
                this.levelTransitionLineCount = 0;
            },
            //reset for new game
            reset: function() {
                this.lives = globalSettings.lives;
                this.level = 1;
                this.score = 0;
                this.gameState = gameState.gameActive;
            },

            incrementScore: function(increment) {
                this.score += increment;

                if (this.score > this.highScore) {
                    this.highScore = this.score;
                }
            },
            //call on player death
            die: function() {
              //remove a life
                if (this.lives > 0) {
                    this.lives--;
                }
                //check if game over
                if (this.lives === 0) {
                    this.gameState = gameState.gameOver;
                } else { //if not, regenerate
                    this.gameState = gameState.playerDeathTransition;
                }

                this.playerDieTime = new Date();
            },

            playerRegenerate: function() {
                this.gameState = gameState.gameActive;
            }
        }
    }]);
