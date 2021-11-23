import { RootState } from './index';
import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  PayloadAction,
  isRejected,
  isPending,
} from '@reduxjs/toolkit';
import { Payment, PaymentService } from 'alex-holanda-sdk';

interface PaymentState {
  paginated: Payment.Paginated;
  fetching: boolean;
  query: Payment.Query;
}

const initialState: PaymentState = {
  paginated: {
    page: 0,
    size: 7,
    totalPages: 1,
    totalElements: 0,
    content: [],
  },
  fetching: false,
  query: {
    sort: ['scheduledTo', 'desc'],
    page: 0,
    size: 7,
  },
};

export const getAllPayments = createAsyncThunk(
  'payment/getAllPayments',
  async (_, { getState, dispatch }) => {
    const {
      payment: { query },
    } = getState() as RootState;

    const paymentPaginated = await PaymentService.getAllPayments(query);

    await dispatch(storeList(paymentPaginated));
  }
);

export const approvePaymentsInBatch = createAsyncThunk(
  'payment/approvePaymentsInBatch',
  async (paymentIds: number[], { dispatch }) => {
    await PaymentService.approvePaymentsBatch(paymentIds);

    await dispatch(getAllPayments());
  }
);

export const setQuery = createAsyncThunk(
  'payment/setQuery',
  async (query: Payment.Query, { dispatch }) => {
    await dispatch(storeQuery(query));
    await dispatch(getAllPayments());
  }
);

const PaymentSlice = createSlice({
  initialState,
  name: 'payment',
  reducers: {
    storeList(state, action: PayloadAction<Payment.Paginated>) {
      state.paginated = action.payload;
    },
    storeQuery(state, action: PayloadAction<Payment.Query>) {
      state.query = {
        ...state.query,
        ...action.payload,
      };
    },
  },
  extraReducers(builder) {
    const success = isFulfilled(getAllPayments, approvePaymentsInBatch);
    const error = isRejected(getAllPayments, approvePaymentsInBatch);
    const loading = isPending(getAllPayments, approvePaymentsInBatch);

    builder
      .addMatcher(success, (state) => {
        state.fetching = false;
      })
      .addMatcher(error, (state) => {
        state.fetching = false;
      })
      .addMatcher(loading, (state) => {
        state.fetching = true;
      });
  },
});

export const { storeQuery, storeList } = PaymentSlice.actions;

const PaymentReducer = PaymentSlice.reducer;

export default PaymentReducer;
