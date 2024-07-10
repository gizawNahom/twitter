/* Core */
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
// import { createLogger } from 'redux-logger';
import { createPostAsync, idleCreateStatus } from './slices';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(createPostAsync.fulfilled, createPostAsync.rejected),
  effect: async (action, { dispatch, getState }) => {
    setTimeout(() => {
      dispatch(idleCreateStatus());
    }, 4000);
  },
});

const middleware = [
  // createLogger({
  //   duration: true,
  //   timestamp: false,
  //   collapsed: true,
  //   colors: {
  //     title: () => '#139BFE',
  //     prevState: () => '#1C5FAF',
  //     action: () => '#149945',
  //     nextState: () => '#A47104',
  //     error: () => '#ff0005',
  //   },
  //   predicate: () => typeof window !== 'undefined',
  // }),
  listenerMiddleware.middleware,
];

export { middleware };
