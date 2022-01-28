import './App.css';
import React, { useEffect, useState } from 'react';
import Form from './components/Form.js';
import Info from './components/Info.js';
import NavBar from './components/NavBar';
import ToastContainer from './components/ToastContainer';
import refreshIcon from './resources/icons/refresh.png';

function App() {
  const [isListRefreshRequired, setIsListRefreshRequired] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('Never');
  const [toastList, setToastList] = useState([]);
  const refresh = false;

  //trigger updates
  useEffect(() => {
    if (refresh) {
      setInterval(() => {
        console.log('Refreshing data...');
        setIsListRefreshRequired(true);
      }, 5000)
    }
  }, [])

  const AddToast = (toast) => {
    setToastList([...toastList, toast]);
  }

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <NavBar>
        <li>Rehab</li>
        <li className="small-text">Last updated: {lastUpdated}</li>
        <li><button className="no-border" onClick={() => setIsListRefreshRequired(true)}>
          <img className="navbar-refresh" src={refreshIcon} alt=""/>
          </button></li>
      </NavBar>
      <Form 
        setIsListRefreshRequired={setIsListRefreshRequired}
        addToast={AddToast}
      />
      <Info
        setLastUpdated={setLastUpdated}
        isListRefreshRequired={isListRefreshRequired}
        setIsListRefreshRequired={setIsListRefreshRequired}
        addToast={AddToast}
      />
      <ToastContainer toastList={toastList} />
      </div>
  );
}

export default App;
