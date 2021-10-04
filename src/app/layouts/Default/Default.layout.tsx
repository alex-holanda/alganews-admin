import DefaultLayoutBreadcrumb from './Breadcrumb';
import DefaultLayoutHeader from './Header';
import DefaultLayoutSidebar from './Sidebar';
import DefaultLayoutContent from './Content';

import { Layout } from 'antd';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default function DefaultLayout(props: DefaultLayoutProps) {
  return (
    <Layout>
      <DefaultLayoutHeader />
      <Layout>
        <DefaultLayoutSidebar />
        <Layout style={{ padding: '0 24px 24px' }}>
          <DefaultLayoutBreadcrumb />
          <DefaultLayoutContent>{props.children}</DefaultLayoutContent>
        </Layout>
      </Layout>
    </Layout>
  );
}
