import { mdiCalendar, mdiLink } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { formatDate } from "../../utils/formatDate";
import { IUser } from "../../utils/interfaces";

interface IProps extends Omit<IUser, "likes"> {}

const UserInfo: React.FC<IProps> = (props) => {
  if (!props.id) {
    return null;
  }

  return (
    <div className="box is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
      <figure className="image is-128x128 mb-3">
        <img src={props.avatar} alt="Аватар" className="is-rounded" />
      </figure>
      <strong>{props.name}</strong>
      <small>@{props.handle}</small>
      <p>{props.bio}</p>
      <div className="is-flex">
        {props.website && (
          <>
            <span className="icon mr-1">
              <Icon path={mdiLink} />
            </span>
            <a
              target="_blank"
              rel="noreferrer"
              href={props.website}
              className="mr-3"
            >
              {props.website}
            </a>
          </>
        )}
        <span className="icon mr-1">
          <Icon path={mdiCalendar} />
        </span>
        {formatDate(props.createdAt)}
      </div>
    </div>
  );
};

export default UserInfo;
