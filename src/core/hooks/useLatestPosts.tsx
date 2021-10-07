import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../store';
import * as LatestPostsAction from '../store/Post.reducer';

export function useLatestPosts() {
  const dispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.post.latestPosts);
  const fetching = useSelector((state: RootState) => state.post.fetching);

  const fetchPosts = useCallback(() => {
    dispatch(
      LatestPostsAction.getLatestPosts({
        sort: ['createdAt', 'desc'],
        page: 0,
        size: 3,
      })
    );
  }, [dispatch]);

  return {
    posts: posts.content,
    fetchPosts,
    fetching,
  };
}
