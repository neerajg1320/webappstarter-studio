import { Outlet, Link } from "react-router-dom";

const ProjectNavLayout = () => {
  return (
      <div style={{
          height: "80vh",
          width:"100%", padding:"0 40px",
          border:"3px solid yellow",
          display: "flex", flexDirection:"column", gap:"20px"
        }}
      >
        <nav className="navbar">
          <div  className="navbar-menu">

            <div className="navbar-start">
              <a className="navbar-item">
                <Link to="/">Projects</Link>
              </a>
              <a className="navbar-item">
                <Link to="/editor">Editor </Link>
              </a>

              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">
                  User
                </a>

                <div className="navbar-dropdown">
                  <a className="navbar-item">
                    Profile
                  </a>
                  <a className="navbar-item">
                    Messages
                  </a>
                  <a className="navbar-item">
                    Contact info
                  </a>
                </div>
              </div>
            </div>

            <div className="navbar-end">
              <div className="navbar-item">
                <div>
                  <a className="button is-family-secondary">
                    <strong>Login</strong>
                  </a>
                  <a className="button is-primary">
                    <strong>Sign up</strong>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </nav>

        <Outlet />
      </div>
  )
};

export default ProjectNavLayout;