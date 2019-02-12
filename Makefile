install:
	npm install

publish:
	npm publish

lint:
	npx eslint .

start:
	npm run babel-node -- src/bin/gendiff.js
