"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";

/**
 * Theme developed at:
 *
 * https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=FDB338&secondary.color=1C77C7
 */
const theme = responsiveFontSizes(
  createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    palette: {
      mode: 'light',
      primary: {
        main: '#004c8b',
        light: '#004a8b',
        dark: '#004a87',
      },
      secondary: {
        main: '#004a8b',
      },
      error: {
        main: "#ff0033",
      },
      background: {
        default: '#ffffff',
        paper: '#ffffff',
      },
      text: {
        primary: '#000000',
        secondary: 'rgba(0, 0, 0, 0.7)',
      }
    },
    components: {
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: "none",
            color: '#004c8b',
            "&:hover": {
              color: '#004a87',
              textDecoration: "underline",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: '#004a8b',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#004c8b',
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            textTransform: 'none',
            fontWeight: 500,
          },
          contained: {
            backgroundColor: '#004c8b',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#004a87',
            },
          },
        },
      },
    },
  })
);

export default theme;
