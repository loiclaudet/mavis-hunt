import fetcher from "lib/fetcher";
import clientPromise from "lib/mongodb";
import type { User } from "lib/validators";
import type { Db, Document } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = Partial<User>[];
type Error = {
  message: string;
};
type APIResponse = Data | Error;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>
) {
  let players!: Document[];
  try {
    const client = await clientPromise;
    const db = client.db("ronin");
    const query = req.body as string;

    players = await getPlayers(query, db);
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ message: "Error when fetching leaderboard players." });
    return;
  }
  res.status(200).json(players);
}

function getPlayers(query: string, database: Db) {
  const isUserID = query.match(
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
  );
  const isRoninID = query.match(/^ronin:[0-9a-fA-F]{40}$/);
  if (isUserID) {
    return getPlayerFromUserID(query, database);
  }
  if (isRoninID) {
    return getPlayerFromRoninID(query, database);
  }

  return getPlayersFromQuery(query, database);
}

function getPlayerFromUserID(userID: string, database: Db) {
  return database
    .collection("leaderboard")
    .find({ userID }, { projection: { _id: 0 } })
    .toArray();
}

async function getPlayerFromRoninID(roninID: string, database: Db) {
  const resolvedProfile = await resolveProfile(roninID);
  return database
    .collection("leaderboard")
    .find({ userID: resolvedProfile.accountId }, { projection: { _id: 0 } })
    .toArray();
}

function getPlayersFromQuery(query: string, database: Db) {
  return database
    .collection("leaderboard")
    .aggregate([
      {
        $search: {
          index: "autocompleteName",
          text: {
            query,
            path: "name",
            fuzzy: {},
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          userID: 1,
          topRank: 1,
          score: {
            $meta: "searchScore",
          },
        },
      },
      {
        $match: {
          score: { $gt: 2.2 },
        },
      },
      {
        $sort: {
          topRank: 1,
        },
      },
      {
        $limit: 5,
      },
    ])
    .toArray();
}

interface resolveProfileResponse {
  accountId: string;
  ronin: string;
}

function resolveProfile(roninID: string): Promise<resolveProfileResponse> {
  return fetcher(
    `https://ronin.rest/sm/resolveProfile/${roninID}`
  ) as Promise<resolveProfileResponse>;
}
