import "./file-cell-control-bar.css";
import React, {useRef, useState} from "react";
import {ReduxFile, ReduxProject, ReduxUpdateFilePartial,} from "../../state";
import {replaceFilePart} from "../../utils/path";
import {readFileContent} from "../../utils/file";
import {useActions} from "../../hooks/use-actions";
import {debugComponent} from "../../config/global";
import {useTypedSelector} from "../../hooks/use-typed-selector";

export enum FileCellEventType {
  NEW_FILE = 'new_file',
  COPY_FILE = 'copy_file',
  DELETE_FILE = 'delete_file',
}

export interface FileCellEvent {
  name: FileCellEventType;
  data: {[k:string]:any}
}

interface FileCellControlBarProps {
  reduxFile: ReduxFile;
  // onEvent: (event: FileCellEvent) => void;
}

const FileCellControlBar:React.FC<FileCellControlBarProps> = ({reduxFile}) => {
  const selectFileInputRef = useRef<HTMLInputElement | null>(null);
  const { updateFile, saveFile, createCellBundle, updateProject, updateApplication } = useActions();
  const [isAdmin, setAdmin] = useState(false);
  const hotReload = useTypedSelector(state => state.application.hotReload);
  const autoSave = useTypedSelector(state => state.application.autoSave);
  const advanceFeatures = useTypedSelector(state => state.application.advanceFeatures);

  // Function to bundle a single file. Not used anymore. Kept for possible use in single file syntax checking.
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

    createCellBundle(reduxFile.localId, reduxFile.content, reduxFile.bundleLanguage);
  }

  // Function to modify filename from the FileCellControlBar. Not used anymore. Kept for possible use in tabs
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
    saveFile(reduxFile.localId);
  }

  const handleFileEditableChange = (checked: boolean) => {
    updateFile({localId: reduxFile.localId, isEditAllowed: checked})
  }


  const handleSaveClick = () => {
    if (!reduxFile.path) {
      console.error(`Error! path not specified`)
      return;
    }

    updateFile({localId: reduxFile.localId, confirmed: true})
    saveFile(reduxFile.localId);
  }


  return (
      <div className="file-cell-control-bar">
        {isAdmin &&
            <div style={{display: "flex", flexDirection: "row", gap: "20px", alignItems: "center"}}>
              <span>localId: {reduxFile.localId}</span>
              <span>Pkid: {reduxFile.pkid}</span>
              <span>Language: {reduxFile.language}</span>
            </div>
        }

        {isAdmin &&
            <div style={{display: "flex", flexDirection: "column", gap: "5px", alignItems: "center"}}>
              <button
                  className="button is-family-primary is-small"
                  onClick={() => {
                    selectFileInputRef.current!.click()
                  }}
              >
                Select File
              </button>
              <input ref={selectFileInputRef} type="file" style={{display: "none"}} onChange={handleFileChange}/>
            </div>
        }



        <div style={{display:"flex", flexDirection:"row", gap:"20px", alignItems:"center"}}>
          {isAdmin &&
              <div style={{display: "flex", flexDirection: "row", gap: "5px", alignItems: "center"}}>
                <label>Editable</label>
                <input
                    type="checkbox"
                    checked={(reduxFile && reduxFile.isEditAllowed) || false}
                    onChange={(e) => handleFileEditableChange( e.target.checked)}
                />
              </div>
          }
          <div style={{display:"flex", flexDirection:"row", gap:"5px", alignItems:"center"}}>
            <label>Auto-Save</label>
            <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => updateApplication({autoSave: e.target.checked})}
            />
          </div>
          <div style={{display:"flex", flexDirection:"row", gap:"5px", alignItems:"center"}}>
            <label>Hot-Reload</label>
            <input
                type="checkbox"
                checked={hotReload}
                onChange={(e) => updateApplication({hotReload: e.target.checked})}
            />
          </div>
          {(advanceFeatures) &&
            <div style={{display: "flex", flexDirection: "row", gap: "5px", alignItems: "center"}}>
              <label>EntryPoint</label>
              <input
                  type="checkbox"
                  checked={(reduxFile && reduxFile.isEntryPoint) || false}
                  onChange={(e) => handleEntryPointChange(e.target.checked)}
              />
            </div>
          }
        </div>

        <div style={{
          display: "flex", flexDirection:"row", gap:"20px", alignItems:"center",
          visibility: autoSave ? "hidden" : "visible"
        }}
        >
          <button
              className="button is-primary is-small"
              onClick={() => handleSaveClick()}
              disabled={!reduxFile.contentSynced}
          >
            Save
          </button>
          {isAdmin &&
              <button
                  className="button is-family-secondary is-small"
                  onClick={() => handleBundleClick()}
                  disabled={!(reduxFile.content && reduxFile.content.length > 0)}
              >
                Bundle
              </button>
          }
        </div>

      </div>
  );
}

export default FileCellControlBar;