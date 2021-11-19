import { Card, Row, Typography } from 'antd';

import taxSvg from '../../assets/tax.svg';

export function PaymentPreviewEmpty() {
  return (
    <Card bordered={false}>
      <Row justify={'center'} style={{ textAlign: 'center' }}>
        <img src={taxSvg} alt={'tax'} width={240} />
        <Typography.Title level={3}>
          Selecione um editor e um período
        </Typography.Title>
        <Typography.Text>
          Para gerar uma prévia do pagamento, por favor, preencha os campos
          "Editor" e "Período"
        </Typography.Text>
      </Row>
    </Card>
  );
}
