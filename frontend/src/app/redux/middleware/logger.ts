import { AnyAction, Dispatch, Middleware } from 'redux';

import { RootState } from '../store';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const logger: Middleware = (store: { dispatch: Dispatch<AnyAction>, getState: () => RootState }) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  console.log(action);

  return next(action);
}
