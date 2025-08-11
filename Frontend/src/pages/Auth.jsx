import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

export default function Auth({ onAuthSuccess }) {
  const [type, setType] = useState('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Personal Cloud Storage
        </h1>

        {/* Toggle buttons */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setType('login')}
            className={`px-4 py-2 font-medium rounded-l 
              ${
                type === 'login'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }
            `}>
            Login
          </button>
          <button
            onClick={() => setType('register')}
            className={`px-4 py-2 font-medium rounded-r 
              ${
                type === 'register'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }
            `}>
            Register
          </button>
        </div>

        {/* Auth form */}
        <AuthForm
          type={type}
          onSuccess={onAuthSuccess}
        />

        {/* Footer note */}
        <p className="text-center text-sm text-gray-500 mt-4">
          {type === 'login'
            ? "Don't have an account? Click Register."
            : 'Already have an account? Click Login.'}
        </p>
      </div>
    </div>
  );
}
