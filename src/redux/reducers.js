import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import authUser from './auth/reducer';
import people from './people/reducer';
import category from './category/reducer';
import caseTag from './case-tag/reducer';
import metaFields from './meta-fields/reducer';

const reducers = combineReducers({
  menu,
  settings,
  authUser,
  people,
  category,
  caseTag,
  metaFields,
});

export default reducers;
