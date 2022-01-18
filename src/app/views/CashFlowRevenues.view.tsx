import { CashFlow } from 'alex-holanda-sdk';
import EntriesList from 'app/features/EntriesList';

export default function CashFlowRevenuesView() {
  const type: CashFlow.CategorySummary['type'] = 'REVENUE';

  return (
    <>
      <h2>TODO: CashFlowRevenuesView</h2>

      <EntriesList type={type} />
    </>
  );
}
