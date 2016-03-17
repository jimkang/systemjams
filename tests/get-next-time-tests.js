var test = require('tap').test;
var GetNextTime = require('../get-next-time');

function withinRange(a, b, range) {
  return Math.abs(a - b) <= range;
}

var testCases = [
  {
    name: 'Eighth note',
    event: {
      start: 15.6,
      duration: '8n'
    },
    bpm: 180,
    expected: 0.1667 + 15.6
  },
  {
    name: 'Quarter note',
    event: {
      start: 2.667,
      duration: '4n'
    },
    bpm: 60,
    expected: 3.667
  },
  {
    name: 'Half-note triplet',
    event: {
      start: 0.35,
      duration: '2t'
    },
    bpm: 116.7,
    expected: 0.35 + 0.686
  },
  {
    name: 'Zero start',
    event: undefined,
    bpm: 400,
    expected: 0
  },
  {
    name: 'No duration',
    event: {
      start: 78.1
    },
    bpm: 120,
    expected: 78.1
  },
  {
    name: 'No start',
    event: {
      duration: '2n'
    },
    bpm: 120,
    expected: 60/120 * 2
  }
];

testCases.forEach(runTest);

function runTest(testCase) {
  test(testCase.name, basicTest);

  function basicTest(t) {
    var getNextTime = GetNextTime({
      bpm: testCase.bpm
    });
    t.ok(
      withinRange(
        getNextTime(testCase.event),
        testCase.expected,
        0.001
      ),
      'Next time is correct.'
    );
    t.end();
  }
}
