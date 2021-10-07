import { useEffect } from 'react';

import { Table, Tag, Switch, Button, Typography, Avatar, Space } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';

import { useUsers } from '../../core/hooks/useUsers';
import { User } from 'alex-holanda-sdk';

export default function UserListFeature() {
  const { users, fetchUsers, toggleUserStatus } = useUsers();

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
            width: 160,
            render(name, row) {
              return (
                <Space>
                  <Avatar size={'small'} src={row.avatarUrls.small} />
                  <Typography.Text ellipsis style={{ width: 120 }}>
                    {name}
                  </Typography.Text>
                </Space>
              );
            },
          },
          {
            dataIndex: 'email',
            title: 'E-mail',
            ellipsis: true,
            width: 240,
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
            render(active, user) {
              return (
                <Switch
                  onChange={() => {
                    toggleUserStatus(user);
                  }}
                  defaultChecked={active}
                />
              );
            },
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            align: 'center',
            render() {
              return (
                <Space>
                  <Button size={'small'} icon={<EyeOutlined />} />
                  <Button size={'small'} icon={<EditOutlined />} />
                </Space>
              );
            },
          },
        ]}
        pagination={false}
      />
    </>
  );
}
