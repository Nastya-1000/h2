install:
	npm install

publish:
	npm publish

lint:
	npx eslint .

start-json:
	npx babel-node src/bin/gendiff __tests__/__fixtures__/plain/before.json __tests__///__fixtures__/plain/after.json

start-yaml:
	npx babel-node src/bin/gendiff __tests__/__fixtures__/plain/before.yaml __tests__/__fixtures__/plain/after.yml

start-ini:
	npx babel-node src/bin/gendiff __tests__/__fixtures__/plain/before.ini __tests__/__fixtures__/plain/after.ini

test:
	npm test --watch

start-Njson:
	npx babel-node src/bin/gendiff __tests__/__fixtures__/nested/before.json __tests__///__fixtures__/nested/after.json

start-Naml:
	npx babel-node src/bin/gendiff __tests__/__fixtures__/nested/before.yaml __tests__///__fixtures__/nested/after.yml

start-Nini:
	npx babel-node src/bin/gendiff __tests__/__fixtures__/nested/before.ini __tests__///__fixtures__/nested/after.ini

start-Njson-plain:
	npx babel-node src/bin/gendiff --format plain __tests__/__fixtures__/nested/before.json __tests__///__fixtures__/nested/after.json

start-json-plain:
	npx babel-node src/bin/gendiff --format plain __tests__/__fixtures__/plain/before.json __tests__///__fixtures__/plain/after.json
