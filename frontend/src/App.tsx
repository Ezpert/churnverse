import Login from './components/Login';
import { useAuth } from './AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/Register';







function App() {
  const { tokens } = useAuth();


  return (
    <main>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={tokens ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </main>
  );
}







export default App;
