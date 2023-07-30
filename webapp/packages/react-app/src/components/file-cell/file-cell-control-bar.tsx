import "./file-cell-control-bar.css";
import React, {useRef} from "react";
import {ReduxFile, ReduxUpdateFilePartial,} from "../../state";
import {replaceFilePart} from "../../utils/path";
import {readFileContent} from "../../utils/file";
import {useActions} from "../../hooks/use-actions";
import {debugComponent} from "../../config/global";

interface FileControlBarProps {
  reduxFile: ReduxFile;
}

const FileCellControlBar:React.FC<FileControlBarProps> = ({reduxFile}) => {
  const selectFileInputRef = useRef<HTMLInputElement | null>(null);
  const { updateFile, saveFile, createCellBundle, updateProject, saveProject } = useActions();


  const handleBundleClick = () => {
    if (debugComponent) {
      console.log(reduxFile.content);
    }

    if (!reduxFile.content) {
      console.log(`Error! no file contents found`)
      return;
    }

    if (reduxFile.projectLocalId) {
      updateProject({localId:reduxFile.projectLocalId, bundleLocalId: reduxFile.localId});
    }

    createCellBundle(reduxFile.localId, reduxFile.content);
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.log('No file selected');
      return;
    }

    const file = e.target.files[0];

    const fileUpdatePartial:ReduxUpdateFilePartial = {localId: reduxFile.localId};

    if (reduxFile.path) {
      const filePath = replaceFilePart(reduxFile.path, file.name);
      fileUpdatePartial['path'] = filePath;
    }

    const fileContent = await readFileContent(file);
    console.log(`fileContent: ${fileContent}`);

    fileUpdatePartial['content'] = fileContent;

    updateFile(fileUpdatePartial);
  }

  const handleEntryPointChange = (checked: boolean) => {
    updateFile({localId: reduxFile.localId, isEntryPoint: checked})

    if (reduxFile.projectLocalId) {
      updateProject({localId:reduxFile.projectLocalId, entryFileLocalId: reduxFile.localId});
    }
  }

  const handleFileEditableChange = (checked: boolean) => {
    updateFile({localId: reduxFile.localId, isEditAllowed: checked})
  }

  const handleFilePathChange = (filePath:string) => {
    updateFile({localId: reduxFile.localId, path: filePath})
  }

  const handleSaveClick = () => {
    if (!reduxFile.path) {
      console.error(`Error! path not specified`)
      return;
    }

    saveFile(reduxFile.localId);
  }


  return (
      <div className="file-cell-control-bar">
        <div style={{display:"flex", flexDirection:"row", gap:"20px", alignItems:"center"}}>
          <span>localId: {reduxFile.localId}</span>
          <span>Pkid: {reduxFile.pkid}</span>
          {/*<span>Project: {reduxFile.projectLocalId}</span>*/}
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
            <label>Editable</label>
            <input
                type="checkbox"
                checked={(reduxFile && reduxFile.isEditAllowed) || false}
                onChange={(e) => handleFileEditableChange(e.target.checked)}
            />
          </div>
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
              disabled={!(Object.keys(reduxFile.saveFilePartial).length > 0)}
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

export default FileCellControlBar;