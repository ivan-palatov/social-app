import React from "react";

interface IProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  displayName: string;
  error?: string;
}

const TextArea: React.FC<IProps> = ({ displayName, error, ...props }) => {
  return (
    <div className="field is-fullwidth">
      <label htmlFor={props.id} className="label">
        {displayName}
      </label>
      <div className="control">
        <textarea
          {...props}
          className={error ? "textarea is-danger" : "textarea"}
        />
      </div>
      {error && <p className="help is-danger">{error}</p>}
    </div>
  );
};

export default TextArea;
