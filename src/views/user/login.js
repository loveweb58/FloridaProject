import React, { Component } from 'react';
import {Row, Card, CardTitle, Label, FormGroup, Button, Alert} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { Formik, Form, Field } from 'formik';

import { loginUser } from '../../redux/actions';
import { Colxx } from '../../components/common/CustomBootstrap';
import IntlMessages from '../../helpers/IntlMessages';
import { setLoggedIn } from '../../helpers/Utils';

import auth0 from 'auth0-js';
import auth_config from '../../auth_config.json';

class Login extends Component {
  
  auth0 = new auth0.WebAuth({
    domain: auth_config.domain,
    clientID: auth_config.clientId,
    redirectUri: auth_config.baseUrl,
    responseType: 'token id_token',
    scope: 'openid',
  });
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
    };
  }

  componentDidMount() {
    localStorage.clear();
    // const url = window.location.href;
    // let accessToken = '';
    // if (url.indexOf('access_token') > -1) {
    //   this.loggedIn();
    //   const vars = url.split('#');
    //   for (let i = 0; i < vars.length; i += 1) {
    //     const pair = vars[i].split('=');
    //     if (pair[0] === 'access_token') {
    //       [, accessToken] = pair;
    //       break;
    //     }
    //   }
    // }
    // if (accessToken) {
    //   this.props.history.push('/app');
    //   this.loggedIn();
    // }
  }

  onUserLogin = (values) => {
    if (!this.props.loading) {
      if (values.email !== '' && values.password !== '') {
        // this.props.loginUser(values, this.props.history);
        this.auth0.client.login(
          {
            realm: 'Username-Password-Authentication',
            username: values.email,
            password: values.password,
          },
          (err, authResult) => {
            if(err) {
              console.log(err);
              this.setState({error: err});
              return;
            }
            if(authResult && authResult.idToken && authResult.accessToken) {
              this.auth0.client.userInfo(
                authResult.accessToken,
                (err1, authResult1) => {
                  if(!err1) {
                    localStorage.setItem('UserEmail', authResult1.email);
                  }
                  const str1 = authResult.idToken.split('.');
                  if(str1.length === 3) {
                    const buff = Buffer.from(str1[1], 'base64');
                    const decodedStr = JSON.parse(buff.toString('ascii'));
                    const str2 = decodedStr.sub.split('|');
                    if(str2.length === 2) {
                      setLoggedIn(true);
                      // this.props.loginUser(values, this.props.history);
                      this.loggedIn();
                    }
                  }
                }
              );
            }
          }
        )
      }
    }
  };

  loggedIn = () => {
    this.props.history.push('/app');
  }

  validateEmail = (value) => {
    let error;
    if (!value) {
      error = 'Please enter your email address';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Invalid email address';
    }
    return error;
  };

  validatePassword = (value) => {
    let error;
    if (!value) {
      error = 'Please enter your name';
    } else if (value.length < 4) {
      error = 'Value must be longer than 2 characters';
    }
    return error;
  };

  render() {
    const { password, email, error } = this.state;
    // const {error} = this.props;
    const initialValues = { email, password };

    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <span class="login-logo"></span>
              <p className="h2" style={{ color: '#fff'}}>LSSFL Admin v1.0.0</p>
              {/* <p className="white mb-0">
                Please use your credentials to login.
                <br />
                If you are not a member, please{' '}
                <NavLink to={`/user/register`} className="white">
                  register
                </NavLink>
                .
              </p> */}
            </div>
            <div className="form-side">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.login-title" />
              </CardTitle>

              <Formik initialValues={initialValues} onSubmit={this.onUserLogin}>
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.email" />
                      </Label>
                      <Field className="form-control" name="email" validate={this.validateEmail} />
                      {errors.email && touched.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.password" />
                      </Label>
                      <Field
                        className="form-control"
                        type="password"
                        name="password"
                        validate={this.validatePassword}
                      />
                      {errors.password && touched.password && (
                        <div className="invalid-feedback d-block">{errors.password}</div>
                      )}
                    </FormGroup>

                    {error && (
                      <Alert color="danger" className="rounded">
                        { error && error.description }
                      </Alert>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <NavLink to={`/user/forgot-password`}>
                        {/* <IntlMessages id="user.forgot-password-question" /> */}
                      </NavLink>
                      <Button
                        color="primary"
                        className={`btn-shadow btn-multiple-state ${this.props.loading ? 'show-spinner' : ''}`}
                        size="lg"
                      >
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label">
                          <IntlMessages id="user.login-button" />
                        </span>
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading, error } = authUser;
  return { user, loading, error };
};

export default connect(
  mapStateToProps,
  {
    loginUser,
  },
)(Login);
