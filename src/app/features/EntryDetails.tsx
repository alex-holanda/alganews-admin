import { CashFlow, CashFlowService } from 'alex-holanda-sdk';
import { Descriptions, Skeleton } from 'antd';
import { transformNumberToCurrency } from 'core/util/transformNumberToCurrency';
import {
  transformStringToDate,
  transformStringToDateTime,
} from 'core/util/transformStringToDate';
import { useEffect, useState } from 'react';

interface EntryDetailsProps {
  entryId: number;
}

function EntryDetails({ entryId }: EntryDetailsProps) {
  const [entry, setEntry] = useState<CashFlow.EntryDetailed>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    CashFlowService.getExistingEntry(entryId)
      .then(setEntry)
      .finally(() => setLoading(false));
  }, [entryId]);

  return loading ? (
    <>
      <Skeleton />
      <Skeleton title={false} />
      <Skeleton title={false} />
    </>
  ) : (
    <>
      {entry && (
        <Descriptions column={1} bordered size={'small'}>
          <Descriptions.Item label={'Descrição'}>
            {entry.description}
          </Descriptions.Item>
          <Descriptions.Item label={'Categoria'}>
            {entry.category.name}
          </Descriptions.Item>
          <Descriptions.Item label={'Data de entrada'}>
            {transformStringToDate(entry.transactedOn)}
          </Descriptions.Item>
          <Descriptions.Item label={'Valor'}>
            {transformNumberToCurrency(entry.amount)}
          </Descriptions.Item>
          <Descriptions.Item label={'Criado em'}>
            {transformStringToDateTime(entry.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label={'Criado por'}>
            {entry.createdBy.name}
          </Descriptions.Item>
          {entry.createdAt !== entry.updatedAt && (
            <>
              <Descriptions.Item label={'Atualizado em'}>
                {transformStringToDateTime(entry.updatedAt)}
              </Descriptions.Item>
              <Descriptions.Item label={'Atualizado por'}>
                {entry.updatedBy.name}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      )}
    </>
  );
}

export default EntryDetails;
