'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend } from 'react-icons/fi';

export default function CommandModal({ isOpen, command, onClose, onExecute, loading }) {
  const [params, setParams] = useState({});

  if (!isOpen || !command) return null;

  const renderParamInput = (paramName) => {
    const value = params[paramName] || '';
    
    switch (paramName) {
      case 'url':
        return (
          <input
            type="url"
            placeholder="https://example.com"
            value={value}
            onChange={(e) => setParams({ ...params, [paramName]: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        );
      case 'number':
        return (
          <input
            type="tel"
            placeholder="+1234567890"
            value={value}
            onChange={(e) => setParams({ ...params, [paramName]: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        );
      case 'message':
      case 'text':
        return (
          <textarea
            placeholder="Enter your message..."
            value={value}
            onChange={(e) => setParams({ ...params, [paramName]: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        );
      case 'title':
        return (
          <input
            type="text"
            placeholder="Notification title"
            value={value}
            onChange={(e) => setParams({ ...params, [paramName]: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        );
      case 'level':
        return (
          <div>
            <input
              type="range"
              min="0"
              max="100"
              value={value || 50}
              onChange={(e) => setParams({ ...params, [paramName]: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="text-center mt-1">{value || 50}%</div>
          </div>
        );
      case 'duration':
        return (
          <input
            type="number"
            placeholder="Duration in ms"
            value={value || 1000}
            onChange={(e) => setParams({ ...params, [paramName]: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        );
      case 'enabled':
        return (
          <select
            value={value}
            onChange={(e) => setParams({ ...params, [paramName]: e.target.value === 'true' })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="true">Enable</option>
            <option value="false">Disable</option>
          </select>
        );
      case 'count':
        return (
          <input
            type="number"
            placeholder="Number of times"
            min="1"
            max="100"
            value={value || 5}
            onChange={(e) => setParams({ ...params, [paramName]: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        );
      case 'pinCode':
        return (
          <input
            type="password"
            placeholder="4-6 digit PIN"
            maxLength={6}
            value={value}
            onChange={(e) => setParams({ ...params, [paramName]: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        );
      case 'lockType':
        return (
          <select
            value={value || 'pin'}
            onChange={(e) => setParams({ ...params, [paramName]: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="pin">PIN</option>
            <option value="password">Password</option>
            <option value="pattern">Pattern</option>
          </select>
        );
      default:
        return (
          <input
            type="text"
            placeholder={`Enter ${paramName}`}
            value={value}
            onChange={(e) => setParams({ ...params, [paramName]: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Execute: {command.name}
              </h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This command will be sent to the device and executed immediately.
              </p>
              
              {command.params.map((param) => (
                <div key={param}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                    {param}
                  </label>
                  {renderParamInput(param)}
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t dark:border-gray-700 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => onExecute(params)}
                disabled={loading}
                className="flex-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="loader-sm"></div>
                ) : (
                  <>
                    <FiSend /> Execute
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
