import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/fetch";
import { IFormData } from "../types/formTypes";

const defaultState: IFormData = {
  name: "",
  email: "",
  password: "",
};

const RegistrationScreen: React.FC = () => {
  const [formData, setFormData] = useState(defaultState);
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
      api.registration(formData).then((response) => console.log(response));
    } else {
      return console.warn(Object.values(formData));
    }
  }

  return (
    <div>
      <form>
        <div>
          <p>Name:</p>
          <input
            type="text"
            name="name"
            onChange={handlerOnChange}
            value={formData.name}
          />
        </div>
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
        <p>allready have an accaunt? </p>
        <button
          onClick={() => {
            navigate("/sign-in");
          }}
        >
          go to login screen
        </button>
      </div>
    </div>
  );
};

export default RegistrationScreen;
