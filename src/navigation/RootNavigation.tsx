import React, { JSX } from 'react';
import AuthNaivgation from './AuthNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import TabNavigation from './TabNavigator';

const RootNavigation = (): JSX.Element => {
  const selector = useSelector((state: RootState) => state?.userData);
  const isLoggin = selector.isLoggin;

  return (
    <>
      {isLoggin ? (
        <TabNavigation />
      ) : (
        <AuthNaivgation initRoute={'LoginScreen'} />
      )}
    </>
  );
};
export default RootNavigation;
