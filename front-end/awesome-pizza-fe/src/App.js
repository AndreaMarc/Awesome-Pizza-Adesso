import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Pizza from './components/Pizza';
import Order from './components/Order';
import Navbar from './components/Navbar';
import Ordernow from './components/Ordernow';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Pizza />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/ordernow" element={<Ordernow />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
