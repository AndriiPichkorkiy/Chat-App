import React, { useState, useEffect } from "react";
import { ContextMenuType, ICoords } from "../../types/contextTypes";

const initialCoords: ICoords = {
  x: 0,
  y: 0,
  isShown: false,
  onClose: null,
  options: [],
};

const MenuContext = React.createContext<null | ContextMenuType>(null);

const ContextMenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [coords, setCoords] = useState(initialCoords);
  const hideContextmenu = (e: MouseEvent) => {
    const el = e.target;
    if (el !== null && el instanceof HTMLElement && el.dataset.contextmenu)
      return;
    if (typeof coords.onClose === "function") coords.onClose();

    setCoords(initialCoords);
  };

  useEffect(() => {
    // document.addEventListener('touchstart', hideContextmenu)
    document.addEventListener("mousedown", hideContextmenu);

    return () => {
      // document.removeEventListener('touchstart', hideContextmenu)
      document.removeEventListener("mousedown", hideContextmenu);
    };
  }, [coords]);

  return (
    <MenuContext.Provider value={{ coords, setCoords }}>
      {children}
    </MenuContext.Provider>
  );
};

export default ContextMenuProvider;
export { MenuContext };
