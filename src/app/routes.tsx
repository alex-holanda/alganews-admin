import { Switch, Route } from 'react-router-dom';
import CashFlowExpensesView from './views/CashFlowExpenses.view';
import CashFlowRevenuesView from './views/CashFlowRevenues.view';
import HomeView from './views/Home.view';
import PaymentCreateView from './views/PaymentCreate.view';
import PaymentListView from './views/PaymentList.view';
import UserCreateView from './views/UserCreate.view';
import UserListView from './views/UserList.view';

export default function Routes() {
  return (
    <Switch>
      <Route path={'/'} component={HomeView} exact />
      <Route path={'/usuarios'} component={UserListView} exact />
      <Route path={'/usuarios/cadastro'} component={UserCreateView} exact />
      <Route path={'/pagamentos'} component={PaymentListView} exact />
      <Route
        path={'/pagamentos/cadastro'}
        component={PaymentCreateView}
        exact
      />
      <Route
        path={'/fluxo-de-caixa/despesas'}
        component={CashFlowExpensesView}
        exact
      />
      <Route
        path={'/fluxo-de-caixa/receitas'}
        component={CashFlowRevenuesView}
        exact
      />
    </Switch>
  );
}
