import React, { useState } from "react";
import "./project-edit-advance-popup.css";
import Slider from "../app-components/slider/slider";
import { useActions } from "../../hooks/use-actions";
import { ReduxProject, ReduxUpdateProjectPartial } from "../../state/project";
import { advanceSettingTypes } from "../../types/types";

interface ProjectEditAdvancePopUpProps {
  // projectLocalId: string;
  currentProject: ReduxProject;
}

const ProjectEditAdvancePopUp: React.FC<ProjectEditAdvancePopUpProps> = ({
  currentProject
}) => {
  const { updateProject } = useActions();

  const handleTreeShakingClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ref: React.RefObject<HTMLDivElement>,
    sliderOuterBoxRef: React.RefObject<HTMLButtonElement>
  ) => {
    if (ref.current.classList.contains("circleLeft")) {
      ref.current.classList.replace("circleLeft", "circleRight");
      sliderOuterBoxRef.current.classList.add("toggleOffBorder");
      ref.current.classList.add("toggleOff");
      updateProject({
        localId: currentProject?.localId,
        tree_shaking: false,
      } as ReduxUpdateProjectPartial);
      
      
    } else {
      ref.current.classList.replace("circleRight", "circleLeft");
      sliderOuterBoxRef.current.classList.remove("toggleOffBorder");
      ref.current.classList.remove("toggleOff");
      updateProject({
        localId: currentProject?.localId,
        tree_shaking: true,
      } as ReduxUpdateProjectPartial);
    }
  };

  const handleMinifyClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ref: React.RefObject<HTMLDivElement>,
    sliderOuterBoxRef: React.RefObject<HTMLButtonElement>
  ) => {
    if (ref.current.classList.contains("circleLeft")) {
      ref.current.classList.replace("circleLeft", "circleRight");
      sliderOuterBoxRef.current.classList.add("toggleOffBorder");
      ref.current.classList.add("toggleOff");
      updateProject({
        localId: currentProject?.localId,
        minify: false,
      } as ReduxUpdateProjectPartial);
    } else {
      ref.current.classList.replace("circleRight", "circleLeft");
      sliderOuterBoxRef.current.classList.remove("toggleOffBorder");
      ref.current.classList.remove("toggleOff");
      updateProject({
        localId: currentProject?.localId,
        minify: true,
      } as ReduxUpdateProjectPartial);
    }
  };

  return (
    <div className="advance-popup-box">
      <div className="heading-advance-popup">
        <h3>Advance setting</h3>
      </div>
      <div className="advance-popup-field">
        <p>Tree Shaking</p>
        <Slider
          size={0.8}
          toggle={true}
          onToggleClick={handleTreeShakingClick}
          circlePosition={currentProject?.tree_shaking}
        />
      </div>
      <div className="advance-popup-field">
        <p>Minify</p>
        <Slider
          size={0.8}
          toggle={true}
          onToggleClick={handleMinifyClick}
          circlePosition={currentProject?.minify}
        />
      </div>
    </div>
  );
};

export default ProjectEditAdvancePopUp;
