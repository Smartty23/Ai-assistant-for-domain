const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class AuditsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const audits = await db.audits.create(
      {
        id: data.id || undefined,

        report: data.report || null,
        result: data.result || null,
        audited_at: data.audited_at || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await audits.setSmart_contract(data.smart_contract || null, {
      transaction,
    });

    await audits.setAuditor(data.auditor || null, {
      transaction,
    });

    await audits.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return audits;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const auditsData = data.map((item, index) => ({
      id: item.id || undefined,

      report: item.report || null,
      result: item.result || null,
      audited_at: item.audited_at || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const audits = await db.audits.bulkCreate(auditsData, { transaction });

    // For each item created, replace relation files

    return audits;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const audits = await db.audits.findByPk(id, {}, { transaction });

    await audits.update(
      {
        report: data.report || null,
        result: data.result || null,
        audited_at: data.audited_at || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await audits.setSmart_contract(data.smart_contract || null, {
      transaction,
    });

    await audits.setAuditor(data.auditor || null, {
      transaction,
    });

    await audits.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return audits;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const audits = await db.audits.findByPk(id, options);

    await audits.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await audits.destroy({
      transaction,
    });

    return audits;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const audits = await db.audits.findOne({ where }, { transaction });

    if (!audits) {
      return audits;
    }

    const output = audits.get({ plain: true });

    output.smart_contract = await audits.getSmart_contract({
      transaction,
    });

    output.auditor = await audits.getAuditor({
      transaction,
    });

    output.organization = await audits.getOrganization({
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
        model: db.smart_contracts,
        as: 'smart_contract',
      },

      {
        model: db.users,
        as: 'auditor',
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

      if (filter.report) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('audits', 'report', filter.report),
        };
      }

      if (filter.audited_atRange) {
        const [start, end] = filter.audited_atRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            audited_at: {
              ...where.audited_at,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            audited_at: {
              ...where.audited_at,
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

      if (filter.result) {
        where = {
          ...where,
          result: filter.result,
        };
      }

      if (filter.smart_contract) {
        var listItems = filter.smart_contract.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          smart_contractId: { [Op.or]: listItems },
        };
      }

      if (filter.auditor) {
        var listItems = filter.auditor.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          auditorId: { [Op.or]: listItems },
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
          count: await db.audits.count({
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
      : await db.audits.findAndCountAll({
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
          Utils.ilike('audits', 'smart_contract', query),
        ],
      };
    }

    const records = await db.audits.findAll({
      attributes: ['id', 'smart_contract'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['smart_contract', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.smart_contract,
    }));
  }
};
