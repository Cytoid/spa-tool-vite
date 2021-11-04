((()=>{
  let fs = require('fs')
  let path = require('path')

  let src = getPath('./');
  for (let pagePath of src) {
    let isPage = (pagePath.substring(pagePath.lastIndexOf('.') + 1).toLowerCase() == 'pug')
    if (isPage) {
      let htmlPath = pagePath.substring(0, pagePath.lastIndexOf('.')) + '.html'
      let hasHtml = fs.existsSync(htmlPath)
      if (!hasHtml) {
        console.log(htmlPath)
        fs.writeFile(htmlPath, 
          `<!DOCTYPE html><html lang="en"><pug src="./${pagePath}"></pug></html>`, 
          err=>{
            if (err) console.error(err)
          }
        )
      }
    }
  }
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
  return
})())