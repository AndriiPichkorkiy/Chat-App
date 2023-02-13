export type IComment = {
  name: string;
  date: number;
  text: string;
};
export type ICommentsArray = IComment[];

export interface IActiveUser {
  name: string;
  socketID: number;
  isTyping: boolean;
}

export type IActiveUserArray = IActiveUser[];
