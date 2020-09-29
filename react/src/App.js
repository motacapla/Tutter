import React, { Component } from 'react';
import TwitterAuth from './components/TwitterAuth';
import AppCardDeck from './components/AppCardDeck';
import AppFooter from './components/AppFooter';
import TwitterHashtag from './components/TwitterHashtag';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';

// TODO : リファクタしたい、設計全体的に見直し
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin : false
    };
    this.setIsLogin = this.setIsLogin.bind(this);
  }

  setIsLogin(isLogin) {
    this.setState({isLogin: isLogin});
  }

  render() {
    if (this.state.isLogin) {
      return (
        <div className="App">
          <div className="AppBody">
            <TwitterAuth setIsLogin={this.setIsLogin} isLogin={this.state.isLogin}/>
          </div>
          <AppFooter />
        </div>
      );
    } else {
      return (
        <div className="App">
          <div className="AppHeader">
            <a href="/"><Image className="Logo" src={`${process.env.PUBLIC_URL}/Tutter-logo-white.png`} /></a>
            <div className="AppHeaderDescription">
              <h1>釣った魚と、思い出の一枚を。</h1>
              <h1>自動生成した魚拓と共にツイートする</h1>
            </div>
            <TwitterAuth setIsLogin={this.setIsLogin} isLogin={this.state.isLogin}/>
          </div>
          <div className="AppBody">
            <AppCardDeck />
          </div>
          <AppFooter />
        </div>
      );
    }
  }
}

export default App;