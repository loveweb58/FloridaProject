import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
// import './helpers/Firebase';
import AppLocale from './lang';
import NotificationContainer from './components/common/react-notifications/NotificationContainer';
import { isDemo, radiusType } from './constants/defaultValues';
import { getDirection, getLoggedIn } from './helpers/Utils';

const ViewMain = React.lazy(() => import(/* webpackChunkName: "views" */ './views'));
const ViewApp = React.lazy(() => import(/* webpackChunkName: "views-app" */ './views/app'));
const ViewUser = React.lazy(() => import(/* webpackChunkName: "views-user" */ './views/user'));
const ViewError = React.lazy(() => import(/* webpackChunkName: "views-error" */ './views/error'));

const AuthRoute = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        // console.log(getLoggedIn())
        getLoggedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/user/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};
class App extends Component {
  constructor(props) {
    super(props);
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }

  componentDidMount() {
    if (radiusType === 'flat') {
      document.body.classList.remove('rounded');
    } else {
      document.body.classList.add('rounded');
    }
  }

  render() {
    const { locale, loginUser } = this.props;
    const currentAppLocale = AppLocale[locale];

    return (
      <div className="h-100">
        <IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
          <React.Fragment>
            <NotificationContainer />
            <Suspense fallback={<div className="loading" />}>
              <Router>
                <Switch>
                  <AuthRoute path="/app" authUser={loginUser} component={ViewApp} />
                  <Route path="/user" render={(props) => <ViewUser {...props} />} />
                  <AuthRoute path="/error" exact render={(props) => <ViewError {...props} />} />
                  <AuthRoute path="/" exact render={(props) => <ViewMain {...props} />} />
                  <Redirect to="/error" />
                </Switch>
              </Router>
            </Suspense>
          </React.Fragment>
        </IntlProvider>
      </div>
    );
  }
}

const mapStateToProps = ({ authUser, settings }) => {
  const { user: loginUser } = authUser;
  const { locale } = settings;
  return { loginUser, locale };
};
const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps,
)(App);