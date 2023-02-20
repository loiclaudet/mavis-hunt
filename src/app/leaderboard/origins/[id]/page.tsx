import Bottleneck from "bottleneck";
import type { Battle, Item, User } from "lib/validators";
import {
  useBattles as getPlayerBattles,
  useLeaderBoard,
  useCharms,
  useRunes,
} from "lib/api";
import type { Player } from "lib/getPlayer";
import { getPlayer } from "lib/getPlayer";
import {
  LEADERBOARD_LIMIT,
  LEADERBOARD_PLAYER_BATTLES,
  X_RATE_LIMIT_PER_SEC,
} from "lib/consts";
import OriginPlayer from "components/OriginPlayer";

interface OriginsLeaderboardPageProps {
  params: {
    id: string;
  };
}

export default async function OriginsLeaderboardPage({
  params,
}: OriginsLeaderboardPageProps) {
  const pageID = Number(params.id);
  const offset = pageID * LEADERBOARD_LIMIT - LEADERBOARD_LIMIT;

  const [{ _items: users }, { _items: charms }, { _items: runes }] =
    await Promise.all([
      useLeaderBoard({ offset, limit: LEADERBOARD_LIMIT }),
      useCharms(),
      useRunes(),
    ]);

  const usersIDs = users.map((_user) => _user.userID);

  // limit the number of requests to the API to 10 per second
  const limiter = new Bottleneck({
    minTime: 1000 / X_RATE_LIMIT_PER_SEC,
    maxConcurrent: X_RATE_LIMIT_PER_SEC,
  });
  const wrappedGetPlayerBattles = limiter.wrap(getPlayerBattles);

  const usersBattlesPromises = usersIDs.map((userID) =>
    wrappedGetPlayerBattles({ userID, limit: LEADERBOARD_PLAYER_BATTLES })
  );
  const usersBattles = (await Promise.all(usersBattlesPromises)).map(
    (battles, index) => {
      if (!battles) {
        console.warn("no battles for player", usersIDs[index]);
      }
      return battles?.battles ?? [];
    }
  );

  const players = usersIDs.map((_, index) => {
    return getPlayer({
      battles: usersBattles[index] as Battle[],
      player: users[index] as User,
    });
  });

  return <PlayerList charms={charms} runes={runes} players={players} />;
}

interface PlayerListProps {
  players: Player[];
  runes: Item[];
  charms: Item[];
}

function PlayerList({ players, runes, charms }: PlayerListProps) {
  return (
    <div className="flex flex-col items-center">
      {players.map((_player) => (
        <OriginPlayer
          ref={null}
          key={_player.userID}
          player={_player}
          runes={runes.map((rune) => rune.item)}
          charms={charms.map((charm) => charm.item)}
        />
      ))}
    </div>
  );
}
