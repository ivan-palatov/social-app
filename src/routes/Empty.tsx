import React from "react";
import { Outlet } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";

interface IProps {}

/**
 * Необходим для корректной работы анимаций.
 * Без этого компонента необходимо обернуть индивидуально каждую страницу в AnimatedPage,
 * иначе при каждой смене страницы всё виртуальное дерево будет перезагружаться
 *
 * @returns React.ReactElement
 */
const Empty: React.FC<IProps> = () => {
  return (
    <AnimatedPage>
      <Outlet />
    </AnimatedPage>
  );
};

export default Empty;
