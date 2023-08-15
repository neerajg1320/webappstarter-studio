import './code-editor.css';
import './syntax.css';
import React, {useEffect, useMemo, useRef} from 'react';
import MonacoEditor, {EditorDidMount} from '@monaco-editor/react';
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';
import {debugComponent} from "../../config/global";
import {BundleLanguage} from "../../state/bundle";
import {CodeLanguage} from "../../state/language";

interface CodeEditorProps {
  // localId: string;
  initialValue: string;
  language: CodeLanguage;
  onChange?: (value:string) => void | null;
  disabled?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({initialValue, language, onChange, disabled}) => {
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

  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;

    // Note the initial value in the listener is always blank. It doesn't get updated on rerenders
    monacoEditor.onDidChangeModelContent((e) => {
      // https://github.com/microsoft/monaco-editor/issues/432

      const newValue = getValue();
      // console.log(`initialValue: ${initialValue}`);
      // console.log(`newValue: ${newValue}`);
      if (onChange) {
        onChange(newValue);
      }
    });


    // Use two spaces for tabs
    monacoEditor.getModel()?.updateOptions({tabSize: 2});

    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    )

    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
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
              <MonacoEditor
                  language={editorLanguage}
                  value={initialValue}
                  editorDidMount={onEditorDidMount}
                  theme='dark'
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