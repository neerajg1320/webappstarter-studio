import React from "react";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {Navigate} from "react-router-dom";
import {RouteName} from "../routes";

interface ProtectedRouteProps {
  children: React.ReactNode
};

const ProtectedRoute:React.FC<ProtectedRouteProps> = ({children}) => {
  const isAuthenticated = useTypedSelector<boolean>(state => state.auth.isAuthenticated);

  return (
      <>
        {isAuthenticated ?
              children
            :
            <Navigate to={RouteName.USER_LOGIN} />
        }
      </>
  );
}

export default ProtectedRoute;