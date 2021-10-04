import { Col, Row, Typography } from 'antd';

import CompanyMetrics from './app/features/CompanyMetrics';

const { Title, Paragraph } = Typography;

function App() {
  return (
    <Row>
      <Col span={24}>
        <Title level={2}>Olá, José Souza</Title>

        <Paragraph>Este é o resumo da empresa nos últimos 12 meses</Paragraph>
      </Col>
      <Col span={24}>
        <CompanyMetrics />
      </Col>
    </Row>
  );
}

export default App;
