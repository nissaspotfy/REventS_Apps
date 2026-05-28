import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { Event } from './Event';

export class Ticket extends Model {
  public id!: number;
  public userId!: number;
  public eventId!: number;
  public purchaseDate!: string;
  public status!: 'active' | 'past';
  public paymentMethod!: string;
  public price!: string;
  public qrCode!: string;
  public checkedIn!: boolean;
  public fullName!: string;
  public email!: string;
  public audienceCategory!: string;
  public referralSource!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id',
      },
    },
    purchaseDate: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'past'),
      allowNull: false,
      defaultValue: 'active',
    },
    paymentMethod: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    qrCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    checkedIn: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    audienceCategory: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    referralSource: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'tickets',
  }
);

// Define associations
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Ticket, { foreignKey: 'userId', as: 'tickets' });

Ticket.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
Event.hasMany(Ticket, { foreignKey: 'eventId', as: 'tickets' });
