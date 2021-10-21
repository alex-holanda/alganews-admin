import { Post } from 'alex-holanda-sdk';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../store';
import * as PostAction from '../store/Post.reducer';

export function usePosts() {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.post.posts);
  const fetching = useSelector((state: RootState) => state.post.fetching);

  const fetchPosts = useCallback(
    (query: Post.Query) => {
      dispatch(PostAction.getAllPosts(query));
    },
    [dispatch]
  );

  const togglePostPublish = useCallback(
    async (post: Post.Summary, query: Post.Query) => {
      await dispatch(PostAction.togglePostPublish(post));
      dispatch(PostAction.getAllPosts(query));
    },
    [dispatch]
  );

  return {
    posts: posts.content,
    fetchPosts,
    fetching,
    togglePostPublish,
  };
}
