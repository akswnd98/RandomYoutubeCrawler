import { Model, DataTypes } from 'sequelize';
import db from '..';

export default class Edge extends Model {
  id?: number;
  baseId?: string;
  relatedId?: string;
};

Edge.init({
  id: {
    field: 'id',
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  baseId: {
    field: 'baseId',
    type: DataTypes.STRING,
    allowNull: false,
  },
  relatedId: {
    field: 'relatedId',
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Edge',
  sequelize: db,
  timestamps: false,
});
