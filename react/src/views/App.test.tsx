import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';

test('renders the Excel upload step', async () => {
  window.history.pushState({}, '', '/1');
  render(
    <ThemeProvider theme={createTheme()}>
      <App />
    </ThemeProvider>,
  );

  expect(await screen.findByRole('heading', { name: 'Chuẩn bị thời khóa biểu' })).toBeInTheDocument();
});
