import { Descriptions, Divider, Space, Tag, Typography } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

import { transformNumberToCurrency } from '../../core/util/transformNumberToCurrency';
import { transformStringToDate } from '../../core/util/transformStringToDate';

interface PaymentHeaderProps {
  editorId?: number;
  editorName?: string;
  periodStart?: string;
  periodEnd?: string;
  postsEarnings?: number;
  totalEarnings?: number;
}

export function PaymentHeader(props: PaymentHeaderProps) {
  const { xs } = useBreakpoint();
  return (
    <>
      <Typography.Title>Pagamentos</Typography.Title>
      <Typography.Text>
        A base do pagamento é calculada pela quantidade de palavras escritas.
      </Typography.Text>

      <Divider />

      <Descriptions column={xs ? 1 : 2} size={xs ? 'small' : 'default'}>
        <Descriptions.Item label={'Editor'}>
          {props.editorName}
        </Descriptions.Item>
        <Descriptions.Item label={'Período'}>
          <Space>
            <Tag style={{ marginRight: 0 }}>
              {props.periodStart && transformStringToDate(props.periodStart)}
            </Tag>
            <span>à</span>
            <Tag>
              {props.periodEnd && transformStringToDate(props.periodEnd)}
            </Tag>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label={'Ganhos por posts'}>
          <Tag>
            {props.postsEarnings &&
              transformNumberToCurrency(props.postsEarnings)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label={'Total'}>
          <Tag>
            {props.totalEarnings &&
              transformNumberToCurrency(props.totalEarnings)}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}
