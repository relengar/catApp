const initState = {
    toVote: [],
    top: [],
    stats: {
        votes: []
    },
    loading: true,
    moreTops: false,
    moreStats: false
};

export default function (state = initState, action) {
    switch (action.type) {
        case 'get_cats':
                return Object.assign({}, state, {
                    toVote: action.payload,
                    loading: false
                });
        case 'top_cats':
            return Object.assign({}, state, {
                top: state.top.concat(action.payload.cats.filter(cat => !state.top.includes(cat))),
                moreTops: action.payload.more,
                loading: false
            });
        case 'top_cats_reset':
            return Object.assign({}, state, {
                top: action.payload.cats,
                moreTops: action.payload.more,
                loading: false
            }); 
        case 'stats':
            //append votes stats to the currently viewed list
            const votes = state.stats.votes.concat(action.payload.votes);
            return Object.assign({}, state, {
                stats: Object.assign({}, action.payload, {votes}),
                moreStats: action.payload.more,
                loading: false
            });
        case 'stats_reset':
            // create new list of votes
            return Object.assign({}, state, {
                stats: action.payload,
                moreStats: action.payload.more,
                loading: false
            });
        case 'toggle_loading':
                return Object.assign({}, state, {
                    loading: true
                });
        case 'toggle_loading_off':
                return Object.assign({}, state, {
                    loading: false
                }); 
        default:
            return state;
    }
}
