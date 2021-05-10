import mongoose from 'mongoose'

import User from './user'
import Config from './config'
import ConfigMock from './configMock'
import Trade from './trade'
import MockTrade from './mockTrade'
import Strategy from './strategy'

const connectDB = () => {
    return mongoose.connect(process.env.MONGO_URL);
};

const models = { User, Config, ConfigMock, Trade, MockTrade, Strategy };

export { connectDB };
export default models;
