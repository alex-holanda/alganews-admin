import { Table } from 'antd';

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
            dataIndex: 'title',
            title: 'Post',
            width: 240,
            responsive: ['sm'],
            ellipsis: true,
          },
          {
            dataIndex: 'earnings',
            title: 'Preço por palavra',
            width: 160,
            responsive: ['sm'],
            render(earnings: Post.WithEarnings['earnings']) {
              return transformNumberToCurrency(earnings.pricePerWord);
            },
          },
          {
            dataIndex: 'earnings',
            title: 'Palavras',
            width: 140,
            responsive: ['sm'],
            align: 'center',
            render(earnings: Post.WithEarnings['earnings']) {
              return earnings.words;
            },
          },
          {
            dataIndex: 'earnings',
            title: 'Total ganho nesse post',
            width: 220,
            responsive: ['sm'],
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
