

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


         window.onload = function() {
           cast.receiver.logger.setLevelValue(0);
           window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
           console.log('Starting Receiver Manager');

           // handler for the 'ready' event
           castReceiverManager.onReady = function(event) {
             console.log('Received Ready event: ' + JSON.stringify(event.data));
             window.castReceiverManager.setApplicationState('Application status is ready...');
           };

           // handler for 'senderconnected' event
           castReceiverManager.onSenderConnected = function(event) {
             console.log('Received Sender Connected event: ' + event.data);
             console.log(window.castReceiverManager.getSender(event.data).userAgent);
           };

           // handler for 'senderdisconnected' event
           castReceiverManager.onSenderDisconnected = function(event) {
             console.log('Received Sender Disconnected event: ' + event.data);
             if (window.castReceiverManager.getSenders().length == 0) {
               window.close();
             }
           };

           // handler for 'systemvolumechanged' event
           castReceiverManager.onSystemVolumeChanged = function(event) {
             console.log('Received System Volume Changed event: ' + event.data['level'] + ' ' +
                 event.data['muted']);
           };

           // create a CastMessageBus to handle messages for a custom namespace
           window.messageBus =
             window.castReceiverManager.getCastMessageBus(
                 'urn:x-cast:com.google.cast.sample.helloworld');

           // handler for the CastMessageBus message event
           window.messageBus.onMessage = function(event) {
             console.log('Message [' + event.senderId + ']: ' + event.data);
             // display the message from the sender
             displayText(event.data);
             keyPressHandlerService.keyPress(event.data);
             //keyPressHandlerService.keyPress == event.data;
             triggerKeyDown();

             // inform all senders on the CastMessageBus of the incoming message event
             // sender message listener will be invoked
             window.messageBus.send(event.senderId, event.data);
           }



           // initialize the CastReceiverManager with an application status message
           window.castReceiverManager.start({statusText: 'Application is starting'});
           console.log('Receiver Manager started');
         };

         // utility function to display the text message in the input field
         function displayText(text) {
           console.log(text);
           document.getElementById('message').innerText = text;
           window.castReceiverManager.setApplicationState(text);
         };

         function triggerKeyDown() {
           var e = new KeyboardEvent('keydown', {'key': 'ArrowLeft', 'code': "ArrowLeft", 'keyCode': 38,'which':38});
           document.dispatchEvent(e);
             console.log(e);
         };




        function KeyPressDetails(direction) {
            this.direction = direction;
            this.keyPressType = KeyPressEnum.DownUnprocessed;
        }

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


          var direction = processKeyCode(keyCode);
          if (direction == characterDirection.none) {
            console.log("THIS IS BAD FRIENDS");

              return;
          }

          if (!this.keyPressList) {
              this.keyPressList = [];
          }

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


                var direction = processKeyCode(keyCode);
                if (direction == characterDirection.none) {
                    console.log("THIS IS BAD FRIENDS");
                    return;
                }

                if (!this.keyPressList) {
                    this.keyPressList = [];
                }

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

            getNextMovement: function() {

                var direction = characterDirection.none;

                if (this.keyPressList && this.keyPressList.length) {
                    direction = this.keyPressList[0].direction;

                    console.log("this is direction: ", direction);

                    switch (this.keyPressList[0].keyPressType) {
                        case KeyPressEnum.DownUnprocessed:
                            this.keyPressList[0].keyPressType = KeyPressEnum.DownProcessed;
                            break;

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
