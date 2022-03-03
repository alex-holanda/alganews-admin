import { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import { message, notification } from 'antd';

import jwtDecode from 'jwt-decode';

import CustomError from 'alex-holanda-sdk/dist/CustomError';
import AuthService from 'auth/Authorization.service';

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

import { Authentication } from 'auth/auth';

import { useAuth } from 'core/hooks/useAuth';

export default function Routes() {
  const history = useHistory();
  const { fetchUser } = useAuth();

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
        notification.error({ message: reason?.message || 'Houve um erro' });
      }
    };

    return () => {
      window.onunhandledrejection = null;
    };
  }, []);

  useEffect(() => {
    async function identify() {
      const isInAuthorizationRoute = window.location.pathname === '/authorize';
      const code = new URLSearchParams(window.location.search).get('code');

      const codeVerifier = AuthService.getCodeVerifier();
      const accessToken = AuthService.getAccessToken();

      if (!accessToken && !isInAuthorizationRoute) {
        AuthService.imperativelySendToLoginScreen();
      }

      if (isInAuthorizationRoute) {
        if (!code) {
          notification.error({ message: 'Código não informado' });
          return;
        }

        if (!codeVerifier) {
          // necessário fazer logout
          return;
        }

        // busca o primeiro token de acesso
        const { access_token, refresh_token } =
          await AuthService.getFirstAccessToken({
            code,
            codeVerifier,
            redirectUri: 'http://localhost:3000/authorize',
          });

        AuthService.setAccessToken(access_token);
        AuthService.setRefreshToken(refresh_token);

        history.push('/');
      }

      if (accessToken) {
        const decodedToken: Authentication.AccessTokenDecodedBody =
          jwtDecode(accessToken);

        fetchUser(decodedToken['alganews:user_id']);
      }
    }

    identify();
  }, [history, fetchUser]);

  return (
    <Switch>
      <Route path={'/'} component={HomeView} exact />
      <Route path={'/usuarios'} component={UserListView} exact />
      <Route path={'/usuarios/cadastro'} component={UserCreateView} exact />
      <Route path={'/usuarios/:id'} component={UserDetailsView} exact />
      <Route path={'/usuarios/edicao/:id'} component={UserEditView} exact />
      <Route path={'/pagamentos'} component={PaymentListView} exact />
      <Route
        path={'/pagamentos/cadastro'}
        component={PaymentCreateView}
        exact
      />
      <Route path={'/pagamentos/:id'} component={PaymentDetailsView} exact />
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
