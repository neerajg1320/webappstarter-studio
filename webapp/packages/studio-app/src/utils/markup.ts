export const injectScriptWithCodeInHtml = (htmlStr:string, javscriptCodeStr:string):string => {
  // https://stackoverflow.com/questions/10585029/parse-an-html-string-with-js
  var detachedHtml = document.createElement( 'html' );
  detachedHtml.innerHTML = htmlStr;

  const bodyEl = detachedHtml.getElementsByTagName('body');
  if (bodyEl.length > 0) {
    const scriptEl = document.createElement('script');
    scriptEl.innerHTML = javscriptCodeStr;

    bodyEl[0].appendChild(scriptEl);
  }

  return detachedHtml.outerHTML;
}

export const deleteScriptEntryPathFromHtml = (htmlStr:string, entryPath:string) => {
  // https://stackoverflow.com/questions/10585029/parse-an-html-string-with-js
  var detachedHtml = document.createElement( 'html' );
  detachedHtml.innerHTML = htmlStr;

  // console.log(`htmlStr:`, htmlStr);

  const bodyEls = detachedHtml.getElementsByTagName('body');
  if (bodyEls.length > 0) {
    const bodyEl = bodyEls[0]

    // We need to delete script tag here
    const scriptEls = bodyEl.getElementsByTagName("script");
    for (const scriptEl of scriptEls) {
      if (scriptEl.getAttribute("src") === entryPath) {
        bodyEl.removeChild(scriptEl);
      }
    }
  }

  return detachedHtml.outerHTML;
}