import { Model, DataTypes } from 'sequelize';
import db from '..';

export default class Node extends Model {
  id?: number;
  ytId?: string;
};

Node.init({
  id: {
    field: 'id',
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  ytId: {
    field: 'ytId',
    type: DataTypes.STRING,
    allowNull: false,
  },
  visit: {
    field: 'visit',
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'Node',
  sequelize: db,
  timestamps: false,
});
