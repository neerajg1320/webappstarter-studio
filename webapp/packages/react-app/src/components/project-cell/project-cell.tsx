import "./project-cell.css";
import React, {useEffect, useMemo, useState} from 'react';
import Select, {SingleValue} from 'react-select';
import Preview from "../code-cell/preview";
import {useActions} from "../../hooks/use-actions";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import Resizable from "../code-cell/resizable";
import CodeEditor from "../code-cell/code-editor";
import FilesTree from "../files-tree/files-tree";
import {ReduxFile} from "../../state/file";

const ProjectCell:React.FC = () => {

  const [selectedProjectOption, setSelectedProjectOption] =
      useState<SingleValue<{ value: string; label: string; } | null>>(null);

  const { createProjectBundle, setCurrentProjectId } = useActions();
  const projectsState = useTypedSelector((state) => state.projects);
  const filesState = useTypedSelector((state) => state.files);
  const bundlesState =  useTypedSelector((state) => state.bundles);
  const [editedFile, setEditedFile] = useState<ReduxFile|null>(null);
  // Temporary till we fix layout
  const [editorContent, setEditorContent] = useState<string>('');
  const { fetchFileContents } = useActions();

  const projects = useMemo(() => {
    return Object.entries(projectsState.data).map(entry => entry[1]);
  }, [projectsState.data]);
  // console.log('ProjectCell: rendered, projects:', JSON.stringify(projects, null, 2));


  const projectOptions = useMemo(() => {
    return projects.map(prj => {
      return {value: prj.localId, label: prj.title};
    })
  }, [projects]);
  // console.log('ProjectCell: rendered, projectOptions:', JSON.stringify(projectOptions, null, 2));

  const currentProject = useMemo(() => {
    if (Object.keys(projectsState.data).length > 0 && selectedProjectOption) {
      return projectsState.data[selectedProjectOption.value];
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectOption, projectsState.data]);
  // console.log('ProjectCell: rendered, currentProject:', JSON.stringify(currentProject, null, 2));

  const handleBundleClick = () => {
    // console.log(`currentProject: ${JSON.stringify(currentProject, null, 2)}`);

    if (currentProject && currentProject.entry_path) {
      const projectEntryPoint= currentProject.entry_path;
      createProjectBundle(currentProject.localId, `${currentProject.folder}/${projectEntryPoint}`);
    } else {
      console.error(`Error! entry_path is not set for current project '${currentProject?.title}'`);
    }
  }

  const handleProjectSelectionChange = (selectedOption:SingleValue<{value: string, label: string}>) => {
    // console.log(selectedOption);
    setSelectedProjectOption(selectedOption);
    
    if (selectedOption) {
      setCurrentProjectId(selectedOption.value);
    }
  }

  const handleFileTreeSelectedFileChange = (fileLocalId: string) => {
    const fileState = filesState.data[fileLocalId];
    setEditedFile(fileState);
    console.log(`fileState=`, filesState);

    if (fileState.contentSynced) {
      setEditorContent(fileState.content!);
    } else {
      fetchFileContents([fileLocalId]);
    }
  }

  useEffect(() => {
    console.log(`ProjectCell: editedFile:`, editedFile);
  }, [editedFile]);

  return (
    <div className="project-cell-wrapper">
      <div style={{width: "100%"}}>
        <Resizable direction="vertical">
          <div style={{height: 'calc(100% - 10px)', display: "flex", flexDirection: "row"}}>
            <Resizable direction="horizontal">
              <CodeEditor initialValue={editorContent} onChange={setEditorContent} />
            </Resizable>
            {/* <pre>{code}</pre> */}
            <div>
              <div style={{
                width: "100%",
                display:"flex", flexDirection:"column", gap:"20px"
              }}
              >
                <div style={{display:"flex", flexDirection:"row", gap:"10px"}}>
                  <Select
                      value={selectedProjectOption}
                      className="project-select is-primary is-small"
                      options={projectOptions}
                      onChange={handleProjectSelectionChange}
                  />
                  <button
                      className="button is-family-secondary is-small"
                      onClick={handleBundleClick}
                      disabled={!currentProject || !currentProject.synced}
                  >
                    Bundle
                  </button>
                </div>
                <div>
                  {currentProject
                      ? <FilesTree
                          project={currentProject}
                          onSelectedFileChange={handleFileTreeSelectedFileChange}
                      />
                      : <p>Select Project</p>}

                </div>
              </div>
            </div>
          </div>
        </Resizable>
      </div>
      {/* TBD: We can try to make this resizable as well */}
      <div style={{height:"200px"}}>
        {(currentProject && bundlesState[currentProject.localId]) &&
            <div style={{height: "100%"}}>
              {/*<pre>{bundlesState[currentProject.localId]!.code}</pre>*/}
              <Preview code={bundlesState[currentProject.localId]!.code} err={bundlesState[currentProject.localId]!.err}/>
            </div>
        }
      </div>
    </div>
  );
}

export default ProjectCell;
