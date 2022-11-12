import './App.css';
import React, { useState } from 'react';
// import Info from './components/Info.js';
import NavBar from './components/NavBar';
import ToastContainer from './components/ToastContainer';
import ModelWithData from './components/ModelWithData';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isListRefreshRequired, setIsListRefreshRequired] = useState(true);
  const [toastList, setToastList] = useState([]);

  const addToast = (toast) => {
    setToastList([...toastList, toast]);
  }

  return (
    <div className="App">
      <NavBar>
        <li>Rehab App</li>
      </NavBar>

      <ErrorBoundary errorMessage={"Unable to load model"}>
        <ModelWithData 
          isListRefreshRequired={isListRefreshRequired}
          setIsListRefreshRequired={setIsListRefreshRequired}
          addToast={addToast}
        />
      </ErrorBoundary>
    
      <ToastContainer toastList={toastList} />
      </div>
  );
}

export default App;
