import {parentCommunicationJavascriptCode} from "./script";

// Kept here for reference
// This is html with hard coded script injection.
// This makes us limited to this html only.
export const htmlWithScript = `
<html>
  <head>
    <title>HTML With Script</title>
    <style>html {background-color: white}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
        ${parentCommunicationJavascriptCode}
    </script>
  </body>
</html>
`;

// The advantage of script injection in a plain html is that it gives the opportunity to user to provide any
// arbitrary but a valid html file.
export const htmlNoScript = `
<html>
  <head>
    <title>WebappStarter Project Preview </title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;