const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Smart_contractsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const smart_contracts = await db.smart_contracts.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        code: data.code || null,
        status: data.status || null,
        deployed_at: data.deployed_at || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await smart_contracts.setDeveloper(data.developer || null, {
      transaction,
    });

    await smart_contracts.setTeam(data.team || null, {
      transaction,
    });

    await smart_contracts.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return smart_contracts;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const smart_contractsData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      code: item.code || null,
      status: item.status || null,
      deployed_at: item.deployed_at || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const smart_contracts = await db.smart_contracts.bulkCreate(
      smart_contractsData,
      { transaction },
    );

    // For each item created, replace relation files

    return smart_contracts;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const smart_contracts = await db.smart_contracts.findByPk(
      id,
      {},
      { transaction },
    );

    await smart_contracts.update(
      {
        name: data.name || null,
        code: data.code || null,
        status: data.status || null,
        deployed_at: data.deployed_at || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await smart_contracts.setDeveloper(data.developer || null, {
      transaction,
    });

    await smart_contracts.setTeam(data.team || null, {
      transaction,
    });

    await smart_contracts.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return smart_contracts;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const smart_contracts = await db.smart_contracts.findByPk(id, options);

    await smart_contracts.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await smart_contracts.destroy({
      transaction,
    });

    return smart_contracts;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const smart_contracts = await db.smart_contracts.findOne(
      { where },
      { transaction },
    );

    if (!smart_contracts) {
      return smart_contracts;
    }

    const output = smart_contracts.get({ plain: true });

    output.audits_smart_contract =
      await smart_contracts.getAudits_smart_contract({
        transaction,
      });

    output.developer = await smart_contracts.getDeveloper({
      transaction,
    });

    output.team = await smart_contracts.getTeam({
      transaction,
    });

    output.organization = await smart_contracts.getOrganization({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.users,
        as: 'developer',
      },

      {
        model: db.teams,
        as: 'team',
      },

      {
        model: db.organizations,
        as: 'organization',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('smart_contracts', 'name', filter.name),
        };
      }

      if (filter.code) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('smart_contracts', 'code', filter.code),
        };
      }

      if (filter.deployed_atRange) {
        const [start, end] = filter.deployed_atRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            deployed_at: {
              ...where.deployed_at,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            deployed_at: {
              ...where.deployed_at,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.status) {
        where = {
          ...where,
          status: filter.status,
        };
      }

      if (filter.developer) {
        var listItems = filter.developer.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          developerId: { [Op.or]: listItems },
        };
      }

      if (filter.team) {
        var listItems = filter.team.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          teamId: { [Op.or]: listItems },
        };
      }

      if (filter.organization) {
        var listItems = filter.organization.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.smart_contracts.count({
            where: globalAccess ? {} : where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.smart_contracts.findAndCountAll({
          where: globalAccess ? {} : where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit, globalAccess, organizationId) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('smart_contracts', 'name', query),
        ],
      };
    }

    const records = await db.smart_contracts.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
