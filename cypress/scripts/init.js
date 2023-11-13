const { PrismaClient } = require('@prisma/client');

async function init() {
  const prisma = new PrismaClient();
  const res = {};
  try {
    res.user = await prisma.user.create({
      data: {
        name: 'test-user',
        email: 'test-user@gmail.com',
      },
    });
  } catch (error) {
    console.error('Init error:', error);
  } finally {
    await prisma.$disconnect();
  }
  return res;
}

module.exports = init;
