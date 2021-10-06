import { Col, Row } from 'antd';
import UserListFeature from '../layouts/Default/UserList';

export default function UserListView() {
  return (
    <Row>
      <Col xs={24}>
        <UserListFeature />
      </Col>
    </Row>
  );
}
