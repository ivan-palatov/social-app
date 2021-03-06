import React from "react";

interface IProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  displayName: string;
  error?: string;
  isAutoExpanding?: boolean;
}

const TextArea: React.FC<IProps> = ({
  displayName,
  error,
  isAutoExpanding,
  onChange,
  ...props
}) => {
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
    <div className="field is-fullwidth">
      <label htmlFor={props.id} className="label">
        {displayName}
      </label>
      <div className="control">
        <textarea
          {...props}
          onChange={handleChange}
          className={error ? "textarea is-danger" : "textarea"}
        />
      </div>
      {error && <p className="help is-danger">{error}</p>}
    </div>
  );
};

export default TextArea;
