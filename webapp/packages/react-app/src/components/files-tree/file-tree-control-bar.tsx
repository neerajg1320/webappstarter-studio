import './file-tree-control-bar.css';
import React from "react";
import {ReduxProject} from "../../state";
import {useActions} from "../../hooks/use-actions";
import {randomIdGenerator} from "../../state/id";

export interface FileTreeEvent {
  name: string;
  data: any;
}

interface FileTreeControlBarProps {
  reduxProject: ReduxProject;
  onEvent: (event:FileTreeEvent) => void;
}

const FileTreeControlBar:React.FC<FileTreeControlBarProps> = ({reduxProject, onEvent}) => {
  const {createFile} = useActions();

  const handleCreateFile: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    // console.log("We need to add file");
    createFile({
      localId: randomIdGenerator(),
      path: 'src/untitled.js',
      fileType: 'javascript',
      content: 'Write here',
      contentSynced: false,
      projectLocalId: reduxProject.localId,
      isEntryPoint: false,
    });
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