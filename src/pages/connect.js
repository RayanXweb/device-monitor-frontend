import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useDevices } from '../hooks/useDevices';
import { FiShield, FiSmartphone, FiKey, FiCheckCircle, FiCopy, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ConnectDevice() {
  const [step, setStep] = useState(1);
  const [deviceId, setDeviceId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPin, setGeneratedPin] = useState('');
  const [qrCode, setQrCode] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const generatePin = async () => {
    if (!deviceId) {
      toast.error('Please enter Device ID');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/devices/${deviceId}/pin/generate`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setGeneratedPin(response.data.pin);
      setStep(2);
      toast.success('PIN generated successfully');
      
      // Generate QR code for easy pairing
      const qrData = JSON.stringify({
        deviceId,
        pin: response.data.pin,
        apiUrl: process.env.NEXT_PUBLIC_API_URL
      });
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`);
      
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate PIN');
    } finally {
      setLoading(false);
    }
  };

  const verifyPin = async () => {
    if (!pin) {
      toast.error('Please enter PIN');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/devices/${deviceId}/pin/verify`,
        { pin }
      );
      
      localStorage.setItem('device_token', response.data.token);
      toast.success('Device connected successfully');
      router.push(`/devices/${deviceId}`);
      
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid PIN');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadClientApp = () => {
    // Redirect to client app download page
    window.open('https://github.com/yourusername/client-app/releases', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-2xl mb-4">
            <FiSmartphone className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Connect New Device</h1>
          <p className="text-white text-opacity-80">Secure device pairing with PIN verification</p>
        </motion.div>

        {/* Steps Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? 'bg-white text-purple-600' : 'bg-white bg-opacity-20 text-white'
            } font-bold`}>
              1
            </div>
            <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-white' : 'bg-white bg-opacity-20'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? 'bg-white text-purple-600' : 'bg-white bg-opacity-20 text-white'
            } font-bold`}>
              2
            </div>
            <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-white' : 'bg-white bg-opacity-20'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 3 ? 'bg-white text-purple-600' : 'bg-white bg-opacity-20 text-white'
            } font-bold`}>
              3
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Step 1: Download Client App
                  </label>
                  <button
                    onClick={downloadClientApp}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition flex items-center justify-center gap-2"
                  >
                    <FiDownload /> Download Client App
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Install the app on the device you want to monitor
                  </p>
                </div>

                <div className="border-t dark:border-gray-700 pt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Step 2: Enter Device ID
                  </label>
                  <input
                    type="text"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    placeholder="Enter Device ID from client app"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Open the client app and copy the Device ID displayed
                  </p>
                </div>

                <button
                  onClick={generatePin}
                  disabled={!deviceId || loading}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="loader-sm"></div>
                      Generating...
                    </>
                  ) : (
                    <>Generate PIN</>
                  )}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                  <FiCheckCircle className="text-4xl text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-green-800 dark:text-green-200 font-medium">PIN Generated Successfully</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                    Your 6-Digit PIN Code
                  </label>
                  <div className="relative">
                    <code className="block text-3xl font-mono font-bold tracking-wider text-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      {generatedPin}
                    </code>
                    <button
                      onClick={() => copyToClipboard(generatedPin)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
                    >
                      <FiCopy />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                    PIN expires in 5 minutes. Enter this PIN in the client app.
                  </p>
                </div>

                {qrCode && (
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Or Scan QR Code
                    </label>
                    <img src={qrCode} alt="QR Code" className="mx-auto w-48 h-48" />
                  </div>
                )}

                <div className="border-t dark:border-gray-700 pt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Step 3: Verify Connection
                  </label>
                  <input
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter PIN from client app"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-2xl font-mono tracking-wider"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={verifyPin}
                    disabled={!pin || loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="loader-sm"></div>
                        Verifying...
                      </>
                    ) : (
                      <>Verify & Connect</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-6">
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-6">
                  <FiCheckCircle className="text-6xl text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                    Device Connected Successfully!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    Your device is now paired and ready to monitor.
                  </p>
                </div>
                
                <button
                  onClick={() => router.push('/devices')}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Go to Devices
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <div className="mt-6 text-center text-white text-opacity-70 text-sm">
          <FiShield className="inline mr-1" /> End-to-end encrypted connection
        </div>
      </div>
    </div>
  );
}
