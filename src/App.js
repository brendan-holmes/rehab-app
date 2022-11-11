import './App.css';
import React, { useEffect, useState } from 'react';
// import Info from './components/Info.js';
import NavBar from './components/NavBar';
import ToastContainer from './components/ToastContainer';
import refreshIcon from './resources/icons/refresh.png';
import { formatDate } from './dateUtils.js';
import ModelWithData from './components/ModelWithData';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isListRefreshRequired, setIsListRefreshRequired] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [lastUpdatedRelative, setLastUpdatedRelative] = useState('Never');
  const [toastList, setToastList] = useState([]);

  const updatePeriodInMilliseconds = 60000;

  // trigger data refresh updates
  useEffect(() => {
    if (false) {
      setInterval(() => {
        console.log('Refreshing data...');
        setIsListRefreshRequired(true);
      }, updatePeriodInMilliseconds)
    }
  }, [])

  // sync 'last updated' and 'last updated relative'
  useEffect(() => {
    setLastUpdatedRelative(formatDate(lastUpdated));
  }, [lastUpdated])

  // trigger updated of 'last updated relative' updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdatedRelative(formatDate(lastUpdated));
    }, updatePeriodInMilliseconds);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const AddToast = (toast) => {
    setToastList([...toastList, toast]);
  }

  return (
    <div className="App">
      <NavBar>
        <li>Rehab App</li>
        {/* <li className="small-text">Last updated: {lastUpdatedRelative}</li> */}
        {/* <li>
          <button className="no-border" onClick={() => setIsListRefreshRequired(true)}>
            <img className="navbar-refresh" src={refreshIcon} alt=""/>
          </button>
        </li> */}
      </NavBar>

      <ErrorBoundary errorMessage={"Unable to load model"}>
        <ModelWithData 
          setLastUpdated={setLastUpdated}
          isListRefreshRequired={isListRefreshRequired}
          setIsListRefreshRequired={setIsListRefreshRequired}
          addToast={AddToast}
        />
      </ErrorBoundary>
      
      {/* <Info
        setLastUpdated={setLastUpdated}
        isListRefreshRequired={isListRefreshRequired}
        setIsListRefreshRequired={setIsListRefreshRequired}
        addToast={AddToast}
      /> */}
      <ToastContainer toastList={toastList} />
      </div>
  );
}

export default App;
