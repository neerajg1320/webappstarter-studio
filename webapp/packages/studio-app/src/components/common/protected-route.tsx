import React, {ReactNode, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {debugAuth, enableLocalStorageAuth} from "../../config/global";
import {fetchAuthFromLocalStorage} from "../../local-storage/local-storage";
import {useActions} from "../../hooks/use-actions";
import {ReduxUser} from "../../state/user";
import {RoutePath} from "../routes";
import {withLifecyleLogger} from "../../hoc/logger";

interface LoginInitiatorProps {
  children: ReactNode;
};

const LoginInitiator:React.FC<LoginInitiatorProps> = ({children}) => {
  const { authenticationSuccess } = useActions();
  const navigate = useNavigate();

  useEffect(() => {
    let user:ReduxUser|null = null;

    if (enableLocalStorageAuth) {
      user = fetchAuthFromLocalStorage();
      if (user) {
        const messages = ['LocalStorage user retrieved successfully'];
        authenticationSuccess(user, messages);
      }
    }

    if (debugAuth) {
      console.log(user);
    }

    if (user === null) {
      // Programmatic navigation to USER_LOGIN should be here only
      navigate(RoutePath.USER_LOGIN, {replace:true});
    }

  }, []);

  return (
      <>
        {children}
      </>
  )
}

interface ProtectedRouteProps {
  children: React.ReactNode
};

const ProtectedRoute:React.FC<ProtectedRouteProps> = ({children}) => {
  const isAuthenticated = useTypedSelector<boolean>(state => state.auth.isAuthenticated);

  // TBD: We should not navigate to User Login page if the token is stored in the localStorage
  // We should be using lazy and Suspense for logging in.
  return (
      <>
        {isAuthenticated ?
              children
            :
            // <Navigate to={RoutePath.USER_LOGIN} />
            <LoginInitiator>Login Initiated</LoginInitiator>
        }
      </>
  );
}

export default withLifecyleLogger(ProtectedRoute, false);