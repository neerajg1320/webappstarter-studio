import './app-router-layout.css';
import {Outlet, Link, useNavigate} from "react-router-dom";
import {useTypedSelector} from "../../hooks/use-typed-selector";
import {useActions} from "../../hooks/use-actions";
import {RouteName} from "../routes";
import AppNavBar from "./app-nav-bar";

const AppRouterLayout = () => {

  return (
      <div style={{
          height: "80vh",
          width:"100%", padding:"0 40px",
          display: "flex", flexDirection:"column", gap:"20px"
        }}
      >
        <AppNavBar />

        <div className="outlet app-router-view">
          <Outlet />
        </div>

      </div>
  )
};

export default AppRouterLayout;