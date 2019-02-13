install:
	npm install

publish:
	npm publish

lint:
	npx eslint .

start:
	npx babel-node src/bin/gendiff __tests__/__fixtures__/before.json __tests__///__fixtures__/after.json

test:
	 npm test --watch
