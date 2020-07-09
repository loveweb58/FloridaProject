import { put, takeLatest } from 'redux-saga/effects';
import {
  CATEGORY_GET,
  CATEGORY_ADD,
  CATEGORY_EDIT,
  CATEGORY_SUB_CATEGORY_GET,
  SUB_CATEGORY_ADD,
  SUB_CATEGORY_EDIT,
  SUB_CATEGORY_REMOVE,
  addCategorySuccess,
  addCategoryError,
  editCategoryError,
  editCategorySuccess,
  getCategorySubCategorySuccess,
  addSubCategoryError,
  addSubCategorySuccess,
  editSubCategoryError,
  editSubCategorySuccess,
  SUB_CATEGORY_CATEGORY_GET,
  getSubCategoryCategoryError,
  getSubCategoryCategorySuccess, getCategorySubCategory,
  SUB_CATEGORY_CATEGORY_ARRAY_GET,
  getSubCategoryCategoryArraySuccess,
  CATEGORY_GET_PER_PAGE,
  getCategoryPerPageSuccess, getCategoryPerPageError,
  removeSubCategoryError
} from '../actions';
import { CategoryAPI, SubCategoryAPI } from '../../helpers/API';
import NotificationManager from '../../components/common/react-notifications/NotificationManager';
import {
  getCategoryCountError,
  getCategoryCountSuccess,
  getCategoryError,
  getCategorySubCategoryError,
  getCategorySuccess,
} from './actions';

function* getCategory({ payload: { fetchCount, filter } }) {
  const [countErr, count] = fetchCount ? yield CategoryAPI.get('count') : [false, {}];
  if (countErr) {
    yield put(getCategoryCountError(countErr));
    NotificationManager.error('Cannot get the Category Count', 'Error');
  } else {
    if (fetchCount) {
      yield put(getCategoryCountSuccess(count.count));
    }
    const [err, list] = yield CategoryAPI.get('', JSON.stringify(filter));
    if (err) {
      NotificationManager.error('Cannot get the Category List', 'Error');
      yield put(getCategoryError(err));
    } else {
      yield put(getCategorySuccess(list));
    }
  }
}

function* getCategoryPerPage({ payload: { limit, skip } }) {
  let filter = {limit: limit, skip: skip}
  const [err, list] = yield CategoryAPI.get('', JSON.stringify(filter));
  if (err) {
    NotificationManager.error('Cannot get the Category List', 'Error');
    yield put(getCategoryPerPageError(err));
  } else {
    yield put(getCategoryPerPageSuccess(list));
  }
}

function* addCategory({ payload: { body } }) {
  const [err, data] = yield CategoryAPI.post('', body);
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(addCategoryError(err));
  } else {
    NotificationManager.success('New Category Added Successfully', 'Success');
    yield put(addCategorySuccess(data));
  }
}

function* getSubCategory({ payload: { id } }) {
  const [err, data] = yield CategoryAPI.get(id + '/subCategory');
  if (err) {
    yield put(getCategorySubCategoryError(err));
  } else {
    yield put(getCategorySubCategorySuccess(data));
  }
}

function* editCategory({ payload: { id, body } }) {
  const [err, data] = yield CategoryAPI.put(id, body);
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(editCategoryError(err));
  } else {
    NotificationManager.success('Edit Success', 'Success');
    yield put(editCategorySuccess(data));
  }
}

function* addSubCategory({ payload: { id, name } }) {
  const [err, data] = yield CategoryAPI.post(id + '/subCategory', { name });
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(addSubCategoryError(err));
  } else {
    NotificationManager.success('Added Success', 'Success');
    yield put(addSubCategorySuccess(data));
  }
}

function* editSubCategory({ payload: { id, body } }) {
  const [err, data] = yield SubCategoryAPI.put(id, body);
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(editSubCategoryError(err));
  } else {
    NotificationManager.success('Edit Success', 'Success');
    yield put(editSubCategorySuccess(data));
  }
}

function* removeSubCategory({ payload: { id, catId } }) {
  const [err, data] = yield SubCategoryAPI.del(id);
  if (err) {
    NotificationManager.error('Something went wrong !', 'Error');
    yield put(removeSubCategoryError(err));
  } else {
    NotificationManager.success('Remove Success', 'Success');
    // yield put(removeSubCategorySuccess(data));
    yield put(getCategorySubCategory(catId));
  }
}

function* getSubCategoryCategory({ payload: { id } }) {
  const [err1, subCategory] = yield SubCategoryAPI.get(id);
  if(err1) {
    const [err2, category] = yield CategoryAPI.get(id);
    if (err2) {
      NotificationManager.error('Something went wrong !', 'Error');
      yield put(getSubCategoryCategoryError(err1 || err2));
    } else {
      yield put(getCategorySubCategory(category.id));
      yield put(getSubCategoryCategorySuccess({ subCategory, category }));
    }
  }else{
    const [err2, category] = yield SubCategoryAPI.get(id + '/category');
    if (err2) {
      NotificationManager.error('Something went wrong !', 'Error');
      yield put(getSubCategoryCategoryError(err2));
    } else {
      yield put(getCategorySubCategory(category.id));
      yield put(getSubCategoryCategorySuccess({ subCategory, category }));
    }
  }
}

function* getSubCategoryCategoryArray({ payload: { ids } }) {
  for (var id of ids) {
    // some item manipulation
    const [err1, subCategory] = yield SubCategoryAPI.get(id);
    if(err1) {
      const [err2, category] = yield CategoryAPI.get(id);
      if (err2) {
        NotificationManager.error('Something went wrong !', 'Error');
      } else {
        yield put(getSubCategoryCategoryArraySuccess({ subCategory, category }));
      }
    }else{
      const [err2, category] = yield SubCategoryAPI.get(id + '/category');
      if (err2) {
        NotificationManager.error('Something went wrong !', 'Error');
      } else {
        yield put(getSubCategoryCategoryArraySuccess({ subCategory, category }));
      }
    }
  }
}

export default [
  takeLatest(CATEGORY_GET, getCategory),
  takeLatest(CATEGORY_ADD, addCategory),
  takeLatest(CATEGORY_SUB_CATEGORY_GET, getSubCategory),
  takeLatest(CATEGORY_EDIT, editCategory),
  takeLatest(SUB_CATEGORY_ADD, addSubCategory),
  takeLatest(SUB_CATEGORY_EDIT, editSubCategory),
  takeLatest(SUB_CATEGORY_REMOVE, removeSubCategory),
  takeLatest(SUB_CATEGORY_CATEGORY_GET, getSubCategoryCategory),
  takeLatest(SUB_CATEGORY_CATEGORY_ARRAY_GET, getSubCategoryCategoryArray),
  takeLatest(CATEGORY_GET_PER_PAGE, getCategoryPerPage),
];
