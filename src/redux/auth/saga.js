
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { auth } from '../../helpers/Firebase';
import {UserAPI} from '../../util/api';

import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER
} from '../actions';

import {
    loginUserSuccess,
    loginUserError,
    registerUserSuccess,
    registerUserError
} from './actions';

const loginWithEmailPasswordAsync = async (email, password) =>
  await UserAPI.post('login', {
    email,
    password,
  });

function* loginWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    try {
        const [err, user] = yield call(loginWithEmailPasswordAsync, email, password);
        if (!err) {
            localStorage.setItem('user_id', user.userId);
            localStorage.setItem('token', user.id);
            yield put(loginUserSuccess(user));
            // history.push('/app/');
            window.location = '/app/pages/product/data-list';
        } else {
            yield put(loginUserError(err));
        }
    } catch (error) {
        yield put(loginUserError(error));
    }
}

const registerWithEmailPasswordAsync = async (email, password, name) =>
    await UserAPI.post('', {
        email,
        password,
        realm: name,
});

function* registerWithEmailPassword({ payload }) {
    const { email, password, name } = payload.user;
    const { history } = payload;
    try {
        const [err, user] = yield call(registerWithEmailPasswordAsync, email, password, name);
        if (!err) {
            localStorage.setItem('user_id', user.id);
            yield put(registerUserSuccess(user));
            history.push('/user/login')
        } else {
            yield put(registerUserError(err));
        }
    } catch (error) {
        yield put(registerUserError(error));
    }
}



const logoutAsync = async (history) => {
    await auth.signOut().then(authUser => authUser).catch(error => error);
    history.push('/')
}

function* logout({ payload }) {
    const { history } = payload
    try {
        yield call(logoutAsync, history);
        localStorage.removeItem('user_id');
    } catch (error) {
    }
}



export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}


export default function* rootSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser)
    ]);
}
