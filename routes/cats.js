const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const provideCats = require('./helpers').provideCats;
const recordVoting = require('./helpers/voting').recordVoting;
const { getCatDocs, alterVotes } = require('./helpers');

const Cat = mongoose.model('Cat');
const Vote = mongoose.model('Vote');

module.exports = app => {
    app.get('/api/moreCats', requireLogin, provideCats); // returns new random or previously used pair

    app.post('/api/vote', requireLogin, async (req, res) => {
        provideCats(req, res); // returns new random or previously used pair
        recordVoting(req); // records all data connected to users voting
    });

    app.get('/api/topCats', async (req, res) => {
        const paginationLimit = !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 100;
        const cats = await Cat.find({})
            .sort({ voted: -1 })
            .sort({ lastVoting: -1 })
            .skip(parseInt(req.query.skip))
            .limit(paginationLimit + 1)
        // adjust response for pagination
        const more = cats.length === paginationLimit + 1;
        more && cats.pop();
        res.send({ cats, more });
    });

    app.get('/api/stats', requireLogin, async (req, res) => {
        const paginationLimit = !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 100;
        const validSortFields = ["winnerVotes", "createdAt", "lastUpdate"];
        const sortBy = req.query.sortBy && validSortFields.includes(req.query.sortBy) ? req.query.sortBy : validSortFields[0];

        // get all user votes per request criteria
        let votes = await Vote.find({ _user: req.user._id}).lean()
            .skip(parseInt(req.query.skip))
            .limit(paginationLimit + 1)
            .sort({ [sortBy]: -1 })

        const cats = await getCatDocs(votes) // retrieves all Cat documents referred in user votes
        votes = alterVotes(votes, cats) // adjusts response with data from Cat documents
        // adjust response for pagination
        const more = votes.length === paginationLimit + 1;
        more && votes.pop();

        const numberOfPairs = votes.length;
        const numberOfVotes = req.user.votesCount;
        res.send({ votes, numberOfPairs, numberOfVotes, more });
    });
}

