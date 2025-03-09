"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { CircularProgress, Typography } from "@mui/material";
import theme from "@/theme";
import Image from "next/image";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(3),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  backgroundColor: theme.palette.background.paper,
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 80dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  background: theme.palette.background.default,
  position: "relative",
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: "0.875rem",
  marginTop: theme.spacing(1),
  textAlign: "center",
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
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

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
      <Box sx={{ position: 'absolute', top: 12, left: 24 }}>
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={48}
          height={48}
          priority
        />
      </Box>
      <Card>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please sign in to continue
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={validateInputs}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 3,
          }}
        >
          <FormControl error={emailError} fullWidth>
            <TextField
              id="email"
              type="email"
              label="Email Address"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              variant="outlined"
              helperText={emailErrorMessage}
              error={emailError}
              onChange={() => setSignInError("")}
            />
          </FormControl>

          <FormControl error={passwordError} fullWidth>
            <TextField
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              required
              variant="outlined"
              helperText={passwordErrorMessage}
              error={passwordError}
              onChange={() => setSignInError("")}
            />
          </FormControl>

          {/* <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Link
              href="#"
              underline="hover"
              variant="body2"
            >
              Forgot password?
            </Link>
          </Box> */}

          {signInError && <ErrorMessage>{signInError}</ErrorMessage>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              marginTop: theme.spacing(2),
              position: "relative",
              height: 48,
            }}
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <>
                Signing In
                <CircularProgress
                  size={24}
                  sx={{
                    position: "absolute",
                    right: theme.spacing(2),
                  }}
                  color="inherit"
                />
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>
      </Card>
    </SignInContainer>
  );
};

export default SignInPage;
