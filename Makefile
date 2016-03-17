UGLIFY = node_modules/.bin/uglifyjs

test:
	node tests/get-next-time-tests.js

run:
	wzrd app.js:index.js -- \
		-d

MIDI_SRC = node_modules/midi

MIDI_LIBRARY_FILES = \
	$(MIDI_SRC)/inc/shim/Base64.js \
	$(MIDI_SRC)/inc/shim/Base64binary.js \
	$(MIDI_SRC)/inc/shim/WebAudioAPI.js \
	$(MIDI_SRC)/js/midi/audioDetect.js \
	$(MIDI_SRC)/js/midi/gm.js \
	$(MIDI_SRC)/js/midi/loader.js \
	$(MIDI_SRC)/js/midi/plugin.audiotag.js \
	$(MIDI_SRC)/js/midi/plugin.webaudio.js \
	$(MIDI_SRC)/js/midi/plugin.webmidi.js \
	$(MIDI_SRC)/js/midi/Player.js \
	$(MIDI_SRC)/js/util/dom_request_xhr.js \
	$(MIDI_SRC)/js/util/dom_request_script

raw-midi-lib:
	node_modules/.bin/smash $(MIDI_LIBRARY_FILES) > lib/midi.js # | \
	# Need to edit out the `require`s in the resulting file after running this.

build:
	browserify app.js | $(UGLIFY) -c -m -o index.js

pushall:
	git push origin master && git push origin gh-pages
