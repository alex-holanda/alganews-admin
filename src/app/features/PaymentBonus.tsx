import { Payment } from 'alex-holanda-sdk';
import { Descriptions, Skeleton, Typography } from 'antd';
import { transformNumberToCurrency } from '../../core/util/transformNumberToCurrency';

interface PaymentBonusProps {
  bonus?: Payment.Detailed['bonuses'];
  isLoading?: boolean;
}

export function PaymentBonus(props: PaymentBonusProps) {
  if (props.isLoading) {
    return <Skeleton />;
  }

  return (
    <>
      <Typography.Title level={2}>Bônus</Typography.Title>
      <Descriptions bordered size={'small'} column={1}>
        {props.bonus?.map((bonus, index) => {
          return (
            <Descriptions.Item key={index} label={bonus.title}>
              {transformNumberToCurrency(bonus.amount)}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </>
  );
}
