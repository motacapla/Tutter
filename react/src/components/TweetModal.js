import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-awesome-modal';
import Converter from './Converter';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

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
      let description = this.state.text
      axios
      .get(TUTTER_HOST_URL + "/v1/twitterCredentials", {withCredentials: true})
      .then(response => {
        const params = new FormData();
        params.append('accessToken', response.data['accessToken']);
        params.append('secret', response.data['secret']);
        params.append('description', description);
        params.append('filename', this.state.filename); 

        axios
        .post(TUTTER_HOST_URL + "/v1/tweet", params)
        .then(response => {
          console.log(response);
        })
        .catch(() => {
          console.log('handleSubmit failed');
        });
      })
      .catch(() => {
        alert('投稿できませんでした\n 再度ログインしてお試しください');
        console.log('twitterCredentials failed');
      });
      this.setState({text: ""});
      alert('投稿しました!');
      event.preventDefault();
    }
  }

  setFilename (filename) {
    this.setState({filename: filename});
  }

  render() {
    return (
      <div className="Tweet">
      <Button variant="info" type="button" size="lg" block onClick={() => this.openModal()}>ツイートする</Button>
      <Modal visible={this.state.visible} width="1200" height="600" effect="fadeInDown" onClickAway={() => this.closeModal()}>
        <div>
          <h3>投稿画像を選択</h3>
          <Converter setFilename={this.setFilename} />
          <form onSubmit={this.handleSubmit}> 
            <div className="textArea">
              <Form>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label><h3>ツイートの投稿内容 (140字以内)</h3></Form.Label>
                  <Form.Control as="textarea" rows="3" onChange={this.handleChange} />
                </Form.Group>
              </Form>
            </div>
            <Button variant="info" type="submit">投稿</Button>
          </form>
          <Button variant="dark" onClick={() => this.closeModal()}>閉じる</Button>
        </div>
      </Modal>
      </div>
    );
  }  
}
export default TweetModal;