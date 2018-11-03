import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logOut } from '../actions/auth';

class Header extends Component {
    renderAuth() {
        if (this.props.auth.user) {
            return (
                <li>
                    <Link to={'/'} className="waves-effect waves-light btn-small grey lighten-1" onClick={this.props.logOut}>
                        Log out
                    </Link>&nbsp;
                </li>
            );
        }
        return;
    }

    render() {
        return (
            <nav className="deep-orange darken-3">
                <div className="nav-wrapper">
                &nbsp;
                    <Link
                        to={'/'}
                        className="brand-logo"
                    >Cats
                    </Link>
                    <ul className="right">
                        <li>{<Link to={'/top'}>Top Cats</Link>}</li>
                        <li>{this.props.auth.user && <Link to={'/stats'}>Your Stats</Link>}</li>
                        {this.renderAuth()}
                    </ul>
                </div>
            </nav>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth }
}

export default connect(mapStateToProps, { logOut })(Header);