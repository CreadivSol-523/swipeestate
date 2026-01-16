import React, { JSX } from 'react';
import AuthNaivgation from './AuthNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import TabNavigation from './TabNavigator';
import { NotifierWrapper } from 'react-native-notifier';

const RootNavigation = (): JSX.Element => {
     const selector = useSelector((state: RootState) => state?.userData);
     const isLoggin = selector.isLoggin;

     return (
          <>
               {isLoggin ? (
                    <NotifierWrapper>
                         <TabNavigation />
                    </NotifierWrapper>
               ) : (
                    <NotifierWrapper>
                         <AuthNaivgation initRoute={'LoginScreen'} />
                    </NotifierWrapper>
               )}
          </>
     );
};
export default RootNavigation;
