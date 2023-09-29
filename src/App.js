import React from "react";
import GameUI from "./GameUI";
import { Helmet } from 'react-helmet';  // 추가
import './App.css'

const App = () => {
  return (
    <div className="App">
      <Helmet>  {/* 추가 */}
        <title>Hangman Game by Crom</title>  {/* 추가 */}
      </Helmet>  {/* 추가 */}
      <GameUI />
    </div>
  );
};

export default App;
