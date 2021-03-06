var paused = 0;

angular.module("gameApp", [])
    //called by ng-controller in receiver.html
    //creats instance of cast receiver
    .controller("appController", ["$scope", "keyPressHandlerService", function ($scope, keyPressHandlerService) {
//Added Spring 2017 by UK CS499 Group
        window.onload = function () {
            cast.receiver.logger.setLevelValue(0);
            window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
            console.log('Starting Receiver Manager');

            // handler for the 'ready' event
            castReceiverManager.onReady = function (event) {
                console.log('Received Ready event: ' + JSON.stringify(event.data));
                window.castReceiverManager.setApplicationState('Application status is ready...');
            };

            // handler for 'senderconnected' event
            castReceiverManager.onSenderConnected = function (event) {
                console.log('Received Sender Connected event: ' + event.data);
                console.log(window.castReceiverManager.getSender(event.data).userAgent);
            };

            // handler for 'senderdisconnected' event
            castReceiverManager.onSenderDisconnected = function (event) {
                console.log('Received Sender Disconnected event: ' + event.data);
                if (window.castReceiverManager.getSenders().length == 0) {
                    window.close();
                }
            };

            // handler for 'systemvolumechanged' event
            castReceiverManager.onSystemVolumeChanged = function (event) {
                console.log('Received System Volume Changed event: ' + event.data['level'] + ' ' +
                    event.data['muted']);
            };

            // create a CastMessageBus to handle messages for a custom namespace
            window.messageBus =
                window.castReceiverManager.getCastMessageBus(
                    'urn:x-cast:com.google.cast.sample.helloworld');

            // handler for the CastMessageBus message event
            //called when receiver created above gets data
            window.messageBus.onMessage = function (event) {
                //print received message for debugging
                console.log('Message [' + event.senderId + ']: ' + event.data);
                // display the message from the sender
                displayText(event.data);

                //if pause message received, toggle paused flag
                if (event.data == 80) {
                    //if not paused, raise flag and display "play"
                    if (paused == 1) {
                        paused = 0;
                        console.log("play!")
                    }
                    //if paused, reset flag and display "pause"
                    else {
                        console.log("pause!");
                        paused = 1;
                    }

                }

                //if not pause message, spend data to key press handler
                //simulate a key up AND key down to prevent continuous movement
                keyPressHandlerService.keyPress(event.data);
                keyPressHandlerService.keyRelease(event.data);



                // inform all senders on the CastMessageBus of the incoming message event
                // sender message listener will be invoked
                window.messageBus.send(event.senderId, event.data);
            }



            // initialize the CastReceiverManager with an application status message
            window.castReceiverManager.start({
                statusText: 'Application is starting'
            });
            console.log('Receiver Manager started');
        };

        // utility function to display the text message in the input field
        function displayText(text) {
            console.log(text);
            document.getElementById('message').innerText = text;
            window.castReceiverManager.setApplicationState(text);
        };

    }])
//End cs 499 addition

//initialize game canvase and start game
.directive("centipedeGame", ["$interval", "gameService", "renderService", "graphicsEngineService", function ($interval, gameService, renderService, graphicsEngineService) {
    return {
        restrict: 'A',
        template: '<canvas id="gameCanvas" width="900" height="640" style="text-align: center; position: absolute; left:50%; top: 50%; transform: translate(-50%,-50%); "></canvas>',

        link: function (scope, element) {
            var intervalPromise;
            var animation = 0;
            var canvas = element.find('canvas')[0].getContext("2d");

            graphicsEngineService.initialise(canvas, 'App/img/graphics.png');
            gameService.initialise();


            //loop to keep game running
            //cycle through, updating animations
            function gameLoop() {

                animation++;

                if (animation == 4) {
                    animation = 0;
                }

                //Added Spring 2017 by UK CS499 Group

                //if game is not paused, update the screen
                if (paused != 1) {
                    gameService.update(animation);
                    renderService.draw(animation);
                }
                // if game is paused, display "Paused" on screen
                //do not update animation or game variables
                else {
                    graphicsEngineService.drawText(
                        1,
                        320,
                        350,
                        "Paused!",
                        "#dfc223",
                        "48px Slackey");
                }
                //end CS 499 Addition

            }

            intervalPromise = $interval(gameLoop, 50);

            scope.$on("$destroy", function () {
                if (intervalPromise) {
                    $interval.cancel(intervalPromise);
                    intervalPromise = undefined;
                }z
            });
        }
    }
    }]);
