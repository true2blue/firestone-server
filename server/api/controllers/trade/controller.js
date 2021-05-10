import tradeService from '../../services/trade.service'

export class TradeController{

    queryUserTrades(req, res){
        tradeService.queryTradesByUser(req.params.accesstoken).then(r => {
            r ? res.json(r) : res.json([]);
        }, err => {
            res.json({"error" : err ? err.toString() : 'failed to query trades'});
        });
    }

    queryHistoryTrades(req, res){
        tradeService.queryHistoryTrades(req.body.accesstoken, req.body.createdDate, req.body.code).then(r => {
            r ? res.json(r) : res.json([]);
        }, err => {
            res.json({"error" : err ? err.toString() : 'failed to query history trades'});
        });
    }

    updateTrade(req, res){
        tradeService.updateTrade(req.body.accesstoken, req.body.tradeid, req.body.update).then(r => {
            r ? res.json(r) : res.json({});
        }, err => {
            res.json({"error" : err ? err.toString() : 'failed to update trade'});
        });
    }

    createTrade(req, res){
        tradeService.createTrade(req.body.accesstoken, req.body.strategyId, req.body.params).then(r => {
            r ? res.json(r) : res.json({});
        }, err => {
            res.json({"error" : err ? err.toString() : 'failed to create trade'});
        });
    }
}

export default new TradeController()