import { useEffect } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';

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
  Divider,
  Popconfirm,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import confirm from 'antd/lib/modal/confirm';
import { WarningFilled } from '@ant-design/icons';

import { useUser } from '../../core/hooks/useUser';
import EditorPostsList from '../features/EditorPostsList';
import { NotFoundError } from '../components/NotFoundError';

export default function UserDetailsView() {
  const params = useParams<{ id: string }>();
  const { user, fetchUser, notFound, toggleUserStatus } = useUser();

  const { lg } = useBreakpoint();

  useEffect(() => {
    if (!isNaN(Number(params.id))) {
      fetchUser(Number(params.id));
    }
  }, [fetchUser, params]);

  if (isNaN(Number(params.id))) {
    return <Redirect to={'/usuarios'} />;
  }

  if (notFound) {
    return (
      <Card>
        <NotFoundError
          title={'Usuário não encontrado'}
          actionDestination={'/usuarios'}
          actionTitle={'Voltar para a lista de usuários'}
        />
      </Card>
    );
  }

  if (!user) {
    return <Skeleton />;
  }

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} lg={4}>
          <Row justify={'center'}>
            <Avatar size={120} src={user.avatarUrls.default} />
          </Row>
        </Col>

        <Col xs={24} lg={20}>
          <Space
            style={{ width: '100%' }}
            direction={'vertical'}
            align={lg ? 'start' : 'center'}
          >
            <Typography.Title level={2}>{user.name}</Typography.Title>

            <Typography.Paragraph
              ellipsis={{ rows: 2 }}
              style={{ textAlign: lg ? 'left' : 'center' }}
            >
              {user.bio}
            </Typography.Paragraph>

            <Space
              direction={lg ? 'horizontal' : 'vertical'}
              align={lg ? 'start' : 'center'}
            >
              <Link to={`/usuarios/edicao/${user.id}`}>
                <Button type={'primary'}>Editar perfil</Button>
              </Link>

              <Popconfirm
                title={
                  user.active
                    ? `Desabilitar o ${user.name}?`
                    : `Habilitar o ${user.name}?`
                }
                onConfirm={() => {
                  confirm({
                    icon: <WarningFilled style={{ color: '#09f' }} />,
                    title: `Tem certeza que deseja ${
                      user.active
                        ? `desabilitar o usuário ${user.name}?`
                        : `habilitar o usuário ${user.name}`
                    }`,
                    content: user.active
                      ? `Desabilitar um usuário fará com que ele seja automaticamente desligado da plataforma, podendo causar prejuízos em seus ganhos.`
                      : `Habilitar um usuário fará com que ele ganhe acesso a plataforma novamente, possibilitando criação e publicação de posts`,
                    onOk() {
                      toggleUserStatus(user).then(() => {
                        fetchUser(Number(params.id));
                      });
                    },
                  });
                }}
              >
                <Button type={'primary'}>
                  {user.active ? 'Desabilitar' : 'Habilitar'}
                </Button>
              </Popconfirm>
            </Space>
          </Space>
        </Col>

        <Divider />

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

        {user.role === 'EDITOR' && (
          <>
            <Divider />
            <Col span={24}>
              <EditorPostsList editorId={user.id} />
            </Col>
          </>
        )}
      </Row>
    </>
  );
}
