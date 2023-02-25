export type ILoginResponse = {
  message: string;
  user: {
    name: string;
    email: string;
    token: string;
    _id: string;
  };
};
