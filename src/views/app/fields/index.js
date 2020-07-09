import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// const Second = React.lazy(() =>
//   import(/* webpackChunkName: "second" */ './fields')
// );

const Category = React.lazy(() => import(/* webpackChunkName: "category" */ '../insureds/category'));
const MetaField = React.lazy(() => import(/* webpackChunkName: "category" */ '../insureds/meta-fields'));
const CaseTag = React.lazy(() => import(/* webpackChunkName: "category" */ '../insureds/case-tag'));

const FieldsMenu = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/category`} />
      {/* <Route
        path={`${match.url}/fields`}
        render={props => <Second {...props} />}
      /> */}
      <Route path={`${match.url}/category`} render={(props) => <Category {...props} />} />
      <Route path={`${match.url}/meta-field`} render={(props) => <MetaField {...props} />} />
      <Route path={`${match.url}/case-tag`} render={(props) => <CaseTag {...props} />} />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default FieldsMenu;
