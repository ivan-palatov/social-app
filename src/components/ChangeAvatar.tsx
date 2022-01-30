import { mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { Button } from "react-bulma-components";
import { UserHandler } from "../firebase/UserHandler";
import { useAppSelector } from "../hooks";
import AvatarDropzone from "./AvatarDropzone";
import Modal from "./Modal";

interface IProps {
  isActive?: boolean;
  onClickOutside: () => void;
}

const ChangeAvatar: React.FC<IProps> = ({ isActive, onClickOutside }) => {
  const [avatar, setAvatar] = useState<File>();
  const [editor, setEditor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(13);

  const state = useAppSelector((state) => state.user);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    setAvatar(acceptedFiles[0]);
  }, []);

  function handleSave() {
    const canvas = editor.getImage() as HTMLCanvasElement;

    canvas.toBlob(saveFromBlob);
  }

  async function saveFromBlob(blob: Blob | null) {
    if (!blob || !avatar || !state.user) {
      return;
    }

    const file = new File([blob], avatar.name, { type: blob.type });
    setIsLoading(true);
    await UserHandler.updateAvatar(file, state.user);
    setIsLoading(false);
    onClickOutside();
    window.location.reload();
  }

  const setEditorRef = (e: any) => setEditor(e);

  return (
    <Modal isActive={isActive} onClickOutside={onClickOutside}>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Изменить аватар</p>
          <button
            className="delete"
            aria-label="close"
            onClick={onClickOutside}
          ></button>
        </header>
        <section className="modal-card-body">
          {avatar && (
            <div className="is-flex is-flex-direction-column is-align-items-center">
              <AvatarEditor
                ref={setEditorRef}
                image={avatar}
                borderRadius={5000}
                height={256}
                width={256}
                border={10}
                scale={scale / 10}
              />
              <input
                className="mt-3 mb-3"
                type="range"
                min={10}
                max={40}
                step={1}
                value={scale}
                onChange={(e) => setScale(parseInt(e.target.value))}
              />
            </div>
          )}
          <AvatarDropzone onDrop={handleDrop} />
        </section>
        <footer className="modal-card-foot">
          <Button
            className="is-success"
            onClick={handleSave}
            disabled={isLoading || !avatar}
          >
            Сохранить
          </Button>
          <button className="button" onClick={onClickOutside}>
            Отмена
          </button>
          {isLoading && (
            <span className="icon">
              <Icon path={mdiLoading} spin />
            </span>
          )}
        </footer>
      </div>
    </Modal>
  );
};

export default ChangeAvatar;
