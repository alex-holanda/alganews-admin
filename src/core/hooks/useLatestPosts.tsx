import { Post, PostService } from 'alex-holanda-sdk';
import { useCallback, useState } from 'react';

export function useLatestPosts() {
  const [posts, setPosts] = useState<Post.Paginated>({} as Post.Paginated);

  const fetchPosts = useCallback(() => {
    PostService.getAllPosts({
      sort: ['createdAt', 'desc'],
      page: 0,
      size: 3,
    }).then(setPosts);
  }, []);

  return {
    posts: posts.content,
    fetchPosts,
  };
}
