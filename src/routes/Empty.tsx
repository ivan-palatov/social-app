import React from "react";
import { Outlet } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";

interface IProps {}

const Empty: React.FC<IProps> = () => {
  return (
    <AnimatedPage>
      <Outlet />
    </AnimatedPage>
  );
};

export default Empty;
