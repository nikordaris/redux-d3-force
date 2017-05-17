import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { storiesOf, addDecorator } from '@kadira/storybook';

import reducers from '../src/redux/reducers';
import middleware from '../src/redux/middleware';

const store = createStore(reducers, applyMiddleware(middleware));

addDecorator((getStory) => (
  <Provider store={store}>
    {getStory()}
  </Provider>
));

storiesOf('ForceGraph', module)
  .add('to Storybook', () => (
    <div>
      
    </div>
  ));
