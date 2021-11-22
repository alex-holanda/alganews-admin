import CustomError from 'alex-holanda-sdk/dist/CustomError';
import { Card, Row, Typography } from 'antd';

import taxSvg from '../../assets/tax.svg';
import confusingSvg from '../../assets/confusing.svg';

interface PaymentPreviewEmptyProps {
  error?: CustomError;
}

export function PaymentPreviewEmpty(props: PaymentPreviewEmptyProps) {
  return (
    <Card bordered={false}>
      <Row justify={'center'} style={{ textAlign: 'center' }}>
        <img
          key={props.error ? 'errorImg' : 'img'}
          src={props.error ? confusingSvg : taxSvg}
          alt={'tax'}
          width={240}
        />
        <Typography.Title level={3} style={{ maxWidth: 360 }}>
          {props.error
            ? props.error.message
            : 'Selecione um editor e um período'}
        </Typography.Title>
        <Typography.Text>
          Para gerar uma prévia do pagamento, por favor, preencha os campos
          "Editor" e "Período"
        </Typography.Text>
      </Row>
    </Card>
  );
}
