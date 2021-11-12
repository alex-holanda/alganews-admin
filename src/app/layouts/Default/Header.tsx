import { Layout, Row, Avatar } from 'antd';

import logo from '../../../assets/logo.svg';

const { Header } = Layout;

export default function DefaltLayoutHeader() {
  return (
    <Header className='no-print'>
      <Row
        justify={'space-between'}
        align={'middle'}
        style={{ height: '100%', maxWidth: 1190, margin: '0 auto' }}
      >
        <img src={logo} alt={'AlgaNews - Admin'} />
        <Avatar />
      </Row>
    </Header>
  );
}
