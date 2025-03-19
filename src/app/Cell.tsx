import { faBomb, faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

interface CellProps {
  isFlagged?: boolean;
  hasMine?: boolean;
  neighborMines?: number;
  isRevealed: boolean;
  isDisabled?: boolean;
}

export default function Cell({
  hasMine,
  isRevealed,
  neighborMines,
  isDisabled,
  isFlagged,
}: CellProps) {
  return (
    <div
      className={clsx(
        `
          flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center
          border-solid select-none text-black
        `,
        {
          "border-2 border-t-gray-100 border-r-gray-500 border-b-gray-500 border-l-gray-100 bg-gray-300":
            !isRevealed,
          "border-1 border-gray-500 bg-gray-400": isRevealed,
          "border-1 border-gray-500 bg-red-500": isRevealed && hasMine,
        }
      )}
    >
      {(isRevealed || isDisabled) && hasMine && (!isFlagged || isRevealed) && (
        <CellContentRevealedMine />
      )}
      {isRevealed && !hasMine && neighborMines != null && neighborMines > 0 && (
        <CellContentRevealedBlank neighborMines={neighborMines} />
      )}
      {isFlagged && !isRevealed && <CellContentFlag />}
    </div>
  );
}

function CellContentRevealedMine() {
  return <FontAwesomeIcon icon={faBomb} size="xl" />;
}

function CellContentFlag() {
  return <FontAwesomeIcon className="text-red-500" icon={faFlag} size="xl" />;
}

function CellContentRevealedBlank({
  neighborMines,
}: {
  neighborMines: number;
}) {
  const colors = [
    "text-blue-500",
    "text-green-600",
    "text-red-600",
    "text-blue-900",
    "text-amber-800",
    "text-cyan-500",
    "text-black",
    "text-gray-600",
  ];

  return (
    <span
      className={clsx(
        "h-full w-full text-center font-mono text-2xl leading-10 font-black",
        colors[neighborMines - 1]
      )}
    >
      {neighborMines.toString()}
    </span>
  );
}
