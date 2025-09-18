'use client';

import { useEffect, useState } from 'react';

export default function AnomalyDetection() {
  const [cpuAnomaly, setCpuAnomaly] = useState<boolean | null>(null);
  const [memoryAnomaly, setMemoryAnomaly] = useState<boolean | null>(null);
  const [cpuPercent, setCpuPercent] = useState<number | null>(null);
  const [memoryPercent, setMemoryPercent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const cpuRes = await fetch('http://localhost:8000/predict/cpu');
      const cpuData = await cpuRes.json();
      setCpuAnomaly(cpuData.is_anomaly);
      setCpuPercent(cpuData.cpu_percent);

      const memRes = await fetch('http://localhost:8000/predict/memory');
      const memData = await memRes.json();
      setMemoryAnomaly(memData.is_anomaly);
      setMemoryPercent(memData.memory_percent);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch anomaly data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
    const interval = setInterval(fetchAnomalies, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-purple-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">AI/ML Anomaly Detection</h2>
      {loading ? (
        <div className="text-lg text-gray-600">Loading anomaly detection results...</div>
      ) : error ? (
        <div className="text-red-600 font-semibold">Error: {error}</div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-300">
            <h3 className="text-xl font-semibold mb-2">CPU Usage Anomaly</h3>
            <p className="text-lg">
              CPU Usage: <span className="font-bold">{cpuPercent?.toFixed(2)}%</span>
            </p>
            <p className={`text-lg font-semibold ${cpuAnomaly ? 'text-red-600' : 'text-green-600'}`}>
              Status: {cpuAnomaly ? 'Anomaly Detected' : 'Normal'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-300">
            <h3 className="text-xl font-semibold mb-2">Memory Usage Anomaly</h3>
            <p className="text-lg">
              Memory Usage: <span className="font-bold">{memoryPercent?.toFixed(2)}%</span>
            </p>
            <p className={`text-lg font-semibold ${memoryAnomaly ? 'text-red-600' : 'text-green-600'}`}>
              Status: {memoryAnomaly ? 'Anomaly Detected' : 'Normal'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
