import './code-editor.css';
import './syntax.css';
import React, {useEffect, useRef} from 'react';
import MonacoEditor, {EditorDidMount} from '@monaco-editor/react';
import prettier from 'prettier';
import parserBabel from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';

interface CodeEditorProps {
  // localId: string;
  initialValue: string;
  onChange?: (value:string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({initialValue}) => {
  console.log(`CodeEditor[${''}]:render  initialValue: ${initialValue}`);
  const editorRef = useRef<any>();

  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;

    monacoEditor.onDidChangeModelContent(() => {
      const newValue = getValue();
      console.log(`initialValue: ${initialValue}`);
      console.log(`newValue: ${newValue}`);
      // onChange(newValue);
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
      <button 
        className="button button-format is-primary is-small" 
        onClick={handleFormatClick}
      >
        Format
      </button>
      <MonacoEditor 
        language='javascript'
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
  );
}

export default React.memo(CodeEditor);