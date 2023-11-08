// scripts/teardown.js
const { PrismaClient } = require('@prisma/client');

async function teardown() {
  const prisma = new PrismaClient();
  const res = {};
  try {
    res.dropDB = await prisma.$runCommandRaw({ dropDatabase: 1 });
  } catch (error) {
    console.error('Teardown error:', error);
  } finally {
    await prisma.$disconnect();
  }
  return res;
}

module.exports = teardown;
