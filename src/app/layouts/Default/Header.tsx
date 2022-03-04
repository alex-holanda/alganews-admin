import { Layout, Row, Avatar, Dropdown, Menu, Card, Tag } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

import { useAuth } from 'core/hooks/useAuth';
import AuthService from 'auth/Authorization.service';

import logo from '../../../assets/logo.svg';
import { Link } from 'react-router-dom';
import confirm from 'antd/lib/modal/confirm';

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
            <Menu style={{ width: 220 }}>
              {/* <Menu.Item> */}
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
              {/* </Menu.Item> */}
              <Menu.Item icon={<UserOutlined />}>
                <Link to={`/usuarios/${user?.id}`}>Meu perfil</Link>
              </Menu.Item>
              <Menu.Item
                icon={<LogoutOutlined />}
                danger
                onClick={() =>
                  confirm({
                    title: 'Fazer logout',
                    content:
                      'Deseja realmente fazer o logout? Será necessário inserir as credenciais novamente',
                    onOk() {
                      AuthService.imperativelySendToLogout();
                    },
                    closable: true,
                    okButtonProps: {
                      danger: true,
                    },
                    okText: 'Fazer logout',
                    cancelText: 'Permanecer logado',
                  })
                }
              >
                Fazer logout
              </Menu.Item>
            </Menu>
          }
        >
          <Avatar src={user?.avatarUrls.small} alt={user?.name} />
        </Dropdown>
      </Row>
    </Header>
  );
}
