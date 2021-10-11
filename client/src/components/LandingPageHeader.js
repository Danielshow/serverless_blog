import React from "react";
import { Container } from "reactstrap";
import { NavLink } from "react-router-dom";

function LandingPageHeader(props) {
  let pageHeader = React.createRef();

  React.useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }
  });
  return (
    <>
      <div className="page-header">
        <div
          className="page-header-image"
          style={{
            backgroundImage:
              "url(" + require("../assets/img/bg11.jpg").default + ")",
          }}
          ref={pageHeader}
        ></div>
        <div className="content-center">
          <Container>
            <h1 className="title">Bloga</h1>
            <h3>
              A Blogging Platform for the Modern Web Developer.
            </h3>
            <NavLink to="/blogs" className="btn">
              View Published Blogs
            </NavLink>
            &nbsp;
            &nbsp;
            { props.auth.isAuthenticated() ? (
              <NavLink to="/blogs/new" className="btn custom-button">
                Create New Blog
              </NavLink>
            ) : (
              <div onClick={props.handleLogin} className="btn custom-button">
                Login to Create New Blog
              </div>
            )}
          </Container>
        </div>
      </div>
    </>
  );
}

export default LandingPageHeader;
