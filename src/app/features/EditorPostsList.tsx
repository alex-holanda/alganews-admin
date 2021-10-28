import { useEffect, useMemo, useState } from 'react';

import { Descriptions, Switch, Table } from 'antd';

import { Post } from 'alex-holanda-sdk';

import { usePosts } from '../../core/hooks/usePosts';

interface EditorPostsListProps {
  editorId: number;
}

export default function EditorPostsList(props: EditorPostsListProps) {
  const { posts, fetchPosts, togglePostPublish, fetching, totalElements } =
    usePosts();
  const [page, setPage] = useState(0);

  const query = useMemo<Post.Query>(() => {
    return { editorId: props.editorId, showAll: true, page, size: 10 };
  }, [props.editorId, page]);

  useEffect(() => {
    fetchPosts(query);
  }, [fetchPosts, query]);

  return (
    <>
      <Table<Post.Summary>
        dataSource={posts}
        loading={fetching}
        rowKey={'id'}
        columns={[
          {
            title: 'Posts',
            responsive: ['xs'],
            render(post: Post.Summary) {
              return (
                <Descriptions column={1} size={'small'}>
                  <Descriptions.Item label={'Título'}>
                    {post.title}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Criação'}>
                    {post.createdAt}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Última atualização'}>
                    {post.updatedAt}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Publicado'}>
                    <Switch
                      checked={post.published}
                      onChange={() => {
                        togglePostPublish(post, query);
                      }}
                    />
                  </Descriptions.Item>
                </Descriptions>
              );
            },
          },
          {
            title: 'Título',
            dataIndex: 'title',
            ellipsis: true,
            responsive: ['sm'],
            width: 400,
          },
          {
            title: 'Criação',
            dataIndex: 'createdAt',
            width: 120,
            responsive: ['sm'],
            render(createAt: string) {
              return new Date(createAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
            },
          },
          {
            title: 'Última atualização',
            dataIndex: 'updatedAt',
            width: 180,
            responsive: ['sm'],
            render(updatedAt: string) {
              return `${new Date(updatedAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })} às ${new Date(updatedAt).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}`;
            },
          },
          {
            title: 'Publicado',
            dataIndex: 'published',
            align: 'center',
            width: 100,
            responsive: ['sm'],
            render(published: boolean, post: Post.Summary) {
              return (
                <Switch
                  checked={published}
                  onChange={() => {
                    togglePostPublish(post, query);
                  }}
                />
              );
            },
          },
        ]}
        pagination={{
          total: totalElements,
          pageSize: 10,
          onChange: (page) => setPage(page - 1),
        }}
      />
    </>
  );
}
