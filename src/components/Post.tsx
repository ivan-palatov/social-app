import { mdiClockOutline, mdiComment, mdiHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { IPost } from "../slices/postsSlice";
import { timeSince } from "../utils/timeSince";

interface IProps extends IPost {}

const Post: React.FC<IProps> = (props) => {
  return (
    <div className="card">
      <div className="card-content">
        <div className="content">{props.body}</div>
      </div>
      <div className="card-footer is-flex is-justify-content-space-around">
        <span className="icon-text mr-3 is-clickable">
          <span>{props.likes}</span>
          <span className="icon">
            <Icon path={mdiHeartOutline} color="red" />
          </span>
        </span>
        <span className="icon-text mr-3 is-clickable">
          <span>{props.comments}</span>
          <span className="icon">
            <Icon path={mdiComment} />
          </span>
          <span>Комментариев</span>
        </span>
        <span className="icon-text">
          <span className="icon">
            <Icon path={mdiClockOutline} />
          </span>
          <span>{timeSince(props.createdAt)}</span>
        </span>
      </div>
    </div>
  );
};

export default Post;
