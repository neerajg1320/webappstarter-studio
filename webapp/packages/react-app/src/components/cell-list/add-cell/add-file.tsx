import './add-file.css';
import React from "react";
import {useActions} from "../../../hooks/use-actions";
import {ReduxCreateFilePartial, ReduxProject} from "../../../state";
import {randomIdGenerator} from "../../../state/id";
import {BundleLanguage} from "../../../state/bundle";

interface AddFileProps {
    reduxProject: ReduxProject;
    forceVisible?: boolean;
};

const AddFile: React.FC<AddFileProps> = ({reduxProject, forceVisible}) => {
    const { createFile } = useActions();

    // We should get the selected/active path for the project
    const handleAddFile = () => {
      const createFilePartial:ReduxCreateFilePartial = {
        localId: randomIdGenerator(),
        language: BundleLanguage.JAVASCRIPT,
        path: '',
        content: null,
        contentSynced: false,
        projectLocalId: reduxProject.localId,
        isEntryPoint: false,
      }

      createFile(createFilePartial);
    }

    return (
        <div className={`add-cell ${forceVisible && 'force-visible'}`}>
            <div className="add-buttons">
                <button
                    className="button is-rounded is-primary is-small"
                    onClick={() => handleAddFile()}
                >
                    <span className="icon is-small">
                        <i className="fas fa-plus" />
                    </span>
                    <span>New File</span>
                </button>
            </div>
            <div className="divider"></div>
        </div>
    )
}

export default AddFile;
