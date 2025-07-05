import sequelize from "../lib/sequelize.js";
import { DataTypes } from "sequelize";
import clfyModel from "./clfy.js";

const voiceModel = sequelize.define('voice', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
  },
  desc: {
    type: DataTypes.JSON,
    allowNull: false
  },
  path: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  creator: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'uploader',
      key: 'name'
    }
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clfyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'clfy'
    }
  }
}, {
  tableName: 'voice',
  timestamps: false
})

export default voiceModel