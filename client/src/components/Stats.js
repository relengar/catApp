import React, { Component } from "react";
import { connect } from 'react-redux';
import { getStats } from '../actions';
import MoreButton from './sub/MoreButton';
import Spinner from './sub/Spinner';

class Stats extends Component {
    constructor(props) {
        super(props);
        this.getMoreStats = this.getMoreStats.bind(this);
        this.sortCats = this.sortCats.bind(this);
        this.state = { skip: 0, limit: 5, sortBy: "winnerVotes" }
    }

    componentDidMount() {
        const { skip, limit, sortBy } = this.state;
        this.props.getStats(skip, limit, sortBy, true);
    }

    getMoreStats() {
        const { limit, skip, sortBy } = this.state;
        const newSkip = skip + limit; // set skip based on reset
        this.setState({ skip: newSkip }); // update state of the component
        this.props.getStats(newSkip, limit, sortBy, false);
    }

    sortCats(evt) {
        const { limit } = this.state;
        const skip = 0;
        this.setState({ skip, sortBy: evt.target.id }); // update state of the component
        this.props.getStats(skip, limit, evt.target.id, true);
    }

    renderCat(cat, vote) {
        return (
            <div key={cat._id} className="col s6">
                <div className="card">
                    <div className="card-image">
                        <img src={cat.url} />
                    </div>
                    <div className="card-content">
                        <h5 className="center-align">{cat.name}</h5>
                        <p>
                            Voted <strong className={cat.voted === vote.winnerVotes ? 'green-text' : 'red-text'}>{cat.voted}</strong> times
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    renderVotes() {
        const { stats } = this.props.cats;
        return stats.votes && this.props.cats.stats.votes.map(vote => {
            return <div key={vote._id} style={{borderRadius: '20px', padding: '10px'}} className="row orange lighten-5 hoverable">
                <div className="col s12">
                    <h5 className="center-align">{vote.cats[0].name} versus {vote.cats[1].name}</h5>
                    <ul className="collection" style={{borderRadius: '20px'}}>
                        <li className="collection-item">
                            <span className="title">Number of decisions</span><span className="secondary-content">{vote.voted}</span>
                        </li>
                        <li className="collection-item">
                            <span className="title">First time appeared</span><span className="secondary-content">{new Date(vote.createdAt).toLocaleDateString()}</span>
                        </li>
                        <li className="collection-item">
                            <span className="title">Last vote</span><span className="secondary-content">{new Date(vote.lastUpdate).toLocaleDateString()}</span>
                        </li>
                    </ul>
                    <div className="card-content">
                        {vote.cats.map(cat => this.renderCat(cat, vote))}
                    </div>
                </div>
            </div>
        });
    }

    render() {
        console.log(this.state);
        const { stats, moreStats, loading } = this.props.cats;
        return (
            <>
                <div className="container">
                    <ul className="collection">
                        <li className="collection-item">
                            <span className="title">Your total vote count:</span>
                            <span className="secondary-content">{stats.numberOfVotes}</span>
                        </li>
                        <li className="collection-item">
                            <span className="title">Number of cat pairs:</span>
                            <span className="secondary-content">{stats.numberOfPairs}</span>
                        </li>
                    </ul>
                    <div className="container">
                        <form>
                            <label>
                                <input name="sortBy" id="winnerVotes" onClick={this.sortCats} type="radio" defaultChecked />
                                <span>By votes</span>
                            </label>
                            <label>
                                <input name="sortBy" id="createdAt" onClick={this.sortCats} type="radio" />
                                <span>By created date</span>
                            </label>
                            <label>
                                <input name="sortBy" id="lastUpdate" onClick={this.sortCats} type="radio" />
                                <span>By last voting</span>
                            </label>
                        </form>
                    </div>
                </div>
                <div className="container">
                    <h4 className="center-align">Your decisions history</h4>
                    {this.renderVotes()}
                    {loading ? <Spinner/> : <MoreButton displayMore={moreStats} callback={this.getMoreStats}/>}
                </div>
            </>
        );
    }
}

function mapStateToProps({ cats }) {
    return { cats }
}

export default connect(mapStateToProps, { getStats })(Stats);