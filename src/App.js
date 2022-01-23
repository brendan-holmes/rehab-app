import './App.css';
import React, { useState } from 'react';
import Form from './components/Form.js';
import Info from './components/Info.js';

function App() {
  const [isListRefreshRequired, setIsListRefreshRequired] = useState(true);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Rehab</h1>
        <Form setIsListRefreshRequired={setIsListRefreshRequired}/>
        <Info isListRefreshRequired={isListRefreshRequired}
          setIsListRefreshRequired={setIsListRefreshRequired}/>
      </header>
    </div>
  );
}

export default App;
