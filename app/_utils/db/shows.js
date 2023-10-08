/* To allow a BigInt to be JSON.stringify'd */
require('@/db/bigint-tojson');

import prisma from '@/db/db-prisma';
import { ObjectId } from 'mongodb';

//TODO: rework as PrismaAdapter:
// @see
// export function ShowAdapter(p /*PrismaClient*/) {
//  getOne: (id) => p.findUniqueOrThrow({where: {id}}),
//  create: (show) => p.show.create({show}),
//}
const getOneById = async (pId) => {
  let errorCode;
  let errorMsg;
  let one;
  try {
    one = await prisma.show.findUniqueOrThrow({
      where: {
        id: new ObjectId(pId),
      },
    });
  } catch (e) {
    errorCode = e.code;
    errorMsg = e.message;
  }
  var res = {
    show: one,
  };
  if (errorCode || errorMsg) {
    res.error = { code: errorCode, message: errorMsg };
  }
  // console.log('end of getOneById');
  // console.dir(res);
  return res;
};

const getMyShows = async (userId) => {
  let errorCode;
  let errorMsg;
  let myShows;
  try {
    myShows = await prisma.show.findMany({
      where: {
        users: { every: { id: new ObjectId(userId) } },
      },
    });
  } catch (e) {
    errorCode = e.code;
    errorMsg = e.message;
  }
  var res = { shows: myShows };
  if (errorCode || errorMsg) {
    res.error = { code: errorCode, message: errorMsg };
  }
  return res;
};

const saveOrUpdateOne = async (show, user) => {
  // console.log('saveOrUpdateOne[show]', show);
  // console.log('saveOrUpdateOne[user]', user);
  let errorMsg;
  let errorCode;
  let savedShow;
  let savedUser;

  try {
    // Save or update the show
    try {
      savedShow = await prisma.show.findUniqueOrThrow({
        where: {
          name: show.name ?? show.title,
        },
      });
    } catch (e) {
      savedShow = await prisma.show.create({
        data: {
          adult: show.adult,
          backdropPath: show.backdrop_path,
          name: show.name ?? show.title,
          originalLanguage: show.original_language,
          originalName: show.original_name ?? show.original_title,
          overview: show.overview,
          posterPath: show.poster_path,
          mediaType: show.media_type,
          popularity: show.popularity,
          voteAverage: show.vote_average,
          voteCount: show.vote_count,
        },
      });
    }

    // Update the user
    try {
      savedUser = await prisma.user.findUniqueOrThrow({
        where: {
          email: user.email ?? user.name,
        },
      });

      savedUser.pinnedShowsIDs.push(savedShow.id);

      savedUser = await prisma.user.update({
        where: {
          email: savedUser.email,
        },
        data: {
          pinnedShowsIDs: savedUser.pinnedShowsIDs,
        },
      });
    } catch (e) {
      savedUser = await prisma.user.create({
        data: {
          email: user.email ?? user.name,
          pinnedShowsIDs: [savedShow.id],
        },
      });
    }

    /* Finally update the user linked to the show */

    // First, search for the user id in the show
    if (savedShow.userIDs.indexOf(savedUser.id) <= -1) {
      // If it does not exist, we have something to do
      savedShow.userIDs.push(savedUser.id);
      savedShow = await prisma.show.update({
        where: {
          id: savedShow.id,
        },
        data: {
          userIDs: savedShow.userIDs,
        },
      });
    }
  } catch (e) {
    errorCode = e.code;
    errorMsg = e.message;
  }
  var res = {
    show: savedShow,
    user: savedUser,
  };
  if (errorCode || errorMsg) {
    res.error = { code: errorCode, message: errorMsg };
  }
  // console.log('end of saveOrUpdateOne');
  // console.dir(res);
  return res;
};

export { getOneById, getMyShows, saveOrUpdateOne };
