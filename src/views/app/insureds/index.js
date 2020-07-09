import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const People = React.lazy(() => import(/* webpackChunkName: "people" */ './people'));
// const Cases = React.lazy(() => import(/* webpackChunkName: "category" */ './cases'));
// const MetaField = React.lazy(() => import(/* webpackChunkName: "category" */ './meta-fields'));

const Insureds = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/people`} />
      <Route path={`${match.url}/people`} render={(props) => <People {...props} />} />
      {/* <Route path={`${match.url}/cases`} render={(props) => <Cases {...props} />} /> */}
      {/* <Route path={`${match.url}/meta-field`} render={(props) => <MetaField {...props} />} /> */} */}
      {/*<Redirect to="/error" />*/}
    </Switch>
  </Suspense>
);
export default Insureds;
