import {
  createReducer,
  createAsyncThunk,
  isFulfilled,
  isRejected,
  isPending,
} from '@reduxjs/toolkit';
import { Post, PostService } from 'alex-holanda-sdk';

interface PostState {
  posts: Post.Paginated;
  fetching: boolean;
}

const initialState: PostState = {
  posts: {} as Post.Paginated,
  fetching: false,
};

export const getAllPosts = createAsyncThunk(
  'post/getAllPosts',
  async (query: Post.Query) => PostService.getAllPosts(query)
);

export const togglePostPublish = createAsyncThunk(
  'post/publishPost',
  async (post: Post.Summary) =>
    post.published
      ? PostService.deactivateExistingPost(post.id)
      : PostService.publishExistingPost(post.id)
);

export default createReducer(initialState, (builder) => {
  const success = isFulfilled(getAllPosts, togglePostPublish);
  const error = isRejected(getAllPosts, togglePostPublish);
  const loading = isPending(getAllPosts, togglePostPublish);

  builder
    .addCase(getAllPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    })
    .addMatcher(success, (state) => {
      state.fetching = false;
    })
    .addMatcher(error, (state) => {
      state.fetching = false;
    })
    .addMatcher(loading, (state) => {
      state.fetching = true;
    });
});
