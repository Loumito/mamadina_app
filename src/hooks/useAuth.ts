import {useSelector, useDispatch} from 'react-redux';
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectUserRole,
} from '../store/slices/authSlice';
import {AppDispatch} from '../store/store';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const userRole = useSelector(selectUserRole);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    userRole,
    dispatch,
  };
};
