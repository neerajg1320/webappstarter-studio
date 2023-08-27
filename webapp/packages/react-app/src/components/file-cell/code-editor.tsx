import './code-editor.css';
import './syntax.css';
import React, {useEffect, useMemo, useRef} from 'react';
import MonacoEditorReact, {Monaco, OnMount} from '@monaco-editor/react';
import MonacoEditor from "monaco-editor";
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import {CodeLanguage} from "../../state/language";


// https://stackoverflow.com/questions/30239060/uncaught-referenceerror-process-is-not-defined
// Required by some npm packages
// window.process = { browser: true, env: { ENVIRONMENT: 'BROWSER' } };


interface CodeEditorProps {
  // localId: string;
  initialValue: string;
  language: CodeLanguage;
  onChange?: (value:string) => void | null;
  disabled?: boolean;
}

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
const activateMonacoJSXHighlighter = async (monacoEditor:MonacoEditor.editor.IStandaloneCodeEditor, monaco:Monaco) => {
  const { default: traverse } = await import('@babel/traverse')
  const { parse } = await import('@babel/parser')
  const { default: MonacoJSXHighlighter } = await import(
      'monaco-jsx-highlighter'
      )

  const monacoJSXHighlighter = new MonacoJSXHighlighter(
      monaco,
      parse,
      traverse,
      monacoEditor
  )

  monacoJSXHighlighter.highlightOnDidChangeModelContent()
  monacoJSXHighlighter.addJSXCommentCommand()

  return {
    monacoJSXHighlighter,
  }
}

const CodeEditor: React.FC<CodeEditorProps> = ({initialValue, language, onChange, disabled}) => {
  const debugComponent = true;
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
    console.log(`CodeEditor[${''}]:render disabled(${typeof disabled})=${disabled}`);
  }

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    activateMonacoJSXHighlighter(editor, monaco);

    // Note the initial value in the listener is always blank. It doesn't get updated on rerenders
    editor.onDidChangeModelContent((e) => {
      // https://github.com/suren-atoyan/monaco-react#usemonaco
      const newValue = editorRef.current.getValue();

      if (onChange) {
        onChange(newValue);
      }
    });

    const model = editor.getModel();
    if (model) {
      // Use two spaces for tabs
      model.updateOptions({tabSize: 2});
    }

    configTypescript(monaco);
  };

  const handleFormatClick = () => {
    const unformattedCode = editorRef.current.getModel().getValue();

    const formattedCode = prettier.format(unformattedCode, {
      parser: 'babel',
      plugins: [parserBabel],
      useTabs: false,
      semi: true,
      singleQuote: true
    }).replace(/\n$/,'');

    editorRef.current.setValue(formattedCode);
  };

  return (
    <div className="editor-wrapper">
      {disabled
          ?
          <div style={{
              height: "100%",
              display:"flex", flexDirection: "column", justifyContent:"center", alignItems: "center"
            }}
          >
            <h3>Select a File</h3>
          </div>
          :
          <>
            <button
                className="button button-format is-primary is-small"
                onClick={handleFormatClick}
            >
              Format {editorLanguage}
            </button>
            <div className="editor-main">
              <MonacoEditorReact
                  language={editorLanguage}
                  value={initialValue}
                  onMount={handleEditorMount}
                  theme='vs-dark'
                  height="calc(100% - 20px)"
                  options={{
                    wordWrap: "on",
                    minimap: {enabled: false},
                    showUnused: false,
                    folding: false,
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