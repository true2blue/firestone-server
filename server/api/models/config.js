import mongoose from 'mongoose'
import l from '../../common/logger';

const configSchema = new mongoose.Schema({
    maxBuyNum: {
        type: Number
    },
    curBuyNum: {
        type: Number,
        default: 0
    },
    cookie: {
        type: String
    },
    validatekey: {
        type: String
    },
    gddm:{
        type: String
    },
    monitor_concept: {
        type: Array
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    }
});

configSchema.statics.findByUserId = async function (userId) {
    l.info(`find the config ${userId}`);
    return this.findOne({
        userId: mongoose.Types.ObjectId(userId)
    });
}

const Config = mongoose.model('Config', configSchema);

export default Config;