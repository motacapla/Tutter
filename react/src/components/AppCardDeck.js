import React, { Component } from 'react';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';

class AppCardDeck extends Component {
    render() {
        return (
          <CardDeck>
          <Card>
            <Card.Img variant="top" src={`${process.env.PUBLIC_URL}/original.jpg`} />
            <Card.Body>
              <Card.Title>釣った魚の写真を撮る</Card.Title>
              <Card.Text>
                釣った魚の写真を撮って、Tutterにアップロードしましょう
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Last updated 3 mins ago</small>
            </Card.Footer>
          </Card>
          <Card>
            <Card.Img variant="top" src={`${process.env.PUBLIC_URL}/converted.jpg`} />
            <Card.Body>
              <Card.Title>写真から魚拓を自動生成</Card.Title>
              <Card.Text>
                アップロードされた写真を自動的に加工され、魚拓が作られます。
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Last updated 3 mins ago</small>
            </Card.Footer>
          </Card>
          <Card>
            <Card.Img variant="top" src={`${process.env.PUBLIC_URL}/tweet.jpg`} />
            <Card.Body>
              <Card.Title>魚拓をそのままツイート</Card.Title>
              <Card.Text>
                そのままツイートの文章を入力して、画像付きの投稿が可能です。
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Last updated 3 mins ago</small>
            </Card.Footer>
          </Card>
        </CardDeck>
        )
    }
}

export default AppCardDeck;