import fs from 'fs'
import path from 'path'
import { resolve } from "path"
import { defineConfig } from "vite"
import pugPlugin from "vite-plugin-pug"
import copy from "rollup-plugin-copy"
import { file } from '@babel/types'

let exportPages = [
  // 'consciousness'
]

export default defineConfig({
  plugins: [
    pugPlugin(),
    copy({
      targets: getOtherFiles(),
      hook: "writeBundle"
    })
  ],
  base: "./",
  build: {
    rollupOptions: {
      input: Object.assign({
        main: resolve(__dirname, "index.html"),
      }, getPages()),
    },
    outDir: '.dist'
  },
})

function getPath(currentDirPath, history = []) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    let filePath = path.join(currentDirPath, name);
    let stat = fs.statSync(filePath);
    if (stat.isFile()) {
      // console.log(filePath, stat);
      history.push(filePath.replace(/\\/g, '/'));
    } else if (stat.isDirectory()) {
      getPath(filePath, history);
    }
  });
  return history;
}

function getPages() {
  let pages = {};
  for (let p of exportPages) {
    let src = getPath('./' + p);
    for (let pagePath of src) {
      let isPage = (pagePath.substring(pagePath.lastIndexOf('.') + 1).toLowerCase() == 'html')
      if (isPage) {
        // let outputPath = pagePath.substring(0, pagePath.lastIndexOf('.') + 1).replace('src', '.') + 'html'
        // console.log(pagePath)
        pages[pagePath] = resolve(__dirname, pagePath)
      }
    }
  }
  return pages;
}

function getOtherFiles() {
  let files = [];
  for (let p of exportPages) {
    let src = getPath('./' + p);
    for (let filePath of src) {
      let isPage = (['html', 'js', 'pug'].indexOf(filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase()) >= 0)
      if (!isPage) {
        // console.log(filePath.lastIndexOf('/'))
        let outputPath = '.dist/' + filePath.substring(0, filePath.lastIndexOf('/') + 1)
        // console.log('Copied', filePath, 'to', outputPath)
        files.push({
          src: filePath,
          dest: outputPath
        })
      }
    }
  }
  // console.log(files)
  return files;
}