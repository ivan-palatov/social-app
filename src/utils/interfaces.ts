export interface IComment {
  id: string;
  body: string;
  createdAt: string;
  postId: string;
  user: string;
  name: string;
  avatar: string;
}

export interface IPost {
  id: string;
  body: string;
  createdAt: string;
  likes: number;
  comments: number;
  user: string;
  name: string;
  avatar: string;
  photos: string[];
}

export interface IUser {
  id: string;
  uid: string;
  authProvider: string;
  avatar: string;
  bio: string;
  createdAt: string;
  email: string;
  handle: string;
  name: string;
  website: string;
  likes: string[];
}

export interface INotification {
  id: string;
  from: string;
  to: string;
  isRead: boolean;
  name: string;
  avatar: string;
  type: "like" | "comment";
  postId: string;
  createdAt: string;
}
