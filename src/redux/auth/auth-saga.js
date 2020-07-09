import { put, takeLatest } from 'redux-saga/effects';
import { LOGIN_USER, REGISTER_USER } from '../actions';
import { UserAPI } from '../../helpers/API';

import { loginUserSuccess, loginUserError, registerUserSuccess, registerUserError } from './actions';
import { NotificationManager } from '../../components/common/react-notifications';

function* loginWithEmailPassword({ payload }) {
  yield put(loginUserError(null));
  const {
    history,
    user: { email, password },
  } = payload;
  try {
    const [err, user] = yield UserAPI.post('login', {
      email,
      password,
    });
    if (!err) {
      NotificationManager.success('Loged in successfully', 'Success');
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.id);
      yield put(loginUserSuccess(user));
      history.push('/app');
      // window.location = '/app/persons';
    } else {
      NotificationManager.error('Error', 'Login Failed');
      yield put(loginUserError(err));
    }
  } catch (error) {
    console.log(error);
    yield put(loginUserError(error));
  }
}

function* registerWithEmailPassword({ payload }) {
  yield put(registerUserError(null));
  const {
    history,
    user: { email, password, name },
  } = payload;
  try {
    const [err, user] = yield UserAPI.post('', {
      email,
      password,
      realm: name,
    });
    if (!err) {
      NotificationManager.success('Yes, you are in', 'Success');
      localStorage.setItem('user_id', user.id);
      yield put(registerUserSuccess(user));
      history.push('/user/login');
    } else {
      console.log(err);
      NotificationManager.error('Error', 'Registration Error');
      yield put(registerUserError(err));
    }
  } catch (error) {
    yield put(registerUserError(error));
  }
}

// const logoutAsync = async (history) => {
//   await auth
//     .signOut()
//     .then((authUser) => authUser)
//     .catch((error) => error);
//   history.push('/');
// };
//
// function* logout({ payload }) {
//   const { history } = payload;
//   try {
//     yield call(logoutAsync, history);
//     localStorage.removeItem('user_id');
//   } catch (error) {}
// }

export default [
  takeLatest(REGISTER_USER, registerWithEmailPassword),
  takeLatest(LOGIN_USER, loginWithEmailPassword),
  // takeLatest(LOGOUT_USER, logout),
];
