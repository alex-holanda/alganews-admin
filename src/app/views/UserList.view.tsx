import { Col, Row } from 'antd';
import { useBreadcrumb } from 'core/hooks/useBreadcrumb';
import { usePageTitle } from '../../core/hooks/usePageTitle';
import UserListFeature from '../features/UserList';

export default function UserListView() {
  usePageTitle('Consulta de usuários');

  useBreadcrumb('Usuários/Consulta');

  return (
    <Row>
      <Col xs={24}>
        <UserListFeature />
      </Col>
    </Row>
  );
}
