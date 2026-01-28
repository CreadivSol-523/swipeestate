import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authState } from './Features/authState';
import Subscription from './Subscription/Subscription';
import Auth from './Auth/AuthSlice';
import Plan from './Plan/Plan';
import Profile from './Profile/Profile';
import ApartmentSlice from './Apartments/ApartmentSlice';
import MatcheSlice from './Matches/MatcheSlice';

const persistConfig = {
     key: 'root',
     storage: AsyncStorage,
     blacklist: ['Subscription', 'Plan', 'Profile', 'ApartmentSlice', 'MatcheSlice'],
};

const rootReducer = combineReducers({
     userData: authState.reducer,
     [Subscription.reducerPath]: Subscription.reducer,
     [Auth.reducerPath]: Auth.reducer,
     [Plan.reducerPath]: Plan.reducer,
     [Profile.reducerPath]: Profile.reducer,
     [ApartmentSlice.reducerPath]: ApartmentSlice.reducer,
     [MatcheSlice.reducerPath]: MatcheSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export type RootState = ReturnType<typeof rootReducer>;
const store = configureStore({
     reducer: persistedReducer,
     middleware: getDefaultMiddleware =>
          getDefaultMiddleware({
               serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
               },
          })
               .concat(Subscription.middleware)
               .concat(Auth.middleware)
               .concat(Plan.middleware)
               .concat(Profile.middleware)
               .concat(ApartmentSlice.middleware)
               .concat(MatcheSlice.middleware),
});
export default store;
export const persistor = persistStore(store);
