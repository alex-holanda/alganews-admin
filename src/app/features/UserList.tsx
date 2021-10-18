import { useEffect } from 'react';

import {
  Table,
  Tag,
  Switch,
  Button,
  Avatar,
  Space,
  Card,
  Input,
  Descriptions,
} from 'antd';
import { EyeOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';

import { ColumnProps } from 'antd/lib/table';

import { useUsers } from '../../core/hooks/useUsers';
import { User } from 'alex-holanda-sdk';

export default function UserListFeature() {
  const { users, fetchUsers, toggleUserStatus, fetching } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getColumnSearchProps = (
    dataIndex: keyof User.Summary,
    displayName?: string
  ): ColumnProps<User.Summary> => ({
    filterDropdown: ({
      selectedKeys,
      setSelectedKeys,
      confirm,
      clearFilters,
    }) => (
      <Card>
        <Space direction={'vertical'}>
          <Input
            value={selectedKeys[0]}
            placeholder={`Buscar ${displayName || dataIndex}`}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
          />
          <Space>
            <Button
              type={'primary'}
              size={'small'}
              style={{ width: 90 }}
              onClick={() => confirm()}
              icon={<SearchOutlined />}
            >
              Buscar
            </Button>
            <Button onClick={clearFilters} size={'small'} style={{ width: 90 }}>
              Limpar
            </Button>
          </Space>
        </Space>
      </Card>
    ),
    //@ts-ignore
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value as string).toLocaleLowerCase())
        : '',
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#0099ff' : undefined }} />
    ),
  });

  return (
    <>
      <Table<User.Summary>
        loading={fetching}
        dataSource={users}
        rowKey={'id'}
        columns={[
          {
            title: 'Usuário',
            responsive: ['xs'],
            render(user: User.Summary) {
              return (
                <Descriptions column={1} size={'small'}>
                  <Descriptions.Item label={'Nome'}>
                    {user.name}
                  </Descriptions.Item>
                  <Descriptions.Item label={'E-mail'}>
                    {user.email}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Criação'}>
                    {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Perfil'}>
                    <Tag
                      color={
                        user.role === 'MANAGER'
                          ? 'red'
                          : user.role === 'EDITOR'
                          ? 'green'
                          : 'blue'
                      }
                    >
                      {user.role === 'EDITOR'
                        ? 'Editor'
                        : user.role === 'MANAGER'
                        ? 'Gerente'
                        : 'Assitente'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={'Ações'}>
                    <Space>
                      <Button size={'small'} icon={<EyeOutlined />} />
                      <Button size={'small'} icon={<EditOutlined />} />
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              );
            },
          },
          {
            dataIndex: 'avatarUrls',
            title: '',
            width: 48,
            fixed: 'left',
            responsive: ['sm'],
            render(avatarUrls: User.Summary['avatarUrls']) {
              return <Avatar size={'small'} src={avatarUrls.small} />;
            },
          },
          {
            dataIndex: 'name',
            title: 'Nome',
            width: 160,
            ellipsis: true,
            responsive: ['sm'],
            ...getColumnSearchProps('name', 'nome'),
          },
          {
            dataIndex: 'email',
            title: 'E-mail',
            responsive: ['sm'],
            ellipsis: true,
            width: 240,
            ...getColumnSearchProps('email', 'e-mail'),
          },
          {
            dataIndex: 'role',
            title: 'Perfil',
            responsive: ['sm'],
            align: 'center',
            width: 100,
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
            responsive: ['sm'],
            width: 120,
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
            responsive: ['sm'],
            width: 100,
            render(active, user) {
              return (
                <Switch
                  onChange={() => {
                    toggleUserStatus(user);
                  }}
                  checked={active}
                />
              );
            },
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            align: 'center',
            responsive: ['sm'],
            width: 100,
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
