import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";

import { InputField, PasswordInputField } from "../../components";
import axios from "axios";

export default function ResetPassword({
  _url,
  gotoFirstStep,
  _header,
  showAlertMessage,
}) {
  const [formData, setFormData] = useState({
    password: "",
    reset_token: "",
    showPassword: false,
  });
  const [secureEntry, setSecureEntry] = useState(true);
  const [formErrors, setFormErrors] = useState({
    reset_token: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    let _data = {
      reset_token: formData.reset_token,
      password: formData.password,
    };

    axios
      .post(_url + "reset/password", _data, _header)
      .then((_json) => {
        setIsLoading(false);
        gotoFirstStep();
        showAlertMessage(_json.data.detail);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 400) {
          showAlertMessage('Error occurred!');
        }
        if (err.response.status === 422) {
          let msg = err.response.data.detail.reset_token[0];
          setFormErrors({ ...formErrors, reset_token: msg });
        }
      });
  };

  return (
    <form onSubmit={handleUpdate} autoComplete="off">
      <InputField
        label="Token"
        name="reset_token"
        error={formErrors.reset_token}
        onChange={(event) => handleChange(event)}
        value={formData.reset_token}
        required
        placeholder="xxxxxx"
        styles={{ mb: 2 }}
      />
      <PasswordInputField
        label="Password"
        name="password"
        placeholder="password"
        required
        onChange={(event) => handleChange(event)}
        value={formData.password}
        secureEntry={secureEntry}
        setSecureEntry={setSecureEntry}
      />
      <div style={{ textAlign: "center" }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{ marginTop: "3rem", textTransform: "capitalize" }}
        >
          {isLoading ? (
            <CircularProgress
              size={15}
              sx={{ color: "#fff", marginRight: 1 }}
            />
          ) : null}
          Submit
        </Button>
      </div>
    </form>
  );
}
