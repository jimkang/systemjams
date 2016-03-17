require('./lib/midi');
var curry = require('lodash.curry');

function play(notes) {
  console.log(notes);

  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    // instruments: ['lead_2_sawtooth', 'lead_2_sawtooth'],
    instrument: 'acoustic_grand_piano',
    onprogress: function(state, progress) {
      console.log(state, progress);
    },
    onsuccess: onInstrumentsLoaded
  });

  function onInstrumentsLoaded() {
    var delays = [0, 0]; // One per channel.
    MIDI.setVolume(0, 127);

    notes.forEach(curry(playNote)(0))

   function playNote(channel, note) {
      var pitch = MIDI.keyToNote[note.pitch];
      // Temporarily shift down to compensate for miscoding everything too high in the grammar.
      pitch -= 12;
      // console.log('on at', delays[channel]);
      MIDI.noteOn(channel, pitch, note.velocity, delays[channel]);
      // console.log('off at', delays[channel] + note.duration * 0.9);
      MIDI.noteOff(channel, pitch, delays[channel] + note.duration * 0.9);

      delays[channel] += note.duration;
    }
  }
}

module.exports = play;
