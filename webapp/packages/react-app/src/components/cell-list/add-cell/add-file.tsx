import './add-file.css';
import React from "react";
import {useActions} from "../../../hooks/use-actions";
import {ReduxProject} from "../../../state";
import {randomIdGenerator} from "../../../state/id";

interface AddFileProps {
    project: ReduxProject;
    forceVisible?: boolean;
};

const AddFile: React.FC<AddFileProps> = ({project, forceVisible}) => {
    const { createFile } = useActions();

    return (
        <div className={`add-cell ${forceVisible && 'force-visible'}`}>
            <div className="add-buttons">
                <button
                    className="button is-rounded is-primary is-small"
                    onClick={() => createFile(randomIdGenerator(), '','javascript')}
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
