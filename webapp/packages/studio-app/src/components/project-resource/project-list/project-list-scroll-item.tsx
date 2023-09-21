import React, {useEffect, useMemo, useRef} from "react";
import "./project-list-scroll-item.css";
import ResizableHorizontalSplitBox from "../../common/resizable-boxes/resizable-boxes-split";
import {ReduxProject} from "../../../state";
import useVisibility from "../../../hooks/use-visibility";
import useDebounceValue from "../../../hooks/use-debounce-value";
import {debugComponent} from "../../../config/global";
import {useTypedSelector} from "../../../hooks/use-typed-selector";
import {getFileFromLocalId} from "../../../state/helpers/file-helpers";
import {useActions} from "../../../hooks/use-actions";
import PreviewTabsPanel from "../../preview-section/preview-tabs-panel";

const ProjectListScrollItem = ({index, reduxProject}) => {
  const appFilesLoaded = useTypedSelector(state => state.application.filesLoaded);
  const {bundleProject, makeProjectIdeReady} = useActions();

  if (debugComponent && index === 0) {
    console.log(`ScrollItem:`, index, reduxProject,);
  }

  const scrollItemRef = useRef<HTMLDivElement>();
  const innerBoxProportions = useMemo(() => {
    return {
      width: {min:0.1, current:0.2, max:0.6}
    }
  }, [])

  const ContentBox = ({data:reduxProject}:{data:ReduxProject}) => {
    return (
        <div className="content-box">
          <h2>{reduxProject.title}</h2>
          <span>{reduxProject.description}</span>
          <span>bundleDirty:{reduxProject.bundleDirty.toString()}</span>
        </div>
    );
  };
  const RemainingBox = ({data:reduxProject}:{data:ReduxProject}) => {
    return (
        <>
        {reduxProject.bundleResult ?
            <div className="remaining-box" >
              {/*<span>Hello this is a long string and we are going to watch</span>*/}
              {/*<pre>{reduxProject.htmlContent}</pre>*/}
              <PreviewTabsPanel
                  html={reduxProject.htmlContent}
                  code={reduxProject.bundleResult.code}
                  err={reduxProject.bundleResult.err}
              />
            </div>
            :
            <h2>Loading</h2>
        }
        </>
    );
  };

  //  TBD: The visibility logic can be taken out to a function like withVisibility()
  const isVisible = useVisibility(scrollItemRef);
  // The useDebounceValue value here solves the initial visibility for all during the layout
  const isVisibleDebounced = useDebounceValue(isVisible, 100);
  if (debugComponent) {
    console.log(`ResizableHorizontalSplitBox: ${reduxProject.title.padEnd(20)} isVisible:${isVisible.toString().padEnd(5)} debouncedVisible:${isVisibleDebounced}`);
  }

  useEffect(() => {
    if (!appFilesLoaded) {
      return;
    }
    if (!isVisibleDebounced) {
      return;
    }

    if (debugComponent || false) {
      console.log(`debounced: ${reduxProject.title.padEnd(20)}: ${isVisibleDebounced}`, `appfilesLoaded:`, appFilesLoaded);
    }

    if (isVisibleDebounced) {
      if (!reduxProject.ideReady) {
        // The following shall cause the ideReady for the project
        makeProjectIdeReady(reduxProject.localId);
      }
    }
  }, [isVisibleDebounced, appFilesLoaded]);
  // visibility logic ends

  useEffect(() => {
    // console.log(`ScrollItem:useEffect[reduxProject.ideReady] ${reduxProject.ideReady}`);
    if (reduxProject.ideReady && reduxProject.bundleDirty) {
      console.log(`${reduxProject.title.padEnd(20)}: need to bundle the project .`);

      bundleProject(reduxProject.localId);
    }
  }, [reduxProject.ideReady, reduxProject.bundleDirty]);

  useEffect(() => {
    if (!reduxProject.bundleDirty) {
      console.log(`${reduxProject.title.padEnd(20)}: bundle is ready`);
    }
  }, [reduxProject.bundleDirty]);
  return (
      <div ref={scrollItemRef}>
        <ResizableHorizontalSplitBox
            key={index}
            contentComponent={ContentBox}
            remainingComponent={RemainingBox}
            defaultHeight={200}
            heightConstraints={{min:50, max:400}}
            innerBoxProportions={innerBoxProportions}
            data={reduxProject}
        />
      </div>
  )
}

export default React.memo(ProjectListScrollItem);