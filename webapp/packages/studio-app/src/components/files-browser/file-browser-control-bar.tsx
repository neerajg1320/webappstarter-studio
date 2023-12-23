import "./file-browser-control-bar.css";
import React, { useRef } from "react";
import { ReduxProject } from "../../state";
import { RiRefreshLine } from "react-icons/ri";
import { MdFileCopy } from "react-icons/md";
import { RiFileUploadFill } from "react-icons/ri";
import { FaTrash } from "react-icons/fa";
import { FaFileCirclePlus } from "react-icons/fa6";
import Tooltip from "../app-components/tooltip";
import Button from "../app-components/button";

export enum FileBrowserControlBarEventType {
  NEW_FILE = "new_file",
  NEW_FOLDER = "new_folder",
  COPY_FILE = "copy_file",
  UPLOAD_FILES = "upload_files",
  DELETE_FILE = "delete_file",
  RELOAD_FILES = 'reload_files',
}

export interface FileBrowserControlBarEvent {
  name: FileBrowserControlBarEventType;
  localId?: string;
  files?: File[];
}

interface FileBrowserControlBarProps {
  reduxProject: ReduxProject;
  selectedFileLocalId: string | null;
  onEvent: (event: FileBrowserControlBarEvent) => void;
}

const FileBrowserControlBar: React.FC<FileBrowserControlBarProps> = ({
  reduxProject,
  selectedFileLocalId,
  onEvent,
}) => {
  const uploadFileRef = useRef<HTMLInputElement>();

  const handleCreateFile: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    onEvent({ name: FileBrowserControlBarEventType.NEW_FILE });
  };

  const handleCreateFolder: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    onEvent({ name: FileBrowserControlBarEventType.NEW_FOLDER });
  };

  const handleCopyFile: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (selectedFileLocalId) {
      onEvent({
        name: FileBrowserControlBarEventType.COPY_FILE,
        localId: selectedFileLocalId,
      });
    }
  };

  const handleUploadFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    onEvent({
      name: FileBrowserControlBarEventType.UPLOAD_FILES,
      files: uploadedFiles,
    });
    e.target.value = null;
  };

  const handleDeleteFile: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (selectedFileLocalId) {
      onEvent({
        name: FileBrowserControlBarEventType.DELETE_FILE,
        localId: selectedFileLocalId,
      });
    }
  };

  const handleRefresh: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (selectedFileLocalId) {
      onEvent({name: FileBrowserControlBarEventType.RELOAD_FILES, localId: selectedFileLocalId});
    }
  }

  return (
    <div className="file-browser-control-bar">
      <Tooltip msg={"refresh"} position={"bottom"} tip={false}>
        <Button
          title=""
          handleButtonClick={handleRefresh}
          buttonType="button"
          buttonClass="file-browser-control-bar-btn"
        >
          <RiRefreshLine />
        </Button>
      </Tooltip>
      <Tooltip msg={"copy file"} position={"bottom"} tip={false}>
        <Button
          title=""
          handleButtonClick={handleCopyFile}
          buttonType="button"
          buttonClass="file-browser-control-bar-btn"
        >
          <MdFileCopy />
        </Button>
      </Tooltip>
      <Tooltip msg={"create file"} position={"bottom"} tip={false}>
        <Button
          title=""
          handleButtonClick={handleCreateFile}
          buttonType="button"
          buttonClass="file-browser-control-bar-btn"
        >
          <FaFileCirclePlus />
        </Button>
      </Tooltip>
      <Tooltip msg={"upload image"} position={"bottom"} tip={false}>
        <Button
          title=""
          handleButtonClick={(e) => {
            if (uploadFileRef.current) {
              uploadFileRef.current.click();
            }
          }}
          buttonType="button"
          buttonClass="file-browser-control-bar-btn"
        >
          {" "}
          <RiFileUploadFill />
          {/* </span> */}
          <input
            ref={uploadFileRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleUploadFile}
            multiple
          />
        </Button>
      </Tooltip>
      <Tooltip msg={"delete"} position={"bottom"} tip={false}>
        <Button
          title=""
          handleButtonClick={handleDeleteFile}
          buttonType="button"
          buttonClass="file-browser-control-bar-btn"
        >
          <FaTrash />
        </Button>
      </Tooltip>
    </div>
  );
};

export default FileBrowserControlBar;
