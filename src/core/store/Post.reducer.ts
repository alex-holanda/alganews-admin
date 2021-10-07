import {
  createReducer,
  createAsyncThunk,
  isFulfilled,
  isRejected,
  isPending,
} from '@reduxjs/toolkit';
import { Post, PostService } from 'alex-holanda-sdk';

interface PostState {
  latestPosts: Post.Paginated;
  fetching: boolean;
}

const initialState: PostState = {
  latestPosts: {} as Post.Paginated,
  fetching: false,
};

export const getLatestPosts = createAsyncThunk(
  'post/latestPosts',
  async (query: Post.Query) => PostService.getAllPosts(query)
);

export default createReducer(initialState, (builder) => {
  const success = isFulfilled(getLatestPosts);
  const error = isRejected(getLatestPosts);
  const loading = isPending(getLatestPosts);

  builder
    .addCase(getLatestPosts.fulfilled, (state, action) => {
      state.latestPosts = action.payload;
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
