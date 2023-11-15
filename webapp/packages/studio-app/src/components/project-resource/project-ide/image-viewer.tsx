import React, {useMemo} from 'react';
import './image-viewer.css';
import {ReduxFile} from "../../../state";

interface ImageViewerProps  {
  imageFile: ReduxFile
}


const ImageViewer:React.FC<ImageViewerProps> = ({imageFile}) => {
  // console.log(`ImageViewer:`, imageFile);
  const imageUrl = useMemo(() => {
    const imageBlob = new Blob([imageFile.content]);
    return URL.createObjectURL(imageBlob);
  }, [imageFile.content]);

  return (
    <div className="image-viewer">
      <span>{imageFile.file}</span>
      <div className="image-container">
        {/*<img src={imageFile.file} />*/}
        <img src={imageUrl} />
      </div>
    </div>
  );
}

export default ImageViewer;
