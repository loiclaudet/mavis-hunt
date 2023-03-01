"use client";
import type { Charm } from "lib/charms";
import type { Player } from "lib/createPlayer";
import type { Rune } from "lib/runes";
import { useState } from "react";
import Modal from "./Modal";
import OriginBattles from "./OriginBattles";
interface BattlesButtonProps {
  player: Player;
  runes: Rune[];
  charms: Charm[];
}

export default function BattlesButton({
  player,
  runes,
  charms,
}: BattlesButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const isBattleButtonDisabled = player.battles.length === 0;
  return (
    <>
      <button
        disabled={isBattleButtonDisabled}
        onClick={() => {
          setIsModalOpen(true);
        }}
        className={`mt-4 mr-3 w-28 ${
          isBattleButtonDisabled
            ? "cursor-not-allowed opacity-50"
            : "transition-transform hover:scale-105"
        }`}
      >
        View Battles
      </button>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} buttonPosition="hidden">
          <OriginBattles player={player} runes={runes} charms={charms} />
        </Modal>
      )}
    </>
  );
}
