import React, { Component } from 'react';
import axios from 'axios';

const API_SERVER_HOST_URL = 'http://localhost:5000';
const API_IMAGE = API_SERVER_HOST_URL + '/v1/image';

class Converter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    uploadFile(event) {
        let files = event.target.files;
        let createObjectURL = (window.URL || window.webkitURL).createObjectURL || window.createObjectURL;
        this.setState({
          file: files[0],
          originalImage: createObjectURL(files[0])
        }, () => {
          this.sendFile();
        });
    };

    sendFile() {
        const params = new FormData();
        params.append('file', this.state.file);
        axios
          .post(
            API_IMAGE,
            params,
            {
              headers: {
                'content-type': 'multipart/form-data',
              },
            }
          )
          .then(response => {
            this.setState({
              savedFilename: response.data['filename']
            });
            this.setFilename();
            this.receiveFile(response.data['filename']);
          })
          .catch(() => {
            console.log('sendFile failed');
          });
      }
      receiveFile(filename) {
        axios
          .get(API_IMAGE + "/" + filename, {responseType: 'arraybuffer'})
          .then(response => {
            const base64 = btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                '',
              ),
            );
            this.setState({ convertedImage: "data:;base64," + base64 });
            console.log("receiveFile successed")
          })
          .catch(() => {
            console.log('receiveFile failed');
          });
      }

    setFilename() {
        return this.props.setFilename(this.state.savedFilename);      
    }

    render() {
        return(
            <div className="Converter">
                <form method="POST" encType="multipart/form-data">
                    <input type="file" name="image" accept="image/png, image/jpeg" onChange={this.uploadFile.bind(this)} />
                </form>
                <p>
                <img src={this.state.originalImage} width="200" />
                <img src={this.state.convertedImage} width="200" />
                </p>
            </div>
        );
    }
}
export default Converter;