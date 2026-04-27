import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  addressValidation,
  nameValidation,
  passwordValidation,
} from "../../utils/validators";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <main className="auth-page">
      <form onSubmit={submitHandler} className="auth-card">
        <h2>Register</h2>

        <input
          name="name"
          placeholder="Name"
          required
          {...nameValidation}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          required
          type="email"
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Address"
          required
          {...addressValidation}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          {...passwordValidation}
          onChange={handleChange}
        />

        <button className="primary-button">Register</button>

        <p className="auth-link">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
};

export default Register;
