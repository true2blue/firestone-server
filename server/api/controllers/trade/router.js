import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .post('/', controller.updateTrade)
  .post('/new', controller.createTrade)
  .get('/:accesstoken', controller.queryUserTrades)
  .post('/history', controller.queryHistoryTrades)