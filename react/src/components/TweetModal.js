import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-awesome-modal';
import Converter from './Converter';

const TUTTER_HOST_URL = 'http://localhost:5000';

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
    if (this.state.filename == null) {
      alert('先に画像をアップロードしてください');
      event.preventDefault();
    } else {
      console.log(this.state.filename)
      axios
      .get(TUTTER_HOST_URL + "/v1/twitterCredentials", {withCredentials: true})
      .then(response => {
        const params = new FormData();
        params.append('accessToken', response.data['accessToken']);
        params.append('secret', response.data['secret']);
        params.append('description', this.state.text);
        params.append('filename', this.state.filename); 

        axios
        .post(TUTTER_HOST_URL + "/v1/tweet", params)
        .then(response => {
          console.log(response);
          console.log("handleSubmit successed");
        })
        .catch(() => {
          console.log('handleSubmit failed');
        });
      })
      .catch(() => {
        console.log('twitterCredentials failed');
      });
    
      this.setState({text: ""});
      alert('投稿しました！');
      event.preventDefault();
    }
  }

  setFilename (filename) {
    this.setState({filename: filename});
  }

  render() {
    return (
      <div className="Tweet">
      <input type="button" value="tweet" onClick={() => this.openModal()} />
      <Modal visible={this.state.visible} width="1200" height="600" effect="fadeInDown" onClickAway={() => this.closeModal()}>
        <div>
          <h3>投稿画像を選択</h3>
          <Converter setFilename={this.setFilename} />
          <h3>ツイートの投稿内容 (140字以内)</h3>
          <form onSubmit={this.handleSubmit}> 
            <textarea value={this.state.text} onChange={this.handleChange} />
            <input type="submit" value="投稿！"/>
          </form>
          <p><a href="" onClick={() => this.closeModal()}>Close</a></p>
        </div>
      </Modal>
      </div>
    );
  }  
}
export default TweetModal;