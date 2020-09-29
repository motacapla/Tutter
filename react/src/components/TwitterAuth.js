import React, { Component } from 'react';
import firebase, { provider } from '../FirebaseConfig';
import '../App.js'
import axios from 'axios';
import TweetBuilder from './TweetBuilder';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import {API_SERVER_HOST_URL} from './Config';

class TwitterAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleLogin = this.handleLogin.bind(this);
    this.setIsLogin = this.setIsLogin.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setIsLogin(true);
      }
      else {
        this.setIsLogin(false);
      }
    })
  }

  handleLogin = () => {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var secret = result.credential.secret;

      const params = new FormData();
      params.append('accessToken', token);
      params.append('secret', secret);
      axios
      .post(API_SERVER_HOST_URL + "/v1/twitterCredentials", params, {withCredentials: true})
      .then(response => {
        console.log(response);
      })
      .catch(() => {
        console.log('twitterCredentials failed');
      });
    });
  }

  setIsLogin(bool) {
    return this.props.setIsLogin(bool);      
  }

  render() {
    if (this.props.isLogin) {
      return (
        <div className="TwitterAuthBody" style={this.props.style}>
          <TweetBuilder />
          <Card className="Card">
            <Image className="TweetCardImage" src={`${process.env.PUBLIC_URL}/Tutter-content-comingsoon-button.jpg`} />        
            <Card.Body>
              <Card.Title><h1>Comming soon...</h1></Card.Title>
              <Card.Text>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      );
    } else {
      return (
        <div style={this.props.style}>
          <button className="BackgroundBlue Button" onClick={this.handleLogin}>
            <Image className="LoginLogo" src={`${process.env.PUBLIC_URL}/Twitter_Social_Icon_Circle_Color.png`} />
            Twitterでログイン
          </button>
        </div>
      );
    }
  }
}

export default TwitterAuth;