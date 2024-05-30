const db = require('../models');
const Users = db.users;

const Audits = db.audits;

const Notifications = db.notifications;

const SmartContracts = db.smart_contracts;

const Teams = db.teams;

const Organizations = db.organizations;

const AuditsData = [
  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    report: 'No issues found. Contract is secure.',

    result: 'Passed',

    audited_at: new Date('2023-10-02T12:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    report: 'Minor issues found. Recommend fixes.',

    result: 'Passed',

    audited_at: new Date('2023-10-03T15:00:00Z'),

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    report: 'Critical vulnerabilities found. Deployment failed.',

    result: 'Passed',

    audited_at: new Date('2023-09-16T10:30:00Z'),

    // type code here for "relation_one" field
  },
];

const NotificationsData = [
  {
    message: 'Your smart contract has been deployed successfully.',

    // type code here for "relation_one" field

    sent_at: new Date('2023-10-01T10:05:00Z'),

    // type code here for "relation_one" field
  },

  {
    message: 'Your smart contract audit report is ready.',

    // type code here for "relation_one" field

    sent_at: new Date('2023-10-03T15:05:00Z'),

    // type code here for "relation_one" field
  },

  {
    message: 'Your smart contract deployment failed. Check the audit report.',

    // type code here for "relation_one" field

    sent_at: new Date('2023-09-16T10:35:00Z'),

    // type code here for "relation_one" field
  },
];

const SmartContractsData = [
  {
    name: 'Crowdfunding Contract',

    code: 'pragma solidity ^0.8.0; contract Crowdfunding { ... }',

    status: 'Deployed',

    deployed_at: new Date(),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    name: 'Token Creation Contract',

    code: 'pragma solidity ^0.8.0; contract Token { ... }',

    status: 'Failed',

    deployed_at: new Date('2023-10-01T10:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    name: 'DAO Contract',

    code: 'pragma solidity ^0.8.0; contract DAO { ... }',

    status: 'Deployed',

    deployed_at: new Date('2023-09-15T14:30:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const TeamsData = [
  {
    name: 'Team Alpha',

    description: 'Team focused on crowdfunding contracts',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Team Beta',

    description: 'Team focused on token creation',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Team Gamma',

    description: 'Team focused on DAOs',

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

const OrganizationsData = [
  {
    name: 'Dmitri Mendeleev',
  },

  {
    name: 'Alfred Kinsey',
  },

  {
    name: 'Jonas Salk',
  },
];

// Similar logic for "relation_many"

async function associateUserWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setOrganization) {
    await User0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setOrganization) {
    await User1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setOrganization) {
    await User2.setOrganization(relatedOrganization2);
  }
}

async function associateAuditWithSmart_contract() {
  const relatedSmart_contract0 = await SmartContracts.findOne({
    offset: Math.floor(Math.random() * (await SmartContracts.count())),
  });
  const Audit0 = await Audits.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Audit0?.setSmart_contract) {
    await Audit0.setSmart_contract(relatedSmart_contract0);
  }

  const relatedSmart_contract1 = await SmartContracts.findOne({
    offset: Math.floor(Math.random() * (await SmartContracts.count())),
  });
  const Audit1 = await Audits.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Audit1?.setSmart_contract) {
    await Audit1.setSmart_contract(relatedSmart_contract1);
  }

  const relatedSmart_contract2 = await SmartContracts.findOne({
    offset: Math.floor(Math.random() * (await SmartContracts.count())),
  });
  const Audit2 = await Audits.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Audit2?.setSmart_contract) {
    await Audit2.setSmart_contract(relatedSmart_contract2);
  }
}

async function associateAuditWithAuditor() {
  const relatedAuditor0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Audit0 = await Audits.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Audit0?.setAuditor) {
    await Audit0.setAuditor(relatedAuditor0);
  }

  const relatedAuditor1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Audit1 = await Audits.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Audit1?.setAuditor) {
    await Audit1.setAuditor(relatedAuditor1);
  }

  const relatedAuditor2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Audit2 = await Audits.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Audit2?.setAuditor) {
    await Audit2.setAuditor(relatedAuditor2);
  }
}

async function associateAuditWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Audit0 = await Audits.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Audit0?.setOrganization) {
    await Audit0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Audit1 = await Audits.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Audit1?.setOrganization) {
    await Audit1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Audit2 = await Audits.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Audit2?.setOrganization) {
    await Audit2.setOrganization(relatedOrganization2);
  }
}

async function associateNotificationWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Notification0 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Notification0?.setUser) {
    await Notification0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Notification1 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Notification1?.setUser) {
    await Notification1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Notification2 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Notification2?.setUser) {
    await Notification2.setUser(relatedUser2);
  }
}

async function associateNotificationWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Notification0 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Notification0?.setOrganization) {
    await Notification0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Notification1 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Notification1?.setOrganization) {
    await Notification1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Notification2 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Notification2?.setOrganization) {
    await Notification2.setOrganization(relatedOrganization2);
  }
}

async function associateSmartContractWithDeveloper() {
  const relatedDeveloper0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const SmartContract0 = await SmartContracts.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (SmartContract0?.setDeveloper) {
    await SmartContract0.setDeveloper(relatedDeveloper0);
  }

  const relatedDeveloper1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const SmartContract1 = await SmartContracts.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (SmartContract1?.setDeveloper) {
    await SmartContract1.setDeveloper(relatedDeveloper1);
  }

  const relatedDeveloper2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const SmartContract2 = await SmartContracts.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (SmartContract2?.setDeveloper) {
    await SmartContract2.setDeveloper(relatedDeveloper2);
  }
}

async function associateSmartContractWithTeam() {
  const relatedTeam0 = await Teams.findOne({
    offset: Math.floor(Math.random() * (await Teams.count())),
  });
  const SmartContract0 = await SmartContracts.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (SmartContract0?.setTeam) {
    await SmartContract0.setTeam(relatedTeam0);
  }

  const relatedTeam1 = await Teams.findOne({
    offset: Math.floor(Math.random() * (await Teams.count())),
  });
  const SmartContract1 = await SmartContracts.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (SmartContract1?.setTeam) {
    await SmartContract1.setTeam(relatedTeam1);
  }

  const relatedTeam2 = await Teams.findOne({
    offset: Math.floor(Math.random() * (await Teams.count())),
  });
  const SmartContract2 = await SmartContracts.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (SmartContract2?.setTeam) {
    await SmartContract2.setTeam(relatedTeam2);
  }
}

async function associateSmartContractWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const SmartContract0 = await SmartContracts.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (SmartContract0?.setOrganization) {
    await SmartContract0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const SmartContract1 = await SmartContracts.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (SmartContract1?.setOrganization) {
    await SmartContract1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const SmartContract2 = await SmartContracts.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (SmartContract2?.setOrganization) {
    await SmartContract2.setOrganization(relatedOrganization2);
  }
}

// Similar logic for "relation_many"

async function associateTeamWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Team0 = await Teams.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Team0?.setOrganization) {
    await Team0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Team1 = await Teams.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Team1?.setOrganization) {
    await Team1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Team2 = await Teams.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Team2?.setOrganization) {
    await Team2.setOrganization(relatedOrganization2);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Audits.bulkCreate(AuditsData);

    await Notifications.bulkCreate(NotificationsData);

    await SmartContracts.bulkCreate(SmartContractsData);

    await Teams.bulkCreate(TeamsData);

    await Organizations.bulkCreate(OrganizationsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateUserWithOrganization(),

      await associateAuditWithSmart_contract(),

      await associateAuditWithAuditor(),

      await associateAuditWithOrganization(),

      await associateNotificationWithUser(),

      await associateNotificationWithOrganization(),

      await associateSmartContractWithDeveloper(),

      await associateSmartContractWithTeam(),

      await associateSmartContractWithOrganization(),

      // Similar logic for "relation_many"

      await associateTeamWithOrganization(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('audits', null, {});

    await queryInterface.bulkDelete('notifications', null, {});

    await queryInterface.bulkDelete('smart_contracts', null, {});

    await queryInterface.bulkDelete('teams', null, {});

    await queryInterface.bulkDelete('organizations', null, {});
  },
};
