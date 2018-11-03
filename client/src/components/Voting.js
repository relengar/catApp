import React, { Component } from "react";
import { connect } from 'react-redux';
import { getCats, vote } from '../actions';
import Spinner from './sub/Spinner';

import LoginForm from './sub/LoginForm';

class Voting extends Component {
  constructor(props) {
    super(props);
    this.handleVote = this.handleVote.bind(this);
    this.state = { cats: this.props.cats.toVote }
  }

  componentDidMount() {
    this.props.cats.toVote.length < 1 && this.props.getCats()
  }

  handleVote(evt) {
    const catPair = this.props.cats.toVote.map(cat => {
      cat.voted = cat.id === evt.target.id;
      return cat;
    });
    this.props.vote(catPair);   
  }

  renderCats() {
    return this.props.cats.toVote.map(cat => {
      return (
        <div key={cat.id} className="col s6">
          <div className="card hoverable">
            <div className="center-align card-action">
              <button id={cat.id} onClick={this.handleVote} className="btn waves-effect waves-light green" type="submit" name="action">Vote
                <i className="material-icons">check</i>
              </button>
              <h5 className="center-align">{cat.name}</h5>
            </div>
            <div className="card-image">
              <img src={cat.url} />
            </div>
          </div>
        </div>
      );
    })
  }

  render() {
    return (
        <div className="row">
          {!this.props.cats.loading && this.props.auth.user ? this.renderCats() : !this.props.cats.loading && <LoginForm />}
          {this.props.cats.loading && <Spinner />}
        </div>
    );
  }
}

function mapStatetoProps({ cats, auth }) {
  return { cats, auth }
}

export default connect(mapStatetoProps, { getCats, vote })(Voting);
