
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await storageService.resetPassword(email);
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-6 text-sm">
           <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="text-center mb-8">
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h1>
           <p className="text-gray-500 dark:text-gray-400">Enter your email to receive a link.</p>
        </div>

        {isSent ? (
            <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Check your email</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">We have sent a recovery link to {email}</p>
                <Link to="/login" className="block w-full bg-gray-900 dark:bg-gray-700 text-white py-3 rounded-xl font-bold">
                    Back to Login
                </Link>
            </div>
        ) : (
            <form onSubmit={handleReset} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                placeholder="name@example.com"
                required
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-70 mt-2"
            >
                {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
