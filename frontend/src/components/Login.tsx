import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';



const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();



  const handleSubmit = async (event:
    React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('');
    setLoading(true);



    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/token/',
        {
          username: username,
          password: password,
        }
      );

      console.log("Hello world!")

      login(response.data);

      navigate("/dashboard");

    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials.');

    } finally {
      setLoading(false);
    }


  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-white">
          Credit Card Pinger
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-400"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border
                border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
                focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-400"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md 
              shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-bold text-white
                bg-indigo-600 rounded-md hover:bg-indigo-600
                focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-indigo-500 focus:ring-offset-gray-800"

            >
              {loading ? 'Logging in....' : 'Login'}
            </button>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                Don't have an account with us?{' '}
                <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};


export default Login;
