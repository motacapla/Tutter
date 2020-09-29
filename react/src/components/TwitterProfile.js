import React, { Component } from "react";
import axios from 'axios';
import {API_SERVER_HOST_URL} from './Config';
import firebase from '../FirebaseConfig';

class TwitterProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount () {
        axios
        .get(API_SERVER_HOST_URL + "/v1/twitterCredentials", {withCredentials: true})
        .then(response => {
            if (response.data['accessToken'] != null && response.data['secret'] != null) {
                axios
                .get(API_SERVER_HOST_URL + "/v1/twitterProfile", {withCredentials: true})
                .then(response => {
                    this.setState({
                        screen_name: response.data['screen_name'],
                        profile_image_url: response.data['profile_image_url']
                    })
                })
                .catch(() => {
                    console.log('twitterProfile failed');
                });       
            }
        })
        .catch(() => {
            console.log('twitterCredentials failed');
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
        return (
            <div className="TwitterProfile">                
                <img className="TwitterIcon" src={this.state.profile_image_url} />            
                <div className="TwitterName">{this.state.screen_name}</div>
                <button className="BackgroundDarkBlue LogoutButton" onClick={this.handleLogout}>ログアウト</button>
            </div>
        );
    }
}

export default TwitterProfile;