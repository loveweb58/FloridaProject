import {
  METAFIELD_ADD,
  METAFIELD_ADD_ERROR,
  METAFIELD_ADD_SUCCESS,
  METAFIELD_COUNT_GET,
  METAFIELD_COUNT_GET_ERROR,
  METAFIELD_COUNT_GET_SUCCESS,
  METAFIELD_EDIT,
  METAFIELD_EDIT_ERROR,
  METAFIELD_EDIT_SUCCESS,
  METAFIELD_GET,
  METAFIELD_GET_ERROR,
  METAFIELD_GET_SUCCESS,
  METAFIELD_GET_PER_PAGE,
  METAFIELD_GET_PER_PAGE_ERROR,
  METAFIELD_GET_PER_PAGE_SUCCESS,
} from '../actions';

export const getMetaFields = (filter, fetchCount = false) => ({
  type: METAFIELD_GET,
  payload: { filter, fetchCount },
});
export const getMetaFieldsSuccess = (list) => ({
  type: METAFIELD_GET_SUCCESS,
  payload: { list },
});
export const getMetaFieldsError = (error) => ({
  type: METAFIELD_GET_ERROR,
  payload: { error },
});

export const getMetaFieldsPerPage = (limit, skip) => ({
  type: METAFIELD_GET_PER_PAGE,
  payload: { limit, skip },
});
export const getMetaFieldsPerPageSuccess = (list) => ({
  type: METAFIELD_GET_PER_PAGE_SUCCESS,
  payload: { list },
});
export const getMetaFieldsPerPageError = (error) => ({
  type: METAFIELD_GET_PER_PAGE_ERROR,
  payload: { error },
});

export const getMetaFieldsCount = () => ({
  type: METAFIELD_COUNT_GET,
});
export const getMetaFieldsCountSuccess = (data) => ({
  type: METAFIELD_COUNT_GET_SUCCESS,
  payload: { data },
});
export const getMetaFieldsCountError = (error) => ({
  type: METAFIELD_COUNT_GET_ERROR,
  payload: { error },
});

export const addMetaFields = (body) => ({
  type: METAFIELD_ADD,
  payload: { body },
});
export const addMetaFieldsSuccess = (data) => ({
  type: METAFIELD_ADD_SUCCESS,
  payload: { data },
});
export const addMetaFieldsError = (error) => ({
  type: METAFIELD_ADD_ERROR,
  payload: { error },
});

export const editMetaFields = (id, body) => ({
  type: METAFIELD_EDIT,
  payload: { id, body },
});
export const editMetaFieldsSuccess = (data) => ({
  type: METAFIELD_EDIT_SUCCESS,
  payload: { data },
});
export const editMetaFieldsError = (error) => ({
  type: METAFIELD_EDIT_ERROR,
  payload: { error },
});
