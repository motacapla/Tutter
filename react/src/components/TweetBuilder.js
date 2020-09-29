import React, { Component } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Collapse from 'react-bootstrap/Collapse';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import {API_SERVER_HOST_URL} from './Config';
import Converter from './Converter';
import TwitterProfile from './TwitterProfile';

class TweetBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible : false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFilename = this.setFilename.bind(this);
    this.setOpenTweetDescription = this.setOpenTweetDescription.bind(this);
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

        axios
        .post(API_SERVER_HOST_URL + "/v1/tweet", params, {withCredentials: true})
          .then(() => {
            alert("投稿しました!\n 自動的に戻ります");
          })
          .catch(() => {
            alert('投稿できませんでした\n 再度ログインしてお試しください');
            console.log('handleSubmit failed');
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

  setOpenTweetDescription(bool) {
    this.setState({openTweetDescription: bool});
  }

  setOpenTweetForm () {
    this.setState({openTweetForm: !this.state.openTweetForm});
  }

  getOpenTweetForm () {
    return this.state.openTweetForm;
  }

  render() {
    return (
      <div className="TweetBody">   
      <TwitterProfile />
      <Card>
        <Image className="TweetCardImage" src={`${process.env.PUBLIC_URL}/Tutter-content-tweet-button.jpg`} />
        
        <Card.Body
                onClick={() => this.setOpenTweetForm()}
                aria-expanded={this.state.openTweetForm}
        >
          <Card.Title className="TweetCardTitle"><h1>ツイートする</h1></Card.Title>
          <Card.Text className="TweetCardText">
            アップロードした画像は自動的に変換され、ツイートに添付されます
          </Card.Text>
        </Card.Body>
        <Collapse in = {this.state.openTweetForm}>
        <div className="TweetForm">
          <div className="ImageForm">
            <h2 className="ImageFormTitle">1. 画像を選択</h2>
            <Converter setFilename={this.setFilename} setOpenTweetDescription={this.setOpenTweetDescription} />
          </div>
          <div className="DescriptionForm">
          <Collapse in = {this.state.openTweetDescription}>
          <form onSubmit={this.handleSubmit}>
            <div className="TextArea">
              <Form>
                <Form.Group controlId="ControlTextarea1">
                  <Form.Label><h2>2. ツイート内容</h2></Form.Label>
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
      </Card>
      </div>
    );
  }  
}
export default TweetBuilder;