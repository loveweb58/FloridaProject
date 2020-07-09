import {
  CATEGORY_GET,
  CATEGORY_COUNT_GET_ERROR,
  CATEGORY_COUNT_GET_SUCCESS,
  CATEGORY_COUNT_GET,
  CATEGORY_GET_ERROR,
  CATEGORY_GET_SUCCESS,
  CATEGORY_ADD_ERROR,
  CATEGORY_ADD_SUCCESS,
  CATEGORY_EDIT_SUCCESS,
  CATEGORY_SUB_CATEGORY_GET,
  CATEGORY_SUB_CATEGORY_GET_ERROR,
  CATEGORY_SUB_CATEGORY_GET_SUCCESS,
  SUB_CATEGORY_ADD_SUCCESS,
  SUB_CATEGORY_EDIT_SUCCESS,
  SUB_CATEGORY_REMOVE_SUCCESS,
  SUB_CATEGORY_CATEGORY_GET,
  SUB_CATEGORY_CATEGORY_GET_SUCCESS,
  SUB_CATEGORY_CATEGORY_ARRAY_GET,
  SUB_CATEGORY_CATEGORY_ARRAY_GET_SUCCESS,
  CATEGORY_GET_PER_PAGE,
  CATEGORY_GET_PER_PAGE_SUCCESS,
  CATEGORY_GET_PER_PAGE_ERROR,
} from '../actions';

const INIT_STATE = {
  categoryCount: 0,
  categoryList: [],
  perpagelist: [],
  error: null,
  loading: false,
  categoryListLoading: false,
  subCategories: [],
  subCategoriesLoading: false,
  subCategoriesError: null,
  subCategoryData: {},
  subCategoryDataArray: [],
};

export default (state = INIT_STATE, { type, payload }) => {
  switch (type) {
    case CATEGORY_COUNT_GET:
      return { ...state, loading: true, error: '', categoryCount: 0 };
    case CATEGORY_COUNT_GET_ERROR:
      return { ...state, loading: false, error: payload.error, categoryCount: 0 };
    case CATEGORY_COUNT_GET_SUCCESS:
      return { ...state, loading: false, error: '', categoryCount: payload.data.count };
    case CATEGORY_GET:
      return { ...state, loading: true, error: '' };
    case CATEGORY_GET_ERROR:
      return { ...state, loading: false, error: payload.error };
    case CATEGORY_GET_SUCCESS:
      return { ...state, loading: false, error: '', categoryList: payload.list };
    case CATEGORY_ADD_ERROR:
      return { ...state, error: payload.error };
    case CATEGORY_ADD_SUCCESS:
      return { ...state, categoryList: [...state.categoryList, payload.data], categoryCount: state.categoryCount + 1 };
    case CATEGORY_EDIT_SUCCESS:
      return {
        ...state,
        error: '',
        categoryList: state.categoryList.map((category) => {
          if (category.id === payload.data.id) {
            return payload.data;
          }
          return category;
        }),
      };
    case CATEGORY_SUB_CATEGORY_GET:
      return { ...state, subCategories: [], subCategoriesLoading: true, subCategoriesError: false };
    case CATEGORY_SUB_CATEGORY_GET_ERROR:
      return { ...state, subCategories: [], subCategoriesLoading: false, subCategoriesError: true };
    case CATEGORY_SUB_CATEGORY_GET_SUCCESS:
      return { ...state, subCategories: payload.data, subCategoriesLoading: false, subCategoriesError: false };
    case SUB_CATEGORY_ADD_SUCCESS:
      return {
        ...state,
        subCategories: [...state.subCategories, payload.data],
        subCategoriesLoading: false,
        subCategoriesError: false,
      };
    case SUB_CATEGORY_EDIT_SUCCESS:
      return {
        ...state,
        error: false,
        subCategories: state.subCategories.map((cat) => {
          if (cat.id === payload.data.id) {
            return payload.data;
          }
          return cat;
        }),
      };
    case SUB_CATEGORY_REMOVE_SUCCESS:
      return {
        ...state,
        error: false,
        subCategoriesLoading: false,
        subCategoriesError: false,
      };
    case SUB_CATEGORY_CATEGORY_GET:
      return { ...state, subCategoryData: {} };
    case SUB_CATEGORY_CATEGORY_GET_SUCCESS:
      return { ...state, subCategoryData: payload.data };
    case SUB_CATEGORY_CATEGORY_ARRAY_GET:
      return { ...state, subCategoryDataArray: [] };
    case SUB_CATEGORY_CATEGORY_ARRAY_GET_SUCCESS:
      return { ...state, subCategoryDataArray:  [...state.subCategoryDataArray, payload.data] };
    case CATEGORY_GET_PER_PAGE:
      return { ...state, loading: true, error: '' };
    case CATEGORY_GET_PER_PAGE_ERROR:
      return { ...state, loading: false, error: payload.error };
    case CATEGORY_GET_PER_PAGE_SUCCESS:
      return { ...state, loading: false, error: '', perpagelist: payload.list };
  
    default:
      return { ...state };
  }
};
