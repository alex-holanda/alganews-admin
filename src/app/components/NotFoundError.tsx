import { Link } from 'react-router-dom';

import { Space, Typography, Button, Row } from 'antd';
import { WarningFilled } from '@ant-design/icons';

interface NotFoundErrorProps {
  title: string;
  description?: string;
  actionDestination: string;
  actionTitle: string;
}

export function NotFoundError(props: NotFoundErrorProps) {
  return (
    <Row gutter={24} justify={'center'} style={{ gap: 16 }}>
      <Space direction={'vertical'} align={'center'}>
        <WarningFilled style={{ fontSize: 32 }} />
        <Typography.Title level={1} style={{ color: '#09f' }}>
          {props.title}
        </Typography.Title>

        <Typography.Paragraph>
          {props.description
            ? props.description
            : 'O recurso que você está procurando, não foi encontrado.'}
        </Typography.Paragraph>

        <Link to={props.actionDestination}>
          <Button type={'primary'}>{props.actionTitle}</Button>
        </Link>
      </Space>
    </Row>
  );
}
