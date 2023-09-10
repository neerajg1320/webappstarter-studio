import React from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {Navigate} from "react-router-dom";
import {RoutePath} from "../routes";

interface ProtectedRouteProps {
  children: React.ReactNode
};

const ProtectedRoute:React.FC<ProtectedRouteProps> = ({children}) => {
  const isAuthenticated = useTypedSelector<boolean>(state => state.auth.isAuthenticated);

  // TBD: We should not navigate to User Login page if the token is stored in the localStorage
  return (
      <>
        {isAuthenticated ?
              children
            :
            <Navigate to={RoutePath.USER_LOGIN} />
        }
      </>
  );
}

export default ProtectedRoute;