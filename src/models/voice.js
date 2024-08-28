import sequelize from "../lib/sequelize";
import { DataTypes } from "sequelize";

export default sequelize.define('voice', {
  id: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true
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
      model: 'auth',
      key: 'name'
    }
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clfy: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    references: {
      model: 'clfy'
    }
  }
}, {
  tableName: 'clfy'
})