

angular.module("gameApp")
    .service("keyPressHandlerService", ["characterDirection", function(characterDirection) {
        var KeyPressEnum = {
            DownUnprocessed: 0,
            DownProcessed: 1,
            Up: 2
        };

        /*
        Originally tried to rely on the KeyDown event however there is always a delay between the first keyDown and subsequent keyDown events, so instead we monitor
        both keyDown and keyUp.  If a keyDown occurs then we check (from end to beginning) if we already have a keyDown for that key in our buffer.  If we do then
        no need to add another.  Otherwise we add it.
        If a keyUp occurs then we check if we have a keyDown in our buffer (from end to beginning) .  If we do and it is not the first key in the buffer
        (and thus has never been processed then we can throw away that keyDown and do nothing with the keyUp.  If however the only keyDown event is the first key
        in our buffer then we need to check if that key has been processed (i.e. has it resulted in an attempted character move). If it has then we can throw
        that keyDown away as it has now been dealt with - however if it has not been processed then we can not throw it away just yet as we will want to at least
        move once with that keyDown.  Therefore we update the entry to have a 'keyPressType' of 'Up' so we know to remove it when it is next processed.

        When the gameEngine requests the next movement details we simply look at the first key in the buffer - this is what is returned.  However, if it is not
        marked as processed then we mark it as processed - and if it is marked as 'up' then we remove it ready to process the next entry when it is called next time

        Separate to this we monitor the fire key (keyDown and keyUp) just to see if the player is trying to fire at the same time.
         */





        function KeyPressDetails(direction) {
            this.direction = direction;
            this.keyPressType = KeyPressEnum.DownUnprocessed;
        }
        //get direction based on key code
        function processKeyCode(keyCode) {
            switch (keyCode) {
                case "37": //left
                    return characterDirection.left;

                case "38": //up
                    return characterDirection.up;

                case "39": //right
                    return characterDirection.right;

                case "40": //down
                    return characterDirection.down;

                default:
                    return characterDirection.none;
            }
        }

        function isFireKey(keyCode) {
            return keyCode == 32;  // space bar
        }


        function keyPresser(keyCode) {
          console.log("hey yall this is the keycode", keyCode);
          if (isFireKey(keyCode)) {
              this.fireKeyStatus = { keyPressed: true, processed: false };
              return;
          }

          //get direction
          var direction = processKeyCode(keyCode);
          if (direction == characterDirection.none) {
            console.log("THIS IS BAD FRIENDS");

              return;
          }
          //initialize list to hold key presses
          if (!this.keyPressList) {
              this.keyPressList = [];
          }
          //add key press to list
          if (this.keyPressList.length) {
              for (var i = this.keyPressList.length - 1; i >= 0; i--) {
                  if (this.keyPressList[i].direction === direction) {
                      if (this.keyPressList[i].keyPressType === KeyPressEnum.Up) {
                          // Previous key entry was an 'up' so we will add a new entry to the end of the list so it is ordered correctly
                          console.log("first push: ", direction);
                          this.keyPressList.push(new KeyPressDetails(direction));
                      }

                      return;
                  }
              }
          }
          console.log("second push: ", direction);
          this.keyPressList.push(new KeyPressDetails(direction));
        };


        return {
            keyPress: function(keyCode) {
                console.log("hey yall this is the keycode", keyCode);
                if (isFireKey(keyCode)) {
                    this.fireKeyStatus = { keyPressed: true, processed: false };
                    return;
                }

                //get direction from key press
                var direction = processKeyCode(keyCode);
                if (direction == characterDirection.none) {
                    console.log("THIS IS BAD FRIENDS");
                    return;
                }
                //initialize key press list
                if (!this.keyPressList) {
                    this.keyPressList = [];
                }
                //add to key press list
                if (this.keyPressList.length) {
                    for (var i = this.keyPressList.length - 1; i >= 0; i--) {
                        if (this.keyPressList[i].direction === direction) {
                            if (this.keyPressList[i].keyPressType === KeyPressEnum.Up) {
                                // Previous key entry was an 'up' so we will add a new entry to the end of the list so it is ordered correctly
                                this.keyPressList.push(new KeyPressDetails(direction));
                            }

                            return;
                        }
                    }
                }
                  console.log("second push: ", direction);
                this.keyPressList.push(new KeyPressDetails(direction));
            },
            //on key release, remove from key press list
            //causes key press to stop being executed
            keyRelease: function(keyCode) {
                if (isFireKey(keyCode)) {
                    if (angular.isUndefined(this.fireKeyStatus)) {
                        return;
                    }

                    this.fireKeyStatus.keyPressed = false;
                    return;
                }

                var direction = processKeyCode(keyCode);
                if (direction == characterDirection.none) {
                    return;
                }

                if (!this.keyPressList) {
                    this.keyPressList = [];
                }

                for (var i = this.keyPressList.length - 1; i >= 0; i--) {
                    if (this.keyPressList[i].direction === direction) {
                        if (this.keyPressList[i].keyPressType !== KeyPressEnum.DownUnprocessed || i != 0) {
                            this.keyPressList.splice(i, 1);
                        } else{
                            this.keyPressList[i].keyPressType = KeyPressEnum.Up;
                        }

                        break;
                    }
                }
            },
            //returns the next key movement to  player.js from
            //the key press list
            getNextMovement: function() {

                var direction = characterDirection.none;
                //get direction
                if (this.keyPressList && this.keyPressList.length) {
                    direction = this.keyPressList[0].direction;

                    console.log("this is direction: ", direction);
                    //get type as defined at top of file
                    switch (this.keyPressList[0].keyPressType) {}
                      //if key down and unprocessed, remain unprocessed
                        case KeyPressEnum.DownUnprocessed:
                            this.keyPressList[0].keyPressType = KeyPressEnum.DownProcessed;
                            break;
                            //if key up, remove from list
                        case KeyPressEnum.Up:
                            this.keyPressList.splice(0, 1);
                            break;
                    }
                }

                if (angular.isUndefined(this.fireKeyStatus)) {
                    this.fireKeyStatus = { keyPressed: false, processed: true };
                }

                var isFiring = this.fireKeyStatus.keyPressed || !this.fireKeyStatus.processed;

                if (!this.fireKeyStatus.processed) {
                    this.fireKeyStatus.processed = true;
                }

                return { direction: direction, isFiring: isFiring };
            }
        };
    }]);
