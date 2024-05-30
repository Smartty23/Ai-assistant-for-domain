const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const audits = sequelize.define(
    'audits',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      report: {
        type: DataTypes.TEXT,
      },

      result: {
        type: DataTypes.ENUM,

        values: ['Passed', 'Failed'],
      },

      audited_at: {
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

  audits.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.audits.belongsTo(db.smart_contracts, {
      as: 'smart_contract',
      foreignKey: {
        name: 'smart_contractId',
      },
      constraints: false,
    });

    db.audits.belongsTo(db.users, {
      as: 'auditor',
      foreignKey: {
        name: 'auditorId',
      },
      constraints: false,
    });

    db.audits.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.audits.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.audits.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return audits;
};
