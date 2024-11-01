'use client';

import {
    createTheme,
    responsiveFontSizes,
  } from '@mui/material/styles';
  import { createBreakpoints } from '@mui/system';
  const breakpoints = createBreakpoints({});
  
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
          main: '#ffffff',
        },
        secondary: {
          main: '#000000',
        },
        text: {
          primary: '#000000',
          secondary: '#fff',
        },
        background: {
          default: '#F5F5F5',
        },
      },
      typography: {
        fontFamily:
          '"Muli", "Roboto", "Helvetica", "Arial", "Poppins", sans-serif',
      },
      components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    textDecoration: 'none', // Remove underline by default
                    '&:hover': {
                        textDecoration: 'none', // Underline on hover
                    },
                },
            },
        },
    },
    })
  );
  
  export default theme;
  