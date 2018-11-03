const axios = require('axios');
const _ = require('lodash');
const mongoose = require('mongoose');
const { catApiKey } = require('../../config');

const Cat = mongoose.model('Cat');
const Vote = mongoose.model('Vote');

function getRandomPair() {
    const url = 'https://api.thecatapi.com/v1/images/search';
    const options = {
        headers: {
            "Content-Type": "application/json",
            "x-api-key": catApiKey
        }
    };
    return Promise.all([
        axios.get(url, options),
        axios.get(url, options)
    ]);
}

async function provideCats(req, res) {
    let cats;
    const random = Math.random() > 0.5;
    // reuse previous cat pair
    if (req.user.votesCount > 10 && random) {
        const vote = await Vote.aggregate([{ $sample: { size: 1 } }]);
        const catRecords = vote.length > 0 ? await Cat.find({ _id: { $in: vote[0].cats.map(({ _cat }) => _cat) } }) : [];
        cats = catRecords.map(cat => Object.assign({}, cat._doc, { reused: vote[0]._id.toString() }));
    }
    // create new random pair
    else {
        cats = await getRandomPair();
        const names = await axios.get('https://uinames.com/api/?amount=2');
        cats = cats.map((cat, i) => {
            cat.data[0].name = names.data[i].name;
            return cat.data[0];
        });
    }
    res.send(cats);
}

function getCatDocs(votes) {
    // retrieves all Cat documents referred in user votes, to be used by alterVotes function
    const catIds = _.chain(votes)
        .reduce((acc, { cats }) => acc.concat(cats), []) //retrieve an array of all cats soted in votes
        .uniqBy('_cat') // filter duplicates
        .map(({ _cat }) => _cat) // retrieve array of _cat only ( _cat is a _id refference to Cat schema)
        .value();
    return Cat.find({ _id: { $in: catIds } });
}

function alterVotes(votes, cats) {
    // adjusts vote cats with data from Cat documents - retrieved by getCatDocs function
    const fieldsToGet = ["url", "name"];
    return votes.map(vote => {
        vote.cats.forEach(catRef => {
            const catDoc = cats.find(cat => cat._id.equals(catRef._cat));
            fieldsToGet.forEach(field => {
                catRef[field] = catDoc[field]
            })
        })
        return vote;
    });
}

module.exports = {
    provideCats,
    getCatDocs,
    alterVotes
}