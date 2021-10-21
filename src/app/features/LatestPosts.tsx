import { useEffect } from 'react';

import { Avatar, Card, Col, Row } from 'antd';

import { usePosts } from '../../core/hooks/usePosts';

export default function LatestPosts() {
  const { fetchPosts, posts } = usePosts();

  useEffect(() => {
    fetchPosts({ sort: ['createdAt', 'desc'], page: 0, size: 3 });
  }, [fetchPosts]);

  return (
    <Row gutter={16}>
      {posts?.map((post) => {
        return (
          <Col xs={24} md={8} key={post.id}>
            <Card
              cover={
                <img
                  src={post.imageUrls.small}
                  alt={post.title}
                  style={{ height: 168, objectFit: 'cover' }}
                />
              }
            >
              <Card.Meta
                title={post.title}
                avatar={
                  <Avatar
                    src={post.editor.avatarUrls.small}
                    alt={post.editor.name}
                  />
                }
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
