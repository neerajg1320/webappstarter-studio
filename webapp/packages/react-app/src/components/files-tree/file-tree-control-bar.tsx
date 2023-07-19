import './file-tree-control-bar.css';
import React from "react";
import {ReduxProject} from "../../state";
import {useActions} from "../../hooks/use-actions";
import {randomIdGenerator} from "../../state/id";

export enum FileTreeEventType {
  NEW_FILE = 'new_file',
  COPY_FILE = 'copy_file'
}

export interface FileTreeEvent {
  name: FileTreeEventType;
  localId: string;
}

interface FileTreeControlBarProps {
  reduxProject: ReduxProject;
  onEvent: (event:FileTreeEvent) => void;
}

const FileTreeControlBar:React.FC<FileTreeControlBarProps> = ({reduxProject, onEvent}) => {
  const {createFile} = useActions();

  const handleCreateFile: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    // console.log("We need to add file");
    const fileLocalId = randomIdGenerator();
    createFile({
      localId: fileLocalId,
      path: 'src/untitled.js',
      fileType: 'javascript',
      content: 'Write here',
      contentSynced: false,
      projectLocalId: reduxProject.localId,
      isEntryPoint: false,
    });

    onEvent({name: FileTreeEventType.NEW_FILE, localId:fileLocalId});
  }

  return (
      <div className="file-tree-control-bar">
        <button className="button is-family-secondary is-small" onClick={handleCreateFile}>
          <span className="icon">
              <i className="fas fa-plus" />
          </span>
        </button>
        <button className="button is-family-secondary is-small" onClick={() => {}}>
          <span className="icon">
              <i className="fas fa-copy" />
          </span>
        </button>
      </div>
  );
}

export default FileTreeControlBar;