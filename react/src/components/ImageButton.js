import React, { Component } from 'react';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

class ImageButton extends Component {
    render(value) {
        return(
            <Col xs={6} md={4}>
                <Image src={this.state.images[i].url} thumbnail />
                <Button variant="primary" value={value} onClick={this.handleClick}>選択</Button>
            </Col>
        )
    }
}
export default ImageButton;