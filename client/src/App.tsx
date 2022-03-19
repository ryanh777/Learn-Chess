import React from 'react';
import './App.css';
import Chessboard from './components/chessboard/chessboard';
import Datatest from './components/datatest';

function App() {
  return (
    <div className="app">
      <Chessboard/>
      {/* <Datatest/> */}
    </div>
  );
}

export default App;
