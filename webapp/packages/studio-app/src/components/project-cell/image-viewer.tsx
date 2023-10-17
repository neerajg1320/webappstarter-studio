import React from 'react';
import './image-viewer.css';
import {ReduxFile} from "../../state";

interface ImageViewerProps  {
  imageFile: ReduxFile
}


const ImageViewer:React.FC<ImageViewerProps> = ({imageFile}) => {
  // console.log(`ImageViewer:`, imageFile);
  return (
    <div className="image-viewer">
      <span>{imageFile.file}</span>
      <div className="image-container">
        <img src={imageFile.file} />
      </div>
    </div>
  );
}

export default ImageViewer;
