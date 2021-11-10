import { Post } from 'alex-holanda-sdk';
import {
  Card,
  Descriptions,
  Divider,
  Space,
  Tag,
  Typography,
  Table,
} from 'antd';

export function PaymentDetailsView() {
  return (
    <>
      <Card>
        <Typography.Title>Pagamentos</Typography.Title>
        <Typography.Text>
          A base do pagamento é calculada pela quantidade de palavras escritas.
        </Typography.Text>

        <Divider />

        <Descriptions column={2}>
          <Descriptions.Item label={'Editor'}>EDITOR</Descriptions.Item>
          <Descriptions.Item label={'Período'}>
            <Space>
              <Tag style={{ marginRight: 0 }}>20/12/2021</Tag>
              <span>até</span>
              <Tag>20/01/2022</Tag>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={'Ganhos por posts'}>
            <Tag>{'R$ 123.98,27'}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={'Total'}>
            <Tag>{'45.234,12'}</Tag>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Typography.Title level={2}>Bônus</Typography.Title>
        <Descriptions bordered size={'small'} column={1}>
          <Descriptions.Item label={'1 milhão de views em 1 dia'}>
            {'R$ 123,56'}
          </Descriptions.Item>
          <Descriptions.Item label={'1 milhão de views em 1 dia'}>
            {'R$ 123,56'}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Table<Post.WithEarnings>
          dataSource={[]}
          columns={[
            {
              dataIndex: 'title',
              title: 'Post',
              ellipsis: true,
            },
            {
              dataIndex: 'earnings.pricePerword',
              title: 'Preço por palavra',
            },
            {
              dataIndex: 'earning.words',
              title: 'Palavras',
            },
            {
              dataIndex: 'earnings.totalAmount',
              title: 'Total ganho nesse post',
            },
          ]}
        />
      </Card>
    </>
  );
}
