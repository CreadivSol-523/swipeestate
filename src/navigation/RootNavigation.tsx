import React, { JSX } from 'react';
import AuthNaivgation from './AuthNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import TabNavigation from './TabNavigator';
import { NotifierWrapper } from 'react-native-notifier';
import AgentTabs from './AgentTabs';

const RootNavigation = (): JSX.Element => {
     const selector = useSelector((state: RootState) => state?.userData);
     const isLoggin = selector.isLoggin;
     const accType = selector?.data?.user?.role;

     return (
          <>
               {isLoggin ? (
                    <NotifierWrapper>{accType === 'Seller' ? <AgentTabs /> : <TabNavigation />}</NotifierWrapper>
               ) : (
                    <NotifierWrapper>
                         <AuthNaivgation initRoute={'LoginScreen'} />
                    </NotifierWrapper>
               )}
          </>
     );
};
export default RootNavigation;
