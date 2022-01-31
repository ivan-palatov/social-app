import React from "react";
import SRLAppWrapper from "../SRLAppWrapper";

interface IProps {
  images: (File & {
    preview: string;
  })[];
  onRemovePhoto: (name: string) => void;
}

const ImagesPreview: React.FC<IProps> = ({ images, onRemovePhoto }) => {
  return (
    <>
      {images.map((photo) => (
        <div className="level-item" key={photo.name}>
          <SRLAppWrapper>
            <figure className="image">
              <img
                className="image image-item is-48x48"
                src={photo.preview}
                alt={photo.name}
              />
              <button
                className="delete is-medium top-right"
                onClick={() => onRemovePhoto(photo.name)}
              ></button>
            </figure>
          </SRLAppWrapper>
        </div>
      ))}
    </>
  );
};

export default ImagesPreview;
