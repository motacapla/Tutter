import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

class AppFooter extends Component {
    render() {
        return(
          <div className="AppFooter">
            <div className="FooterButton">
              <Button variant="info" href="https://twitter.com/motacapla">twitter</Button>{' '}
              <Button variant="dark" href="https://github.com/motacapla">github</Button>{' '}
            </div>
          </div>
        );
    }
}

export default AppFooter;