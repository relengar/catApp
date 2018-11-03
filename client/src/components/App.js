import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/auth';

import Header from './Header';
import Voting from './Voting';
import TopCats from './TopCats';
import Stats from './Stats';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render () {
    return (
      <>
        <BrowserRouter>
          <div className="container" style={{paddingBottom: '20px'}}>
            <Header />          
            <Route exact path="/" component={Voting} />
            <Route exact path="/top" component={TopCats} />
            <Route exact path="/stats" component={Stats} />
          </div>
        </BrowserRouter>
      </>
    );
  }
}

export default connect(null, actions)(App);