## Webtoon Crawler
### crawled platform
- [Kakao](https://webtoon.kakao.com/)
### TBD
- [Naver](https://comic.naver.com/index)
- [Kakaopage](https://page.kakao.com/main)
- [Lezhin Comics](https://www.lezhin.com/ko)

## How to run
### Server
```bash
$ npm install

$ npm run build

$ yarn typeorm schema:sync

$ npm run start # GraphQL playground
```

### console
```bash
# REPL console
$ npm run console
```

### crawl in console
```node
// kakao webtoon
kakao = app.get('KakaoService');

// extract all identifier
kakao.extractAllIdentifier();
```

### test
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
