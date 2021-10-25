import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme, Arwes, Button } from 'arwes';

export function App() {
  return (
    <ThemeProvider theme={createTheme()}>
      <Arwes>
        <h1>My App</h1>
        <p>A SciFi Project</p>
        <div style={{ padding: 20 }}>
          <Button>My Button</Button>
        </div>
      </Arwes>
    </ThemeProvider>
  );
}
