'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiMessageSquare, FiPhone, FiMail, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function DeviceMessages({ deviceId }) {
  const [activeTab, setActiveTab] = useState('sms');
  const [sms, setSms] = useState([]);
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [deviceId]);

  const fetchMessages = async () => {
    try {
      const [smsRes, callsRes] = await Promise.all([
        fetch(`/api/devices/${deviceId}/sms`),
        fetch(`/api/devices/${deviceId}/call-logs`)
      ]);
      const smsData = await smsRes.json();
      const callsData = await callsRes.json();
      setSms(smsData.data || []);
      setCallLogs(callsData.data || []);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const filteredSms = sms.filter(msg => 
    msg.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.body?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCalls = callLogs.filter(call => 
    call.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportData = () => {
    const data = activeTab === 'sms' ? filteredSms : filteredCalls;
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deviceId}_${activeTab}_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported');
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="flex border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab('sms')}
            className={`flex items-center gap-2 px-6 py-3 transition ${
              activeTab === 'sms'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <FiMessageSquare /> SMS Messages ({sms.length})
          </button>
          <button
            onClick={() => setActiveTab('calls')}
            className={`flex items-center gap-2 px-6 py-3 transition ${
              activeTab === 'calls'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <FiPhone /> Call Logs ({callLogs.length})
          </button>
        </div>

        {/* Search and Export */}
        <div className="p-4 border-b dark:border-gray-700 flex gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'sms' ? 'messages' : 'calls'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <FiDownload /> Export
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[600px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : activeTab === 'sms' ? (
            <div className="space-y-3">
              {filteredSms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No SMS messages found</div>
              ) : (
                filteredSms.map((msg, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{msg.address}</div>
                        <div className="text-xs text-gray-500">{msg.contactName || 'Unknown'}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(msg.date).toLocaleString()}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{msg.body}</p>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        msg.type === 'received' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {msg.type}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCalls.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No call logs found</div>
              ) : (
                filteredCalls.map((call, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{call.name || call.number}</div>
                        <div className="text-xs text-gray-500">{call.number}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          call.type === 'incoming' ? 'text-green-600' :
                          call.type === 'outgoing' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {call.type}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(call.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      Duration: {Math.floor(call.duration / 60)}:{String(call.duration % 60).padStart(2, '0')}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
