import React from 'react';
import './image-viewer.css';
import {ReduxFile} from "../../state";

interface ImageViewerProps  {
  imageFile: ReduxFile
}


const ImageViewer:React.FC<ImageViewerProps> = ({imageFile}) => {
  return (
    <>
      <span>{imageFile.file}</span>
      <img src={imageFile.file} />
    </>
  );
}

export default ImageViewer;
