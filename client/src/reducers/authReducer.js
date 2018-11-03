export default function (state = { user: null, error: null }, action) {
    switch (action.type) {
        case 'set_user':
            return Object.assign({}, state, {
                user: action.payload,
                error: null
            })
        case 'error':
            return Object.assign({}, state, {
                error: action.payload
            });
        default:
            return state;
    }
}
