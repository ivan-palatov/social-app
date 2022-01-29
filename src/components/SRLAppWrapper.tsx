import React from "react";
import { SRLWrapper } from "simple-react-lightbox";

const srlOptions = {
  settings: {
    disableKeyboardControls: true,
    disableWheelControls: true,
  },
  buttons: {
    showAutoplayButton: false,
    showDownloadButton: false,
    showFullscreenButton: false,
    showThumbnailsButton: false,
    showNextButton: false,
    showPrevButton: false,
  },
  thumbnails: {
    showThumbnails: false,
  },
  caption: {
    showCaption: false,
  },
};

const SRLAppWrapper: React.FC = ({ children }) => {
  return <SRLWrapper options={srlOptions}>{children}</SRLWrapper>;
};

export default SRLAppWrapper;
