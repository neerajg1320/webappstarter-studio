import React, {useState} from "react";
import "./project-edit-advance-popup.css";
import Slider from "../app-components/slider/slider";
import { useActions } from "../../hooks/use-actions";
import {
  ReduxUpdateProjectPartial,
} from "../../state/project";

interface ProjectEditAdvancePopUpProps {
  projectLocalId: string
}

const ProjectEditAdvancePopUp: React.FC<ProjectEditAdvancePopUpProps> = ({projectLocalId}) => {

  const { updateProject} =
    useActions();

  const [treeShaking, setTreeShaking] = useState<Boolean>(false)


  const handleTreeShakingClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ref: React.RefObject<HTMLDivElement>,
    sliderOuterBoxRef: React.RefObject<HTMLButtonElement>
  ) => {
    if (ref.current.classList.contains("circleLeft")) {
      ref.current.classList.replace("circleLeft", "circleRight");
      sliderOuterBoxRef.current.classList.add("toggleOffBorder")
      ref.current.classList.add("toggleOff")
      updateProject({
        localId: projectLocalId,
        treeShaking: false
      } as ReduxUpdateProjectPartial);
    } else {
      ref.current.classList.replace("circleRight", "circleLeft");
      sliderOuterBoxRef.current.classList.remove("toggleOffBorder")
      ref.current.classList.remove("toggleOff")
      updateProject({
        localId: projectLocalId,
        treeShaking: true
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
      sliderOuterBoxRef.current.classList.add("toggleOffBorder")
      ref.current.classList.add("toggleOff")
      updateProject({
        localId: projectLocalId,
        minify: false
      } as ReduxUpdateProjectPartial);
    } else {
      ref.current.classList.replace("circleRight", "circleLeft");
      sliderOuterBoxRef.current.classList.remove("toggleOffBorder")
      ref.current.classList.remove("toggleOff")
      updateProject({
        localId: projectLocalId,
        minify: true
      } as ReduxUpdateProjectPartial);
    }
  };


  return (
    <div className="advance-popup-box">
      <div className="advance-popup-field">
        <p>Tree Shaking</p>
        <Slider
          size={0.8}
          toggle={true}
          onToggleClick={handleTreeShakingClick}
        />
      </div>
      <div className="advance-popup-field">
        <p>Minify</p>
        <Slider
          size={0.8}
          toggle={true}
          onToggleClick={handleMinifyClick}
        />
      </div>
    </div>
  );
};

export default ProjectEditAdvancePopUp;
