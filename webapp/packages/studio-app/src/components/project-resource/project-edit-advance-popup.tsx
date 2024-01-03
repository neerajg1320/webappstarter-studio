import React from 'react'
import './project-edit-advance-popup.css'
import Slider from '../app-components/slider/slider'

const ProjectEditAdvancePopUp = () => {

  const handleTreeShakingClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, ref: React.RefObject<HTMLDivElement>)=>{

  }
  return (
    <div className='outer-advance-popup-box'>
    <div className='advance-popup-box'>
      <div className='advance-popup-field'>
        <p>Tree Shaking</p>
        <Slider size={0.8} toggle={true} onToggleClick={handleTreeShakingClick}/>
      </div>
      <div className='advance-popup-field'>
        <p>Minify</p>
        <Slider size={0.8} toggle={true} onToggleClick={handleTreeShakingClick}/>
      </div>
    </div>
    </div>
  )
}

export default ProjectEditAdvancePopUp
