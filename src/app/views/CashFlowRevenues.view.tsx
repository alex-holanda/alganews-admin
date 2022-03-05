import EntryCRUD from 'app/features/EntryCRUD';
import { useBreadcrumb } from 'core/hooks/useBreadcrumb';
import { usePageTitle } from 'core/hooks/usePageTitle';

export default function CashFlowRevenuesView() {

  usePageTitle('Consulta de receitas');

  useBreadcrumb('Fluxo de caixa/Receitas');

  return (
    <>
      <EntryCRUD type={'REVENUE'} />
    </>
  );
}
