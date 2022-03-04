import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Form,
  Row,
  Col,
  Avatar,
  Input,
  DatePicker,
  Divider,
  Tabs,
  Select,
  Upload,
  Button,
  notification,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ptBR from 'antd/es/date-picker/locale/pt_BR';

import ImageCrop from 'antd-img-crop';

import MaskedInput from 'antd-mask-input';

import { Moment } from 'moment';

import { FileService, User, UserService } from 'alex-holanda-sdk';
import CustomError from 'alex-holanda-sdk/dist/CustomError';
import CurrencyInput from '../components/CurrencyInput';

const { TabPane } = Tabs;

type UserFormType = {
  createdAt: Moment;
  updatedAt: Moment;
  birthdate: Moment;
} & Omit<User.Detailed, 'createdAt' | 'updatedAt' | 'birthdate'>;

interface UserFormProps {
  user?: UserFormType;
  onUpdate?: (user: User.Input) => Promise<any>;
}

export default function UserForm(props: UserFormProps) {
  const history = useHistory();
  const [form] = Form.useForm<User.Input>();
  const [avatar, setAvatar] = useState(props.user?.avatarUrls.default || '');
  const [activeTab, setActiveTab] = useState<'personal' | 'bankAccount'>(
    'personal'
  );
  const [loading, setLoading] = useState(false);
  const [isEditorRole, setIsEditorRole] = useState(
    props.user?.role === 'EDITOR'
  );

  const handleAvatarUpload = useCallback(async (file: File) => {
    const avatarSource = await FileService.upload(file);
    setAvatar(avatarSource);
  }, []);

  useEffect(() => {
    form.setFieldsValue({ avatarUrl: avatar || undefined });
  }, [form, avatar]);

  return (
    <Form
      form={form}
      layout={'vertical'}
      initialValues={props.user}
      onFinish={async (user: User.Input) => {
        setLoading(true);
        const userDTO: User.Input = {
          ...user,
          phone: user.phone.replace(/\D/g, ''),
          taxpayerId: user.taxpayerId.replace(/\D/g, ''),
        };

        if (props.user) {
          return (
            props.onUpdate &&
            props.onUpdate(userDTO).finally(() => {
              setLoading(false);
              history.push(`/usuarios`);
            })
          );
        }

        try {
          await UserService.insertNewUser(userDTO);
          history.push(`/usuarios`);
          notification.success({
            message: 'Sucesso',
            description: 'Usuário criado com sucesso',
          });
        } catch (error) {
          if (error instanceof CustomError) {
            if (error.data?.objects) {
              form.setFields(
                error.data.objects.map((error) => {
                  return {
                    name: error.name
                      ?.split(/(\.|\[|\])/gi)
                      .filter(
                        (str) =>
                          str !== '.' &&
                          str !== '[' &&
                          str !== ']' &&
                          str !== ''
                      )
                      .map((str) =>
                        isNaN(Number(str)) ? str : Number(str)
                      ) as string[],
                    errors: [error.userMessage],
                  };
                })
              );
            } else {
              notification.error({
                message: error.message,
                description:
                  error.data?.detail === 'Network Error'
                    ? 'Erro na rede'
                    : error.data?.detail,
              });
            }
          } else {
            notification.error({ message: 'Houve um erro' });
          }
        } finally {
          setLoading(false);
        }
      }}
      onFinishFailed={(fields) => {
        let bankAccountErrors = 0;
        let personalDataErrors = 0;

        fields.errorFields.forEach(({ name }) => {
          if (name.includes('bankAccount')) {
            bankAccountErrors++;
          }

          if (
            name.includes('location') ||
            name.includes('skills') ||
            name.includes('phone') ||
            name.includes('taxpayerId') ||
            name.includes('pricePerWord')
          ) {
            personalDataErrors++;
          }
        });

        if (bankAccountErrors > personalDataErrors) {
          setActiveTab('bankAccount');
        }

        if (personalDataErrors > bankAccountErrors) {
          setActiveTab('personal');
        }
      }}
      autoComplete={'off'}
    >
      <Row gutter={24} align={'middle'}>
        <Col
          xs={24}
          lg={4}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ImageCrop rotate shape={'round'} grid aspect={1 / 1}>
            <Upload
              maxCount={1}
              beforeUpload={(file) => {
                handleAvatarUpload(file);
                return false;
              }}
              onRemove={() => {
                setAvatar('');
              }}
              fileList={[...(avatar ? [{ name: 'avatar', uid: '' }] : [])]}
            >
              <Avatar
                icon={<UserOutlined />}
                src={avatar}
                size={102}
                style={{ cursor: 'pointer' }}
              />
            </Upload>
          </ImageCrop>
          <Form.Item name={'avatarUrl'} hidden>
            <Input hidden />
          </Form.Item>
        </Col>

        <Col xs={24} lg={10}>
          <Form.Item
            label={'Nome'}
            name={'name'}
            rules={[
              { required: true, message: 'O campo é obrigatório' },
              { max: 255, message: 'O nome deve ter no máximo 255 caracteres' },
            ]}
          >
            <Input placeholder={'E.g.: João Silva'} />
          </Form.Item>

          <Form.Item
            label={'Data de nascimento'}
            name={'birthdate'}
            rules={[{ required: true, message: 'O campo é obrigatório' }]}
          >
            <DatePicker
              locale={ptBR}
              placeholder={'Selecione uma data'}
              format={'DD/MM/YYYY'}
              style={{ width: '100%' }}
              showToday={false}
            />
          </Form.Item>
        </Col>
        <Col xs={24} lg={10}>
          <Form.Item
            label={'Bio'}
            name={'bio'}
            rules={[
              { required: true, message: 'O campo é obrigatório' },
              {
                max: 255,
                message: 'O campo deve conter no máximo 255 caracteres',
              },
            ]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Divider />
        </Col>

        <Col xs={24} lg={12}>
          <Form.Item
            label={'Perfil'}
            name={'role'}
            rules={[{ required: true, message: 'O campo é obrigatório' }]}
          >
            <Select
              disabled={props.user && !props.user?.canSensitiveDataBeUpdated}
              placeholder={'Selecione um perfil'}
              onChange={(value) => setIsEditorRole(value === 'EDITOR')}
            >
              <Select.Option value={'EDITOR'}>Editor</Select.Option>
              <Select.Option value={'ASSISTENT'}>Assistente</Select.Option>
              <Select.Option value={'MANAGER'}>Gerente</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item
            label={'E-mail'}
            name={'email'}
            rules={[
              { required: true, message: 'O campo é obrigatório' },
              {
                max: 255,
                message: 'O e-mail deve ter no máximo 255 caracteres',
              },
            ]}
          >
            <Input
              disabled={props.user && !props.user?.canSensitiveDataBeUpdated}
              type={'email'}
              placeholder={'E.g.: contato@joao.silva.com'}
            />
          </Form.Item>
        </Col>

        <Col xs={24} lg={24}>
          <Divider />
        </Col>

        <Col xs={24} lg={24}>
          <Tabs
            defaultActiveKey={'personal'}
            activeKey={activeTab}
            onChange={(tab) => setActiveTab(tab as 'personal' | 'bankAccount')}
          >
            <TabPane key={'personal'} tab={'Dados pessoais'} forceRender>
              <Row gutter={24}>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label={'País'}
                    name={['location', 'country']}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                    ]}
                  >
                    <Input placeholder={'E.g.: Brasil'} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label={'Estado'}
                    name={['location', 'state']}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                    ]}
                  >
                    <Input placeholder={'E.g.: Espírito Santo'} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label={'Cidade'}
                    name={['location', 'city']}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                    ]}
                  >
                    <Input placeholder={'E.g.: Vitória'} />
                  </Form.Item>
                </Col>

                <Col xs={24} lg={8}>
                  <Form.Item
                    label={'Telefone'}
                    name={'phone'}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                    ]}
                  >
                    <MaskedInput
                      disabled={props.user && !props.user?.canSensitiveDataBeUpdated}
                      mask={'(11) 11111-1111'}
                      placeholder={'(27) 99999-0000'}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label={'CPF'}
                    name={'taxpayerId'}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                      {
                        max: 14,
                        message: 'O cpf deve ter no máximo 14 caracteres',
                      },
                    ]}
                  >
                    <MaskedInput
                      mask={'111.111.111-11'}
                      placeholder={'111.222.333-44'}
                      maxLength={14}
                    />
                  </Form.Item>
                </Col>
                {isEditorRole && (
                  <>
                    <Col xs={24} lg={8}>
                      <Form.Item
                        label={'Preço por palavra'}
                        name={'pricePerWord'}
                        rules={[
                          { required: true, message: 'O campo é obrigatório' },
                          {
                            type: 'number',
                            min: 0.01,
                            message: 'O valor mínimo é 1 centavo',
                          },
                        ]}
                      >
                        <CurrencyInput
                          onChange={(e, value) => {
                            form.setFieldsValue({ pricePerWord: value });
                          }}
                        />
                      </Form.Item>
                    </Col>

                    {Array(3)
                      .fill(null)
                      .map((_, index) => {
                        return (
                          <React.Fragment key={index}>
                            <Col xs={19} lg={5}>
                              <Form.Item
                                label={'Habilidade'}
                                name={['skills', index, 'name']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'O campo é obrigatório',
                                  },
                                  {
                                    max: 50,
                                    message:
                                      'O nome deve ter no máximo 50 caracteres',
                                  },
                                ]}
                              >
                                <Input
                                  placeholder={'E.g.: Javascript'}
                                  maxLength={50}
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={5} lg={3}>
                              <Form.Item
                                label={'%'}
                                name={['skills', index, 'percentage']}
                                rules={[
                                  {
                                    required: true,
                                    message: '',
                                  },
                                  {
                                    async validator(field, value) {
                                      if (isNaN(Number(value))) {
                                        throw new Error('Apenas números');
                                      }

                                      if (Number(value) > 100) {
                                        throw new Error('Máximo até 100');
                                      }

                                      if (Number(value) < 0) {
                                        throw new Error('Mínimo 0');
                                      }
                                    },
                                  },
                                ]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                          </React.Fragment>
                        );
                      })}
                  </>
                )}
              </Row>
            </TabPane>

            <TabPane key={'bankAccount'} tab={'Dados bancários'} forceRender>
              <Row gutter={24}>
                <Col xs={24} lg={8}>
                  <Form.Item
                    label={'Instituição'}
                    name={['bankAccount', 'bankCode']}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                      {
                        min: 3,
                        max: 3,
                        message: 'O campo deve conter 3 caracteres',
                      },
                    ]}
                  >
                    <Input placeholder={'260'} type={'number'} />
                  </Form.Item>
                </Col>

                <Col xs={24} lg={8}>
                  <Form.Item
                    label={'Agência'}
                    name={['bankAccount', 'agency']}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                      {
                        min: 1,
                        max: 10,
                        message: 'O campo deve ter entre 1 e 10 caracteres',
                      },
                    ]}
                  >
                    <Input placeholder={'0001'} />
                  </Form.Item>
                </Col>

                <Col xs={24} lg={8}>
                  <Form.Item
                    label={'Conta sem dígito'}
                    name={['bankAccount', 'number']}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                      {
                        min: 1,
                        max: 20,
                        message: 'O campo deve ter entre 1 e 20 caracteres',
                      },
                    ]}
                  >
                    <Input placeholder={'12345'} />
                  </Form.Item>
                </Col>

                <Col xs={24} lg={8}>
                  <Form.Item
                    label={'Dígito'}
                    name={['bankAccount', 'digit']}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                      {
                        min: 1,
                        max: 1,
                        message: 'O campo deve ter entre 1 caractere',
                      },
                    ]}
                  >
                    <Input placeholder={'5'} type={'number'} />
                  </Form.Item>
                </Col>

                <Col xs={24} lg={8}>
                  <Form.Item
                    label={'Tipo de conta'}
                    name={['bankAccount', 'type']}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                    ]}
                  >
                    <Select placeholder={'Selecione o tipo de conta'}>
                      <Select.Option value={'SAVING'}>
                        Conta poupança
                      </Select.Option>
                      <Select.Option value={'CHECKING'}>
                        Conta corrente
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Col>
        <Col xs={24} lg={24}>
          <Row justify={'end'}>
            <Button htmlType={'submit'} type={'primary'} loading={loading}>
              {props.user ? 'Atualizar usuário' : 'Cadastrar usuário'}
            </Button>
          </Row>
        </Col>
      </Row>
    </Form>
  );
}
