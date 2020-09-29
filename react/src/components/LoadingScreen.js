import React, { Component } from "react";
import Spinner from 'react-bootstrap/Spinner';

class LoadingScreen extends Component {
    render() {
        return (
            <Spinner animation="border" variant="dark" role="status" className="LoadingScreen">
              <span className="sr-only">Loading...</span>
            </Spinner>
        );
    }
}

export default LoadingScreen;