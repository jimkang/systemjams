var Tone = require('tone');
var tracery = require('tracery-grammar');
var GetNextTime = require('./get-next-time');

var bpm = 90;

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

var getNextTime = GetNextTime({
  bpm: 90
});

function addStartTime(lastAttack, attack) {
  attack.start = getNextTime(lastAttack);
  return attack;
}

var song = grammar.flatten('#origin#');

song = song.replace(/ /g, ',');
var events = song.split(',').map(parsePair);

function eventIsValid(e) { return e.pitch.indexOf('n') === -1; }
var filtered = events.filter(eventIsValid);
if (filtered.length !== events.length) {
  console.log('Some events were invalid; had to filter them out.');
  events = filtered;
}

debugger;
events.reduce(addStartTime, {
  start: 0
});

console.log(events);

function parsePair(pair) {
  var parts = pair.split('-');
  return {
    pitch: parts[0],
    duration: parts[1]
  };
}

var bass = new Tone.MonoSynth({
      "volume" : 1,
      "envelope" : {
        "attack" : 0.1,
        "decay" : 0.3,
        "release" : 2,
      },
      "filterEnvelope" : {
        "attack" : 0.001,
        "decay" : 0.01,
        "sustain" : 0.5,
        "baseFrequency" : 200,
        "octaves" : 2.6
      }
    }).toMaster();


// var synth = new Tone.SimpleSynth().toMaster();

// var part = new Tone.Part(playAttack, attacks);
// part.loop = true;
// part.loopEnd = "1m";
// part.humanize = true;
// part.start('1m');




    // /**
    //  *  PIANO
    //  */
    // var piano = new Tone.PolySynth(4, Tone.SimpleSynth, {
    //   "volume" : -8,
    //   "oscillator" : {
    //     "partials" : [1, 2, 1],
    //   },
    //   "portamento" : 0.05
    // }).toMaster()

    // var cChord = ["C4", "E4", "G4", "B4"];
    // var dChord = ["D4", "F4", "A4", "C5"];
    // var gChord = ["B3", "D4", "E4", "A4"];

    // var pianoPart = new Tone.Part(function(time, chord){
    //   piano.triggerAttackRelease(chord, "8n", time);
    // }, [["0:0:2", cChord], ["0:1", cChord], ["0:1:3", dChord], ["0:2:2", cChord], ["0:3", cChord], ["0:3:2", gChord]]).start("2m");

    // pianoPart.loop = true;
    // pianoPart.loopEnd = "1m";
    // pianoPart.humanize = true;



// Tone.Transport.bpm.value = bpm;
setTimeout(kickOff, 2000);

function kickOff() {
  Tone.Transport.start();
  setTimeout(scheduleEvents, 1000);
}

function scheduleEvents() {
  events.forEach(scheduleEvent);
}

function scheduleEvent(event) {
  // setTimeout(playEvent, event.start);
  Tone.Transport.scheduleOnce(playEvent, event.start);

  function playEvent() {
    bass.triggerAttackRelease(event.pitch, event.duration);
  }
}
// synth.triggerAttackRelease('C4', '8n');

//play a middle c for the duration of an 8th note
// synth.triggerAttackRelease('C4', '8n');
