var paused = 0;

angular.module("gameApp", [])

    .controller("appController", ["$scope", "keyPressHandlerService", function($scope, keyPressHandlerService) {
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


          if(event.data == 80) {
            if(paused == 1) {
              paused = 0;
              console.log ("play!")
            }
            else {
              console.log("pause!");
              paused = 1;
            }

          }


          keyPressHandlerService.keyPress(event.data);
          keyPressHandlerService.keyRelease(event.data);
          //keyPressHandlerService.keyPress == event.data;


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


/*

        $scope.keydown = function(keyEvent) {
            if (!$scope.instructionsDisplayed) {
                $scope.instructionsDisplayed = true;
                return;
            }
            keyPressHandlerService.keyPress(keyEvent.key);
        };

        $scope.keyup = function(keyEvent) {
            keyPressHandlerService.keyRelease(keyEvent.key);
        };
*/
    }])


    .directive("centipedeGame", ["$interval", "gameService", "renderService", "graphicsEngineService", function($interval, gameService, renderService, graphicsEngineService) {
        return {
            restrict: 'A',
            template: '<canvas id="gameCanvas" width="600" height="640" left=50% setAttribute('style', "position: absolute;  left: 50%;margin-left:-400px; top: 50% margin-top:-300px; border:2px solid blue");style="border:1px solid #000000;"></canvas>',

            link: function(scope, element) {
                var intervalPromise;
                var animation = 0;
                var canvas = element.find('canvas')[0].getContext("2d");

                graphicsEngineService.initialise(canvas, 'App/img/graphics.png');
                gameService.initialise();

                function gameLoop() {

                    animation++;

                    if (animation == 4) {
                        animation = 0;
                    }

                   if(paused != 1) {
                      gameService.update(animation);
                      renderService.draw(animation);
                  }

                }

                intervalPromise = $interval(gameLoop, 50);

                scope.$on("$destroy", function() {
                    if (intervalPromise) {
                        $interval.cancel(intervalPromise);
                        intervalPromise = undefined;
                    }
                });
            }
        }
    }]);
