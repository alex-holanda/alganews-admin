import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  Tooltip,
  Col,
  Row,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { ColumnProps } from 'antd/lib/table';

import { useUsers } from '../../core/hooks/useUsers';
import { User } from 'alex-holanda-sdk';
import { Forbidden } from 'app/components/Forbidden';

export default function UserListFeature() {
  const { users, fetchUsers, toggleUserStatus, fetching } = useUsers();

  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetchUsers().catch((error) => {
      if (error?.data?.status === 403) {
        setForbidden(true);
        return;
      }

      throw error;
    });
  }, [fetchUsers]);

  function handleUpdateUserList() {
    fetchUsers();
  }

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

  if (forbidden) {
    return <Forbidden />;
  }

  return (
    <>
      <Row justify={'end'}>
        <Col>
          <Button
            type={'default'}
            onClick={handleUpdateUserList}
            icon={<ReloadOutlined />}
          >
            Atualiar
          </Button>
        </Col>
      </Row>
      <Table<User.Summary>
        loading={fetching}
        dataSource={users}
        rowKey={'id'}
        columns={[
          {
            title: 'Usu??rio',
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
                  <Descriptions.Item label={'Cria????o'}>
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
                  <Descriptions.Item label={'A????es'}>
                    <Space>
                      <Tooltip title={'Visualizar usu??rio'} placement={'left'}>
                        <Link to={`/usuarios/${user.id}`}>
                          <Button size={'small'} icon={<EyeOutlined />} />
                        </Link>
                      </Tooltip>

                      <Tooltip title={'Editar usu??rio'} placement={'right'}>
                        <Link to={`/usuarios/edicao/${user.id}`}>
                          <Button size={'small'} icon={<EditOutlined />} />
                        </Link>
                      </Tooltip>
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
            sorter(a, b) {
              return a.role.localeCompare(b.role);
            },
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
            title: 'Cria????o',
            align: 'center',
            responsive: ['sm'],
            width: 120,
            sorter(a, b) {
              return new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1;
            },
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
                  disabled={
                    (active && !user.canBeDeactivated) ||
                    (!active && !user.canBeActivated)
                  }
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
            title: 'A????es',
            align: 'center',
            responsive: ['sm'],
            width: 100,
            render(id: number) {
              return (
                <Space>
                  <Tooltip title={'Editar usu??rio'} placement={'right'}>
                    <Link to={`/usuarios/edicao/${id}`}>
                      <Button
                        type={'text'}
                        size={'small'}
                        icon={<EditOutlined />}
                      />
                    </Link>
                  </Tooltip>

                  <Tooltip title={'Visualizar usu??rio'} placement={'left'}>
                    <Link to={`/usuarios/${id}`}>
                      <Button
                        type={'text'}
                        size={'small'}
                        icon={<EyeOutlined />}
                      />
                    </Link>
                  </Tooltip>
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
