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
