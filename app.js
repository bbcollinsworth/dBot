//JS in-class 3/3/2015

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var async = require('async');
var Parse = require('node-parse-api').Parse;
var server = require('http').Server(app);
var io = require('socket.io')(server);
var sentiment = require('sentiment');
var port = 9000; //process.env.PORT;//9000;app.set('port', process.env.PORT || 3000);
// var messageArray = [];
// var choicesFunc = [];

var responsesBeforeRepeatAllowed = 25;

var options = {
    app_id: '9X7zv5iCaJ4LlAEN9wD1A3886geFH942KB3zo4um',
    api_key: 'rDEd5ONpK0b00uh3zaUMLFdNBCJphoaPMLq4th1y' //Rest api key (not master key)
};

var parse = new Parse(options);
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use(function(req, res, next) {
    // Setup a Cross Origin Resource sharing
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // console.log('incoming request from ---> ' + ip);
    // Show the target URL that the user just hit
    var url = req.originalUrl;
    console.log('### requesting ---> ' + url);
    next();
});

app.use('/', express.static(__dirname + '/public'));

server.listen(process.env.PORT || 9000, function() {
    console.log('Server running at port:' + port);
});


//*TEST* INDIVIDUAL QUERY FUNCTIONS -
//WOULD NEED ASYNC CALLBACKS TO WORK
//========================================
// function indexQuery(i) {
//     var query = {
//         where: {
//             index: i
//         },
//     };
//     return query;
// }

// function getMessageFromParse(i) {

//     var queryResult = 'bad';
//     parse.find('responses', { where: {
//             messageIndex: i
//         } }, function(err, res) {
//         if (err) {
//             console.log('this ain\'t workin');
//         }
//         console.log('Number of responses retrieved is ' + res.results.length);
//         console.log('Parse message retrieved ' + res.results[0].messageText);
//         queryResult = res.results[0];

//     });
//     return queryResult;
// }
//========================================

// var messageArray = [];
// var choicesFunc = [];

// var query = {
//     limit: 1000,
//     skip: 0
// };

// parse.find('responses', query, function(err, res) {
//     if (err) {
//         console.log('this ain\'t workin');
//     } else {
//         var resResults = res.results;
//         console.log('Number of responses retrieved is ' + resResults.length);


//         for (var j = 0; j < resResults.length; j++) {
//             for (var i = 0; i < resResults.length; i++) {
//                 if (resResults[i].messageIndex == j) {
//                     messageArray.push(resResults[i]);

//                 }
//             }
//         }

//         for (var i = 0; i < messageArray.length; i++) {
//             console.log("Message ObjectID is:" + messageArray[i].objectId);
//             //console.log("True index is: " + i);
//             //console.log("Message index is:" + messageArray[i].messageIndex);
//             //console.log("True index is: " + i);
//             // messageArray[i].messageIndex = i;
//             // console.log("New message index is:" + messageArray[i].messageIndex);
//             // console.log("New true index is: " + i);
//         }


//         // console.log(messageArray[i].messageText);
//         if (messageArray.length == resResults.length) {
//             console.log('Parse Successful!');
//         }
//         return;
//     }

// });

app.post('/', function(req, res) {
    console.log(req.body);

    parse.insert('submissions', {
        // time: req.body[time],
        heSaid: req.body.heSaid,
        iSaid: req.body.iSaid
    }, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log('Parse: Inserted item');
            res.json({
                status: 'OK'
            });
        }
    });

});

//TO STORE RESPONSES IN DATABASE
// app.post('/', function(req, res) {
//     console.log(req.body);



// });



var userIDs = [];
var users = [];
//var startMessage = getMessageFromParse(0);

//.on = listener function (for an event)
//everything on the server happens in .on scope
io.on('connection', function(socket) {
    /*––––––––––– SOCKET.IO starts here –––––––––––––––*/

    //logging user id
    var sock = socket.id;
    console.log('The user ' + sock + ' just connected.');

    userIDs.push(socket.id);


    var messageArray = [];
    var choicesFunc = [];

    var query = {
        limit: 1000,
        skip: 0,
        keys: 'uniqueID,messageIndex,triggers,messageText,nextNodes,canBeNewTopic,category'
    };

    parse.find('responses', query, function(err, res) {
        console.log("Pulling responses DB for user: " + socket.id);
        if (err) {
            console.log('this ain\'t workin');
            console.log(err);
        } else {
            var resResults = res.results;
            console.log('Number of responses retrieved is ' + resResults.length);


            for (var j = 0; j < resResults.length; j++) {
                for (var i = 0; i < resResults.length; i++) {
                    if (resResults[i].messageIndex == j) {
                        messageArray.push(resResults[i]);

                    }
                }
            }

            for (var i = 0; i < messageArray.length; i++) {
                console.log("Message ObjectID is:" + messageArray[i].objectId);
                //console.log("True index is: " + i);
                //console.log("Message index is:" + messageArray[i].messageIndex);
                //console.log("True index is: " + i);
                // messageArray[i].messageIndex = i;
                // console.log("New message index is:" + messageArray[i].messageIndex);
                // console.log("New true index is: " + i);
            }


            // console.log(messageArray[i].messageText);
            if (messageArray.length == resResults.length) {
                console.log('Parse Successful!');
            }

            sendStartMsg();
            return;
        }

    });

    function sendStartMsg() {
        setTimeout(function() {
            var startMessage = messageArray[0];
            //var startMessage = getMessageFromParse(0);
            //console.log(getMessageFromParse(0));

            console.log("Start Message Data: ");
            console.log(startMessage.messageText);
            console.log(startMessage.objectId);

            users.push({
                "socketID": socket.id,
                "index": users.length,
                "name": '',
                "currentMessage": messageArray[0],
                "nextMessage": {},
                "gameStarted": false,
                "size": '',
                "recentMessages": [],
                "userResponses": []
            });


            var newUserIndex = users.length - 1;
            //io.to(users[newUserIndex].socketID).emit('startMessage', {

            io.to(socket.id).emit('startMessage', {
                data: {
                    itemName: startMessage.objectId,
                    user: users[newUserIndex].index,
                    msg: startMessage.messageText
                }
            });

            console.log("Start Emit Done!");

            users[newUserIndex].gameStarted = true;

        }, 500);
    }

    //WHAT TO DO WHEN USER SENDS A CHOICE
    socket.on('userResponse', function(res) {

        console.log(res.userResponse);
        console.log("Their full res is:");
        console.log(res);
        console.log("Their socketID is:");
        console.log(socket.id);


        parseResponse(res.userResponse, socket.id, res.user);
        //var sentimentTest = sentiment(res.userResponse, {
        //    'not': -3
        //});
        //console.log(sentimentTest.score);
    });


    //parse choice so that it can be compared against choiceName trigger words in executeChoice function
    function parseResponse(_userResponse, _userID, _userIndex) {
        console.log("working");
        var response = _userResponse.toLowerCase();
        var parsedResponse = response.split(/[\s,.?!&:()]+/);

        if (response.indexOf("?") !== -1) {
            parsedResponse.push("?");
        }
        if (response.indexOf("!") !== -1) {
            parsedResponse.push("!");
        }
        console.log("parsedResponse: " + parsedResponse);


        var thisUser = {};
        for (var u in users) {
            if (_userID == users[u].socketID) {
                thisUser = users[u];
                break;
            }
        }

        var resToLog = {
            msgObjId: thisUser.currentMessage.objectId,
            msgIndex: thisUser.currentMessage.messageIndex,
            uRRaw: _userResponse,
            uRParsed: parsedResponse
        };

        thisUser.userResponses.push(resToLog);
        console.log("Response Stored: ");
        console.log(thisUser.userResponses[thisUser.userResponses.length - 1]);

        //this function includes process to pick the next message and sends it
        respondToUser(thisUser, parsedResponse);
    }



    function respondToUser(thisUser, parsedResponse) {
        console.log("This User is: " + thisUser.socketID);
        console.log("Current message for this User: " + thisUser.currentMessage.messageText);

        thisUser.nextMessage = pickNextMessage(thisUser.currentMessage, parsedResponse, thisUser.recentMessages);

        //***extra safeguard in case pick totally fails
        if (thisUser.nextMessage === undefined) {
            console.log("PickNext fn returned undefined. Replacing w Random Message");
            thisUser.nextMessage = randomResponse(thisUser.recentMessages);
        }

        console.log("Next message for this User: " + thisUser.nextMessage.messageText);
        console.log("Index of next message: " + thisUser.nextMessage.messageIndex);
        //console.log("TRUE index of next message: " + messageArray.indexOf(thisUser.nextMessage));

        updateRecentMessages(thisUser, thisUser.nextMessage);

        thisUser.currentMessage = thisUser.nextMessage;

        var resDelay = Math.random()*500;
        resDelay = Math.floor(resDelay);
        console.log("Random delay is: " + resDelay);

        setTimeout(function() {
            io.to(thisUser.socketID).emit('botMessage', {
                data: {
                    itemName: thisUser.currentMessage.objectId, //nextChoiceName,//nextMessage[index].messageText;
                    msg: thisUser.currentMessage.messageText
                }
            });
        }, resDelay);
    }


    function updateRecentMessages(_user, _message) {
        _user.recentMessages.push({
            text: _message.messageText,
            index: _message.messageIndex,
            timer: responsesBeforeRepeatAllowed
        });

        //could just splice off first array item when
        //length greater than certain #, as proxy for timer;
        //but this allows different time limits on different messages
        //if we ever wanted that functionality
        for (var m in _user.recentMessages) {
            var thisMsg = _user.recentMessages[m];
            thisMsg.timer -= 1;
            if (thisMsg.timer <= 0) {
                _user.recentMessages.splice(m, 1);
            }
            // console.log("RecentMessages new length: " + _user.recentMessages.length);

        }

        console.log("This user's recent messages updated: ");
        console.log("RecentMessages new length: " + _user.recentMessages.length);
        console.log(_user.recentMessages);
    }

    function pickNextMessage(_currentMessage, _parsedResponse, _recentMessages) {
        var pickedMessage = {};
        console.log("Pick Next Message Called");
        //console.log("Next Nodes of this message: " + _currentMessage.nextNodes.length);
        if (_currentMessage.nextNodes !== undefined) {
            console.log("I know this message has nextNodes");
            if (_currentMessage.nextNodes.length == 1) { //if there's only one path to take...
                nextMessageIndex = _currentMessage.nextNodes[0]; //pulls the only number in nextNodes array and sets it as index
                pickedMessage = messageArray[nextMessageIndex]; //pulls the next message object based on index from nextNodes
                console.log("This message has one possible path");
                //console.log("Next message is: " + pickedMessage.messageText);
                return pickedMessage;

                //****UPDATED THIS TO CATCH NEXT-NODES ARRAYS THAT ARE ZEROED OUT
            } else if (_currentMessage.nextNodes.length > 1) {
                console.log("This message has multiple possible paths");
                pickedMessage = matchTriggers(_parsedResponse, _recentMessages, _currentMessage.nextNodes); //call matchtriggers, but with limits to specific options
                //console.log("Next message is: " + pickedMessage.messageText);
                return pickedMessage;
            } else {
                console.log("Msg has nextNodes but arr length is <1...");
                console.log("Thus proceeding to trigger match");

                pickedMessage = matchTriggers(_parsedResponse, _recentMessages);
                console.log("Next Picked Message: " + pickedMessage.messageText);
                console.log("Index of next message: " + pickedMessage.messageIndex);
                return pickedMessage;
            }
        } else {
            console.log("I know nextNodes is undefined");

            pickedMessage = matchTriggers(_parsedResponse, _recentMessages);
            console.log("Next Picked Message: " + pickedMessage.messageText);
            console.log("Index of next message: " + pickedMessage.messageIndex);
            return pickedMessage;
        }

    }

    function matchTriggers(parsedRes, recentArray, nextNodesArray) {
        console.log("Match Triggers called");

        var limitRandomToNextNodes;

        if (nextNodesArray !== undefined) {
            limitRandomToNextNodes = true;
            console.log("NextNodesArray is defined...limiting to next nodes");
        } else {
            nextNodesArray = getFullDBIndex();
            limitRandomToNextNodes = false;
        }

        console.log("NextNodesArray Length before recentCheck is: " + nextNodesArray.length);

        spliceRecentlyUsed(nextNodesArray, recentArray);

        console.log("NextNodesArray Length after recentCheck is: " + nextNodesArray.length);

        var matchedMessage = {};
        var matchCounts = [];
        var matchCountMax = 0;

        for (var n in nextNodesArray) {

            var matchCount = 0;

            var indexToCheck = nextNodesArray[n];
            //console.log("Next nodes Index to check: " + indexToCheck);
            //console.log("Triggers at nextNodes: " + messageArray[indexToCheck].triggers);
            nextTriggersArray = messageArray[indexToCheck].triggers;

            if (nextTriggersArray !== undefined) {
                for (var w in parsedRes) {

                    var termToCompare = parsedRes[w];

                    for (var t in nextTriggersArray) {

                        var triggerToCheck = nextTriggersArray[t];
                        //OR FOR WEIGHTED MATCH:
                        ////var triggerToCheck = tempTriggers[t].value;

                        if (termToCompare == triggerToCheck) {
                            matchCount++;
                            //FOR WEIGHTED MATCH:
                            //matchCount += tempTriggers[t].weight;
                        }
                    }

                }
            }

            if (matchCount > matchCountMax) {
                matchCountMax = matchCount;
            }

            if (matchCount > 0 && matchCount >= matchCountMax) {
                matchCounts.push({
                    "indexOfMessage": indexToCheck,
                    "matchedTriggers": matchCount
                });
            }
        }

        if (matchCounts.length < 1) {
            if (limitRandomToNextNodes) {
                console.log("NextNodes limited but no triggers matched");
                //var randomIndex = getRandomIndex(nextNodesArray.length);
                var randomIndex = Math.floor(Math.random() * nextNodesArray.length);
                var randomNextNode = nextNodesArray[randomIndex];
                matchedMessage = messageArray[randomNextNode];
                return matchedMessage;
            } else {
                //randomIndex
                console.log("No matches - I am sending a random response!");
                matchedMessage = randomResponse(recentArray); // THIS NEEDS TO BE SET
                return matchedMessage;
            }
        } else if (matchCounts.length == 1) {
            console.log("Only one matched message");
            var indexOfNextMessage = matchCounts[0].indexOfMessage;
            matchedMessage = messageArray[indexOfNextMessage];
            return matchedMessage;
        } else {
            console.log("Picking a matched message from several matched triggers");
            for (var m = 0; m < matchCounts.length; m++) {
                if (matchCounts[m].matchedTriggers < matchCountMax) {
                    matchCounts.splice(m, 1);
                }
            }

            var randomIndex = Math.floor(Math.random() * matchCounts.length);
            var indexOfNextMessage = matchCounts[randomIndex].indexOfMessage;
            matchedMessage = messageArray[indexOfNextMessage];
            return matchedMessage;

        }

    }

    function spliceRecentlyUsed(arrayOfIndices, _recentArray) {
        //checks each index in this array of indices to see if it matches
        //index of a message that was recently used

        for (var j in _recentArray) {
            var indexMatched = false;

            for (var i in arrayOfIndices) {
                if (_recentArray[j].index == arrayOfIndices[i]) {
                    indexMatched = true;
                    console.log("Splicing Message Index " + arrayOfIndices[i]);
                    arrayOfIndices.splice(i, 1);
                    break;
                }
            }
        }
    }


    function getRandomIndex(arrayLength) {
        var randI = Math.floor(Math.random() * arrayLength);
        return randI;
    }

    function randomResponse(recent) {

        var allAvailIndices = getFullDBIndex(true);

        spliceRecentlyUsed(allAvailIndices, recent);

        randomIndex = Math.floor(Math.random() * allAvailIndices.length);

        var randResIndex = allAvailIndices[randomIndex];

        var randRes = messageArray[randResIndex];
        return randRes;
    }

    function getFullDBIndex(onlyNewTopics) {
        if (onlyNewTopics == undefined) {
            onlyNewTopics = false;
        }


        if (onlyNewTopics) {
            var fullDBIndex = [];

            for (var i = 0; i < messageArray.length; i++) {
                if (messageArray[i].canBeNewTopic == true) {
                    fullDBIndex.push(i);
                }
            }
            console.log("FullDBLength: " + fullDBIndex.length);
            return fullDBIndex;

        } else {
            var fullDBIndex = [];

            for (var i = 0; i < messageArray.length; i++) {
                fullDBIndex.push(i);
                //console.log("messageIndex pushed: " + messageIndex);
            }
            console.log("FullDBLength: " + fullDBIndex.length);
            return fullDBIndex;
        }

    }

    var updateResArrays = function(itemsToUpdate, newResData) {

        itemsToUpdate.forEach(function(i) {

            var itemID = i.objectId;
            var uResRawAr = [];
            if (i.userResponseRaw !== undefined) {
                uResRawAr = i.userResponseRaw;
            }
            var uResParsedAr = [];
            if (i.userResponseParsed !== undefined) {
                uResParsedAr = i.userResponseParsed;
            }

            //console.log("Old Res Array Raw for BotMsg " + i.messageIndex + " is:");
            //console.log(uResRawAr);

            var newResponses = {};
            var newDataFound = false;

            for (var d in newResData) {
                if (newResData[d].msgObjId == itemID) {
                    newResponses = newResData[d];
                    newDataFound = true;
                    break;
                }
            }

            if (newDataFound) {

                uResRawAr.push(newResponses.uRRaw);
                newResponses.uRParsed.forEach(function(r) {
                    uResParsedAr.push(r);
                });

                console.log("Pushed new data to Res Arrays");
                //console.log("Updated Res Arrays are: ");
                //console.log(uResRawAr);
                //console.log(uResParsedAr);

                parse.update('responses', itemID, {
                    userResponseRaw: uResRawAr,
                    userResponseParsed: uResParsedAr
                }, function(err, data) {
                    if (err) {
                        console.log("Error: " + err);
                        return;
                    } else {
                        console.log('Parse: updated uRes Data for BotMsg ' + i.messageIndex);
                        return;

                    }
                });
            }

        });
    };


    var pushUserResponses = function(user, cb) {

        var resRecords = user.userResponses;

        var prevData = [];

        async.each(resRecords, function(resObj, callback) {
            console.log("This Msg ID is: " + resObj.msgObjId);

            parse.find('responses', {
                objectId: resObj.msgObjId,
                keys: 'uniqueID,messageIndex,messageText,userResponseRaw,userResponseParsed'
            }, function(err, res) {

                if (res !== undefined) {
                    prevData.push(res);

                    //console.log("Response to update for " + resObj.msgObjId + " is: ");
                    //console.log(res);

                    callback();

                } else if (err) {
                    callback("Parse Find Error in ResRecords for " + resObj.msgObjId + ": " + res);
                }
            });
        }, function(err) {
            // if any of the file processing produced an error, err would equal that error 
            if (err) {
                // One of the iterations produced an error. All processing will now stop. 
                console.log(err);
            } else {
                console.log('All records to update have bene pulled successfully');
                //console.log(prevData);
            }

            //this updates the Parse aggregate userinput arrays
            updateResArrays(prevData, resRecords);

            //this deletes the disconnected user from the users array
            cb(user);

        });

    };

    var spliceUser = function(userObj) {
        var indexToRemove = users.indexOf(userObj);

        var socketIndexToRemove = userIDs.indexOf(userObj.socketID);

        if (indexToRemove > -1) {
            users.splice(indexToRemove, 1);
            console.log("User removed. " + users.length + " users remain.");
        }

        if (socketIndexToRemove > -1) {
            userIDs.splice(indexToRemove, 1);
            console.log("User socketID removed. " + userIDs.length + " users remain.");
        }
    };

    //****LISTENS FOR USER DISCONNECT****
    socket.on('disconnect', function() {
        console.log('a user ' + socket.id + ' just disconnected.');

        var goneUser = {};

        for (var u in users) {
            if (users[u].socketID == socket.id) {
                goneUser = users[u];
                console.log("User who left is: " + goneUser.socketID);
                console.log("Their index is: " + users.indexOf(goneUser));
                break;
            }
        }

        pushUserResponses(goneUser, spliceUser);

    });

});