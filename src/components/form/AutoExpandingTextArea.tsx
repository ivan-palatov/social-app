import React from "react";

interface IProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {}

const AutoExpandingTextArea: React.FC<IProps> = ({ onChange, ...props }) => {
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!onChange) {
      return;
    }

    onChange(e);

    // Делаем textarea автоматически расширяемой
    e.currentTarget.style.height = "inherit";
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
  }

  return (
    <div className="field">
      <div className="control">
        <textarea onChange={handleChange} {...props} />
      </div>
    </div>
  );
};

export default AutoExpandingTextArea;
