import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InfinitePosts from "../../components/InfinitePosts";
import Button from "../../components/layout/Button";
import Loader from "../../components/layout/Loader";
import AddPostForm from "../../components/post/AddPostForm";
import UserInfo from "../../components/profile/UserInfo";
import { PostHandler } from "../../firebase/PostHandler";
import { UserHandler } from "../../firebase/UserHandler";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setLatestSnapshot,
  setPosts,
  setPostsFromLatestSnapshot,
  setPostsFromSnapshot,
  setPostsType,
} from "../../slices/postsSlice";
import { IUser } from "../../utils/interfaces";
import NotFoundPage from "./NotFoundPage";

function ProfilePage() {
  const { handle } = useParams();
  const [user, setUser] = useState<Omit<IUser, "likes">>();
  const [isLoading, setIsLoading] = useState(false);

  const postsState = useAppSelector((state) => state.posts);
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  // Получаем информацию о пользователе
  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      setUser(await UserHandler.getUserDataByHandle(handle!));
      setIsLoading(false);
    }

    getUser();
  }, [handle]);

  // Проверяем, если уже имеющиеся в state посты относятся к общему фиду или к конкретному пользователю
  useEffect(() => {
    if (postsState.postsType !== handle) {
      dispatch(setPosts([]));
      dispatch(setLatestSnapshot([]));
      dispatch(setPostsType(handle!));
    }
  }, [handle, postsState.postsType, dispatch]);

  useEffect(() => {
    const unsubscribe = PostHandler.subscribeToPosts(
      (posts) => dispatch(setPostsFromSnapshot(posts)),
      handle
    );

    return () => unsubscribe();
  }, [dispatch, handle]);

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <NotFoundPage />;
  }

  return (
    <>
      <UserInfo {...user!} />
      {userState.user && userState.user.handle === handle && <AddPostForm />}
      {postsState.latestSnapshot.length !== 0 && (
        <Button
          onClick={() => dispatch(setPostsFromLatestSnapshot())}
          className="is-fullwidth"
        >
          Показать новые посты
        </Button>
      )}
      <InfinitePosts handle={handle} />
    </>
  );
}

export default ProfilePage;
