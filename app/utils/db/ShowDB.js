/* To allow a BigInt to be JSON.stringify'd */
require('./bigint-tojson');
import { isExternalIdValid, isObjectIdValid } from './db-helper';
import { prisma } from './db-prisma';
import { ExternalToDB } from './ExternalToDB';

export function ShowDB() {
  return {
    findManyByUser: async (userId) => {
      const res = {};
      var docs = [];
      try {
        if (!isObjectIdValid(userId)) {
          throw Error(`Unknown user [${userId}]`);
        }

        docs = await prisma.show.findMany({
          where: {
            userIDs: {
              has: userId,
            },
          },
          include: {
            networks: true,
          },
        });
      } catch (e) {
        res.error = { code: e.code, message: e.message };
      }
      res.shows = docs;
      return res;
    },

    /**
     * Remove the show from the user's pinned shows
     * @param externalId : the externalId of the show
     * @param userId : the id of the user
     * @returns { user, show, error }
     */
    remove: async (externalId, userId) => {
      var errorMsg;
      var errorCode;
      var show;
      var user;

      try {
        if (!isExternalIdValid(externalId)) {
          throw Error(`Unknown show [${externalId}]`);
        }
        if (!isObjectIdValid(userId)) {
          throw Error(`Unknown user [${userId}]`);
        }
        await prisma.$transaction(async (tx) => {
          show = await tx.show.update({
            where: { externalId: externalId },
            data: {
              users: {
                disconnect: [{ id: userId }],
              },
            },
            include: {
              networks: true,
            },
          });

          user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
        });
      } catch (e) {
        errorCode = e.code;
        errorMsg = e.message;
      }

      // build the result
      var res = { show: show, user: user };
      if (errorCode || errorMsg) {
        res.error = { code: errorCode, message: errorMsg };
      }
      return res;
    },

    /**
     * Save or update the show, linking it to the user (and the user to the show)
     * @param show : the show to link to the user
     * @param user : the user to link to the show
     * @returns { user, show, error }
     */
    saveOrUpdate: async (show, user) => {
      let errorMsg;
      let errorCode;
      let savedShow;
      let savedUser;
      console.log('saveOrUpdate show and user', { show, user });
      try {
        // Save or create the show
        try {
          savedShow = await prisma.show.findUniqueOrThrow({
            where: {
              name: show.name ?? show.title,
            },
            include: {
              networks: true,
            },
          });
        } catch (e) {
          const networksDB = ExternalToDB().networks(show.networks);
          const showDB = ExternalToDB().show(show);
          savedShow = await prisma.show.create({
            data: {
              ...showDB,
              networks: {
                connectOrCreate: networksDB.map((n) => {
                  return {
                    create: n,
                    where: { name: n.name },
                  };
                }),
              },
            },
          });
        }

        savedUser = await prisma.user.findUniqueOrThrow({
          where: {
            email: user.email,
          },
        });

        // isolate connections between user and show in a
        // transaction
        await prisma.$transaction(async (tx) => {
          // Updates the user with the showId
          savedUser = await tx.user.update({
            where: {
              id: savedUser.id,
            },
            data: {
              pinnedShows: {
                connect: { id: savedShow.id },
              },
            },
          });
          // finally, update the show with userId
          savedShow = await tx.show.update({
            where: { id: savedShow.id },
            data: {
              users: {
                connect: { id: savedUser.id },
              },
            },
            include: {
              networks: true,
            },
          });
        });
      } catch (e) {
        errorCode = e.code;
        errorMsg = e.message;
      }
      var res = errorMsg
        ? { error: { code: errorCode, message: errorMsg } }
        : {
            show: savedShow,
            user: savedUser,
          };
      return res;
    },
  };
}
