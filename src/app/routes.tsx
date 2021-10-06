import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomeView from './views/Home.view';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={'/'} component={HomeView} exact />
      </Switch>
    </BrowserRouter>
  );
}
