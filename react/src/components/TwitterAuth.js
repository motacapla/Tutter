import React, { Component } from 'react';
import firebase, { provider } from '../config';
import axios from 'axios';
import TweetModal from './TweetModal';
import Button from 'react-bootstrap/Button';

const API_SERVER_HOST_URL = 'http://localhost:5000';

class TwitterAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin : true
    }; //TODO: isLoginは親のappが持ったほうが良さそう
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({isLogin: true});
      }
      else {
        this.setState({isLogin: false});
      }
    })
  }

  handleLogin = () => {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var secret = result.credential.secret;
      console.log(token);
      console.log(secret);

      const params = new FormData();
      params.append('accessToken', token);
      params.append('secret', secret);
      axios
      .post(API_SERVER_HOST_URL + "/v1/twitterCredentials", params, {withCredentials: true})
      .then(response => {
        console.log(response);
        console.log("twitterCredentials successed");
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

  render() {
    if (this.state.isLogin) {
      return (
        <div style={this.props.style}>
          <TweetModal />
          <Button variant="dark" onClick={this.handleLogout} size="lg" block>LogOut</Button>
        </div>
      );
    } else {
      return (
        <div style={this.props.style}>
          <Button variant="info" onClick={this.handleLogin} size="lg" block><img src={`${process.env.PUBLIC_URL}/signin_twitter.jpg`} width="200" /></Button>
        </div>
      );
    }
  }
}

export default TwitterAuth;