import { put, takeLatest } from 'redux-saga/effects';
import {
  getMetaFieldsCountError,
  getMetaFieldsCountSuccess,
  getMetaFieldsError,
  addMetaFieldsError,
  addMetaFieldsSuccess,
  editMetaFieldsError,
  editMetaFieldsSuccess,
  METAFIELD_GET,
  METAFIELD_ADD,
  METAFIELD_EDIT, getMetaFieldsSuccess,
  METAFIELD_GET_PER_PAGE,
  getMetaFieldsPerPageSuccess, getMetaFieldsPerPageError,
} from '../actions';
import { MetaFieldsAPI } from '../../helpers/API';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';

function* getMetaFields({ payload: { fetchCount, filter } }) {
  const [countErr, count] = fetchCount ? yield MetaFieldsAPI.get('count') : [false, {}];
  if (countErr) {
    yield put(getMetaFieldsCountError(countErr));
    NotificationManager.error('Cannot get the Meta Fields Count', 'Error');
  } else {
    if (fetchCount) {
      yield put(getMetaFieldsCountSuccess(count.count));
    }
    const [err, list] = yield MetaFieldsAPI.get('', JSON.stringify(filter));
    if (err) {
      NotificationManager.error('Cannot get the Meta Fields List', 'Error');
      yield put(getMetaFieldsError(err));
    } else {
      yield put(getMetaFieldsSuccess(list));
    }
  }
}

function* getMetaFieldsPerPage({ payload: { limit, skip } }) {
  let filter = {limit: limit, skip: skip}
  const [err, list] = yield MetaFieldsAPI.get('', JSON.stringify(filter));
  if (err) {
    NotificationManager.error('Cannot get the Meta Fields List', 'Error');
    yield put(getMetaFieldsPerPageError(err));
  } else {
    yield put(getMetaFieldsPerPageSuccess(list));
  }
}
function* addMetaField({ payload: { body } }) {
  const [err, data] = yield MetaFieldsAPI.post('', body);
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(addMetaFieldsError(err));
  } else {
    NotificationManager.success('New Meta Field Added Successfully', 'Success');
    yield put(addMetaFieldsSuccess(data));
  }
}

function* editMetaField({ payload: { id, body } }) {
  const [err, data] = yield MetaFieldsAPI.put(id, body);
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(editMetaFieldsError(err));
  } else {
    NotificationManager.success('Edit Success', 'Success');
    yield put(editMetaFieldsSuccess(data));
  }
}

export default [
  takeLatest(METAFIELD_GET, getMetaFields),
  takeLatest(METAFIELD_ADD, addMetaField),
  takeLatest(METAFIELD_EDIT, editMetaField),
  takeLatest(METAFIELD_GET_PER_PAGE, getMetaFieldsPerPage),
];
