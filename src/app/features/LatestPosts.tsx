import { useEffect } from 'react';

import { Avatar, Card, Col, Row, Space, Tooltip, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

import { usePosts } from '../../core/hooks/usePosts';

const BLOG_BASE_URL = process.env.REACT_APP_BLOG_SERVER_BASE_URL;

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
              actions={[
                <Tooltip title={'Ver post no blog'}>
                  <a
                    target={'_blank'}
                    rel={'noopener noreferrer'}
                    href={`${BLOG_BASE_URL}/posts/${post.id}/${post.slug}`}
                  >
                    <Space>
                      <EyeOutlined />
                      <Typography.Text>Ver post no blog</Typography.Text>
                    </Space>
                  </a>
                </Tooltip>,
              ]}
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
