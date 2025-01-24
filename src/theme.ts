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
      primary: {
        main: "#FFA500",
      },
      secondary: {
        main: "#000000",
      },
      error: {
        main: "#ff0033",
      },

      background: {
        default: "#F5F5F5",
      },
    },
    components: {
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: "none", // Remove underline by default
            "&:hover": {
              textDecoration: "none", // Underline on hover
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: "#808080",
            "&.Mui-checked": {
              color: "#808080",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "#000000",
          },
        },
      },
    },
  })
);

export default theme;
