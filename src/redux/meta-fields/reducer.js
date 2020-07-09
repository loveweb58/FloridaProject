import {
  METAFIELD_EDIT_SUCCESS,
  METAFIELD_ADD_SUCCESS,
  METAFIELD_ADD_ERROR,
  METAFIELD_GET_SUCCESS,
  METAFIELD_GET_ERROR,
  METAFIELD_GET,
  METAFIELD_COUNT_GET_SUCCESS,
  METAFIELD_COUNT_GET_ERROR,
  METAFIELD_COUNT_GET,
  METAFIELD_GET_PER_PAGE,
  METAFIELD_GET_PER_PAGE_SUCCESS,
  METAFIELD_GET_PER_PAGE_ERROR,
} from '../actions';

const INIT_STATE = {
  count: 0,
  list: [],
  perpagelist: [],
  error: null,
  addError: null,
  loading: false,
};

export default (state = INIT_STATE, { type, payload }) => {
  switch (type) {
    case METAFIELD_COUNT_GET:
      return { ...state, loading: true, error: '', count: 0 };
    case METAFIELD_COUNT_GET_ERROR:
      return { ...state, loading: false, error: payload.error, count: 0 };
    case METAFIELD_COUNT_GET_SUCCESS:
      return { ...state, loading: false, error: '', count: payload.data.count };
    case METAFIELD_GET:
      return { ...state, loading: true, error: '' };
    case METAFIELD_GET_ERROR:
      return { ...state, loading: false, error: payload.error };
    case METAFIELD_GET_SUCCESS:
      return { ...state, loading: false, error: '', list: payload.list };
    case METAFIELD_ADD_ERROR:
      return { ...state, addError: payload.error };
    case METAFIELD_ADD_SUCCESS:
      return { ...state, list: [...state.list, payload.data], count: state.count + 1 };
    case METAFIELD_EDIT_SUCCESS:
      return {
        ...state,
        error: '',
        list: state.list.map((mf) => {
          if (mf.id === payload.data.id) {
            return payload.data;
          }
          return mf;
        }),
      };
    case METAFIELD_GET_PER_PAGE:
      return { ...state, loading: true, error: '' };
    case METAFIELD_GET_PER_PAGE_ERROR:
      return { ...state, loading: false, error: payload.error };
    case METAFIELD_GET_PER_PAGE_SUCCESS:
      return { ...state, loading: false, error: '', perpagelist: payload.list };
    default:
      return { ...state };
  }
};
