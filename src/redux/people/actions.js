import {
  PEOPLE_ADD,
  PEOPLE_ADD_ERROR,
  PEOPLE_ADD_SUCCESS, PEOPLE_CASE_ADD, PEOPLE_CASE_ADD_ERROR, PEOPLE_CASE_ADD_SUCCESS,
  PEOPLE_CASE_GET,
  PEOPLE_CASE_GET_ERROR,
  PEOPLE_CASE_GET_SUCCESS,
  COMBINED_CASE_GET,
  COMBINED_CASE_GET_ERROR,
  COMBINED_CASE_GET_SUCCESS,
  PEOPLE_COUNT_GET,
  PEOPLE_COUNT_GET_ERROR,
  PEOPLE_COUNT_GET_SUCCESS,
  PEOPLE_EDIT,
  PEOPLE_EDIT_ERROR,
  PEOPLE_EDIT_SUCCESS,
  PEOPLE_GET,
  PEOPLE_GET_ERROR,
  PEOPLE_GET_SUCCESS,
  PEOPLE_GET_PER_PAGE,
  PEOPLE_GET_PER_PAGE_ERROR,
  PEOPLE_GET_PER_PAGE_SUCCESS,
  PEOPLE_CASE_EDIT, PEOPLE_CASE_EDIT_ERROR, PEOPLE_CASE_EDIT_SUCCESS,
  COMBINED_CASE_ADD, COMBINED_CASE_ADD_ERROR, COMBINED_CASE_ADD_SUCCESS,
  COMBINED_CASE_EDIT, COMBINED_CASE_EDIT_ERROR, COMBINED_CASE_EDIT_SUCCESS,
  COMBINED_CASE_REMOVE, COMBINED_CASE_REMOVE_ERROR, COMBINED_CASE_REMOVE_SUCCESS
} from '../actions';

export const getPeople = (filter, fetchCount = false) => ({
  type: PEOPLE_GET,
  payload: { filter, fetchCount },
});
export const getPeopleSuccess = (list) => ({
  type: PEOPLE_GET_SUCCESS,
  payload: { list },
});
export const getPeopleError = (error) => ({
  type: PEOPLE_GET_ERROR,
  payload: { error },
});

export const getPeoplePerPage = (limit, skip) => ({
  type: PEOPLE_GET_PER_PAGE,
  payload: { limit, skip },
});
export const getPeoplePerPageSuccess = (list) => ({
  type: PEOPLE_GET_PER_PAGE_SUCCESS,
  payload: { list },
});
export const getPeoplePerPageError = (error) => ({
  type: PEOPLE_GET_PER_PAGE_ERROR,
  payload: { error },
});


export const getPeopleCount = () => ({
  type: PEOPLE_COUNT_GET,
});
export const getPeopleCountSuccess = (data) => ({
  type: PEOPLE_COUNT_GET_SUCCESS,
  payload: { data },
});
export const getPeopleCountError = (error) => ({
  type: PEOPLE_COUNT_GET_ERROR,
  payload: { error },
});

export const getPeopleCases = (id) => ({
  type: PEOPLE_CASE_GET,
  payload: { id },
});
export const getPeopleCasesSuccess = (data) => ({
  type: PEOPLE_CASE_GET_SUCCESS,
  payload: { data },
});
export const getPeopleCasesError = (error) => ({
  type: PEOPLE_CASE_GET_ERROR,
  payload: { error },
});

export const addCase = (body) => ({
  type: PEOPLE_CASE_ADD,
  payload: { body },
});
export const addCaseSuccess = (data) => ({
  type: PEOPLE_CASE_ADD_SUCCESS,
  payload: { data },
});
export const addCaseError = (error) => ({
  type: PEOPLE_CASE_ADD_ERROR,
  payload: { error },
});

export const addPeople = (body) => ({
  type: PEOPLE_ADD,
  payload: { body },
});
export const addPeopleSuccess = (data) => ({
  type: PEOPLE_ADD_SUCCESS,
  payload: { data },
});
export const addPeopleError = (error) => ({
  type: PEOPLE_ADD_ERROR,
  payload: { error },
});

export const editPeople = (id, body) => ({
  type: PEOPLE_EDIT,
  payload: { id, body },
});
export const editPeopleSuccess = (data) => ({
  type: PEOPLE_EDIT_SUCCESS,
  payload: { data },
});
export const editPeopleError = (error) => ({
  type: PEOPLE_EDIT_ERROR,
  payload: { error },
});

export const editCase = (id, body) => ({
  type: PEOPLE_CASE_EDIT,
  payload: { id, body },
});
export const editCaseSuccess = (data) => ({
  type: PEOPLE_CASE_EDIT_SUCCESS,
  payload: { data },
});
export const editCaseError = (error) => ({
  type: PEOPLE_CASE_EDIT_ERROR,
  payload: { error },
});

export const getCombinedCases = (id) => ({
  type: COMBINED_CASE_GET,
  payload: { id },
});
export const getCombinedCasesSuccess = (data) => ({
  type: COMBINED_CASE_GET_SUCCESS,
  payload: { data },
});
export const getCombinedCasesError = (error) => ({
  type: COMBINED_CASE_GET_ERROR,
  payload: { error },
});

export const addCombinedCase = (body) => ({
  type: COMBINED_CASE_ADD,
  payload: { body },
});
export const addCombinedCaseSuccess = (data) => ({
  type: COMBINED_CASE_ADD_SUCCESS,
  payload: { data },
});
export const addCombinedCaseError = (error) => ({
  type: COMBINED_CASE_ADD_ERROR,
  payload: { error },
});

export const editCombinedCase = (id, body) => ({
  type: COMBINED_CASE_EDIT,
  payload: { id, body },
});
export const editCombinedCaseSuccess = (data) => ({
  type: COMBINED_CASE_EDIT_SUCCESS,
  payload: { data },
});
export const editCombinedCaseError = (error) => ({
  type: COMBINED_CASE_EDIT_ERROR,
  payload: { error },
});

export const removeCombinedCase = (id) => ({
  type: COMBINED_CASE_REMOVE,
  payload: { id },
});
export const removeCombinedCaseSuccess = (data) => ({
  type: COMBINED_CASE_REMOVE_SUCCESS,
  payload: { data },
});
export const removeCombinedCaseError = (error) => ({
  type: COMBINED_CASE_REMOVE_ERROR,
  payload: { error },
});
