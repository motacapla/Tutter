import React, { Component } from 'react';
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {API_SERVER_HOST_URL} from './Config';
import LoadingScreen from './LoadingScreen';

class Converter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }

    uploadFile(event) {
        let files = event.target.files;
        let createObjectURL = (window.URL || window.webkitURL).createObjectURL || window.createObjectURL;
        this.setState({
          file: files[0],
          originalImage: {
            filename: "originalImage",
            url: createObjectURL(files[0]),
            isSelected: false
          }
        }, () => {
          this.sendFile();
        });
    };

    sendFile() {
        this.setState({isLoading: true});
        const params = new FormData();
        params.append('file', this.state.file);
        axios
          .post(
            API_SERVER_HOST_URL + '/v1/image',
            params,
            {
              headers: {
                'content-type': 'multipart/form-data',
              },
            }
          )
          .then(response => {
            this.setState({isLoading: false});
            this.setState({isUploaded: true});
            this.receiveFiles(response.data['filenameList']);
          })
          .catch(() => {
            this.setState({isLoading: false});
            console.log('sendFile failed');
          });
    }

    receiveFiles(filenameList) {
      axios
      .get(API_SERVER_HOST_URL + '/v1/images?filenameList=' + filenameList.join(','))
      .then(response => {
        this.setState({images: response.data.images.map(
          (image, index) => {
            return {
              filename: "convertedImage"+index, 
              url: image.url,
              isSelected: false
            }
          }
          )});
      })
      .catch(() => {
        console.log('receiveFile failed');
      }); 
    }

    handleClick(event) {
      this.setFilename(event.target.value);
      this.setOpenTweetDescription();
      this.setIsSelected(event.target.value);
    }

    setFilename(url) {
      return this.props.setFilename(url);      
    }

    setOpenTweetDescription() {
      return this.props.setOpenTweetDescription(true);
    }

    setIsSelected(url) {
      if (this.state.originalImage.url == url) {
        this.state.originalImage.isSelected = true;
        for (var i in this.state.images) {
            this.state.images[i].isSelected = false;          
        }
      } else {
        this.state.originalImage.isSelected = false;
        for (var i in this.state.images) {
          if (this.state.images[i].url == url) {
            this.state.images[i].isSelected = true;
          } else {
            this.state.images[i].isSelected = false;
          }
        }
      }      
    }

    getUrl(filename) {
      if (this.state.originalImage.filename == filename) {
        return this.state.originalImage.url;
      } else {
        for (var i in this.state.images) {
          if (this.state.images[i].filename == filename) {
            return this.state.images[i].url;
          }
        }
      } 
    }

    render() {
        let loadScreen = this.state.isLoading ? <LoadingScreen /> : null
        let originalImage, convertedImages = [];
        if (this.state.isUploaded) {
          originalImage = 
          <Col xs={6} md={4}>
            <div className={this.state.originalImage.isSelected ? "SelectedImageButton" : "UnselectedImageButton"}>
            <Image src={this.state.originalImage.url} thumbnail />
            <Button variant="primary" value={this.getUrl("originalImage")} onClick={this.handleClick}>選択</Button>
            </div>
          </Col>          
          for (var i in this.state.images){
            convertedImages.push(
              <Col xs={6} md={4}>
                <div className={this.state.images[i].isSelected ? "SelectedImageButton" : "UnselectedImageButton"}>
                <Image src={this.state.images[i].url} thumbnail />
                <Button variant="primary" value={this.getUrl("convertedImage"+i)} onClick={this.handleClick}>選択</Button>
                </div>
              </Col>
            );
          }
        }        
        return(
            <div className="Converter">
                <form method="POST" encType="multipart/form-data">
                    <input type="file" name="image" accept="image/png, image/jpeg" onChange={this.uploadFile.bind(this)} />
                </form> 
                {loadScreen}               
                <Container className="ImageContainer">
                  <Row>
                    {originalImage}
                    {convertedImages}
                  </Row>
                </Container>
            </div>
        );
    }
}
export default Converter;