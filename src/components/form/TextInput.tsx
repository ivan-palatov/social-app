import Icon from "@mdi/react";
import React from "react";

interface IProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  iconPath?: string;
  displayName: string;
  error?: string;
}

const TextInput: React.FC<IProps> = ({
  iconPath,
  displayName,
  error,
  ...props
}) => {
  return (
    <div className="field is-fullwidth">
      <label htmlFor={props.id} className="label">
        {displayName}
      </label>
      <div className={iconPath ? "control has-icons-left" : "control"}>
        <input {...props} className={error ? "input is-danger" : "input"} />
        {iconPath && (
          <span className="icon is-small is-left">
            <Icon path={iconPath} />
          </span>
        )}
      </div>
      {error && <p className="help is-danger">{error}</p>}
    </div>
  );
};

export default TextInput;
