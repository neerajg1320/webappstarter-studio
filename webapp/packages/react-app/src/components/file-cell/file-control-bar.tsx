import React, {useRef, useState} from "react";
import {ReduxFile, ReduxFilePartial} from "../../state";
import {getFileNameFromPath, replaceFilePart} from "../../utils/path";
import {createFileFromString, readFileContent} from "../../utils/file";
import {useActions} from "../../hooks/use-actions";

interface FileControlBarProps {
  reduxFile: ReduxFile;
}

const FileControlBar:React.FC<FileControlBarProps> = ({reduxFile}) => {
  const selectFileInputRef = useRef<HTMLInputElement | null>(null);
  const { updateFile, saveFile, createCellBundle } = useActions();
  const [fileSavePartial, setFileSavePartial] = useState<ReduxFilePartial>({} as ReduxFilePartial);

  const handleBundleClick = () => {
    if (!reduxFile || !reduxFile.content) {
      console.log(`Error! no file contents found`)
      return;
    }
    createCellBundle(reduxFile.localId, reduxFile.content);
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.log('No file selected');
      return;
    }

    const file = e.target.files[0];

    const fileUpdatePartial:ReduxFilePartial= {localId: reduxFile.localId};

    if (reduxFile.path) {
      const filePath = replaceFilePart(reduxFile.path, file.name);
      fileUpdatePartial['path'] = filePath;
    }

    const fileContent = await readFileContent(file);
    console.log(`fileContent: ${fileContent}`);

    fileUpdatePartial['content'] = fileContent;

    // updateCell(cell.id, fileContent, filePath);
    updateFile(fileUpdatePartial);
    setFileSavePartial((prev) => Object.assign(prev, {content: fileContent}))
  }

  const handleEntryPointChange = (checked: boolean) => {
    // console.log(`fileState: ${JSON.stringify(fileState)}`);
    // updateProject({localId: currentProjectId, entry_file:filePkid, entry_path:filePath})
    setFileSavePartial((prev) => Object.assign(prev, {isEntryPoint: checked}));
    updateFile({localId: reduxFile.localId, isEntryPoint: checked})
  }

  const handleFilePathChange = (filePath:string) => {
    // setFilePath(filePath);
    setFileSavePartial((prev) => Object.assign(prev, {path: filePath}))
    updateFile({localId: reduxFile.localId, path: filePath})
  }

  const handleSaveClick = () => {

    if (!reduxFile.content) {
      console.error(`We need to add code`);
      return;
    }

    if (reduxFile.path) {
      const fileName = getFileNameFromPath(reduxFile.path);
      const file = createFileFromString(reduxFile.content, fileName);

      if (reduxFile.pkid && reduxFile.pkid > 0) {
        if (Object.keys(fileSavePartial).length > 0) {
          console.log(`fileUpdatePartial:`, fileSavePartial);
          saveFile(Object.assign({localId: reduxFile.localId, pkid: reduxFile.pkid, localFile: file}, fileSavePartial))
        }
      } else {
        const createFilePartial = {...reduxFile, ...fileSavePartial, localFile: file};
        saveFile(createFilePartial);
      }
    }

    setFileSavePartial({} as ReduxFilePartial);
  }


  return (
      <div style={{
        display: "flex", justifyContent: "center", gap: "60px", alignItems: "center",
        marginTop: "5px"
      }}
      >
        <div style={{display:"flex", flexDirection:"row", gap:"20px", alignItems:"center"}}>
          <span>localId: {reduxFile.localId}</span>
          <span>Pkid: {reduxFile.pkid}</span>
          <span>Project: {reduxFile.projectLocalId}</span>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:"5px", alignItems: "center"}}>
          <button
              className="button is-family-primary is-small"
              onClick={() => {selectFileInputRef.current!.click()}}
          >
            Select File
          </button>
          <input ref={selectFileInputRef} type="file" style={{display: "none"}} onChange={handleFileChange}/>
        </div>

        <div style={{display:"flex", flexDirection:"row", gap:"20px", alignItems:"center"}}>
          <div style={{display:"flex", flexDirection:"row", gap:"5px", alignItems:"center"}}>
            <label>EntryPoint</label>
            <input
                type="checkbox"
                checked={(reduxFile && reduxFile.isEntryPoint) || false}
                onChange={(e) => handleEntryPointChange(e.target.checked)}
            />
          </div>
          <div>
            <label>File Path:</label>
            <input type="text" value={reduxFile.path || ''} onChange={(e) => handleFilePathChange(e.target.value)} />
          </div>
        </div>

        <div style={{display:"flex", flexDirection:"row", gap:"20px", alignItems:"center"}}>
          <button
              className="button is-primary is-small"
              onClick={() => handleSaveClick()}
              disabled={!(Object.keys(fileSavePartial).length > 0)}
          >
            Save
          </button>
          <button
              className="button is-family-secondary is-small"
              onClick={() => handleBundleClick()}
              disabled={!(reduxFile.content && reduxFile.content.length > 0)}
          >
            Bundle
          </button>
        </div>
      </div>
  );
}

export default FileControlBar;