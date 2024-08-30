import sequelize from "../lib/sequelize.js";
import { DataTypes } from "sequelize";

export default sequelize.define('clfy', {
  id: {
    type: DataTypes.UUID,
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
      model: 'uploader',
      key: 'name'
    }
  }
}, {
  tableName: 'clfy',
  timestamps: false
})