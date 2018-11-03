import axios from 'axios';
import { getCats } from './index';

export const logOut = () => async dispatch => {
    await axios.get('/api/logout');
    dispatch({ type: 'set_user', payload: null });
}

export const logIn = user => async dispatch => {
    const config = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: user
    }
    axios.request('/api/login', config)
    .then(resp => {
        // successfull login
        dispatch({ type: 'set_user', payload: resp.data });
        // retrieve cat pair
        dispatch({ type: 'toggle_loading' });
        dispatch(getCats());
    })
    .catch(resp => {
        dispatch({type: 'error', payload: resp.response.data.message})
    })
}

export const fetchUser = () => async dispatch => {
    const res = await axios.get('/api/current_user');
    !res.data && dispatch({ type: 'toggle_loading_off' });
    dispatch({ type: 'set_user', payload: res.data });
}

