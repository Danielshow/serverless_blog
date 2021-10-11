import React from "react";
import BlogaNavbar from "../components/BlogaNavbar.js";
import LandingPageHeader from "../components/LandingPageHeader.js";
import Auth from '../auth/Auth'

interface BlogProps {
  auth: Auth
  history: any
  handleLogin: () => void
  handleLogout: () => void
}


function LandingPage(props: BlogProps) {
  React.useEffect(() => {
    document.body.classList.add("landing-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("landing-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, []);
  return (
    <>
      <BlogaNavbar { ...props }/>
      <div className="wrapper">
        <LandingPageHeader {...props }/>
      </div>
    </>
  );
}

export default LandingPage;
