import { useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';

import {
  Skeleton,
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Space,
  Button,
} from 'antd';

import { useUser } from '../../core/hooks/useUser';

export default function UserDetailsView() {
  const params = useParams<{ id: string }>();
  const { user, fetchUser, notFound } = useUser();

  useEffect(() => {
    if (!isNaN(Number(params.id))) {
      fetchUser(Number(params.id));
    }
  }, [fetchUser, params]);

  if (isNaN(Number(params.id))) {
    return <Redirect to={'/usuarios'} />;
  }

  if (notFound) {
    return <Card>Usuário não encontrado</Card>;
  }

  if (!user) {
    return <Skeleton />;
  }

  return (
    <>
      <Row>
        <Col xs={24} lg={4}>
          <Avatar size={120} src={user.avatarUrls.default} />
        </Col>

        <Col xs={24} lg={20}>
          <Typography.Title level={2}>{user.name}</Typography.Title>

          <Typography.Paragraph ellipsis>{user.bio}</Typography.Paragraph>

          <Space>
            <Button type={'primary'}>Editar perfil</Button>
            <Button type={'primary'}>Remover</Button>
          </Space>
        </Col>
      </Row>
    </>
  );
}
