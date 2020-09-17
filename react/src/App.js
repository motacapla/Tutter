import React, { Component } from 'react';
import TwitterAuth from './components/TwitterAuth';
import AppCardDeck from './components/AppCardDeck';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';

// TODO : リファクタしたい、設計全体的に見直し
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="AppHeader">
          <a href="/"><Image className="Logo" src={`${process.env.PUBLIC_URL}/Tutter-logo-white.png`} /></a>
          <div className="AppHeaderDescription">
            <h1>釣った魚と、思い出の一枚を。</h1>
            <h1>自動生成した魚拓でツイートする</h1>
          </div>
          <TwitterAuth />
        </div>
        <div className="AppBody">
          <AppCardDeck />
        </div>
        <div className="AppFooter">
          github
          twitter
        </div>
      </div>
    );
  }
}

export default App;