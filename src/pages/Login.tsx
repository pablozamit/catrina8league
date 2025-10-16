import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(password);
    if (success) {
      navigate('/admin');
    } else {
      setError(t('login.error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-20 h-20 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 107, 0, 0.4)',
                '0 0 40px rgba(139, 92, 246, 0.5)',
                '0 0 20px rgba(255, 107, 0, 0.4)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <KeyRound className="w-10 h-10 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-orange-400 mb-2 animate-glow-orange">
            {t('login.title')}
          </h2>
          <p className="text-gray-400">{t('login.subtitle')}</p>
        </div>

        <motion.div
          className="card bg-black/50 border-purple-500/30"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('login.password')}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-white placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                className="flex items-center space-x-2 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('login.submit')}
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          className="mt-8 text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>{t('login.footer1')}</p>
          <p className="mt-2">{t('login.footer2')}</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
