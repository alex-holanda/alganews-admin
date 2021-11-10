import CustomError from 'alex-holanda-sdk/dist/CustomError';
import { message, notification } from 'antd';
import { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import CashFlowExpensesView from './views/CashFlowExpenses.view';
import CashFlowRevenuesView from './views/CashFlowRevenues.view';
import HomeView from './views/Home.view';
import PaymentCreateView from './views/PaymentCreate.view';
import { PaymentDetailsView } from './views/PaymentDetails.view';
import PaymentListView from './views/PaymentList.view';
import UserCreateView from './views/UserCreate.view';
import UserDetailsView from './views/UserDetails.view';
import UserEditView from './views/UserEdit.view';
import UserListView from './views/UserList.view';

export default function Routes() {
  useEffect(() => {
    window.onunhandledrejection = ({ reason }) => {
      if (reason instanceof CustomError) {
        if (reason.data?.objects) {
          reason.data.objects.forEach((error) => {
            message.error(error.userMessage);
          });
        } else {
          notification.error({
            message: reason.message,
            description:
              reason.data?.detail === 'Network reason'
                ? 'Erro na rede'
                : reason.data?.detail,
          });
        }
      } else {
        notification.error({ message: 'Houve um erro' });
      }
    };

    return () => {
      window.onunhandledrejection = null;
    };
  }, []);

  return (
    <Switch>
      <Route path={'/'} component={HomeView} exact />
      <Route path={'/usuarios'} component={UserListView} exact />
      <Route path={'/usuarios/cadastro'} component={UserCreateView} exact />
      <Route path={'/usuarios/:id'} component={UserDetailsView} exact />
      <Route path={'/usuarios/edicao/:id'} component={UserEditView} exact />
      <Route path={'/pagamentos'} component={PaymentListView} exact />
      <Route path={'/pagamentos/:id'} component={PaymentDetailsView} exact />
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
