const mongoose = require('mongoose');
const Cat = mongoose.model('Cat');
const Vote = mongoose.model('Vote');

async function catAdjustments(req) {
    const pendingPromises = [];
    // from the voted pair find which cats are already stored in my db
    const catRecords = await Cat.find({ id: { $in: req.body.map(cat => cat.id) } });
    catRecords.forEach(catRecord => {
        // each stored cat has it's voted counter incremented in case it was selected
        const cat = req.body.find(cat => cat.id === catRecord.id);
        catRecord.voted += cat.voted ? 1 : 0;
        catRecord.lastVoting = cat.voted ? new Date() : catRecord.lastVoting;
        pendingPromises.push(catRecord.save())
    });
    // for remaining cats create new records with appropriately set voted counter
    const foundRecodsIds = catRecords.map(({ id }) => id);
    const newCats = req.body.filter(({ id }) => foundRecodsIds.indexOf(id) === -1); // filter cats that were not yet saved;
    newCats.forEach(({ url, id, voted, name }) => {
        const newCat = new Cat({
            name,
            url,
            id,
            voted: voted ? 1 : 0,
            lastVoting: voted ? new Date: null
        });
        pendingPromises.push(newCat.save())
    });

    return Promise.all(pendingPromises); // wait until all cat adjustments are done  - to have valid _id for vote reference
}

async function voteAdjustments(req, ready) {
    // resued flag is used todtermine if vote was reused or a new pair was created
    // create new or retrieve existing vote
    const vote = req.body[0].reused ? await Vote.findById(req.body[0].reused) : new Vote({
        _user: req.user.id,
        cats: ready.map(cat => {
            return {
                voted: 0,
                _cat: cat._id,
            }
        })
    });
    // update cats within the vote
    vote.cats.forEach(cat => {
        const catRecord = ready.find(rec => rec._id.equals(cat._cat));
        const votedCat = req.body.find(received => received.id === catRecord.id);
        cat.voted += votedCat.voted ? 1 : 0;
    });
    // set some additional data on vote
    vote.set({ lastUpdate: new Date() })
    vote.set({ voted: vote.voted + 1 })
    vote.set({ winnerVotes: vote.cats.sort((catA, catB) => catB.voted - catA.voted)[0].voted })
    return vote.save();
}

async function recordVoting(req) {
    const ready = await catAdjustments(req);
    voteAdjustments(req, ready);
    
    // //user adjustments
    req.user.votesCount++;
    req.user.save();
}

module.exports = {
    recordVoting
};