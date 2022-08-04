# jugem-xml-to-md

jugem xml convert to markdown.

## Install

```bash
npm install -g jugem-xml-to-md
# or
yarn global add jugem-xml-to-md
```

## Usage

変換対象の xml ファイルが `./xml-data` 内にある状態で下記のコマンドを実行してください。

`markdown`に変換されたファイルが `./result` 上に出力されます。  
(`result` ディレクトリが存在しない場合、スクリプト実行時に作成されます)

```bash
jugem-xml-to-md
```

また、対象のディレクトリを第一引数に指定することで、指定したディレクトリ内の xml ファイルを処理対象とすることも可能です。

```bash
jugem-xml-to-md [target dir]
```

`-h, --help` を第一引数に指定することで利用方法を確認することが出来ます。

```bash
jugem-xml-to-md -h
# or
jugem-xml-to-md --help
```

## Development

Scripts start

```bash
npm run start
```

Scrpts Build (Production)

```bash
npm run build
```

Development (Build and Start with development mode)

```bash
npm run dev
```

Lint and Preitter

```bash
npm run fmt
```

## Jugem XML について

`Jugem XML` を`json`に変換した場合の構造は下記のようになります。

実際の変換コードも下記となります。

変換には `fast-xml-parser` を用いています。

```typescript
const { parse: xmlParse } = require("fast-xml-parser");
const { readFileSync, writeFileSync } = require("fs");

(async () => {
  const xml = await readFileSync("./jugem.xml", "utf8");
  const json = xmlParse(xml);
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

この json 型を下記のような`markdown`に変換していきます。

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

エクスポートした XML データの場合、画像パスが実際のサイト上で指しているものとは違うものが吐き出されるようです。  
このパスにアクセスしても画像自体は見つからず 404 が返されます。  
そのため、変換の合間に古い画像パスから現在の画像パスに変換する処理を挟んでいます。  
(途中で画像パスの仕様が変わったのだが、エクスポート機能の方は未対応ということなのだろうか？)
