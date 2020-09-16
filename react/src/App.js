import React, { Component } from 'react';
import TwitterAuth from './components/TwitterAuth';

// TODO : リファクタしたい、設計全体的に見直し
class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="header">
          <h1>Tutter</h1>
        </div>
        <TwitterAuth/>
      </div>
    );
  }
}
 
export default App;