import { useMemo, useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';

import { Button, Drawer, DrawerProps, Layout, Menu } from 'antd';

import {
  UserOutlined,
  LaptopOutlined,
  DiffOutlined,
  HomeOutlined,
  TableOutlined,
  PlusCircleOutlined,
  FallOutlined,
  RiseOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { SiderProps } from 'antd/lib/layout';

import logo from 'assets/logo.svg';

const { SubMenu } = Menu;
const { Sider } = Layout;

export default function DefaulLayoutSidebar() {
  const { lg } = useBreakpoint();

  const history = useHistory();
  const location = useLocation();

  const [show, setShow] = useState(false);

  const siderProps = useMemo((): SiderProps => {
    return {
      width: 200,
      className: 'site-layout-background no-print',
    };
  }, []);

  const drawerProps = useMemo((): DrawerProps => {
    return {
      title: (
        <>
          <img alt={'Logo AlgaNews'} src={logo} />
        </>
      ),
      bodyStyle: {
        padding: 0,
      },
      headerStyle: {
        height: 64,
      },
      visible: show,
      closable: true,
      onClose() {
        setShow(false);
      },
      placement: 'left',
    };
  }, [show]);

  const SidebarWrapper: React.FC = useMemo(() => (lg ? Sider : Drawer), [lg]);

  const sidebarProps = useMemo(() => {
    return lg ? siderProps : drawerProps;
  }, [lg, siderProps, drawerProps]);

  return (
    <>
      {!lg && (
        <Button
          icon={<MenuOutlined />}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: 64,
            zIndex: 99,
          }}
          type={'text'}
          onClick={() => setShow(true)}
        />
      )}

      <SidebarWrapper {...sidebarProps}>
        <Menu
          mode='inline'
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
          defaultOpenKeys={[location.pathname.split('/')[1]]}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item
            key='/'
            onClick={() => history.push('/')}
            icon={<HomeOutlined />}
          >
            <Link to={'/'}>Home</Link>
          </Menu.Item>
          <SubMenu key='usuarios' icon={<UserOutlined />} title='Usuários'>
            <Menu.Item
              key='/usuarios'
              onClick={() => history.push('/usuarios')}
              icon={<TableOutlined />}
            >
              <Link to={'/usuarios'}>Consulta</Link>
            </Menu.Item>
            <Menu.Item
              key='/usuarios/cadastro'
              onClick={() => history.push('/usuarios/cadastro')}
              icon={<PlusCircleOutlined />}
            >
              <Link to={'/usuarios/cadastro'}>Cadastro</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key='pagamentos'
            icon={<LaptopOutlined />}
            title='Pagamentos'
          >
            <Menu.Item
              key='/pagamentos'
              onClick={() => history.push('/pagamentos')}
              icon={<TableOutlined />}
            >
              <Link to={'/pagamentos'}>Consulta</Link>
            </Menu.Item>
            <Menu.Item
              key='/pagamentos/cadastro'
              onClick={() => history.push('/pagamentos/cadastro')}
              icon={<PlusCircleOutlined />}
            >
              <Link to={'/pagamentos/cadastro'}>Cadastro</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key='fluxo-de-caixa'
            icon={<DiffOutlined />}
            title='Fluxo de Caixa'
          >
            <Menu.Item
              key='/fluxo-de-caixa/despesas'
              onClick={() => history.push('/fluxo-de-caixa/despesas')}
              icon={<FallOutlined />}
            >
              <Link to={'/fluxo-de-caixa/despesas'}>Despesa</Link>
            </Menu.Item>
            <Menu.Item
              key='/fluxo-de-caixa/receitas'
              onClick={() => history.push('/fluxo-de-caixa/receitas')}
              icon={<RiseOutlined />}
            >
              <Link to={'/fluxo-de-caixa/receitas'}>Receita</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </SidebarWrapper>
    </>
  );
}
