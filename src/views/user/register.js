import React, { Component } from 'react';
import { Row, Card, CardTitle, Form, Label, Input, Button, Alert } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../redux/actions';

import createInputHandler from '../../helpers/inputHandler';

import IntlMessages from '../../helpers/IntlMessages';
import { Colxx } from '../../components/common/CustomBootstrap';

import auth0 from 'auth0-js';
import auth_config from '../../auth_config.json';

class Register extends Component {

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
      name: '',
      error: null,
    };
  }

  onUserRegister = async () => {
    const { email, password , name} = this.state;
    if (email !== '' && password !== '' && name !== '') {
      this.auth0.signup(
        {
          connection: 'Username-Password-Authentication',
          email: email,
          password: password,
          name: name,
        },
        (err, authResult) => {
          console.log(err);
          if(err) {
            if(err.name === 'PasswordStrengthError') {
              this.setState({error: 'At least 8 characters in length.\nContain at least 3 of the following 4 types of characters:\nlower case letters (a-z)\nupper case letters (A-Z)\nnumbers (i.e. 0-9)\nspecial characters (e.g. !@#$%^&*)'})
            }else{
              this.setState({error: err.description})
            }
          }else{
            this.props.registerUser({email: email, password: password, name: name}, this.props.history);
            localStorage.setItem('isFirstLogin', true);
          }
        }
      )
    }
  };

  render() {
    const inputHandler = createInputHandler(this).normal;
    const { error } = this.state;
    const { name, email, password } = this.state;

    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
              <p className="white mb-0">
                Please use this form to register. <br />
                If you are a member, please{' '}
                <NavLink to={`/user/login`} className="white">
                  login
                </NavLink>
                .
              </p>
            </div>
            <div className="form-side">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.register" />
              </CardTitle>
              <Form>
                <Label className="form-group has-float-label mb-4">
                  <Input type="name" value={name} onChange={inputHandler('name')} />
                  <IntlMessages id="user.fullname" />
                </Label>
                <Label className="form-group has-float-label mb-4">
                  <Input type="email" value={email} onChange={inputHandler('email')} />
                  <IntlMessages id="user.email" />
                </Label>
                <Label className="form-group has-float-label mb-4">
                  <Input type="password" onChange={inputHandler('password')} />
                  <IntlMessages id="user.password" defaultValue={password} />
                </Label>

                {error && (
                  <Alert color="danger" className="rounded">
                    {error}
                  </Alert>
                )}

                <div className="d-flex justify-content-end align-items-center">
                  <Button color="primary" className="btn-shadow" size="lg" onClick={this.onUserRegister}>
                    <IntlMessages id="user.register-button" />
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, loading, regError } = authUser;
  return { user, loading, error: regError };
};

export default connect(
  mapStateToProps,
  {
    registerUser,
  },
)(Register);
