import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import DCLayout from './components/DCLayout';

const socket = io('http://localhost:3000');

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    socket.on('data', (data) => {
      console.log(data);
      setData(data);
    });
  }, []);
  return (
    <div>
      <h1>Data Center Layout</h1>
      <DCLayout data={data} />
    </div>
  );
}

export default App;
