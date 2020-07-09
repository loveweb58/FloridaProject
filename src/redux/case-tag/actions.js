import {
    CASETAG_ADD,
    CASETAG_ADD_ERROR,
    CASETAG_ADD_SUCCESS,
    CASETAG_COUNT_GET,
    CASETAG_COUNT_GET_ERROR,
    CASETAG_COUNT_GET_SUCCESS,
    CASETAG_EDIT,
    CASETAG_EDIT_ERROR,
    CASETAG_EDIT_SUCCESS,
    CASETAG_GET,
    CASETAG_GET_ERROR,
    CASETAG_GET_SUCCESS,
    CASETAG_GET_PER_PAGE,
    CASETAG_GET_PER_PAGE_ERROR,
    CASETAG_GET_PER_PAGE_SUCCESS,
  } from '../actions';
  
  export const getCaseTag = (filter, fetchCount = false) => ({
    type: CASETAG_GET,
    payload: { filter, fetchCount },
  });
  export const getCaseTagSuccess = (list) => ({
    type: CASETAG_GET_SUCCESS,
    payload: { list },
  });
  export const getCaseTagError = (error) => ({
    type: CASETAG_GET_ERROR,
    payload: { error },
  });
  
  export const getCaseTagPerPage = (limit, skip) => ({
    type: CASETAG_GET_PER_PAGE,
    payload: { limit, skip },
  });
  export const getCaseTagPerPageSuccess = (list) => ({
    type: CASETAG_GET_PER_PAGE_SUCCESS,
    payload: { list },
  });
  export const getCaseTagPerPageError = (error) => ({
    type: CASETAG_GET_PER_PAGE_ERROR,
    payload: { error },
  });
  
  export const getCaseTagCount = () => ({
    type: CASETAG_COUNT_GET,
  });
  export const getCaseTagCountSuccess = (data) => ({
    type: CASETAG_COUNT_GET_SUCCESS,
    payload: { data },
  });
  export const getCaseTagCountError = (error) => ({
    type: CASETAG_COUNT_GET_ERROR,
    payload: { error },
  });
  
  export const addCaseTag = (body) => ({
    type: CASETAG_ADD,
    payload: { body },
  });
  export const addCaseTagSuccess = (data) => ({
    type: CASETAG_ADD_SUCCESS,
    payload: { data },
  });
  export const addCaseTagError = (error) => ({
    type: CASETAG_ADD_ERROR,
    payload: { error },
  });
  
  export const editCaseTag = (id, body) => ({
    type: CASETAG_EDIT,
    payload: { id, body },
  });
  export const editCaseTagSuccess = (data) => ({
    type: CASETAG_EDIT_SUCCESS,
    payload: { data },
  });
  export const editCaseTagError = (error) => ({
    type: CASETAG_EDIT_ERROR,
    payload: { error },
  });