import React, { Component } from 'react';
import axios from 'axios';
import Converter from './Converter';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import {API_SERVER_HOST_URL} from './Config';

class TweetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible : false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFilename = this.setFilename.bind(this);
  }

  openModal() {
    this.setState({
        visible : true
    });
  }
    
  closeModal() {
    this.setState({
        visible : false
    });
  }

  handleChange (event) {
    this.setState({text: event.target.value});
  }

  handleSubmit (event) {
    let description = this.state.text
      axios
      .get(API_SERVER_HOST_URL + "/v1/twitterCredentials", {withCredentials: true})
      .then(response => {
        const params = new FormData();
        params.append('accessToken', response.data['accessToken']);
        params.append('secret', response.data['secret']);
        params.append('description', description);
        params.append('filename', this.state.filename); 

        console.log()

        axios
        .post(API_SERVER_HOST_URL + "/v1/tweet", params)
          .then(() => {
            alert("投稿しました!\n 自動的に戻ります");
          })
          .catch(() => {
            console.log('handleSubmit failed');
            alert('投稿できませんでした\n 再度ログインしてお試しください');
          });
      })
      .catch(() => {
        alert('投稿できませんでした\n 再度ログインしてお試しください');
        console.log('twitterCredentials failed');
      });
      event.preventDefault();
      this.setState({text: ""});
      setTimeout(() => {
        window.location.reload(true);
      }, 5000);
  }

  setFilename (filename) {
    this.setState({filename: filename});
  }

  setOpenTweetForm () {
    this.setState({openTweetForm: !this.state.openTweetForm});
  }

  render() {
    return (
      <div className="TweetBody">      
      <button className="BackgroundBlue Button"
        onClick={() => this.setOpenTweetForm()}
        aria-expanded={this.state.openTweetForm}
      >
        ツイートする
      </button>
      <Collapse in = {this.state.openTweetForm}>
        <div className="TweetForm">
          <div className="ImageForm">
            <h3>投稿画像を選択</h3>
            <Converter setFilename = {this.setFilename} />
          </div>
          <div className="DescriptionForm">
          <Collapse in = {this.state.filename}>
          <form onSubmit={this.handleSubmit}>
            <div className="TextArea">
              <Form>
                <Form.Group controlId="ControlTextarea1">
                  <Form.Label><h3>ツイートの投稿内容 (140字以内)</h3></Form.Label>
                  <Form.Control as="textarea" rows="3" onChange={this.handleChange} />
                </Form.Group>
              </Form>
            </div>
            <button className="BackgroundOrange Button" type="submit">投稿！</button>
          </form>
          </Collapse>
          </div>          
        </div>
      </Collapse>
      </div>
    );
  }  
}
export default TweetModal;