import l from '../../common/logger'
import Utils from '../common/Utils'
import models from '../models'
import mongoose from 'mongoose'

class ConfigService {

    constructor() {
    }

    async getConfig(accessToken) {
        let userId = Utils.getUserIdFromAccessToken(accessToken);
        return models.Config.findByUserId(userId);
    }

    async saveConfig(accessToken, update) {
        let userId = Utils.getUserIdFromAccessToken(accessToken);
        l.info(`userId = ${userId}, update config = ${JSON.stringify(update)}`);
        return models.Config.findOneAndUpdate({ userId: mongoose.Types.ObjectId(userId) }, update, { new: true })
    }

    async clear() {
        return models.Config.updateMany({}, { $set: { curBuyNum: 0, monitor_concept : [] } })
    }

    async createConfig(accessToken, update) {
        let userId = Utils.getUserIdFromAccessToken(accessToken);
        if (!userId) {
            return Promise.reject("invalid accessToken");
        }
        let initConfig = {
            userId: mongoose.Types.ObjectId(userId)
        }
        for (let k in update) {
            initConfig[k] = update[k];
        }
        let config = new models.Config(initConfig);
        l.info(`userId = ${userId} create config = ${config}`);
        return config.save();
    }
}

export default new ConfigService()