"use client";
import fetcher from "lib/fetcher";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import debounce from "debounce";
import Link from "next/link";
import {
  userIdToSkymavisTeamMember,
  userIdToTwitchChannelMap,
} from "data/players";
import Image from "next/image";
import { Oval } from "react-loader-spinner";

interface RoninLeaderBoardPlayer {
  name: string;
  userID: string;
}

export default function Search() {
  const [inputValue, setInputValue] = useState<string>("");
  const [roninPlayers, setRoninPlayers] = useState<RoninLeaderBoardPlayer[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const debounceHandleChange = useMemo(() => debounce(handleChange, 400), []);

  const getPlayersFromQuery = useCallback(
    (query: string): Promise<RoninLeaderBoardPlayer[]> => {
      const url = `/api/search`;
      return fetcher(url, { body: query }) as Promise<RoninLeaderBoardPlayer[]>;
    },
    []
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const query = inputValue.trim();
    if (query.length < 2) {
      setRoninPlayers([]);
      return;
    }
    void (async () => {
      try {
        setLoading(true);
        const roninPlayersFromAPI = await getPlayersFromQuery(query);
        setRoninPlayers(
          Array.isArray(roninPlayersFromAPI) ? roninPlayersFromAPI : []
        );
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    })();
  }, [inputValue, getPlayersFromQuery]);

  useEffect(() => {
    return () => {
      // Stop the invocation of the debounced function after unmounting
      debounceHandleChange.clear();
    };
  }, [debounceHandleChange]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeydown);
    };

    function handleKeydown(event: KeyboardEvent): void {
      const key = event.key.toLowerCase();
      switch (key) {
        case "escape":
          setInputValue("");
          inputRef.current?.focus();
          break;
        default:
          break;
      }
    }
  }, []);

  return (
    <div className="relative mx-auto box-border w-[100%] max-w-[800px] border-0 sm:w-[90%]">
      <textarea
        ref={inputRef}
        className={`font-['Work Sans'] box-border w-full bg-black/0 px-3 py-2 text-center font-bold mix-blend-overlay outline-none placeholder:text-2xl placeholder:italic placeholder:text-white/70 sm:px-4 sm:placeholder:text-5xl ${
          inputValue.length >= 30
            ? "text-2xl sm:text-3xl"
            : "text-4xl sm:text-6xl"
        }`}
        required
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        autoFocus
        minLength={1}
        maxLength={50}
        placeholder={`Search lunacian by name,\nuser ID or Ronin address`}
        title=""
        onChange={debounceHandleChange}
      />
      {loading && (
        <div className="absolute -bottom-20 left-1/2 z-30 -translate-x-1/2">
          <Oval
            height={60}
            width={60}
            color="#FDE5D2"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#FDE5D2"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
      <ul
        className={`pointer-events-none absolute -bottom-[270px] z-10 box-border flex min-h-[270px] w-[90%] max-w-[450px] flex-col items-center justify-center rounded-[50%] border-2 border-black  bg-white/95 px-3 opacity-0 sm:left-[calc(50%-225px)] sm:px-4 ${
          roninPlayers.length > 0
            ? "pointer-events-auto animate-openModal"
            : "pointer-events-none animate-closeModal"
        }`}
      >
        {sortArrayWithFirstElementsInTheMiddle(roninPlayers).map((player) => {
          const resultIndex = roninPlayers.findIndex(
            (_player) => player.userID === _player.userID
          );
          const isSkyMavisTeamMember = userIdToSkymavisTeamMember.has(
            player.userID
          );
          const isStreamer = userIdToTwitchChannelMap.has(player.userID);
          return (
            <li
              key={player.userID}
              className="group relative box-border rounded-none transition-transform last:border-b-0"
            >
              {isSkyMavisTeamMember && (
                <div className="absolute top-1/2 -left-1 h-4 w-4 origin-right -translate-y-1/2 -translate-x-full duration-100 group-hover:scale-125 group-hover:ease-in">
                  <Image
                    priority
                    src="/skymavis-logo.png"
                    alt={"Skymavis team member"}
                    fill={true}
                    style={{
                      objectFit: "contain",
                    }}
                    unoptimized
                  />
                </div>
              )}
              {isStreamer && (
                <div className="absolute top-1/2 -left-1 h-4 w-4 origin-right -translate-y-1/2 -translate-x-full duration-100 group-hover:scale-125 group-hover:ease-in">
                  <Image
                    priority
                    src="/twitch-icon.jpeg"
                    alt={"Streamer"}
                    fill={true}
                    style={{
                      objectFit: "contain",
                    }}
                    unoptimized
                  />
                </div>
              )}
              <Link
                href={`origins/profile/${player.userID}`}
                className="flex w-full items-center bg-none py-2 px-0 shadow-none"
                prefetch={false}
              >
                <p
                  style={{
                    fontSize: `${0.5 / (resultIndex * 0.7 + 1) + 1}rem`,
                  }}
                  className={`text-bold w-full translate-x-0 text-center text-lg font-normal text-black duration-100 group-hover:scale-105 group-hover:ease-in sm:text-xl ${
                    isSkyMavisTeamMember || isStreamer ? "origin-left" : ""
                  }`}
                >
                  {player.name}
                </p>
              </Link>
            </li>
          );
        })}
        <div className="absolute -bottom-[35px] left-1/2 h-[50px] w-[70px] rounded-[50%] border-2 border-black bg-white/95"></div>
        <div className="absolute -bottom-[80px] left-1/2 h-[40px] w-[50px] -translate-x-1/2 rounded-[50%] border-2 border-black bg-white/95"></div>
      </ul>
    </div>
  );

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;
    setInputValue(value);
  }

  /**
   *  Sorts an array with the first elements in the middle  (e.g. [1,2,3,4,5,6] -> [5,3,1,2,4,6])
   * @param arr the array to sort
   * @returns a sorted array
   */
  function sortArrayWithFirstElementsInTheMiddle<T>(arr: Array<T>) {
    const newArr: Array<T> = [];
    arr.forEach((el, index) => {
      if (index % 2 === 0) {
        newArr.push(el);
      } else {
        newArr.unshift(el);
      }
    });
    return newArr;
  }
}
