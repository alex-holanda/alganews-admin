import { Breadcrumb } from 'antd';
import { useBreadcrumb } from 'core/hooks/useBreadcrumb';

export default function DefaultLayoutBreadcrumb() {
  const { breadcrumb } = useBreadcrumb();

  return (
    <Breadcrumb className={'no-print'} style={{ margin: '16px 0' }}>
      {breadcrumb.map((bc, index) => (
        <Breadcrumb.Item key={index}>{bc}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
