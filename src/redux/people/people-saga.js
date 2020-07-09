import { put, takeLatest } from 'redux-saga/effects';
import {
  getPeopleCountSuccess,
  getPeopleCountError,
  PEOPLE_GET,
  getPeopleError,
  getPeopleSuccess,
  PEOPLE_ADD,
  addPeopleError,
  addPeopleSuccess,
  PEOPLE_CASE_GET,
  getPeopleCasesSuccess,
  getPeopleCasesError,
  PEOPLE_EDIT,
  editPeopleError,
  editPeopleSuccess,
  addCaseError,
  addCaseSuccess,
  PEOPLE_CASE_ADD,
  PEOPLE_GET_PER_PAGE,
  getPeoplePerPageSuccess, getPeoplePerPageError,
  PEOPLE_CASE_EDIT,
  editCaseError,
  editCaseSuccess,
  COMBINED_CASE_GET,
  getCombinedCasesSuccess,
  getCombinedCasesError,
  addCombinedCaseError,
  addCombinedCaseSuccess,
  COMBINED_CASE_ADD,
  COMBINED_CASE_EDIT,
  editCombinedCaseError,
  editCombinedCaseSuccess,
  COMBINED_CASE_REMOVE,
  removeCombinedCaseError,
  removeCombinedCaseSuccess,
} from '../actions';
import { PeopleAPI, CombinedCaseAPI } from '../../helpers/API';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';

function* getPeople({ payload: { fetchCount, filter } }) {
  const [countErr, count] = fetchCount ? yield PeopleAPI.get('count') : [false, {}];
  if (countErr) {
    yield put(getPeopleCountError(countErr));
    NotificationManager.error('Cannot get the People Count', 'Error');
  } else {
    if (fetchCount) {
      yield put(getPeopleCountSuccess(count.count));
    }
    const [err, list] = yield PeopleAPI.get('', JSON.stringify(filter));
    if (err) {
      NotificationManager.error('Cannot get the People List', 'Error');
      yield put(getPeopleError(err));
    } else {
      yield put(getPeopleSuccess(list));
    }
  }
}

function* getPeoplePerPage({ payload: { limit, skip } }) {
  let filter = {limit: limit, skip: skip}
  const [err, list] = yield PeopleAPI.get('', JSON.stringify(filter));
  if (err) {
    NotificationManager.error('Cannot get the People List', 'Error');
    yield put(getPeoplePerPageError(err));
  } else {
    yield put(getPeoplePerPageSuccess(list));
  }
}

function* addPeople({ payload: { body } }) {
  const [err, data] = yield PeopleAPI.post('', body);
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(addPeopleError(err));
  } else {
    NotificationManager.success('New Person Added Successfully', 'Success');
    yield put(addPeopleSuccess(data));
  }
}

function* getCases({ payload: { id } }) {
  const [err, data] = yield PeopleAPI.get(id + '/case');
  if (err) {
    yield put(getPeopleCasesError(err));
  } else {
    yield put(getPeopleCasesSuccess(data));
  }
}

function* getCombinedCases({ payload: { id } }) {
  const [err, data] = yield PeopleAPI.get(id + '/combinedCase');
  if (err) {
    yield put(getCombinedCasesError(err));
  } else {
    yield put(getCombinedCasesSuccess(data));
  }
}

function* editPeople({ payload: { id, body } }) {
  const [err, data] = yield PeopleAPI.put(id, body);
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(editPeopleError(err));
  } else {
    NotificationManager.success('Edit Success', 'Success');
    yield put(editPeopleSuccess(data));
  }
}

function* addCase({ payload: { body } }) {
  const [err, data] = yield PeopleAPI.post(body.personId + '/case', {
    name: body.name,
    catId: body.catId,
    subCatId: body.subCatId,
    catName: body.catName,
    subCatName: body.subCatName,
    metaFields: body.metaFields,
    extractText: body.extractText,
    fileName: body.fileName,
  });
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(addCaseError(err));
  } else {
    NotificationManager.success('Edit Success', 'Success');
    yield put(addCaseSuccess(data));
  }
}

function* editCase({ payload: { id, body } }) {
  const [err, data] = yield PeopleAPI.put(body.personId + '/case/' + id , {
    name: body.name,
    catId: body.catId,
    subCatId: body.subCatId,
    catName: body.catName,
    subCatName: body.subCatName,
    metaFields: body.metaFields,
    extractText: body.extractText,
    fileName: body.fileName,
  });
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(editCaseError(err));
  } else {
    NotificationManager.success('Edit Success', 'Success');
    yield put(editCaseSuccess(data));
  }
}

function* addCombinedCase({ payload: { body } }) {
  console.log(body);
  const [err, data] = yield PeopleAPI.post(body.personId + '/combinedCase', {
    name: body.name,
    description: body.description,
    data_collections: body.data_collections
  });
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(addCombinedCaseError(err));
  } else {
    NotificationManager.success('Add Successfully', 'Success');
    yield put(addCombinedCaseSuccess(data));
  }
}

function* editCombinedCase({ payload: { id, body } }) {
  const [err, data] = yield PeopleAPI.put(body.personId + '/combinedCase/' + id , {
    name: body.name,
    description: body.description,
    data_collections: body.data_collections
  });
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(editCombinedCaseError(err));
  } else {
    NotificationManager.success('Edit Successfully', 'Success');
    yield put(editCombinedCaseSuccess(data));
  }
}

function* removeCombinedCase({ payload: { id } }) {
  const [err, data] = yield CombinedCaseAPI.del(id);
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(removeCombinedCaseError(err));
  } else {
    NotificationManager.success('Remove Successfully', 'Success');
    yield put(removeCombinedCaseSuccess(data));
  }
}

export default [
  takeLatest(PEOPLE_GET, getPeople),
  takeLatest(PEOPLE_ADD, addPeople),
  takeLatest(PEOPLE_CASE_GET, getCases),
  takeLatest(PEOPLE_EDIT, editPeople),
  takeLatest(PEOPLE_CASE_ADD, addCase),
  takeLatest(PEOPLE_CASE_EDIT, editCase),
  takeLatest(PEOPLE_GET_PER_PAGE, getPeoplePerPage),
  takeLatest(COMBINED_CASE_GET, getCombinedCases),
  takeLatest(COMBINED_CASE_ADD, addCombinedCase),
  takeLatest(COMBINED_CASE_EDIT, editCombinedCase),
  takeLatest(COMBINED_CASE_REMOVE, removeCombinedCase),
];
