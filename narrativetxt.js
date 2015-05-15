var choices = [{
    //0
    choiceName: 'YES',
    messageText: 'Really? So you know what happened to Lee?',
    nextChoices: ['NO', '...']
}, { //1
    choiceName: 'NO',
    messageText: 'Me either. Everything is a haze. Fuck. We need to figure out what happened. Should I call the police? Or look around?',
    nextChoices: ['POLICE', 'AROUND']
},{ //2
    choiceName: '...',
    messageText: 'Me either. Everything is a haze. Fuck. We need to figure out what happened. Should I call the police? Or look around?',
    nextChoices: ['POLICE', 'AROUND']
}, { //3
    choiceName: 'POLICE',
    messageText: 'Everything\'s a haze for me. Same for the others. Maybe we should figure out what happened and get our stories straight first? Where should I look?',
    nextChoices: ['BEDROOM', 'BATHROOM']
}, { //4
    choiceName: 'AROUND',
    bgImage: '/img/cabin.jpg',
    messageText: 'Okay. Should I start in the bedroom or bathroom?',
    nextChoices: ['BEDROOM', 'BATHROOM']
}, { //5
    choiceName: 'BEDROOM',
    bgImage: '/img/bedroom.jpg',
    messageText: 'Hmmmm... There\'s a video camera on the dresser, a journal on the nightstand, and it looks like a used condom by the bed. What should I check out?',
    nextChoices: ['VIDEO', 'CONDOM', 'JOURNAL']
}, { //6
    choiceName: 'VIDEO',
    messageText: 'Whoa...WTF? This video shows... That\'s definitely you...having sex with Lee. Sam better not have seen this...talk about pissed. Um, should I delete this or...not?',
    nextChoices: ['DELETE', 'NOT']
}, { //7
    choiceName: 'DELETE',
    hasConsequence: true,
    choiceConsequence: function () {
        //bedroom choice
        choices[5].nextChoices.splice(0, 1);
        //yeah, maybe, noo! choices
        choices[10].nextChoices.splice(0, 1);
        choices[11].nextChoices.splice(0, 1);
        choices[12].nextChoices.splice(0, 1);
        },
    messageText: 'Okay, I deleted it. Where do you want to look next?',
    nextChoices: ['CONDOM', 'JOURNAL', 'BATHROOM']
}, { //8
    choiceName: 'NOT',
    messageText: 'Yeah, that\'s probably the right decision. Okay, we should hurry. Where do you want me to look next?',
    nextChoices: ['CONDOM', 'JOURNAL', 'BATHROOM']
}, { //9
    choiceName: 'CONDOM',
    messageText: 'Definitely used. Do you remember using it last night?',
    nextChoices: ['YEH', 'NOO!']
}, { //10
    choiceName: 'YEAH',
    messageText: 'Oh, it was with Sam again, wasn\'t it? God, Lee would have flipped out. Ok, where next?',
    nextChoices: ['VIDEO', 'JOURNAL', 'BATHROOM']
}, { //11
    choiceName: 'NOO!',
    //choiceConsequence: ,
    messageText: 'Okay, okay. You never know. We were all pretty fucked up. Besides, I thought I heard Sam in here with someone, but it must not have been you. Where to next?',
    nextChoices: ['VIDEO', 'JOURNAL', 'BATHROOM']
}, { //12
    choiceName: 'JOURNAL',
    //choiceConsequence: ,
    messageText: 'I\'m looking at the last page. At the top are 4 numbers: 1114. The entry below says: \"I can\'t believe it\'s come to this. I\'m so angry at myself...and them. I need to get out even if I have to...\" that\'s where it ends. Sounds really serious though. We need to get to the bottom of this. Where next?',
    nextChoices: ['VIDEO', 'CONDOM', 'BATHROOM']
},{ //13
    choiceName: 'BATHROOM',
    bgImage: '/img/bathroom.jpg',
    //choiceConsequence: ,
    messageText: 'In the bathroom now. There\'s Lee\'s phone, an empty bottle of booze, and what looks like some sort of white powder on the sink. What should I look at first?',
    nextChoices: ['BOOZE', 'PHONE', 'POWDER']
}, { //14
    choiceName: 'PHONE',
    //choiceConsequence: ,
    messageText: 'There\'s a lockscreen. Do you know the 4-digit code? Be careful. I know Lee was pretty paranoid about security, so it\'ll lock us out if you guess wrong.',
    nextChoices: ['1111', '1946', '1614', '1114']
}, { //15
    choiceName: '1111',
    //choiceConsequence: ,
    messageText: 'Wrong code. You\'ve been locked out. We\'ll have to look somewhere else and come back to this. Where to?',
    nextChoices: ['BOOZE', 'POWDER', 'BEDROOM']
}, { //16
    choiceName: '1946',
    //choiceConsequence: ,
    messageText: 'Wrong code. Locked out. I hate to say it, but we\'ll have to look somewhere else and come back to this. Where to?',
    nextChoices: ['BOOZE', 'POWDER', 'BEDROOM']
}, { //17
    choiceName: '1614',
    //choiceConsequence: ,
    messageText: 'Wrong code...locked out. Damn Lee. We\'ll have to look somewhere else and come back to this. Where to?',
    nextChoices: ['BOOZE', 'POWDER', 'BEDROOM']
}, { //18
    choiceName: '1114',
    //choiceConsequence: ,
    messageText: 'Nice. I\'m in. Oh, whoa...there\'s a text from the CEO of our competitor company. It looks like Lee was going to sell out. That little backstabber. Did you suspect this?',
    nextChoices: ['SUSPECTED', 'NOPE']
}, { //19
    choiceName: 'SUSPECTED',
    //choiceConsequence: ,
    messageText: 'If you did, then I bet I know who else did too. Alex would have freakin\' killed anyone who threated the startup. I mean, not actually killed...I think.',
    nextChoices: ['BOOZE', 'POWDER', 'BEDROOM']
}, { //20
    choiceName: 'NOPE',
    //choiceConsequence: ,
    messageText: 'Right. I did hear raised voices and banging the other night. When I walked in Jessie and Lee were both panting and glaring at each other. Like they\'d been having a very heated argument.',
    nextChoices: ['BOOZE', 'POWDER', 'BEDROOM']
}, { //21
    choiceName: 'POWDER',
    //choiceConsequence: ,
    messageText: 'Something\'s coming back to me. I have this memory of you holding a bag of some crazy new powdered stuff. Do you remember who the drugs belonged to?',
    nextChoices: ['YOU', 'ME', 'LEE']
}, { //22
    choiceName: 'YOU',
    //choiceConsequence: ,
    messageText: 'Damn. I can\'t believe I forgot...I remember now. You both were being total downers, so I thought a little bit in your drinks would do the trick. I got a bunch in Lee\'s, but I think I might have missed your cup.',
    nextChoices: ['BOOZE','PHONE','BEDROOM']
}, { //23
    choiceName: 'ME',
    //choiceConsequence: ,
    messageText: 'Oh yeah, shit that stuff was strong mixed with alcohol. I remember hallucinating all sorts of freaky stuff, but everything\'s jumbled. Fuck. I remember blood...and you screaming at Lee to get away.',
    nextChoices: ['BOOZE','PHONE','BEDROOM']
}, { //24
    choiceName: 'LEE',
    //choiceConsequence: ,
    messageText: 'Of course. I thought Lee\'d quit that stuff. I guess the nightmares from service abroad came back. This is fucking depressing. Lee didn\'t deserves...we owe it to him to figure out what happened. Where next?',
    nextChoices: ['BOOZE','PHONE','BEDROOM']
}, { //25
    choiceName: 'BOOZE',
    //choiceConsequence: ,
    messageText: 'It\'s the bottle of vodka Lee was drinking from...you must have bought it because the rest of us know better than to let him near that stuff. There\'s also a little bit of that powder on the outside. Do you want to destroy the bottle or leave it?',
    nextChoices: ['DESTROY', 'LEAVE']
}, { //26
    choiceName: 'DESTROY',
    //choiceConsequence: ,
    hasConsequence: true,
    choiceConsequence: function () {
        //bathroom choice
        choices[13].nextChoices.splice(0, 1);
        //phone
        choices[15].nextChoices.splice(0, 1);
        choices[16].nextChoices.splice(0, 1);
        choices[17].nextChoices.splice(0, 1);
        choices[19].nextChoices.splice(0, 1);
        choices[20].nextChoices.splice(0, 1);
        choices[22].nextChoices.splice(0, 1);
        choices[23].nextChoices.splice(0, 1);
        choices[24].nextChoices.splice(0, 1);
        },
    messageText: 'Okay, I got rid of it. Where do you want me to look next?',
    nextChoices: ['PHONE', 'POWDER', 'BEDROOM']
}, { //27
    choiceName: 'LEAVE',
    //choiceConsequence: ,
    messageText: 'It\'s the bottle of vodka Lee was drinking from...you must have bought it because the rest of us know better than to let him near that stuff. There\'s also a little bit of that powder on the outside. Do you want to destroy the bottle or leave it?',
    nextChoices: ['PHONE', 'POWDER', 'BEDROOM']
}];

// var choices = [{
//     //0
//     choiceName: 'YES',
//     messageText: 'Really? I just texted the others. No one remembers anything. So you know what happened to Lee?',
//     nextChoices: ['NO', 'OF COURSE NOT']
// }, { //1
//     choiceName: 'NO',
//     messageText: 'Me either. Everything is a haze. Fuck. We need to figure out what happened. Should I call the police? Or look around?',
//     nextChoices: ['POLICE', 'LOOK AROUND']
// },{ //2
//     choiceName: 'OF',
//     messageText: 'Me either. Everything is a haze. Fuck. We need to figure out what happened. Should I call the police? Or look around?',
//     nextChoices: ['POLICE', 'LOOK AROUND']
// }, { //3
//     choiceName: 'POLICE',
//     messageText: 'Everything\'s a haze for me. Same for the others. Maybe we should figure out what happened and get our stories straight first? Where should I look?',
//     nextChoices: ['BEDROOM', 'BATHROOM']
// }, { //4
//     choiceName: 'LOOK',
//     bgImage: '/img/cabin.jpg',
//     messageText: 'Okay. Should I start in the bedroom or bathroom?',
//     nextChoices: ['BEDROOM', 'BATHROOM']
// }, { //5
//     choiceName: 'BEDROOM',
//     bgImage: '/img/bedroom.jpg',
//     // hasConsequence: true,
//     // choiceConsequence: function () {
//     // },
//     messageText: 'Hmmmm...There\'s a video camera on the dresser, a journal on the nightstand, and it looks like a used condom by the bed. What should I check out?',
//     nextChoices: ['VIDEO', 'CONDOM', 'JOURNAL']
// }, { //6
//     choiceName: 'VIDEO',
//     //specialUser: 'Sam',
//     //messageAlt: 'Whoa...WTF! Not sure how to break this to you. It's Lee...having sex with'
//     //hasConsequence: true,
//     //visitorArray: [],
//     //choiceConsequence: function(){ insert character name of visitor into visitorArray, i++}
//     //this.visitorArray.push(nme of user sent from client side);
//     messageText: 'Whoa...WTF? This video shows... That\'s definitely you...having sex with Lee. Sam better not have seen this...talk about pissed. I won\'t tell anyone, but um, should I delete this or...not?',
//     nextChoices: ['DELETE', 'NOT']
// }, { //7
//     choiceName: 'DELETE',
//     hasConsequence: true,
//     choiceConsequence: function () {
//         // // bedroom choice
//         // choices[5].nextChoices.splice(0, 1);
//         // //yeah, nah choices
//         // choices[10].nextChoices.splice(0, 1);
//         // choices[11].nextChoices.splice(0, 1);
//         // // from journal choice
//         // choices[12].nextChoices.splice(0, 1);

//         choices[6].messageText = 'There\'s nothing on here. Looks like someone deleted something. Where do you want to look next?'
//         choices[6].nextChoices = ['CONDOM', 'JOURNAL', 'BATHROOM']
//         },
//     messageText: 'Okay, I deleted it. Where do you want to look next?',
//     nextChoices: ['CONDOM', 'JOURNAL', 'BATHROOM']
// }, { //8
//     choiceName: 'NOT',
//     messageText: 'Yeah, that\'s probably the right decision. Okay, we should hurry. Where do you want me to look next?',
//     nextChoices: ['CONDOM', 'JOURNAL', 'BATHROOM']
// }, { //9
//     choiceName: 'CONDOM',
//     messageText: 'Definitely used. Do you remember using it last night?',
//     nextChoices: ['YEH', 'NAH']
// }, { //10
//     choiceName: 'YEAH',
//     messageText: 'Oh, it was with Sam again, wasn\'t it? God, Lee would have flipped out. Ok, where next?',
//     nextChoices: ['VIDEO', 'JOURNAL', 'BATHROOM']
// }, { //11
//     choiceName: 'NAH',
//     //choiceConsequence: ,
//     messageText: 'Okay, okay. You never know. We were all pretty fucked up. Besides, I thought I heard Sam in here with someone, but it must not have been you. Where to next?',
//     nextChoices: ['VIDEO', 'JOURNAL', 'BATHROOM']
// }, { //12
//     choiceName: 'JOURNAL',
//     //choiceConsequence: ,
//     messageText: 'I\'m looking at the last page. At the top are 4 numbers: 1114. The entry below says: \"I can\'t believe it\'s come to this. I\'m so angry at myself...and them. I need to get out even if I have to...\" that\'s where it ends. Sounds really serious though. We need to get to the bottom of this. Where next?',
//     nextChoices: ['VIDEO', 'CONDOM', 'BATHROOM']
// },{ //13
//     choiceName: 'BATHROOM',
//     bgImage: '/img/bathroom.png',
//     //choiceConsequence: ,
//     messageText: 'In the bathroom now. There\'s Lee\'s phone, an empty bottle of booze, and what looks like some sort of white powder on the sink. What should I look at first?',
//     nextChoices: ['BOOZE', 'PHONE', 'POWDER']
// }, { //14
//     choiceName: 'PHONE',
//     //choiceConsequence: ,
//     messageText: 'There\'s a lockscreen. Do you know the 4-digit code? Be careful. I know Lee was pretty paranoid about security, so it\'ll lock us out if you guess wrong.',
//     nextChoices: ['PASS','1111', '1946', '1614', '1114']
// }, { //15
//     choiceName: 'PASS',
//     //choiceConsequence: ,
//     messageText: 'Yeah, let\'s look somewhere else. It seems disrespectful to go throuh Lee\'s phone given what\'s happened. Where do you want to look next?',
//     nextChoices: ['BOOZE', 'POWDER', 'BEDROOM']
// }, { //16
//     choiceName: '1111',
//     //choiceConsequence: ,
//     messageText: 'Wrong code. You\'ve been locked out. We\'ll have to look somewhere else and come back to this. Where to?',
//     nextChoices: ['BOOZE', 'POWDER', 'BEDROOM']
// }, { //17
//     choiceName: '1946',
//     //choiceConsequence: ,
//     messageText: 'Wrong code. Locked out. I hate to say it, but we\'ll have to look somewhere else and come back to this. Where to?',
//     nextChoices: ['BOOZE', 'POWDER', 'BEDROOM']
// }, { //18
//     choiceName: '1614',
//     //choiceConsequence: ,
//     messageText: 'Wrong code...locked out. Damn Lee. We\'ll have to look somewhere else and come back to this. Where to?',
//     nextChoices: ['BOOZE', 'POWDER', 'BEDROOM']
// }, { //19
//     choiceName: '1114',
//     //choiceConsequence: ,
//     messageText: 'Nice. I\'m in. Oh, whoa...there\'s a text from the CEO of our competitor company. It looks like Lee was going to sell out. That little backstabber. Did you suspect this?',
//     nextChoices: ['SUSPECTED', 'NOPE']
// }, { //20
//     choiceName: 'SUSPECTED',
//     //choiceConsequence: ,
//     messageText: 'If you did, then I bet I know who else did too. Alex would have freakin\' killed anyone who threated the startup. I mean, not actually killed...I think.',
//     nextChoices: ['BOOZE', 'POWDER', 'BEDROOM']
// }, { //21
//     choiceName: 'NOPE',
//     //choiceConsequence: ,
//     messageText: 'Right. I did hear raised voices and banging the other night. When I walked in Jessie and Lee were both panting and glaring at each other. Like they\'d been having a very heated argument.',
//     nextChoices: ['BOOZE', 'POWDER', 'BEDROOM']
// }, { //22
//     choiceName: 'POWDER',
//     //choiceConsequence: ,
//     messageText: 'Something\'s coming back to me. I have this memory of you holding a bag of some crazy new designer stuff. Do you remember who the drugs belonged to?',
//     nextChoices: ['YOU', 'ME', 'LEE']
// }, { //23
//     choiceName: 'YOU',
//     //choiceConsequence: ,
//     messageText: 'Damn. I can\'t believe I forgot...I remember now. You both were being total downers, so I thought a little bit in your drinks would do the trick. I got a bunch in Lee\'s, but I think I might have missed your cup.',
//     nextChoices: ['BOOZE','PHONE','BEDROOM']
// }, { //24
//     choiceName: 'ME',
//     //choiceConsequence: ,
//     messageText: 'Oh yeah, shit that stuff was strong mixed with alcohol. I remember hallucinating all sorts of freaky stuff, but everything\'s jumbled. Fuck. I remember blood...and you screaming at Lee to get away.',
//     nextChoices: ['BOOZE','PHONE','BEDROOM']
// }, { //25
//     choiceName: 'LEE',
//     //choiceConsequence: ,
//     messageText: 'Of course. I thought Lee\'d quit that stuff. I guess the nightmares from service abroad came back. This is fucking depressing. Lee didn\'t deserve this. We owe it to him to figure out what happened. Where next?',
//     nextChoices: ['BOOZE','PHONE','BEDROOM']
// }, { //26
//     choiceName: 'BOOZE',
//     //choiceConsequence: ,
//     messageText: 'It\'s the bottle of vodka Lee was drinking from...you must have bought it because the rest of us know better than to let him near that stuff. There\'s also a little bit of that powder on the outside. Do you want to destroy the bottle or leave it?',
//     nextChoices: ['DESTROY', 'LEAVE']
// }, { //27
//     choiceName: 'DESTROY',
//     //choiceConsequence: ,
//     hasConsequence: true,
//     choiceConsequence: function () {
//         //bathroom choice
//         choices[13].nextChoices.splice(0, 1);
//         //phone
//         choices[15].nextChoices.splice(0, 1);
//         choices[16].nextChoices.splice(0, 1);
//         choices[17].nextChoices.splice(0, 1);
//         choices[18].nextChoices.splice(0, 1);
//         choices[20].nextChoices.splice(0, 1);
//         choices[21].nextChoices.splice(0, 1);
//         choices[23].nextChoices.splice(0, 1);
//         choices[24].nextChoices.splice(0, 1);
//         choices[25].nextChoices.splice(0, 1);

//         choices[13].messageText = 'In the bathroom now. There\'s Lee\'s phone and what looks like some sort of white powder on the sink. What should I look at?'
//         },
//     messageText: 'Okay, I got rid of it. Where do you want me to look next?',
//     nextChoices: ['PHONE', 'POWDER', 'BEDROOM']
// }, { //28
//     choiceName: 'LEAVE',
//     //choiceConsequence: ,
//     messageText: 'Yeah, probably for the best. Our top priority should be to figure out what happened to Lee. We shouldn\'t destroy something that might help. Okay, where next?',
//     nextChoices: ['PHONE', 'POWDER', 'BEDROOM']
// }];







