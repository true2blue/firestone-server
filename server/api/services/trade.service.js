import l from '../../common/logger';
import models from '../models';
import Utils from '../common/Utils';
import mongoose from 'mongoose';

class TradeService {

    async queryTradesByUser(accessToken){
        let userId = Utils.getUserIdFromAccessToken(accessToken);
        return models.Trade.findByUserId(userId);
    }


    async queryHistoryTrades(accessToken, createdDate, code){
        let userId = Utils.getUserIdFromAccessToken(accessToken);
        return models.Trade.findByUserIdAndDateAndCode(userId, createdDate, code);
    }


    async updateTrade(accessToken, tradeId, update){
        let userId = Utils.getUserIdFromAccessToken(accessToken);
        l.info(`userId = ${userId}, update tradeId = ${tradeId} with update = ${JSON.stringify(update)}`);
        return models.Trade.findOneAndUpdate({userId : mongoose.Types.ObjectId(userId), _id : mongoose.Types.ObjectId(tradeId)}, update, {new : true})
    }

    async createTrade(accessToken, strategyId, params){
        let userId = Utils.getUserIdFromAccessToken(accessToken);
        let trade = new models.Trade({
            code : params.code,
            userId : mongoose.Types.ObjectId(userId),
            strategyId : mongoose.Types.ObjectId(strategyId),
            createDate : Date.now(),
            params : params
        });
        l.info(`userId = ${userId} create trade = ${trade}`);
        return trade.save();
    }
}

export default new TradeService();