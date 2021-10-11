import React, { useCallback, useEffect, useState } from 'react';
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
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ptBR from 'antd/es/date-picker/locale/pt_BR';

import ImageCrop from 'antd-img-crop';

import { FileService, User } from 'alex-holanda-sdk';

const { TabPane } = Tabs;

export default function UserForm() {
  const [form] = Form.useForm<User.Input>();
  const [avatar, setAvatar] = useState('');
  const [activeTab, setActiveTab] = useState<'personal' | 'bankAccount'>(
    'personal'
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
      onFinish={(form) => {
        console.log(form);
      }}
    >
      <Row gutter={24} align={'middle'}>
        <Col lg={4}>
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
            >
              <Avatar
                icon={<UserOutlined />}
                src={avatar}
                size={128}
                style={{ cursor: 'pointer' }}
              />
            </Upload>
          </ImageCrop>
          <Form.Item name={'avatarUrl'} hidden />
        </Col>

        <Col lg={10}>
          <Form.Item
            label={'Nome'}
            name={'name'}
            rules={[{ required: true, message: 'O campo é obrigatório' }]}
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
            />
          </Form.Item>
        </Col>
        <Col lg={10}>
          <Form.Item
            label={'Bio'}
            name={'bio'}
            rules={[{ required: true, message: 'O campo é obrigatório' }]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Divider />
        </Col>

        <Col lg={12}>
          <Form.Item
            label={'Perfil'}
            name={'role'}
            rules={[{ required: true, message: 'O campo é obrigatório' }]}
          >
            <Select placeholder={'Selecione um perfil'}>
              <Select.Option value={'EDITOR'}>Editor</Select.Option>
              <Select.Option value={'ASSISTENT'}>Assistente</Select.Option>
              <Select.Option value={'MANAGER'}>Gerente</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item
            label={'E-mail'}
            name={'email'}
            rules={[{ required: true, message: 'O campo é obrigatório' }]}
          >
            <Input
              type={'email'}
              placeholder={'E.g.: contato@joao.silva.com'}
            />
          </Form.Item>
        </Col>

        <Col lg={24}>
          <Divider />
        </Col>

        <Col lg={24}>
          <Tabs
            defaultActiveKey={'personal'}
            activeKey={activeTab}
            onChange={(tab) => setActiveTab(tab as 'personal' | 'bankAccount')}
          >
            <TabPane key={'personal'} tab={'Dados pessoais'} forceRender>
              <Row gutter={24}>
                <Col lg={8}>
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
                <Col lg={8}>
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
                <Col lg={8}>
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

                <Col lg={8}>
                  <Form.Item
                    label={'Telefone'}
                    name={'phone'}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                    ]}
                  >
                    <Input placeholder={'(27) 99999-0000'} />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item
                    label={'CPF'}
                    name={'taxpayerId'}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                    ]}
                  >
                    <Input placeholder={'111.222.333-44'} />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item
                    label={'Preço por palavra'}
                    name={'pricePerWord'}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                    ]}
                  >
                    <Input placeholder={'0'} />
                  </Form.Item>
                </Col>

                {Array(3)
                  .fill(null)
                  .map((_, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Col lg={6}>
                          <Form.Item
                            label={'Habilidade'}
                            name={['skills', index, 'name']}
                            rules={[
                              {
                                required: true,
                                message: 'O campo é obrigatório',
                              },
                            ]}
                          >
                            <Input placeholder={'E.g.: Javascript'} />
                          </Form.Item>
                        </Col>
                        <Col lg={2}>
                          <Form.Item
                            label={'%'}
                            name={['skills', index, 'percentage']}
                            rules={[
                              {
                                required: true,
                                message: '',
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </React.Fragment>
                    );
                  })}

                <Col lg={8}></Col>
              </Row>
            </TabPane>

            <TabPane key={'bankAccount'} tab={'Dados bancários'} forceRender>
              <Row gutter={24}>
                <Col lg={8}>
                  <Form.Item
                    label={'Instituição'}
                    name={['bankAccount', 'bankCode']}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                    ]}
                  >
                    <Input placeholder={'260'} />
                  </Form.Item>
                </Col>

                <Col lg={8}>
                  <Form.Item
                    label={'Agência'}
                    name={['bankAccount', 'agency']}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                    ]}
                  >
                    <Input placeholder={'0001'} />
                  </Form.Item>
                </Col>

                <Col lg={8}>
                  <Form.Item
                    label={'Conta sem dígito'}
                    name={['bankAccount', 'number']}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                    ]}
                  >
                    <Input placeholder={'12345'} />
                  </Form.Item>
                </Col>

                <Col lg={8}>
                  <Form.Item
                    label={'Dígito'}
                    name={['bankAccount', 'digit']}
                    rules={[
                      { required: true, message: 'O campo é obrigatório' },
                    ]}
                  >
                    <Input placeholder={'5'} />
                  </Form.Item>
                </Col>

                <Col lg={8}>
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
        <Col lg={24}>
          <Row justify={'end'}>
            <Button htmlType={'submit'} type={'primary'}>
              Cadastrar usuário
            </Button>
          </Row>
        </Col>
      </Row>
    </Form>
  );
}
