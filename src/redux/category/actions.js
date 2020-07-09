import {
  CATEGORY_ADD,
  CATEGORY_ADD_ERROR,
  CATEGORY_ADD_SUCCESS,
  CATEGORY_COUNT_GET,
  CATEGORY_COUNT_GET_ERROR,
  CATEGORY_COUNT_GET_SUCCESS,
  CATEGORY_EDIT,
  CATEGORY_EDIT_ERROR,
  CATEGORY_EDIT_SUCCESS,
  CATEGORY_GET,
  CATEGORY_GET_ERROR,
  CATEGORY_GET_SUCCESS,
  CATEGORY_SUB_CATEGORY_GET,
  CATEGORY_SUB_CATEGORY_GET_ERROR,
  CATEGORY_SUB_CATEGORY_GET_SUCCESS,
  SUB_CATEGORY_ADD,
  SUB_CATEGORY_ADD_ERROR,
  SUB_CATEGORY_ADD_SUCCESS,
  SUB_CATEGORY_CATEGORY_GET,
  SUB_CATEGORY_CATEGORY_GET_ERROR,
  SUB_CATEGORY_CATEGORY_GET_SUCCESS,
  SUB_CATEGORY_EDIT,
  SUB_CATEGORY_EDIT_ERROR,
  SUB_CATEGORY_EDIT_SUCCESS,
  SUB_CATEGORY_CATEGORY_ARRAY_GET,
  SUB_CATEGORY_CATEGORY_ARRAY_GET_ERROR,
  SUB_CATEGORY_CATEGORY_ARRAY_GET_SUCCESS,
  CATEGORY_GET_PER_PAGE,
  CATEGORY_GET_PER_PAGE_ERROR,
  CATEGORY_GET_PER_PAGE_SUCCESS,
  SUB_CATEGORY_REMOVE,
  SUB_CATEGORY_REMOVE_ERROR,
  SUB_CATEGORY_REMOVE_SUCCESS,
} from '../actions';

export const getCategory = (filter, fetchCount = false) => ({
  type: CATEGORY_GET,
  payload: { filter, fetchCount },
});
export const getCategorySuccess = (list) => ({
  type: CATEGORY_GET_SUCCESS,
  payload: { list },
});
export const getCategoryError = (error) => ({
  type: CATEGORY_GET_ERROR,
  payload: { error },
});

export const getCategoryPerPage = (limit, skip) => ({
  type: CATEGORY_GET_PER_PAGE,
  payload: { limit, skip },
});
export const getCategoryPerPageSuccess = (list) => ({
  type: CATEGORY_GET_PER_PAGE_SUCCESS,
  payload: { list },
});
export const getCategoryPerPageError = (error) => ({
  type: CATEGORY_GET_PER_PAGE_ERROR,
  payload: { error },
});

export const getCategoryCount = () => ({
  type: CATEGORY_COUNT_GET,
});
export const getCategoryCountSuccess = (data) => ({
  type: CATEGORY_COUNT_GET_SUCCESS,
  payload: { data },
});
export const getCategoryCountError = (error) => ({
  type: CATEGORY_COUNT_GET_ERROR,
  payload: { error },
});

export const addCategory = (body) => ({
  type: CATEGORY_ADD,
  payload: { body },
});
export const addCategorySuccess = (data) => ({
  type: CATEGORY_ADD_SUCCESS,
  payload: { data },
});
export const addCategoryError = (error) => ({
  type: CATEGORY_ADD_ERROR,
  payload: { error },
});

export const addSubCategory = (id, name) => ({
  type: SUB_CATEGORY_ADD,
  payload: { id, name },
});
export const addSubCategorySuccess = (data) => ({
  type: SUB_CATEGORY_ADD_SUCCESS,
  payload: { data },
});
export const addSubCategoryError = (error) => ({
  type: SUB_CATEGORY_ADD_ERROR,
  payload: { error },
});

export const editSubCategory = (id, body) => ({
  type: SUB_CATEGORY_EDIT,
  payload: { id, body },
});
export const editSubCategorySuccess = (data) => ({
  type: SUB_CATEGORY_EDIT_SUCCESS,
  payload: { data },
});
export const editSubCategoryError = (error) => ({
  type: SUB_CATEGORY_EDIT_ERROR,
  payload: { error },
});

export const removeSubCategory = (id, catId) => ({
  type: SUB_CATEGORY_REMOVE,
  payload: { id, catId },
});
export const removeSubCategorySuccess = (data) => ({
  type: SUB_CATEGORY_REMOVE_SUCCESS,
  payload: { data },
});
export const removeSubCategoryError = (error) => ({
  type: SUB_CATEGORY_REMOVE_ERROR,
  payload: { error },
});

export const editCategory = (id, body) => ({
  type: CATEGORY_EDIT,
  payload: { id, body },
});
export const editCategorySuccess = (data) => ({
  type: CATEGORY_EDIT_SUCCESS,
  payload: { data },
});
export const editCategoryError = (error) => ({
  type: CATEGORY_EDIT_ERROR,
  payload: { error },
});

export const getCategorySubCategory = (id) => ({
  type: CATEGORY_SUB_CATEGORY_GET,
  payload: { id },
});
export const getCategorySubCategorySuccess = (data) => ({
  type: CATEGORY_SUB_CATEGORY_GET_SUCCESS,
  payload: { data },
});
export const getCategorySubCategoryError = (error) => ({
  type: CATEGORY_SUB_CATEGORY_GET_ERROR,
  payload: { error },
});

export const getSubCategoryCategory = (id) => ({
  type: SUB_CATEGORY_CATEGORY_GET,
  payload: { id },
});
export const getSubCategoryCategorySuccess = (data) => ({
  type: SUB_CATEGORY_CATEGORY_GET_SUCCESS,
  payload: { data },
});
export const getSubCategoryCategoryError = (error) => ({
  type: SUB_CATEGORY_CATEGORY_GET_ERROR,
  payload: { error },
});

export const getSubCategoryCategoryArray = (ids) => ({
  type: SUB_CATEGORY_CATEGORY_ARRAY_GET,
  payload: { ids },
});
export const getSubCategoryCategoryArraySuccess = (data) => ({
  type: SUB_CATEGORY_CATEGORY_ARRAY_GET_SUCCESS,
  payload: { data },
});
export const getSubCategoryCategoryArrayError = (error) => ({
  type: SUB_CATEGORY_CATEGORY_ARRAY_GET_ERROR,
  payload: { error },
});
