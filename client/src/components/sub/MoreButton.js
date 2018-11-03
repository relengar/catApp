import React, { Component } from "react";

const MoreButton = ({ displayMore, callback }) => {
    return (
        displayMore && 
        <div className="center-align">
            <button onClick={callback} className="teal btn-flat white-text">
                More
                <i className="material-icons right">arrow_forward</i>
            </button>
        </div>
    );
}

export default MoreButton;

