var faker = require('faker');

var database = {
  issues: [
    {
      id: 1,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: 2
    },
    {
      id: 2,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: 1
    }
  ],
  users: [
    {
      id: 1,
      name: faker.name.findName(),
      email: faker.internet.email()
    },
    {
      id: 2,
      name: faker.name.findName(),
      email: faker.internet.email()
    },
  ]
};

module.exports = database;
