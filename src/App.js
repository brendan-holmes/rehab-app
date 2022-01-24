import './App.css';
import React, { useEffect, useState } from 'react';
import Form from './components/Form.js';
import Info from './components/Info.js';

function App() {
  const [isListRefreshRequired, setIsListRefreshRequired] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('Never');

  //trigger updates
  useEffect(() => {
    setInterval(() => {
      console.log('Refreshing data...');
      setLastUpdated(new Date().toUTCString());
      setIsListRefreshRequired(true);
      }, 5000)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>Last updated: {lastUpdated}</p>
        <h1>Rehab</h1>
        <Form setIsListRefreshRequired={setIsListRefreshRequired}/>
        <Info isListRefreshRequired={isListRefreshRequired}
          setIsListRefreshRequired={setIsListRefreshRequired}/>
      </header>
    </div>
  );
}

export default App;
