/* To allow a BigInt to be JSON.stringify'd */
require('./bigint-tojson');

import prisma from './db-prisma';

//TODO: rework as PrismaAdapter:
// export function UserAdapter(p /*PrismaClient*/) {
//  getOne: (id) => p.user.findUniqueOrThrow({where: {id}}),
//  create: (user) => p.user.create({user}),
//}
const getOrUpsertOne = async (user) => {
  let errorMsg;
  let errorCode;
  let savedUser;
  try {
    try {
      savedUser = await prisma.user.findUniqueOrThrow({
        where: {
          email: user.email,
        },
      });
    } catch (e) {
      savedUser = await prisma.user.upsert({
        create: {
          email: user.email,
        },
        update: {
          email: user.email,
        },
        where: {
          email: user.email,
        },
      });
    }
  } catch (e) {
    errorCode = e.code;
    errorMsg = e.message;
  }
  var res = {
    user: savedUser,
  };
  if (errorCode || errorMsg) {
    res.error = { code: errorCode, message: errorMsg };
  }
  return res;
};

const getOne = async (email) => {
  let u;
  try {
    u = await prisma.user.findUniqueOrThrow({
      where: { email },
      include: {
        pinnedShows: true,
      },
    });
  } catch (e) {
    console.error(e);
  }
  return u;
};

export { getOrUpsertOne, getOne };