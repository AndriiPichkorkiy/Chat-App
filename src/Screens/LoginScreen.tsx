import React, { useState } from "react";
import { IFormData } from "../types/formTypes";
import { logIn } from "../redux/userSlice";
import { useAppSelector, useAppDispatch } from "../redux/reduxTsHooks";

const defaultState: Pick<IFormData, "email" | "password"> = {
  email: "",
  password: "",
};

const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState(defaultState);

  const anUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  function handlerOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function submit(e: React.FormEvent): void {
    e.preventDefault();
    dispatch(logIn({ ...formData, name: "defName" }));
    console.log("formData", formData);
  }

  return (
    <div>
      <form>
        <div>
          <p>Email:</p>
          <input
            type="text"
            name="email"
            onChange={handlerOnChange}
            value={formData.email}
          />
        </div>
        <div>
          <p>Password:</p>
          <input
            type="password"
            name="password"
            onChange={handlerOnChange}
            value={formData.password}
          />
        </div>
        <div>
          <button type="submit" onClick={submit}>
            Enter
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
