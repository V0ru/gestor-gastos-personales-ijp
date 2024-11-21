import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GetStarted from './components/GetStarted';
import Dashboard from './components/Dashboard';
import SignUpSignIn from "./components/Signup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sing" element={<SignUpSignIn />} />
      </Routes>
    </Router>
  );
};

export default App;
