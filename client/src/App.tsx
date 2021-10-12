import { Component } from 'react';
import { Router, Route, Switch } from "react-router-dom";
import "./assets/css/bootstrap.min.css";
import "./assets/css/now-ui-kit.min.css";
import "./assets/css/custom.css"
import LandingPage from './pages/LandingPage';
import BlogsPage from './pages/BlogsPage';
import BlogsPersonal from './pages/BlogPersonal';
import NewBlog from './pages/NewBlog';
import Auth from './auth/Auth'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <Router history={this.props.history}>
        <div className="App">
          <Switch>
            <Route
              path="/blogs/new"
              render={(props) => <NewBlog {...props} auth={this.props.auth} handleLogin={this.handleLogin} handleLogout={this.handleLogout}/>}
            />
            <Route
              path="/blogs/mine"
              render={(props) => <BlogsPersonal {...props} auth={this.props.auth} handleLogin={this.handleLogin} handleLogout={this.handleLogout}/>}
            />
            <Route
              path="/blogs"
              render={(props) => <BlogsPage {...props} auth={this.props.auth} handleLogin={this.handleLogin} handleLogout={this.handleLogout}/>}
            />
            <Route
              exact
              path="/"
              render={(props) => <LandingPage {...props} auth={this.props.auth} handleLogin={this.handleLogin} handleLogout={this.handleLogout}/>}
            />
          </Switch>
        </div>
      </Router>
    )
  }
}
