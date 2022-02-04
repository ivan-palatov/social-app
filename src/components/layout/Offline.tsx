import React, { useCallback, useEffect, useMemo, useState } from "react";

interface IProps {}

const Offline: React.FC<IProps> = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [shouldShow, setShouldShow] = useState(false);

  const handleStatusChange = useCallback(() => {
    setShouldShow(true);
    setIsOnline(navigator.onLine);
    setTimeout(() => {
      setShouldShow(false);
    }, 5000);
  }, []);

  useEffect(() => {
    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    return () => {
      window.removeEventListener("online", () => {});
      window.removeEventListener("offline", () => {});
    };
  }, [handleStatusChange]);

  const classNames = useMemo(() => {
    const classes = ["notification", "is-clickabe", "offline-notification"];

    if (shouldShow) {
      classes.push("offline-notification-active");
    }

    if (isOnline) {
      classes.push("is-success");
    } else {
      classes.push("is-danger");
    }

    return classes;
  }, [isOnline, shouldShow]);

  return (
    <div className={classNames.join(" ")} onClick={() => setShouldShow(false)}>
      <button className="delete"></button>
      {isOnline
        ? "Соединение с сервером успешно восстановлено"
        : "Потеряно соединение с сервером"}
    </div>
  );
};

export default Offline;
