import {
    CASETAG_GET,
    CASETAG_COUNT_GET_ERROR,
    CASETAG_COUNT_GET_SUCCESS,
    CASETAG_COUNT_GET,
    CASETAG_GET_ERROR,
    CASETAG_GET_SUCCESS,
    CASETAG_ADD_ERROR,
    CASETAG_ADD_SUCCESS,
    CASETAG_EDIT_SUCCESS,
    CASETAG_GET_PER_PAGE,
    CASETAG_GET_PER_PAGE_SUCCESS,
    CASETAG_GET_PER_PAGE_ERROR,
  } from '../actions';
  
  const INIT_STATE = {
    caseTagCount: 0,
    caseTagList: [],
    perpagelist: [],
    error: null,
    loading: false,
    caseTagListLoading: false,
  };
  
  export default (state = INIT_STATE, { type, payload }) => {
    switch (type) {
      case CASETAG_COUNT_GET:
        return { ...state, loading: true, error: '', caseTagCount: 0 };
      case CASETAG_COUNT_GET_ERROR:
        return { ...state, loading: false, error: payload.error, caseTagCount: 0 };
      case CASETAG_COUNT_GET_SUCCESS:
        return { ...state, loading: false, error: '', caseTagCount: payload.data.count };
      case CASETAG_GET:
        return { ...state, loading: true, error: '' };
      case CASETAG_GET_ERROR:
        return { ...state, loading: false, error: payload.error };
      case CASETAG_GET_SUCCESS:
        return { ...state, loading: false, error: '', caseTagList: payload.list };
      case CASETAG_ADD_ERROR:
        return { ...state, error: payload.error };
      case CASETAG_ADD_SUCCESS:
        return { ...state, caseTagList: [...state.caseTagList, payload.data], caseTagCount: state.caseTagCount + 1 };
      case CASETAG_EDIT_SUCCESS:
        return {
          ...state,
          error: '',
          caseTagList: state.caseTagList.map((caseTag) => {
            if (caseTag.id === payload.data.id) {
              return payload.data;
            }
            return caseTag;
          }),
        };
      case CASETAG_GET_PER_PAGE:
        return { ...state, loading: true, error: '' };
      case CASETAG_GET_PER_PAGE_ERROR:
        return { ...state, loading: false, error: payload.error };
      case CASETAG_GET_PER_PAGE_SUCCESS:
        return { ...state, loading: false, error: '', perpagelist: payload.list };
    
      default:
        return { ...state };
    }
  };
  