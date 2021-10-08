import { FileService } from 'alex-holanda-sdk';
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
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ptBR from 'antd/es/date-picker/locale/pt_BR';

import React, { useCallback, useState } from 'react';

const { TabPane } = Tabs;

export default function UserForm() {
  const [avatar, setAvatar] = useState('');

  const handleAvatarUpload = useCallback(async (file: File) => {
    const avatarSource = await FileService.upload(file);
    setAvatar(avatarSource);
  }, []);

  return (
    <Form layout={'vertical'}>
      <Row gutter={24} align={'middle'}>
        <Col lg={4}>
          <Upload
            beforeUpload={async (file) => {
              await handleAvatarUpload(file);
              return false;
            }}
            onRemove={() => setAvatar('')}
          >
            <Avatar
              icon={<UserOutlined />}
              src={avatar}
              size={128}
              style={{ cursor: 'pointer' }}
            />
          </Upload>
        </Col>

        <Col lg={10}>
          <Form.Item label={'Nome'}>
            <Input placeholder={'E.g.: João Silva'} />
          </Form.Item>

          <Form.Item label={'Data de nascimento'}>
            <DatePicker
              locale={ptBR}
              placeholder={'Selecione uma data'}
              format={'DD/MM/YYYY'}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col lg={10}>
          <Form.Item label={'Bio'}>
            <Input.TextArea rows={5} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Divider />
        </Col>

        <Col lg={12}>
          <Form.Item label={'Perfil'}>
            <Select placeholder={'Selecione um perfil'}>
              <Select.Option value={'EDITOR'}>Editor</Select.Option>
              <Select.Option value={'ASSISTENT'}>Assistente</Select.Option>
              <Select.Option value={'MANAGER'}>Gerente</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item label={'E-mail'}>
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
          <Tabs defaultActiveKey={'personal'}>
            <TabPane key={'personal'} tab={'Dados pessoais'}>
              <Row gutter={24}>
                <Col lg={8}>
                  <Form.Item label={'País'}>
                    <Input placeholder={'E.g.: Brasil'} />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label={'Estado'}>
                    <Input placeholder={'E.g.: Espírito Santo'} />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label={'Cidade'}>
                    <Input placeholder={'E.g.: Vitória'} />
                  </Form.Item>
                </Col>

                <Col lg={8}>
                  <Form.Item label={'Telefone'}>
                    <Input placeholder={'(27) 99999-0000'} />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label={'CPF'}>
                    <Input placeholder={'111.222.333-44'} />
                  </Form.Item>
                </Col>
                <Col lg={8}>
                  <Form.Item label={'Preço por palavra'}>
                    <Input placeholder={'0'} />
                  </Form.Item>
                </Col>

                {Array(3)
                  .fill(null)
                  .map((_, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Col lg={6}>
                          <Form.Item label={'Habilidade'}>
                            <Input placeholder={'E.g.: Javascript'} />
                          </Form.Item>
                        </Col>
                        <Col lg={2}>
                          <Form.Item label={'%'}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </React.Fragment>
                    );
                  })}

                <Col lg={8}></Col>
              </Row>
            </TabPane>

            <TabPane key={'bankAccount'} tab={'Dados bancários'}>
              <Row gutter={24}>
                <Col lg={8}>
                  <Form.Item label={'Instituição'}>
                    <Input placeholder={'260'} />
                  </Form.Item>
                </Col>

                <Col lg={8}>
                  <Form.Item label={'Agência'}>
                    <Input placeholder={'0001'} />
                  </Form.Item>
                </Col>

                <Col lg={8}>
                  <Form.Item label={'Conta sem dígito'}>
                    <Input placeholder={'12345'} />
                  </Form.Item>
                </Col>

                <Col lg={8}>
                  <Form.Item label={'Dígito'}>
                    <Input placeholder={'5'} />
                  </Form.Item>
                </Col>

                <Col lg={8}>
                  <Form.Item label={'Tipo de conta'}>
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
      </Row>
    </Form>
  );
}
