import { useEffect } from 'react';

import {
  Table,
  Tag,
  Switch,
  Button,
  Typography,
  Avatar,
  Space,
  Card,
  Input,
} from 'antd';
import { EyeOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';

import { ColumnProps } from 'antd/lib/table';

import { useUsers } from '../../core/hooks/useUsers';
import { User } from 'alex-holanda-sdk';

export default function UserListFeature() {
  const { users, fetchUsers, toggleUserStatus } = useUsers();

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
            ...getColumnSearchProps('name', 'nome'),
          },
          {
            dataIndex: 'email',
            title: 'E-mail',
            ellipsis: true,
            width: 240,
            ...getColumnSearchProps('email', 'e-mail'),
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
