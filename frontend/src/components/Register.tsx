import { useState } from "react";
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';




const Register = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    setError('');
    setLoading(true);


    try {

      await api.post("/api/register/", {
        "username": userName,
        "password": password,
      })

      alert('Registration successful! Please log in.');
      navigate("/");

    } catch (error) {
      console.error("Failed to register:", error);
      setError("Failed to register!");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-white">
          Create an Account
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
              value={userName}
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
              {loading ? 'Creating Account....' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
