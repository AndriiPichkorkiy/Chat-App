import React, { useState } from "react";
import { IFormData } from "../types/formTypes";
import { logIn } from "../redux/auth/auth-slice";
import { useAppSelector, useAppDispatch } from "../redux/reduxTsHooks";
// import socket from "../api/socket";
import { useNavigate } from "react-router-dom";
import { api } from "../api/fetch";

const defaultState: Pick<IFormData, "email" | "password"> = {
  email: "",
  password: "",
};

const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState(defaultState);

  // const anUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handlerOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function submit(e: React.FormEvent): void {
    e.preventDefault();

    let key: keyof typeof formData;
    for (key in formData) {
      formData[key] = formData[key].trim();
    }
    setFormData({ ...formData });

    if (Object.values(formData).every((item) => !!item)) {
      api.login(formData).then((response) => {
        console.log(response);
        dispatch(logIn(response.user));
      });
    } else {
      return console.warn(Object.values(formData));
    }

    // const name = `Robot-№${Math.random().toString().substring(2, 7)}`;
    // socket.emit("newUser", {
    //   name: name,
    //   socketID: socket.id,
    // });
    // dispatch(logIn({ ...formData, name: name }));
    // console.log("formData", formData);
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
      <div>
        <p>have not accaunt yet? </p>
        <button
          onClick={() => {
            navigate("/sign-up");
          }}
        >
          go to registration screen
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
