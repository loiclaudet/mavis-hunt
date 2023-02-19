import type { ReactNode } from "react";
import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ReactPortal({
  children,
  wrapperId = "react-portal-wrapper",
}: {
  children: ReactNode;
  wrapperId: string;
}) {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(
    null
  );

  useLayoutEffect(() => {
    let element = document.getElementById(wrapperId);
    if (!element) {
      element = createWrapperAndAppendToBody(wrapperId);
    }
    setWrapperElement(element);

    return () => {
      if (element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  // wrapperElement state will be null on the very first render.
  if (wrapperElement === null) {
    return null;
  }

  return createPortal(children, wrapperElement);
}

function createWrapperAndAppendToBody(wrapperId: string) {
  const wrapperElement = document.createElement("div");
  wrapperElement.setAttribute("id", wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
}
