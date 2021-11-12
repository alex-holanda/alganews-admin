import { Breadcrumb } from 'antd';

export default function DefaultLayoutBreadcrumb() {
  return (
    <Breadcrumb className={'no-print'} style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>List</Breadcrumb.Item>
      <Breadcrumb.Item>App</Breadcrumb.Item>
    </Breadcrumb>
  );
}
