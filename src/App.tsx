import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React from 'react';
import Landing from './Landing';  // Importa il tuo componente Landing.tsx

function App() {
  return (
    <div>
      <Landing />  {/* Mostra il componente Landing */}
    </div>
  );
}

export default App;

