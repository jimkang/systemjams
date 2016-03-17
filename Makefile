test:
	node tests/get-next-time-tests.js

run:
	wzrd app.js:index.js -- \
		-d

build:
	$(BROWSERIFY) app.js | $(UGLIFY) -c -m -o index.js

pushall:
	git push origin master && git push origin gh-pages
