import React from 'react'
import './project-edit-advance-popup.css'
import Slider from '../app-components/slider/slider'

const ProjectEditAdvancePopUp = () => {

  const handleTreeShakingClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, ref: React.RefObject<HTMLDivElement>)=>{

  }
  return (
    <div>
      <div>
        <p>Tree Shaking</p>
        <Slider size={0.8} toggle={true} onToggleClick={handleTreeShakingClick}/>
      </div>
      <div>
        <p>Minify</p>
        <Slider size={0.8} toggle={true} onToggleClick={handleTreeShakingClick}/>
      </div>
    </div>
  )
}

export default ProjectEditAdvancePopUp
