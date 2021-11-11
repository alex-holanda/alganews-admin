import { Descriptions, Table, Tooltip } from 'antd';

import { Post } from 'alex-holanda-sdk';
import { transformNumberToCurrency } from '../../core/util/transformNumberToCurrency';

interface PaymentPostsProps {
  posts: Post.WithEarnings[];
  isLoading: boolean;
}

export function PaymentPosts(props: PaymentPostsProps) {
  return (
    <>
      <Table<Post.WithEarnings>
        dataSource={props.posts}
        rowKey={'id'}
        loading={props.isLoading}
        columns={[
          {
            responsive: ['xs'],
            title: 'Posts',
            render(post: Post.WithEarnings) {
              return (
                <Descriptions column={1}>
                  <Descriptions.Item label={'Título'}>
                    {post.title}
                  </Descriptions.Item>

                  <Descriptions.Item label={'Preço por palavra'}>
                    {transformNumberToCurrency(post.earnings.pricePerWord)}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Total de palavras'}>
                    {post.earnings.words}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Ganho no posto'}>
                    {transformNumberToCurrency(post.earnings.totalAmount)}
                  </Descriptions.Item>
                </Descriptions>
              );
            },
          },
          {
            dataIndex: 'title',
            title: 'Post',
            width: 240,
            responsive: ['sm'],
            ellipsis: true,
            render(title: string) {
              return (
                <Tooltip title={title} placement={'top'}>
                  {title}
                </Tooltip>
              );
            },
          },
          {
            dataIndex: 'earnings',
            title: 'Preço por palavra',
            width: 160,
            responsive: ['sm'],
            align: 'right',
            render(earnings: Post.WithEarnings['earnings']) {
              return transformNumberToCurrency(earnings.pricePerWord);
            },
          },
          {
            dataIndex: 'earnings',
            title: 'Palavras',
            width: 140,
            responsive: ['sm'],
            align: 'right',
            render(earnings: Post.WithEarnings['earnings']) {
              return earnings.words;
            },
          },
          {
            dataIndex: 'earnings',
            title: 'Total ganho nesse post',
            width: 220,
            responsive: ['sm'],
            align: 'right',
            render(earnings: Post.WithEarnings['earnings']) {
              return transformNumberToCurrency(earnings.totalAmount);
            },
          },
        ]}
        pagination={false}
      />
    </>
  );
}
