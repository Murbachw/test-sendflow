import { createTheme } from '@mui/material'
import { ptBR } from '@mui/material/locale'

export const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#0f172a',
      },
      secondary: {
        main: '#06b6d4',
      },
      background: {
        default: '#f4f7fb',
        paper: '#ffffff',
      },
      success: {
        main: '#0f766e',
      },
      warning: {
        main: '#c2410c',
      },
    },
    shape: {
      borderRadius: 22,
    },
    typography: {
      fontFamily: '"Manrope Variable", sans-serif',
      h3: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 700,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            boxShadow: 'none',
            paddingInline: 20,
            textTransform: 'none',
            fontWeight: 700,
          },
          contained: {
            background: 'linear-gradient(135deg, #0f172a 0%, #155e75 100%)',
            '&.Mui-disabled': {
              background: '#dbe3ee',
              backgroundImage: 'none',
              color: '#475569',
            },
            '&.Mui-disabled .MuiButton-startIcon, &.Mui-disabled .MuiButton-endIcon': {
              color: '#475569',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            minHeight: 44,
            textTransform: 'none',
            fontWeight: 700,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 18,
          },
        },
      },
    },
  },
  ptBR,
)
