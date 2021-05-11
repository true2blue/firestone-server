import mongoose from 'mongoose'
import l from '../../common/logger';

const tradeSchema = new mongoose.Schema({
    code : {
        type: String
    },
    state : {
        type: String,
        default: '未开始'
    },
    result : {
        type: String,
        default: '无'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    strategyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Strategy'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    createDate: {
        type: Date
    },
    params : {
        type: Object
    },
    order : {
        type: Object
    }
});

tradeSchema.statics.findByUserId = async function (userId) {
    l.info(`find the trade of user ${userId}`);
    let now = new Date();
    let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startOfTodayStr = `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${('0' + now.getDate()).slice(-2)}`;
    return this.find({
        userId: mongoose.Types.ObjectId(userId),
        $or: [{createDate: {$gte: startOfToday}}, {'params.executeDate': {$gte: startOfTodayStr}}],
        deleted: false
    }).sort({createDate : -1}).populate('strategyId');
}

tradeSchema.statics.findByUserIdAndDateAndCode = async function(userId, createdDate, code){
    l.info(`find history trade of user ${userId}, createDate = ${createdDate}, code = ${code}`);
    let startDate = new Date(createdDate);
    let endDate = new Date(createdDate);
    endDate.setDate(startDate.getDate() + 1);
    let cond = {
        userId: mongoose.Types.ObjectId(userId),
        createDate : {$gte: startDate, $lt: endDate},
        deleted: false
    };
    if(code != null && code.length > 0){
        cond.code = code;
    }
    return this.find(cond).populate('strategyId');
}


const trade = mongoose.model('Trade', tradeSchema);

export default trade;