#! /usr/bin/env node
const { parse } = require("fast-xml-parser");
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("fs");
const glob = require("glob");
const path = require("path");

const usage = (): void => {
  console.log(`Usage:
  jugem-xml-to-md [target dir]

Description:
  This is a CLI tool to convert JUGEM-XML to markdown format.
`);
};

const xmlToJson = (xml: string): any => {
  return parse(xml);
};

const convertMd = (json: any): Array<object> => {
  let mdList = [];

  // TODO: entry is Array<entryObject>
  const { entry } = json.blog.entries;

  if (!entry.length) return [];

  for (const e of entry) {
    const { title, description, author, category, date } = e;

    mdList.push({
      title,
      description: description.substr(1, 100),
      author,
      category,
      date,
      body: description
    });
  }

  return mdList;
};

const generateMd = (mdList: any): void => {
  /*
   * TODO:
   * エクスポートしたXMLデータの場合、画像パスが実際のサイト上で指しているものとは違うものが吐き出される。このパスにアクセスしても画像自体は見つからず404が返される。
   * そのため、変換の合間に古い画像パスから現在の画像パスに変換する処理を挟む。
   * (途中で画像パスの仕様が変わったのだが、エクスポート機能は未対応ということなのだろうか？)
   */
  const disableImagePath = "{古い画像パス}";
  const availableImagePath = "{新しい画像パス}";

  for (const md of mdList) {
    const data = `---
title: ${md.title}
date: ${md.date}
category: ${md.category}
description: ${md.description}
---

${md.body.replace(disableImagePath, availableImagePath)}`;

    writeFileSync(`result/${md.title.replace(/\//g, "-")}.md`, data);
  }
};

(async () => {
  if (["-h", "--help"].includes(process.argv[2])) {
    usage();
    return;
  }

  console.log("START: generate markdown files");

  const reusltDir = "result";

  if (!existsSync(reusltDir)) {
    mkdirSync(reusltDir);
  }

  const targetDif = process.argv[2] || "xml-data";

  const xmlFilePathList = glob.sync(path.join(targetDif, "*.xml"));

  for (const xmlPath of xmlFilePathList) {
    console.log(`processing file ===> ${xmlPath}`);

    const xml = await readFileSync(xmlPath, "utf8");
    const json = xmlToJson(xml);
    if (!json) continue;

    const mdList = convertMd(json);

    if (!mdList) console.log("FINISH: Not found blog data");

    generateMd(mdList);
  }

  console.log("FINISH: generate markdown files");
})();
