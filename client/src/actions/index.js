import axios from 'axios';

export const getCats = () => async dispatch => {
    dispatch({ type: 'toggle_loading' });
    const res = await axios.get('/api/moreCats');
    dispatch({ type: 'get_cats', payload: res.data });
};

export const vote = cats => async dispatch => {
    dispatch({ type: 'toggle_loading' });
    const options = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: cats
    }
    const res = await axios.request('/api/vote', options);
    dispatch({ type: 'get_cats', payload: res.data }); // new cat pair is returned after voting
};

export const getTopCats = (skip, limit, reset) => async dispatch => {
    dispatch({ type: 'toggle_loading'});
    const type = reset ? 'top_cats_reset' : 'top_cats';
    const resp = await axios.get(`/api/topCats?skip=${skip}&limit=${limit}`); //skip and limit parsed from component control pagination
    dispatch({ type, payload: resp.data });
};

export const getStats = (skip, limit, sortBy, reset) => async dispatch => {
    const type = reset ? 'stats_reset' : 'stats'; // reset flag indicates user selected new sortBy so  the pagination is reset
    dispatch({ type: 'toggle_loading'});
    const resp = await axios.get(`/api/stats?skip=${skip}&limit=${limit}&sortBy=${sortBy}`);
    dispatch({ type, payload: resp.data });
}


