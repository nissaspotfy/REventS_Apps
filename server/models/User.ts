import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class User extends Model {
  public id!: number;
  public email!: string;
  public password?: string;
  public fullName!: string;
  public role!: 'organizer' | 'audience';
  public preferences!: {
    categories: string[];
    budget: string;
    frequency: string;
    ageGroup: string;
    [key: string]: any;
  };
  public profilePicUrl!: string | null;
  public googleId!: string | null;
  public passwordResetToken!: string | null;
  public passwordResetExpires!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: 'users_email_unique',
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('organizer', 'audience'),
      allowNull: false,
      defaultValue: 'audience',
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        categories: [],
        budget: '',
        frequency: '',
        ageGroup: '',
      },
    },
    profilePicUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);
