import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import './App.css'

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/waiter-dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
  )
}

export default App
