/* To allow a BigInt to be JSON.stringify'd */
require('./bigint-tojson');
import { prisma } from './db-prisma';

export function UserDB() {
  return {
    get: async (email) => {
      var res = {};
      try {
        res.user = await prisma.user.findUniqueOrThrow({
          where: { email },
          include: {
            pinnedShows: {
              include: {
                networks: true,
              },
            },
          },
        });
      } catch (e) {
        res.error = { message: e.message };
      }
      return res;
    },
  };
}
// const getOrUpsertOne = async (user) => {
//   let errorMsg;
//   let errorCode;
//   let savedUser;
//   try {
//     try {
//       savedUser = await prisma.user.findUniqueOrThrow({
//         where: {
//           email: user.email,
//         },
//       });
//     } catch (e) {
//       savedUser = await prisma.user.upsert({
//         create: {
//           email: user.email,
//         },
//         update: {
//           email: user.email,
//         },
//         where: {
//           email: user.email,
//         },
//       });
//     }
//   } catch (e) {
//     errorCode = e.code;
//     errorMsg = e.message;
//   }
//   var res = {
//     user: savedUser,
//   };
//   if (errorCode || errorMsg) {
//     res.error = { code: errorCode, message: errorMsg };
//   }
//   return res;
// };
