install:
	npm install

publish:
	npm publish

lint:
	npx eslint .

start-json:
	npx babel-node src/bin/gendiff __tests__/__fixtures__/before.json __tests__///__fixtures__/after.json

start-yaml:
	npx babel-node src/bin/gendiff __tests__/__fixtures__/before.yaml __tests__/__fixtures__/after.yml

start-ini:
	npx babel-node src/bin/gendiff __tests__/__fixtures__/before.ini __tests__/__fixtures__/after.ini

start-wrong:
	npx babel-node src/bin/gendiff __tests__/__fixtures__/before.yaml __tests__/__fixtures__/after.json

test:
	 npm test --watch
