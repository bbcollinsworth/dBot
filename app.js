//JS in-class 3/3/2015

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var AWS = require('aws-sdk');
var dotenv = require('dotenv').load();
var fs = require('fs');
var async = require('async');
var Parse = require('node-parse-api').Parse;
var server = require('http').Server(app);
var io = require('socket.io')(server);
var sentiment = require('sentiment');
var port = 8081; //process.env.PORT;//9000;app.set('port', process.env.PORT || 3000);
// var messageArray = [];
// var choicesFunc = [];

var dataFile = require('./responses.json');
var rawData = dataFile.results;
console.log("Raw data length is " + rawData.length);

var responsesBeforeRepeatAllowed = 35;
var rerollThreshold = 0.4;

var options = {
    app_id: process.env.PARSE_APP_ID,
    api_key: process.env.PARSE_API_KEY //Rest api key (not master key)
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

server.listen(process.env.PORT || port, function() {
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

    var userIndex;

    var messageArray = [];
    var choicesFunc = [];

    var query = {
        limit: 1000,
        skip: 0,
        keys: 'messageIndex,triggers,messageText,nextNodes,canBeNewTopic,canBeRandomNextNode,category'
    };

    var dataKeys = [
        'messageIndex',
        'triggers',
        'messageText',
        'nextNodes',
        'canBeNewTopic',
        'canBeRandomNextNode',
        'category',
        'objectId'
    ];

    //var rawData = js;

    //var responseDB = []; //messageArray

    //for each item we need to add...
    for (var i = 0; i < rawData.length; i++) {
        //loop through the raw data...
        for (var j = 0; j < rawData.length; j++) {

            var thisResponse = rawData[j];

            //if the index of this raw data object equals the index we're ready to add...
            if (thisResponse.messageIndex == i) {


                var myResObject = {};
                //copy out the keys we need...
                for (var k = 0; k < dataKeys.length; k++) {

                    var key = dataKeys[k];
                    //console.log("Trying to add Key " + key + " for item " + i);
                    myResObject[key] = thisResponse[key];

                }

                // if (i % 30 == 0) {
                //     console.log("Test Object: " + i);
                //     console.log(myResObject);
                // }
                //add it to our local response database for this user
                messageArray.push(myResObject);
            }
        }


    }

    if (messageArray.length == rawData.length) {
        console.log('Parse pull Successful!');
    } else {
        console.log('DB pull messed up!');
    }

    sendStartMsg();
    //return;

    // parse.find('responses', query, function(err, res) {
    //     console.log("Pulling responses DB for user: " + socket.id);
    //     if (err) {
    //         console.log('this ain\'t workin');
    //         console.log(err);
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
    //             // console.log("Message ObjectID is:" + messageArray[i].objectId);
    //             //console.log("True index is: " + i);
    //             //console.log("Message index is:" + messageArray[i].messageIndex);
    //             //console.log("True index is: " + i);
    //             // messageArray[i].messageIndex = i;
    //             // console.log("New message index is:" + messageArray[i].messageIndex);
    //             // console.log("New true index is: " + i);
    //         }


    //         // console.log(messageArray[i].messageText);
    //         if (messageArray.length == resResults.length) {
    //             console.log('Parse pull Successful!');
    //         }

    //         sendStartMsg();
    //         return;
    //     }

    // });

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

    //for users who don't respond for a while
    var delayedRes;
    var secondDelayedRes;
    //var waitTime = 10000;

    //WHAT TO DO WHEN USER SENDS A CHOICE
    socket.on('userResponse', function(res) {

        console.log(res.userResponse);
        console.log("Their full res is:");
        console.log(res);
        console.log("Their socketID is:");
        console.log(socket.id);

        //THIS MAKES DBOT SEND IMPATIENT RESPONSES:
        clearTimeout(delayedRes);
        clearTimeout(secondDelayedRes);

        var waitTime = 1000 * (Math.random() * 20 + 10);
        var thisUser = getUser(socket.id);

        delayedRes = setTimeout(function() {
            console.log("I'm getting impatient after userRes " + res.userResponse);

            respondToUser(thisUser);

        }, waitTime);

        if (Math.random() > 0.3) {
            var longerWaitTime = waitTime + 1000 * (Math.random() * 30 + 10);
            secondDelayedRes = setTimeout(function() {
                console.log("Sending 2nd impatient res after " + res.userResponse);
                respondToUser(thisUser);
            }, longerWaitTime);
        }

        parseResponse(res.userResponse, socket.id, res.user);
        //var sentimentTest = sentiment(res.userResponse, {
        //    'not': -3
        //});
        //console.log(sentimentTest.score);
    });

    function getUser(sID) {
        var thisUser = {};
        for (var u in users) {
            if (socket.id == users[u].socketID) {
                thisUser = users[u];
                break;
            }
        }
        return thisUser;
    }

    function shortCheck(rawResponse) {
        console.log("Checking for short response");
        if (rawResponse.length <= 2) {
            console.log("Short detected!");
            return true;
        } else {
            return false;
        }
    }

    function longCheck(parsedResponse) {
        console.log("Checking for long response");
        if (parsedResponse.length > 14) {
            return true;
        } else {
            for (var r in parsedResponse) {
                var word = parsedResponse[r];

                if (word.length > 8) {
                    console.log("Long detected!");
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    function repeatCheck(rawResponse) {
        console.log("Checking for repeated response");
        var u = getUser(socket.id);
        var lastUResIndex = u.userResponses.length - 1;
        if (lastUResIndex < 0) {
            return;
        } else {
            var lastURes = u.userResponses[lastUResIndex].uRRaw;
            if (rawResponse == lastURes) {
                console.log("Repeat detected!");
                return true;
            } else {
                return false;
            }
        }
    }


    //parse choice so that it can be compared against choiceName trigger words in executeChoice function
    function parseResponse(_userResponse, _userID, _userIndex) {
        console.log("working");
        var response = _userResponse.toLowerCase();

        //TEST THIS WITH '<>'
        var parsedResponse = response.split(/[\s,.?!&:()<>]+/);

        if (response.indexOf("?") !== -1) {
            parsedResponse.push("?");
        }
        if (response.indexOf("!") !== -1) {
            parsedResponse.push("!");
        }
        console.log("parsedResponse: " + parsedResponse);

        var shortRes = shortCheck(_userResponse);
        var longRes = longCheck(parsedResponse);
        var repeatRes = repeatCheck(_userResponse);

        if (shortRes) {
            parsedResponse.push("shortResponse");
        }

        if (longRes) {
            parsedResponse.push("longResponse");
        }

        if (repeatRes) {
            parsedResponse.push("repeatResponse");
        }

        console.log("Updated parsedResponse: " + parsedResponse);

        var thisUser = getUser(_userID);

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

    function impatientResponse(user) {
        var impResIndices = [];
        for (var i in messageArray) {
            if (messageArray[i].category == "impatient") {
                impResIndices.push(messageArray[i].messageIndex);
            }
        }

        spliceRecentlyUsed(impResIndices, user.recentMessages);

        if (impResIndices.length < 1) {
            return null;
        } else {
            randIndex = getRandomIndex(impResIndices.length);
            var pickedIndex = impResIndices[randIndex];
            var impRes = messageArray[pickedIndex];
            console.log("Sending impatient response: ");
            console.log(impRes.messageText);
            return impRes;
        }

    }

    function respondToUser(thisUser, parsedResponse) {
        console.log("This User is: " + thisUser.socketID);
        console.log("Current message for this User: " + thisUser.currentMessage.messageText);

        if (parsedResponse === undefined) {
            var tempRes = impatientResponse(thisUser);

            if (tempRes === null) {
                console.log("All impatient msgs used. Returning");
                return;
            } else {
                thisUser.nextMessage = tempRes;
            }

        } else {

            thisUser.nextMessage = pickNextMessage(thisUser.currentMessage, parsedResponse, thisUser.recentMessages);
        }
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

        var resDelay = Math.random() * 800;
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
        console.log("Most recent is: " + _user.recentMessages[_user.recentMessages.length - 1].messageText);
    }

    function pickNextMessage(_currentMessage, _parsedResponse, _recentMessages) {
        var pickedMessage = {};
        console.log("Pick Next Message Called");

        //console.log("Next Nodes of this message: " + _currentMessage.nextNodes.length);
        if (_currentMessage.nextNodes !== undefined) {
            var nextNodesCopy = _currentMessage.nextNodes.slice(0); //making sure we don't modify original nextnodes!

            console.log("I know this message has nextNodes");
            console.log("NextNodesCopy is: " + nextNodesCopy);

            if (nextNodesCopy.length == 1) { //if there's only one path to take...
                nextMessageIndex = nextNodesCopy[0];
                //nextMessageIndex = nextNodesCopy[0]; //pulls the only number in nextNodes array and sets it as index
                pickedMessage = messageArray[nextMessageIndex]; //pulls the next message object based on index from nextNodes
                console.log("This message has one possible path");
                //console.log("Next message is: " + pickedMessage.messageText);
                return pickedMessage;

                //****UPDATED THIS TO CATCH NEXT-NODES ARRAYS THAT ARE ZEROED OUT
            } else if (nextNodesCopy.length > 1) {
                console.log("This message has multiple possible paths");
                pickedMessage = matchTriggers(_parsedResponse, _recentMessages, nextNodesCopy); //call matchtriggers, but with limits to specific options
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

        //console.log("NextNodesArray Length before recentCheck is: " + nextNodesArray.length);

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

                spliceNonRandomNextNodes(nextNodesArray);

                matchedMessage = randomResponse(recentArray, nextNodesArray);
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
            if (!matchedMessage.canBeRandomNextNode) {
                if (Math.random() > rerollThreshold) {
                    console.log("Matched message special - sending random response instead!");
                    matchedMessage = randomResponse(recentArray, nextNodesArray); // THIS NEEDS TO BE SET
                    //return matchedMessage;
                } //else {
                //     console.log("Matched message special - sending it!");
                //     return matchedMessage;
                // }
                console.log("Matched message special - sending it!");
            } //else {
            return matchedMessage;
            //}
        } else {
            console.log("Picking a matched message from several matched triggers");
            for (var m = 0; m < matchCounts.length; m++) {
                if (matchCounts[m].matchedTriggers < matchCountMax) {
                    matchCounts.splice(m, 1);
                }
            }

            var randomIndex = getRandomIndex(matchCounts.length);
            //var randomIndex = Math.floor(Math.random() * matchCounts.length);
            var indexOfNextMessage = matchCounts[randomIndex].indexOfMessage;
            matchedMessage = messageArray[indexOfNextMessage];

            //check for special message
            if (limitRandomToNextNodes) {
                if (!matchedMessage.canBeRandomNextNode) {
                    console.log("I know this message can't be RandomNextNode");
                    if (Math.random() > rerollThreshold) {
                        console.log("Matched message special - sending random response instead!");
                        matchedMessage = randomResponse(recentArray, nextNodesArray); // THIS NEEDS TO BE SET
                        // return matchedMessage;
                    } else {
                        console.log("Matched message special - sending it!");
                        //return matchedMessage;
                    }
                } // else {

                //}
            }
            return matchedMessage;

        }

    }

    function spliceNonRandomNextNodes(nodesArray) {

        if (nodesArray.length > 1) {
            console.log("Checking for special nextnodes...");
            nodesArray.forEach(function(nodeIndex) {
                //for (var n in nodesArray){
                //NOT WORKING YET
                //var checkIndex = nodesArray[n];
                console.log("canBeRandNext is: " + messageArray[nodeIndex].canBeRandomNextNode);
                if (!messageArray[nodeIndex].canBeRandomNextNode) {
                    var iToSplice = nodesArray.indexOf(nodeIndex);
                    console.log("Splicing special nextNode at index: " + iToSplice);
                    nodesArray.splice(iToSplice, 1);
                }
            });
        }

        console.log("nodesArray Length after specialCheck is: " + nodesArray.length);
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

    function randomResponse(recent, indicesArray) {

        var allAvailIndices = [];
        if (indicesArray !== undefined) {
            console.log("Sending a random response limited to nextNodes");
            allAvailIndices = indicesArray;
        } else {
            console.log("Sending a random response from ALL can be new topics");
            allAvailIndices = getFullDBIndex(true);
        }

        //var allAvailIndices = getFullDBIndex(true);

        spliceRecentlyUsed(allAvailIndices, recent);

        //randomIndex = Math.floor(Math.random() * allAvailIndices.length);

        randomIndex = getRandomIndex(allAvailIndices.length);

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
                keys: 'messageIndex,messageText,userResponseRaw,userResponseParsed'
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

        clearTimeout(delayedRes);
        clearTimeout(secondDelayedRes);

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

        //temporarily removing push of user response data
        spliceUser(goneUser);
        //pushUserResponses(goneUser, spliceUser);

    });

});