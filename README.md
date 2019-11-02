# jugem-xml-to-md

jugem xml convert to markdown.

## Usage

Scripts start

```bash
yarn start
```

Scrpts Build (Production)

```bash
yarn build
```

Development (Build and Start with development mode)

```bash
yarn dev
```

Lint and Preitter

```bash
yarn fmt
```

## Jugem XML

`Jugem XML` を`json`に変換した場合の構造は下記のようになる

実際の変換コードも下記となる

変換には `fast-xml-parser` を用いた

```typescript
const { parse } = require("fast-xml-parser");
const { readFileSync, writeFileSync } = require("fs");

const xmlToJson = (xml: string): any => {
  return parse(xml);
};

(async () => {
  const xml = await readFileSync("./jugem.xml", "utf8");
  const json = xmlToJson(xml);
  console.log(json);
})();
```

`json` 変換後の構成

```xml
{
  "blog": {
    "name": "",
    "description": "",
    "users": {
      "user": {
        "name": "jugemのユーザ名",
        "full_name": "",
        "description": ""
      }
    },
    "entries": {
      "entry": [{
        "title": "ブログタイトル",
        "author": "執筆者",
        "category": "カテゴリー(指定していない場合は空文字)",
        "date": "投稿日(YYYY/MM/DD hh:mm:dd)",
        "description": "ブログ内の本文。執筆環境によっては(?)、改行が'<BR>'で記述されることもある",
        "sequel": "",
        "comments": {
          "comment": [{
            "title": "コメントタイトル",
            "description": "コメント本文",
            "name": "コメントした人の名前",
            "email": "",
            "url": "",
            "date": "コメント投稿日(YYYY/MM/DD hh:mm:dd)"
          },
          ...]
        },
        "trackbacks": "トラックバック"
      },
      ...]
    }
  }
}
```

この json 型を下記のような`markdown`に変換する

```markdown
---
title: entry.title
date: entry.date
category: entry.category
description: entry.description(100文字まで表示)
---

entry.description(全て展開)
```

### 注意点

エクスポートした XML データの場合、画像パスが実際のサイト上で指しているものとは違うものが吐き出される。このパスにアクセスしても画像自体は見つからず 404 が返される。
そのため、変換の合間に古い画像パスから現在の画像パスに変換する処理を挟んでいる。
(途中で画像パスの仕様が変わったのだが、エクスポート機能の方は未対応ということなのだろうか？)
