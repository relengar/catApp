import React, { Component } from "react";
import { connect } from 'react-redux';
import { getTopCats } from '../actions';
import MoreButton from './sub/MoreButton';
import Spinner from './sub/Spinner';

class TopCats extends Component {
    constructor(props) {
        super(props);
        this.getMoreCats = this.getMoreCats.bind(this);
        this.state = { skip: 0, limit: 5 }
    }

    componentDidMount() {
        const { skip, limit } = this.state;
        this.props.getTopCats(skip, limit, true);
    }

    getMoreCats() {
        const limit = this.state.limit;
        const skip = this.state.skip + limit;
        this.setState({ skip });
        this.props.getTopCats(skip, limit, false);
    }

    renderCatList() {
        return this.props.cats.top.map(cat => {
            return (
                <div key={cat.id} className="col s12 m7">
                    <div className="card horizontal">
                        <div className="card-image">
                            <img src={cat.url} />
                        </div>
                        <div className="card-stacked">
                            <div className="card-content">
                                <ul>
                                    <li><h5 className="center-align">{cat.name}</h5></li>
                                    <li>Has <strong className="green-text">{cat.voted}</strong> votes</li>
                                    {cat.lastVoting && <li>Last time voted for on:<br /><strong className="green-text">{new Date(cat.lastVoting).toLocaleString()}</strong></li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }

    render() {
        const { moreTops, loading } = this.props.cats;
        return (
            <div className="container">
            <h2 className="center-align">All the cats</h2>
                {this.renderCatList()}
                {loading ? <Spinner/> : <MoreButton displayMore={moreTops} callback={this.getMoreCats}/>}
            </div>
        );
    }
}

function mapStatetoProps({ cats }) {
    return { cats }
  }

export default connect(mapStatetoProps, { getTopCats })(TopCats);