// var Tone = require('tone');
var tracery = require('tracery-grammar');
var GetNextTime = require('./get-next-time');
var play = require('./play');
var probable = require('probable');

var offsetsForLetters = {
  'A': 0,
  'A#': 1,
  'B': 2,
  'C': 3,
  'C#': 4,
  'D': 5,
  'D#': 6,
  'E': 7,
  'F': 8,
  'F#': 9,
  'G': 10,
  'G#': 11  
}


var grammar = tracery.createGrammar({
  "origin": [
    "#intro# #verse# #chorus# #verse# #chorus# #breakdown# #chorus#"
  ],

  "intro": [
    "#arpeggio# #chug# #arpeggio#",
    "#chug# #chug# #slams#"
  ],
  "verse": [
    "#chug# #chug# #chug# #tail#",
    "#slams# #descend# #slams# #descend#"
  ],
  "chorus": [
    "#wholenotes# #slams#",
    "#slams# #slams# #arpeggio#"
  ],
  "breakdown": [
    "#chug# #chug# #descend# #arpeggio#",
    "#arpeggio# #descend# #arpeggio# #descend#"
  ],

  "arpeggio": [
    "E4-8n,G4-8n,B5-8n,D5-8n,E5-8n,D5-8n,B5-8n,G4-8n",
    "G4-8n,B5-8n,D5-8n,F\\#5-8n,G5-8n,F\\#5-8n,D5-8n,B5-8n"
  ],
  "chug": [
    "E3-8n,E3-8n,E3-8n,E3-8n,E3-8n,E3-8n,E3-8n,E3-8n",
    "E3-8n,E3-16n,E3-16n,E3-8n,E3-16n,E3-16n,E3-8n,E3-16n,E3-16n,E3-8n,E3-16n,E3-16n"
  ],
  "slams": [
    "E3-4n,E3-4n,E3-4n,E3-4n",
    "E3-4n,G3-4n,F\\#3-4n,E3-4n"
  ],
  "tail": [
    "F\\#3-8n,E3-8n,G3-8n,F\\#3-8n,A4-8n,G3-8n,B5-4n",
    "E3-4n,G3-4n,A\\#4-4n,E3-8n,A\\#5-8n"
  ],
  "descend": [
    "A\\#4-8n,A4-8n,G\\#3-8n,G3-8n,G3-8n,F\\#3-8n,F3-8n,E3-8n",
    "E4-8n,D4-8n,C4-8n,B4-8n,A4-8n,G3-8n,F\\#3-8n,E3-8n"
  ],
  "wholenotes": [
    "F\\#4-1n,G4-1n,A4-1n,E4-1n",
    "B4-1n,F\\#3-1n,G3-1n,A4-1n"
  ]
});

var bpm = 120 + probable.roll(120);
document.querySelector('#bpm').textContent = bpm;

var getNextTime = GetNextTime({
  bpm: bpm
});

// function addStartTime(lastAttack, attack) {
//   attack.start = getNextTime(lastAttack);
//   return attack;
// }

var song = grammar.flatten('#origin#');

song = song.replace(/ /g, ',');


var notes = song.split(',').map(parsePair);
play(notes);

// function eventIsValid(e) { return e.pitch.indexOf('n') === -1; }

// var filtered = events.filter(eventIsValid);
// if (filtered.length !== events.length) {
//   console.log('Some events were invalid; had to filter them out.');
//   events = filtered;
// }

// events.reduce(addStartTime, {
//   start: 0
// });

// console.log(events);

function parsePair(pair) {
  var parts = pair.split('-');
  return {
    pitch: parts[0],
    duration: getNextTime({
      duration: parts[1]
    }),
    velocity: 127 * 0.9
  };
}

function letterPitchToMidiPitch(letterPitch) {
  var number = parseInt(letterPitch.substr('-1'));
  var letter = letterPitch.substr(0, letterPitch.length - 1);
  return number * 12 + offsetsForLetters[letter];
}

// var bass = new Tone.MonoSynth({
//       "volume" : 1,
//       "envelope" : {
//         "attack" : 0.1,
//         "decay" : 0.3,
//         "release" : 2,
//       },
//       "filterEnvelope" : {
//         "attack" : 0.001,
//         "decay" : 0.01,
//         "sustain" : 0.5,
//         "baseFrequency" : 200,
//         "octaves" : 2.6
//       }
//     }).toMaster();


// setTimeout(kickOff, 2000);

// function kickOff() {
//   Tone.Transport.start();
//   setTimeout(scheduleEvents, 1000);
// }

// function scheduleEvents() {
//   events.forEach(scheduleEvent);
// }

// function scheduleEvent(event) {
//   // setTimeout(playEvent, event.start);
//   Tone.Transport.scheduleOnce(playEvent, event.start);

//   function playEvent() {
//     bass.triggerAttackRelease(event.pitch, event.duration);
//   }
// }
