import examplesRouter from './api/controllers/examples/router';
import usersRouter from './api/controllers/users/router'
import configRouter from './api/controllers/config/router'
import configmockRouter from './api/controllers/configmocks/router'
import tradeRouter from './api/controllers/trade/router'
import mockTradeRouter from './api/controllers/mocktrade/router'
import strategyRouter from './api/controllers/strategies/router'
import fireStoneRockRouter from './api/controllers/firestonerock/router'

export default function routes(app) {
  app.use('/api/v1/examples', examplesRouter);
  app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/config', configRouter);
  app.use('/api/v1/configmock', configmockRouter);
  app.use('/api/v1/trade', tradeRouter);
  app.use('/api/v1/mocktrade', mockTradeRouter);
  app.use('/api/v1/strategy', strategyRouter);
  app.use('/api/v1/firestonerock', fireStoneRockRouter);
}
