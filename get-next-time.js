function GetNextTime(createOpts) {
  var bpm;

  if (createOpts) {
    bpm = createOpts.bpm;
  }

  var quarterNoteSeconds = 60.0 / bpm;
  var wholeNoteSeconds = quarterNoteSeconds * 4;

  function getNextTime(currentEvent) {
    var nextTime = 0;
    var start = 0;

    if (currentEvent) {
      if (currentEvent.start) {
        start = currentEvent.start;
      }
      
      if (currentEvent.duration) {
        nextTime = start + getDurationLength(currentEvent.duration);
      }
      else {
        nextTime = start;
      }
    }

    return nextTime;
  }

  // Remember: Triplet eighth notes are 2/3 of an eighth note, not 1/3.
  function getDurationLength(durationString) {
    var length;
    var magnitude = parseInt(durationString.substr(0, durationString.length - 1), 10);
    var division = durationString.substr(-1);

    if (division === 'n') {
      length = wholeNoteSeconds / magnitude;
    }
    else if (division === 't') {
      length = wholeNoteSeconds * 2 / magnitude / 3; 
    }
    return length;
  }

  return getNextTime;
}

module.exports = GetNextTime;
