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
  Progress,
  Descriptions,
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
      <Row gutter={24}>
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

        <Col xs={24} lg={12}>
          <Space direction={'vertical'} style={{ width: '100%' }}>
            {user.skills?.map((skill, index) => (
              <div key={index}>
                <Typography.Text>{skill.name}</Typography.Text>
                <Progress percent={skill.percentage} success={{ percent: 0 }} />
              </div>
            ))}
          </Space>
        </Col>

        <Col xs={24} lg={12}>
          <Descriptions column={1} bordered size={'small'}>
            <Descriptions.Item label={'País'}>
              {user.location.country}
            </Descriptions.Item>
            <Descriptions.Item label={'Estado'}>
              {user.location.state}
            </Descriptions.Item>
            <Descriptions.Item label={'Cidade'}>
              {user.location.city}
            </Descriptions.Item>
            <Descriptions.Item label={'Telefone'}>
              {user.phone}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </>
  );
}
