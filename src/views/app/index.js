import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Insureds = React.lazy(() => import(/* webpackChunkName: "viwes-gogo" */ './insureds'));
const Fields = React.lazy(() => import(/* webpackChunkName: "viwes-second-menu" */ './fields'));
// const BlankPage = React.lazy(() => import(/* webpackChunkName: "viwes-blank-page" */ './blank-page'));

class App extends Component {
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/insureds`} />
              <Route path={`${match.url}/insureds`} render={(props) => <Insureds {...props} />} />
              <Route path={`${match.url}/fields`} render={(props) => <Fields {...props} />} />
              {/* <Route path={`${match.url}/blank-page`} render={(props) => <BlankPage {...props} />} /> */}
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {},
  )(App),
);
