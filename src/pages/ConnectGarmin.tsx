import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Zap, Check, ArrowRight } from 'lucide-react';

const ConnectGarmin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const { connectGarmin, user } = useUser();
  const navigate = useNavigate();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await connectGarmin(username, password);
      if (success) {
        setStep(2);
      } else {
        setError('Failed to connect to Garmin. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  if (user?.isGarminConnected && step === 1) {
    setStep(2);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 space-y-8 transform transition-all duration-300 hover:shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center">
            <Zap size={40} className="text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {step === 1 ? 'Connect to Garmin' : 'Connection Successful'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 
              ? 'Connect your Garmin account to import your activities' 
              : 'Your Garmin account has been successfully connected'}
          </p>
        </div>

        {step === 1 ? (
          <>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleConnect}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="garmin-username" className="sr-only">Garmin Connect Username</label>
                  <input
                    id="garmin-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Garmin Connect Username"
                  />
                </div>
                <div>
                  <label htmlFor="garmin-password" className="sr-only">Garmin Connect Password</label>
                  <input
                    id="garmin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Garmin Connect Password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300`}
                >
                  {isLoading ? 'Connecting...' : 'Connect to Garmin'}
                </button>
              </div>

              <div className="text-center text-sm text-gray-500">
                We will only use your credentials to sync your activity data.
                We do not store your Garmin password.
              </div>
            </form>
          </>
        ) : (
          <div className="space-y-6 mt-8">
            <div className="flex items-center justify-center text-green-500">
              <div className="p-3 rounded-full bg-green-100">
                <Check size={30} />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                Your Garmin account has been successfully connected. 
                We're now importing your activities. This might take a few moments 
                depending on how many activities you have.
              </p>
              
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div className="w-full bg-blue-500 animate-pulse rounded"></div>
                </div>
              </div>
              
              <button
                onClick={goToDashboard}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
              >
                Go to Dashboard
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectGarmin;