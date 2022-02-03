import React from "react";

interface IProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

const Button: React.FC<IProps> = ({ children, className, ...props }) => {
  return (
    <button className={className ? `button ${className}` : "button"} {...props}>
      {children}
    </button>
  );
};

export default React.memo(Button);
