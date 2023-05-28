import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import DCLayout from './components/DCLayout';

const socket = io('http://localhost:3000');

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    socket.on('data', (data) => {
      setData(data);
    });
  }, []);
  return (
    <div>
      <DCLayout data={data} />
    </div>
  );
}

export default App;
