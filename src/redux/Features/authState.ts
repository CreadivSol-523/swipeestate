import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthData {
  isLoggin: boolean;
  data: any;
}
const initialState: AuthData = {
  isLoggin: false,
  data: null,
};
export const authState = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    authUser: (state, action: PayloadAction<{ data: AuthData['data'] }>) => {
      state.isLoggin = true;
      state.data = action.payload.data;
    },
    logout: state => {
      state.isLoggin = false;
      state.data = null;
    },
  },
});
export const { authUser, logout } = authState.actions;
export default authState.reducer;
