import sequelize from "../lib/sequelize.js";
import { DataTypes } from "sequelize";

export default sequelize.define('uploader', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'uploader',
  timestamps: false
})