export interface ICoords {
  x: number;
  y: number;
  isShown: boolean;
  onClose: null | Function;
  options: { title: string; fun: () => void }[];
}

export type ContextMenuType = {
  coords: ICoords;
  setCoords: (newCoords: ICoords) => void;
};
