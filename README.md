## Webtoon Crawler

### How to run

```bash
$ npm install

$ npm run build

$ yarn typeorm schema:sync

$ npm run start
```

### Crawl webtoon metadata

```bash
# REPL console
$ npm run console
```

```node
// kakao webtoon
kakao = app.get('KakaoService');

// extract all identifier
kakao.extractAllIdentifier();
```

### GraphQL

If you use graphql playground, [click here](http://localhost:3000/graphql)

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
