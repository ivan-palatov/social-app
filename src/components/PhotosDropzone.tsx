import { mdiUpload } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { useDropzone } from "react-dropzone";

interface IProps {
  onDrop: (acceptedFiles: File[]) => void;
}

const PhotosDropzone: React.FC<IProps> = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 4,
    maxSize: 5 * 1024 * 1024,
    multiple: true,
  });

  return (
    <div className="file is-large is-boxed is-centered" {...getRootProps()}>
      <label className="file-label">
        <input className="file-input" {...getInputProps()} />
        <span className="file-cta">
          <span className="file-icon">
            <Icon path={mdiUpload} />
          </span>
          <span className="file-label is-align-items-center is-size-4">
            {isDragActive
              ? "Положите изображения сюда"
              : "Переместите изображения сюда"}
            <br />
            <small className="is-size-6">
              Максимум 4 изображения, не более 5 МБ
            </small>
          </span>
        </span>
      </label>
    </div>
  );
};

export default PhotosDropzone;
