import EntryCRUD from 'app/features/EntryCRUD';
import { useBreadcrumb } from 'core/hooks/useBreadcrumb';
import { usePageTitle } from 'core/hooks/usePageTitle';

export default function CashFlowExpensesView() {

  usePageTitle('Consulta de despesas');

  useBreadcrumb('Fluxo de caixa/Despesas');

  return (
    <>
      <EntryCRUD type={'EXPENSE'} />
    </>
  );
}
