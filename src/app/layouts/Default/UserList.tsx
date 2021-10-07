import { useEffect } from 'react';

import { Table, Tag, Switch, Button, Typography, Avatar, Space } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';

import { useUsers } from '../../../core/hooks/useUsers';
import { User } from 'alex-holanda-sdk';

export default function UserListFeature() {
  const { users, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      <Table<User.Summary>
        dataSource={users}
        columns={[
          {
            dataIndex: 'name',
            title: 'Nome',
            render(name, row) {
              return (
                <Space>
                  <Avatar size={'small'} src={row.avatarUrls.small} />
                  <Typography.Text>{name}</Typography.Text>
                </Space>
              );
            },
          },
          {
            dataIndex: 'email',
            title: 'E-mail',
          },
          {
            dataIndex: 'role',
            title: 'Perfil',
            align: 'center',
            render(role) {
              return (
                <Tag
                  color={
                    role === 'MANAGER'
                      ? 'red'
                      : role === 'EDITOR'
                      ? 'green'
                      : 'blue'
                  }
                >
                  {role === 'EDITOR'
                    ? 'Editor'
                    : role === 'MANAGER'
                    ? 'Gerente'
                    : 'Assitente'}
                </Tag>
              );
            },
          },
          {
            dataIndex: 'createdAt',
            title: 'Criação',
            align: 'center',
            render(createdAt) {
              return new Date(createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
            },
          },
          {
            dataIndex: 'active',
            title: 'Ativo',
            align: 'center',
            render(active) {
              return <Switch defaultChecked={active} />;
            },
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            align: 'center',
            render(id) {
              return (
                <>
                  <Button size={'small'} icon={<EyeOutlined />} />
                  <Button
                    size={'small'}
                    icon={<EditOutlined />}
                    style={{ marginLeft: 10 }}
                  />
                </>
              );
            },
          },
        ]}
        pagination={false}
      />
    </>
  );
}
