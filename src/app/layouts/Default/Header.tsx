import { Layout, Row, Avatar } from 'antd';

import logo from '../../../assets/logo.svg';

const { Header } = Layout;

export default function DefaltLayoutHeader() {
  return (
    <Header>
      <Row
        justify={'space-between'}
        align={'middle'}
        style={{ height: '100%' }}
      >
        <img src={logo} alt={'AlgaNews - Admin'} />
        <Avatar />
      </Row>
    </Header>
  );
}
