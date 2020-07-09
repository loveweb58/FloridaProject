import { fork, all } from 'redux-saga/effects';
import authSagas from './auth/auth-saga';
import people from './people/people-saga';
import category from './category/category-saga';
import metaFields from './meta-fields/meta-fields-saga';
import caseTag from './case-tag/case-tag-saga';

function getWatcher(func) {
    return function*() {
        yield func;
    };
}

const allSagas = [...authSagas, ...people, ...category, ...metaFields, ...caseTag];

export default function* rootSaga(getState) {
    yield all(
        allSagas.map((saga) => {
            return fork(getWatcher(saga));
        }),
    );
}