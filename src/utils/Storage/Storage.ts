import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export const useAuth = () => {
     const userData = useSelector((state: RootState) => state.userData);
     return {
          isLoggedIn: userData?.isLoggin ?? false,
          refreshToken: userData?.data?.refreshToken,
          accessToken: userData?.data?.accessToken,
          userData: userData?.data?.user,
     };
};
