import React, { Component } from 'react';
import firebase, { provider } from '../config';
import '../App.js'
import axios from 'axios';
import TweetModal from './TweetModal';
import Image from 'react-bootstrap/Image';

const API_SERVER_HOST_URL = 'http://localhost:5000';

class TwitterAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
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

  handleLogout = () => {
    firebase.auth().signOut().then(function() {
      console.log("logout");
    }).catch(function(error) {
      console.log(error);
    });
  }

  setIsLogin(bool) {
    return this.props.setIsLogin(bool);      
  }

  render() {
    if (this.props.isLogin) {
      return (
        <div style={this.props.style}>
          <TweetModal />
          <button className="BackgroundGrey Button" >Comming soon.</button> 
          <br/> 
          <button className="BackgroundDarkBlue Button" onClick={this.handleLogout}>ログアウト</button>
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