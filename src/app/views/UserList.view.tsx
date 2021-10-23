import { Col, Row } from 'antd';
import { usePageTitle } from '../../core/hooks/usePageTitle';
import UserListFeature from '../features/UserList';

export default function UserListView() {
  usePageTitle('Consulta de usuários');
  return (
    <Row>
      <Col xs={24}>
        <UserListFeature />
      </Col>
    </Row>
  );
}
