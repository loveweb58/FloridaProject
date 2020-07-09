import { put, takeLatest } from 'redux-saga/effects';
import {
  CASETAG_GET,
  CASETAG_ADD,
  CASETAG_EDIT,
  addCaseTagSuccess,
  addCaseTagError,
  editCaseTagError,
  editCaseTagSuccess,
  CASETAG_GET_PER_PAGE,
  getCaseTagPerPageSuccess, getCaseTagPerPageError,
} from '../actions';
import { MetaDataAPI } from '../../helpers/API';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';
import {
  getCaseTagCountError,
  getCaseTagCountSuccess,
  getCaseTagError,
  getCaseTagSuccess,
} from './actions';

function* getCaseTag({ payload: { fetchCount, filter } }) {
  const [countErr, count] = fetchCount ? yield MetaDataAPI.get('count') : [false, {}];
  if (countErr) {
    yield put(getCaseTagCountError(countErr));
    NotificationManager.error('Cannot get the Case Tag Count', 'Error');
  } else {
    if (fetchCount) {
      yield put(getCaseTagCountSuccess(count.count));
    }
    const [err, list] = yield MetaDataAPI.get('', JSON.stringify(filter));
    if (err) {
      NotificationManager.error('Cannot get the Case Tag List', 'Error');
      yield put(getCaseTagError(err));
    } else {
      yield put(getCaseTagSuccess(list));
    }
  }
}

function* getCaseTagPerPage({ payload: { limit, skip } }) {
  let filter = {limit: limit, skip: skip}
  const [err, list] = yield MetaDataAPI.get('', JSON.stringify(filter));
  if (err) {
    NotificationManager.error('Cannot get the Case Tag List', 'Error');
    yield put(getCaseTagPerPageError(err));
  } else {
    yield put(getCaseTagPerPageSuccess(list));
  }
}

function* addCaseTag({ payload: { body } }) {
  const [err, data] = yield MetaDataAPI.post('', body);
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(addCaseTagError(err));
  } else {
    NotificationManager.success('New Case Tag Added Successfully', 'Success');
    yield put(addCaseTagSuccess(data));
  }
}


function* editCaseTag({ payload: { id, body } }) {
  const [err, data] = yield MetaDataAPI.put(id, body);
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(editCaseTagError(err));
  } else {
    NotificationManager.success('Edit Success', 'Success');
    yield put(editCaseTagSuccess(data));
  }
}


export default [
  takeLatest(CASETAG_GET, getCaseTag),
  takeLatest(CASETAG_ADD, addCaseTag),
  takeLatest(CASETAG_EDIT, editCaseTag),
  takeLatest(CASETAG_GET_PER_PAGE, getCaseTagPerPage),
];
