import sequelize from "../lib/sequelize";
import { DataTypes } from "sequelize";

export default sequelize.define('clfy', {
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
  creator: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'auth',
      key: 'name'
    }
  }
}, {
  tableName: 'clfy'
})