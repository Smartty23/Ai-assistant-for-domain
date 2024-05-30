const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const smart_contracts = sequelize.define(
    'smart_contracts',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      code: {
        type: DataTypes.TEXT,
      },

      status: {
        type: DataTypes.ENUM,

        values: ['Draft', 'Deployed', 'Failed'],
      },

      deployed_at: {
        type: DataTypes.DATE,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  smart_contracts.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.smart_contracts.hasMany(db.audits, {
      as: 'audits_smart_contract',
      foreignKey: {
        name: 'smart_contractId',
      },
      constraints: false,
    });

    //end loop

    db.smart_contracts.belongsTo(db.users, {
      as: 'developer',
      foreignKey: {
        name: 'developerId',
      },
      constraints: false,
    });

    db.smart_contracts.belongsTo(db.teams, {
      as: 'team',
      foreignKey: {
        name: 'teamId',
      },
      constraints: false,
    });

    db.smart_contracts.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.smart_contracts.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.smart_contracts.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return smart_contracts;
};
