import { combineReducers } from 'redux';
import catsReducer from './catsReducer';
import authReducer from './authReducer';

export default combineReducers({
    cats: catsReducer,
    auth: authReducer
});
