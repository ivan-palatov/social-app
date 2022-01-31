import { mdiUpload } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { useDropzone } from "react-dropzone";

interface IProps {
  onDrop: (acceptedFiles: File[]) => void;
}

const AvatarDropzone: React.FC<IProps> = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
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
            {isDragActive ? "Положите фото сюда" : "Переместите фото сюда"}
          </span>
        </span>
      </label>
    </div>
  );
};

export default AvatarDropzone;
