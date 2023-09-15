import './code-editor.css';
import './syntax.css';
import React, {useEffect, useMemo, useRef} from 'react';
import MonacoEditorReact, {Monaco, OnMount, useMonaco} from '@monaco-editor/react';
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import {CodeLanguage} from "../../state/language";
import {debugComponent} from "../../config/global";
import {editor} from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;


const configTypescript = (monaco:Monaco) => {
  // https://stackoverflow.com/questions/56954280/monaco-editor-how-to-disable-errors-typescript
  // https://blog.expo.dev/building-a-code-editor-with-monaco-f84b3a06deaf
  // We will set the language settings for typescript
  try {
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      // diagnosticCodesToIgnore: [
      //   2792, // Unused imports
      //   2304, 1005, 1161, // For JSX
      // ]
    });
  } catch (err) {
    console.error(err);
  }
}

// This function is used to active the JSX syntax highlighting
const activateMonacoJSXHighlighter = async (editor:IStandaloneCodeEditor, monaco:Monaco) => {
  const { default: traverse } = await import('@babel/traverse');
  const { parse } = await import('@babel/parser');
  const { default: MonacoJSXHighlighter } = await import( 'monaco-jsx-highlighter' );

  const monacoJSXHighlighter = new MonacoJSXHighlighter(
      monaco,
      parse,
      traverse,
      editor
  )

  monacoJSXHighlighter.highlightOnDidChangeModelContent()
  monacoJSXHighlighter.addJSXCommentCommand()

  return {
    monacoJSXHighlighter,
  }
}


interface CodeEditorProps {
  modelKey: string;
  value: string;
  language: CodeLanguage;
  onChange?: (value:string) => void | null;
  disabled?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
                                                 modelKey,
                                                 value:propValue,
                                                 language,
                                                 onChange:propOnChange,
                                                 disabled
}) => {
  // const debugComponent = true;
  const enableFormatButton = false;

  const editorRef = useRef<any>();
  const editorLanguage = useMemo(() => {
    if (language === CodeLanguage.JAVASCRIPT) {
      return 'javascript';
    } else if (language === CodeLanguage.TYPESCRIPT) {
      return 'typescript';
    } else if (language === CodeLanguage.CSS) {
      return 'css';
    } else if (language === CodeLanguage.SCSS) {
      return 'scss';
    } else if (language === CodeLanguage.HTML) {
      return 'html';
    }

    return 'javascript';
  }, [language]);

  useEffect(() => {
    if (debugComponent) {
      console.log(`CodeEditor: useEffect([]) created`);
    }

    return () => {
      if (debugComponent) {
        console.log(`CodeEditor: destroyed`)
      }
    }
  }, []);

  if (debugComponent) {
    console.log(`CodeEditor[${''}]:render disabled(${typeof disabled})=${disabled} modelKey=${modelKey} propValue=`, propValue);
  }

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    activateMonacoJSXHighlighter(editor, monaco);

    editor.onDidChangeModelContent((e) => {
      // https://github.com/suren-atoyan/monaco-react#usemonaco
      const newValue = editorRef.current.getValue();

      if (debugComponent) {
        console.log(`CodeEditor: onDidChangeModelContent() newValue=`, newValue);
      }

      if (propOnChange) {
        propOnChange(newValue);
      }
    });

    const model = editor.getModel();
    if (model) {
      // Use two spaces for tabs
      model.updateOptions({tabSize: 2});
    }

    configTypescript(monaco);
  };

  const handleFormatClick = async () => {
    const unformattedCode = editorRef.current.getModel().getValue();

    let formattedCode = await prettier.format(unformattedCode, {
      parser: 'babel',
      plugins: [parserBabel],
      useTabs: false,
      semi: true,
      singleQuote: true
    }) //.replace(/\n$/,'');

    editorRef.current.setValue(formattedCode);
  };

  return (
    <div className="editor-wrapper">
      {disabled
          ?
          <div style={{
              height: "100%", width:"100%",
              display:"flex", flexDirection: "column", justifyContent:"center", alignItems: "center",
            }}
          >
            <h3>Select a File</h3>
          </div>
          :
          <>
            {enableFormatButton &&
              <button
                  className="button button-format is-primary is-small"
                  onClick={handleFormatClick}
              >
                Format {editorLanguage}
              </button>
            }
            <div className="editor-main">
              <MonacoEditorReact
                  path={modelKey}
                  value={propValue}
                  language={editorLanguage}
                  onMount={handleEditorMount}
                  theme='vs-dark'
                  height="calc(100% - 20px)"
                  options={{
                    wordWrap: "on",
                    minimap: {enabled: false},
                    showUnused: false,
                    folding: true,
                    lineNumbersMinChars: 3,
                    fontSize: 16,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
              />
            </div>
          </>
      }
    </div>
  );
}

export default React.memo(CodeEditor);