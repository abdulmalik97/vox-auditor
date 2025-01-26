"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import theme from "@/theme";
import { CircularProgress, Typography } from "@mui/material";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  background: theme.palette.background.default,
}));

interface SignPageProps {
  signInAction: (formData: FormData) => Promise<string>;
}

const SignInPage = ({ signInAction }: SignPageProps) => {
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [signInError, setSignInError] = React.useState("");
  const [isSigningIn, setIsSigningIn] = React.useState<boolean>(false);

  const validateInputs = async (e: React.FormEvent) => {
    setIsSigningIn(true);
    e.preventDefault(); // Prevent form submission

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    let isValid = true;

    // Email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // Password validation
    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (isValid) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      const error = await signInAction(formData);
      setSignInError(error);
    }
    setIsSigningIn(false);
  };

  return (
    <SignInContainer direction="column" justifyContent="center">
      <Card variant="outlined">
        <Box
          component="form"
          onSubmit={validateInputs}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl error={emailError} fullWidth>
            <TextField
              id="email"
              type="email"
              label="Email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              variant="standard"
              color={"secondary"}
              helperText={emailErrorMessage}
              error={emailError}
              onChange={() => setSignInError("")}
              slotProps={{
                inputLabel: {
                  style: {
                    color: theme.palette.secondary.main, // Set label color here
                  },
                },
              }}
            />
          </FormControl>

          <FormControl error={passwordError} fullWidth>
            <TextField
              id="password"
              type="password"
              label="Password"
              placeholder="Voxology123"
              required
              variant="standard"
              color="secondary" // The color for the input itself
              helperText={passwordErrorMessage}
              error={passwordError}
              onChange={() => setSignInError("")}
              slotProps={{
                inputLabel: {
                  style: {
                    color: theme.palette.secondary.main, // Set label color here
                  },
                },
              }}
            />
          </FormControl>

          <Typography>{signInError}</Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ marginTop: theme.spacing(2), position: "relative" }}
            disabled={isSigningIn}
            endIcon={
              isSigningIn ? (
                <CircularProgress size={24} color="inherit" />
              ) : null
            }
          >
             {isSigningIn ? "Signing In" : "Sign In"}
          </Button>
        </Box>
      </Card>
    </SignInContainer>
  );
};

export default SignInPage;
