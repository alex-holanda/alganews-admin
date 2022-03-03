import { Layout, Row, Avatar } from 'antd';
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
        <Avatar src={user?.avatarUrls.small} alt={user?.name} />
      </Row>
    </Header>
  );
}
