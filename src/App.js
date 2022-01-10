import './App.css';
import Form from './components/Form.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Form submitUrl='https://qqznn893v8.execute-api.ap-southeast-2.amazonaws.com/beta'/>
      </header>
    </div>
  );
}

export default App;
