import React, { Component } from "react";
import { connect } from 'react-redux';
import { logIn } from '../../actions/auth';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};
        this.alterInput = this.alterInput.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
    }

    alterInput(evt) {
        this.setState({[evt.target.id]: evt.target.value});
    }

    handleLogIn(evt) {
        this.props.logIn(this.state);
        evt.preventDefault();
    }

    render() {
        return (
            <>
                <h4 className="center-align">Insert your nick and password.</h4>
                <form className="col s12" onSubmit={this.handleLogIn}>
                    <div className="row">
                        <div className="input-field col s6">
                            <input placeholder="Nickname" id="username" type="text" onChange={this.alterInput} />
                        </div>
                        <div className="input-field col s6">
                            <input placeholder="Password" id="password" type="password" onChange={this.alterInput} />
                        </div>
                    </div>
                    <button type="submit" className="teal btn-flat right white-text">
                        Log In / Sign Up
                        <i className="material-icons right">done</i>
                    </button>
                    {   
                        this.props.auth.error &&
                        <p className="align-center">
                            <strong className="red-text darken-2">Error: {this.props.auth.error}</strong>
                        </p>
                    }
                </form>
            </>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth }
}

export default connect(mapStateToProps, { logIn })(LoginForm)