import { Layout, Row, Avatar, Dropdown, Menu, Card, Tag } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

import { useAuth } from 'core/hooks/useAuth';

import logo from '../../../assets/logo.svg';

const { Header } = Layout;

export default function DefaltLayoutHeader() {
  const { user } = useAuth();

  return (
    <Header className='no-print'>
      <Row
        justify={'space-between'}
        align={'middle'}
        style={{ height: '100%', maxWidth: 1190, margin: '0 auto' }}
      >
        <img src={logo} alt={'AlgaNews - Admin'} />
        <Dropdown
          placement={'bottomRight'}
          overlay={
            <Card style={{ width: 200 }}>
              <Card bordered={false}>
                <Card.Meta
                  title={user?.name}
                  description={
                    <Tag
                      color={
                        user?.role === 'MANAGER'
                          ? 'red'
                          : user?.role === 'EDITOR'
                          ? 'green'
                          : 'blue'
                      }
                    >
                      {user?.role === 'EDITOR'
                        ? 'Editor'
                        : user?.role === 'MANAGER'
                        ? 'Gerente'
                        : 'Assitente'}
                    </Tag>
                  }
                />
              </Card>

              <Menu>
                <Menu.Item icon={<UserOutlined />}>Meu perfil</Menu.Item>
                <Menu.Item icon={<LogoutOutlined />} danger>
                  Fazer logout
                </Menu.Item>
              </Menu>
            </Card>
          }
        >
          <Avatar src={user?.avatarUrls.small} alt={user?.name} />
        </Dropdown>
      </Row>
    </Header>
  );
}
