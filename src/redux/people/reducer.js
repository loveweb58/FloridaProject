import {
  PEOPLE_COUNT_GET,
  PEOPLE_GET_ERROR,
  PEOPLE_GET_SUCCESS,
  PEOPLE_GET,
  PEOPLE_ADD_SUCCESS,
  PEOPLE_ADD_ERROR,
  PEOPLE_COUNT_GET_ERROR,
  PEOPLE_COUNT_GET_SUCCESS,
  PEOPLE_EDIT_SUCCESS,
  PEOPLE_CASE_GET,
  PEOPLE_CASE_GET_SUCCESS,
  PEOPLE_CASE_GET_ERROR,
  PEOPLE_CASE_ADD_SUCCESS,
  PEOPLE_GET_PER_PAGE,
  PEOPLE_GET_PER_PAGE_SUCCESS,
  PEOPLE_GET_PER_PAGE_ERROR,
  PEOPLE_CASE_EDIT_SUCCESS,
  COMBINED_CASE_GET,
  COMBINED_CASE_GET_SUCCESS,
  COMBINED_CASE_GET_ERROR,
  COMBINED_CASE_ADD_SUCCESS,
  COMBINED_CASE_EDIT_SUCCESS,
  COMBINED_CASE_REMOVE_SUCCESS,
} from '../actions';

const INIT_STATE = {
  peopleCount: 0,
  peopleList: [],
  perpagelist: [],
  error: null,
  peopleListLoading: false,
  cases: [],
  combinedCases: [],
  loading: false,
  caseLoading: false,
  caseError: false,
};

export default (state = INIT_STATE, { type, payload }) => {
  switch (type) {
    case PEOPLE_COUNT_GET:
      return { ...state, loading: true, error: '', peopleCount: 0 };
    case PEOPLE_COUNT_GET_ERROR:
      return { ...state, loading: false, error: payload.error, peopleCount: 0 };
    case PEOPLE_COUNT_GET_SUCCESS:
      return { ...state, loading: false, error: '', peopleCount: payload.data.count };
    case PEOPLE_GET:
      return { ...state, loading: true, error: '' };
    case PEOPLE_GET_ERROR:
      return { ...state, loading: false, error: payload.error };
    case PEOPLE_GET_SUCCESS:
      return { ...state, loading: false, error: '', peopleList: payload.list };
    case PEOPLE_ADD_ERROR:
      return { ...state, error: payload.error };
    case PEOPLE_ADD_SUCCESS:
      return { ...state, peopleList: [...state.peopleList, payload.data], peopleCount: state.peopleCount + 1 };
    case PEOPLE_CASE_GET:
      return { ...state, caseLoading: true, cases: [], caseError: false };
    case PEOPLE_CASE_GET_SUCCESS:
      return { ...state, caseLoading: false, cases: payload.data, caseError: false };
    case PEOPLE_CASE_GET_ERROR:
      return { ...state, caseLoading: false, caseError: true, cases: payload.data };
    case PEOPLE_CASE_ADD_SUCCESS:
      return { ...state, cases: [...state.cases, payload.data] };
    case PEOPLE_CASE_EDIT_SUCCESS:
      const newCases = state.cases.map((caseItem) => {
        if (caseItem.id === payload.data.id) {
          return payload.data;
        }
        return caseItem;
      });
      return { ...state, error: '', cases: newCases };
    case PEOPLE_EDIT_SUCCESS:
      const newList = state.peopleList.map((person) => {
        if (person.id === payload.data.id) {
          return payload.data;
        }
        return person;
      });
      return { ...state, error: '', peopleList: newList };
    case PEOPLE_GET_PER_PAGE:
      return { ...state, loading: true, error: '' };
    case PEOPLE_GET_PER_PAGE_ERROR:
      return { ...state, loading: false, error: payload.error };
    case PEOPLE_GET_PER_PAGE_SUCCESS:
      return { ...state, loading: false, error: '', perpagelist: payload.list };
    case COMBINED_CASE_GET:
      return { ...state, caseLoading: true, combinedCases: [], caseError: false };
    case COMBINED_CASE_GET_SUCCESS:
      return { ...state, caseLoading: false, combinedCases: payload.data, caseError: false };
    case COMBINED_CASE_GET_ERROR:
      return { ...state, caseLoading: false, caseError: true, combinedCases: payload.data };
    case COMBINED_CASE_ADD_SUCCESS:
      return { ...state, combinedCases: [...state.combinedCases, payload.data] };
    case COMBINED_CASE_EDIT_SUCCESS:
      const newCombinedCases = state.combinedCases.map((caseItem) => {
        if (caseItem.id === payload.data.id) {
          return payload.data;
        }
        return caseItem;
      });
      return { ...state, error: '', combinedCases: newCombinedCases };
    case COMBINED_CASE_REMOVE_SUCCESS:
      return {
        ...state,
        error:false,
      }
    default:
      return { ...state };
  }
};
