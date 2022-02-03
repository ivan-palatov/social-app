import {
  mdiCalendarOutline,
  mdiEmailOutline,
  mdiLink,
  mdiPencilOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { Link } from "react-router-dom";
import { UserHandler } from "../../firebase/UserHandler";
import { useAppSelector } from "../../hooks";
import { formatDate } from "../../utils/formatDate";
import { IUser } from "../../utils/interfaces";

interface IProps extends Omit<IUser, "likes"> {}

const UserInfo: React.FC<IProps> = (props) => {
  const state = useAppSelector((state) => state.user);

  return (
    <div className="box is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
      <figure className="image is-128x128 mb-3">
        <img
          src={props.avatar || UserHandler.defaultAvatar}
          alt="Аватар"
          className="is-rounded"
        />
      </figure>
      <strong>
        {props.name}
        {state.user?.handle === props.handle && (
          <Link
            to="/edit"
            data-tooltip="Редактировать"
            className="has-tooltip-arrow ml-2"
          >
            <span className="icon is-small">
              <Icon path={mdiPencilOutline} />
            </span>
          </Link>
        )}
      </strong>
      {props.id && (
        <>
          <small>@{props.handle}</small>
          <p className="mb-3">{props.bio}</p>
          <div className="is-flex is-flex-wrap-wrap is-justify-content-center">
            <div className="is-flex">
              <span className="icon mr-1">
                <Icon path={mdiEmailOutline} />
              </span>
              <a href={`mailto:${props.email}`} className="mr-3">
                {props.email}
              </a>
            </div>
            {props.website && (
              <div className="is-flex">
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
              </div>
            )}
            <div className="is-flex">
              <span className="icon mr-1">
                <Icon path={mdiCalendarOutline} />
              </span>
              {formatDate(props.createdAt)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserInfo;
