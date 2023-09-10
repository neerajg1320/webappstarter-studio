export const injectScriptInHtml = (markupStr:string, javscriptCodeStr:string):string => {
  let resultMarkupStr = "Not processed";

  // https://stackoverflow.com/questions/10585029/parse-an-html-string-with-js
  var detachedHtml = document.createElement( 'html' );
  detachedHtml.innerHTML = markupStr;

  const bodyEl = detachedHtml.getElementsByTagName('body');
  if (bodyEl.length > 0) {
    const scriptEl = document.createElement('script');
    scriptEl.innerHTML = javscriptCodeStr;

    bodyEl[0].appendChild(scriptEl);
  }

  resultMarkupStr = detachedHtml.innerHTML;

  return resultMarkupStr;
}
