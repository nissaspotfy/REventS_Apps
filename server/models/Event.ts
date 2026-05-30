import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export class Event extends Model {
  public id!: number;
  public title!: string;
  public category!: string;
  public date!: string;
  public month!: string;
  public day!: string;
  public location!: string;
  public price!: string;
  public image!: string;
  public isTrending!: boolean;
  public organizerId!: number;
  public description!: string;
  public type!: string;
  public ticketType!: string;
  public ticketsSold!: number;
  public revenue!: number;
  public views!: number;
  public checkins!: number;
  public status!: 'active' | 'draft' | 'past' | 'cancelled';
  public isPublic!: boolean;
  public isSalesClosed!: boolean;
  public fullDescription?: string;
  public capacity?: number;
  public onlineLink?: string;
  public ticketName?: string;
  public provideCertificate?: boolean;
  public certificateReleased?: boolean;
  public certificateTemplateUrl?: string;
  public isExternal!: boolean;
  public externalUrl?: string;
  public externalProvider?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    day: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isTrending: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ticketType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ticketsSold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    revenue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    checkins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isSalesClosed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fullDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 100,
    },
    onlineLink: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    ticketName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'Standard Ticket',
    },
    provideCertificate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    certificateReleased: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    certificateTemplateUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    isExternal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    externalUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    externalProvider: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'events',
  }
);

// Define associations
Event.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });
User.hasMany(Event, { foreignKey: 'organizerId', as: 'events' });
