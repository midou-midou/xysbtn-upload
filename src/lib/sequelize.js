import Sequelize from 'sequelize'
import {logger} from '../middleware/logger';
import config from '../config'

const sequelize = new Sequelize(config.db.url, {
  logging: (...msg) => logger.info(...msg),
  pool: {
    max: 50,
    min: 0,
    idle: 10000
  }
})

;(function testConnected(){
  try {
    sequelize.authenticate();
  } catch (error) {
    throw new Error('Unable to connect to the database:', error);
  }
})()

export default sequelize
