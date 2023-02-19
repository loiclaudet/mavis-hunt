import ReactPortal from "./ReactPortal";
import type { ReactNode } from "react";
import { memo, useEffect, useMemo } from "react";
import { useSwipeable } from "react-swipeable";

interface ModalProps {
  onClose: () => void;
  readonly children?: ReactNode;
  readonly buttonPosition?: "center" | "left" | "right" | "hidden";
}
const Modal = memo(function ModalComponent({
  children,
  onClose,
  buttonPosition = "center",
}: ModalProps) {
  const isTouchDevice = useMemo(() => {
    if (!globalThis.navigator) {
      return false;
    }
    return (
      navigator.maxTouchPoints || "ontouchstart" in document.documentElement
    );
  }, []);

  const handlers = useSwipeable({
    onSwiped: ({ dir }) => {
      if (!isTouchDevice) {
        return;
      }
      if (dir !== "Left" && dir !== "Right") {
        return;
      }

      onClose();
    },
    delta: 50,
  });

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);

    function handleKeydown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      onClose();
    }
  }, [onClose]);
  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <div
        onClick={onClose}
        className="fixed top-0 left-0 right-0 bottom-0 z-40 bg-[rgba(43,24,18,.9)]"
      ></div>
      <div
        className="fixed top-0 left-1/2 z-50 m-auto flex h-full max-w-full -translate-x-1/2 flex-col items-center justify-center"
        {...handlers}
      >
        {children}
      </div>
      <button
        className={`fixed bottom-2 z-[60] flex h-4 w-4 items-center justify-center rounded-full bg-[length:100%_200%] bg-center p-4 font-bold ${getButtonPositionStyle(
          buttonPosition
        )}`}
        title="close"
        onClick={onClose}
      >
        <p className="mt-[-3px] text-3xl text-white">✖</p>
      </button>
    </ReactPortal>
  );

  function getButtonPositionStyle(
    buttonPosition: "center" | "left" | "right" | "hidden"
  ) {
    switch (buttonPosition) {
      case "center":
        return "left-1/2 -translate-x-1/2";
      case "left":
        return "left-2";
      case "right":
        return "right-2";
      default:
        return "hidden";
    }
  }
});

export default Modal;
