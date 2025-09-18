'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  cpu_percent: number;
  total: number;
  available: number;
  used: number;
  percent: number;
}

interface AnomalyData {
  cpu_percent: number;
  is_anomaly: boolean;
}

export default function Dashboard() {
  const [cpu, setCpu] = useState<number | null>(null);
  const [memory, setMemory] = useState<Metrics | null>(null);
  const [cpuAnomaly, setCpuAnomaly] = useState<boolean | null>(null);
  const [memoryAnomaly, setMemoryAnomaly] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const cpuRes = await fetch('http://localhost:8000/metrics/cpu');
        const cpuData = await cpuRes.json();
        setCpu(cpuData.cpu_percent);

        const memRes = await fetch('http://localhost:8000/metrics/memory');
        const memData = await memRes.json();
        setMemory(memData);

        // Fetch anomaly data
        const cpuAnomalyRes = await fetch('http://localhost:8000/predict/cpu');
        const cpuAnomalyData: AnomalyData = await cpuAnomalyRes.json();
        setCpuAnomaly(cpuAnomalyData.is_anomaly);

        const memoryAnomalyRes = await fetch('http://localhost:8000/predict/memory');
        const memoryAnomalyData: AnomalyData = await memoryAnomalyRes.json();
        setMemoryAnomaly(memoryAnomalyData.is_anomaly);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getCpuColor = (percent: number) => {
    if (percent < 50) return 'text-green-600';
    if (percent < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMemoryColor = (percent: number) => {
    if (percent < 50) return 'text-green-600';
    if (percent < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">System Metrics Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">CPU Usage</h3>
            <div className="flex items-center">
              <div className="text-4xl font-bold mr-4">
                {cpu !== null ? (
                  <span className={getCpuColor(cpu)}>{cpu.toFixed(2)}%</span>
                ) : (
                  <span className="text-gray-500">Loading...</span>
                )}
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      cpu !== null
                        ? cpu < 50
                          ? 'bg-green-500'
                          : cpu < 80
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                        : 'bg-gray-300'
                    }`}
                    style={{ width: cpu !== null ? `${Math.min(cpu, 100)}%` : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
            {cpuAnomaly !== null && (
              <div className={`mt-4 text-sm font-semibold ${cpuAnomaly ? 'text-red-600' : 'text-green-600'}`}>
                AI/ML Status: {cpuAnomaly ? 'Anomaly Detected' : 'Normal'}
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Memory Usage</h3>
            <div className="flex items-center">
              <div className="text-4xl font-bold mr-4">
                {memory ? (
                  <span className={getMemoryColor(memory.percent)}>{memory.percent.toFixed(2)}%</span>
                ) : (
                  <span className="text-gray-500">Loading...</span>
                )}
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      memory
                        ? memory.percent < 50
                          ? 'bg-green-500'
                          : memory.percent < 80
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                        : 'bg-gray-300'
                    }`}
                    style={{ width: memory ? `${Math.min(memory.percent, 100)}%` : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
            {memoryAnomaly !== null && (
              <div className={`mt-4 text-sm font-semibold ${memoryAnomaly ? 'text-red-600' : 'text-green-600'}`}>
                AI/ML Status: {memoryAnomaly ? 'Anomaly Detected' : 'Normal'}
              </div>
            )}
          </div>
          {memory && (
            <div className="mt-4 text-sm text-gray-600">
              Used: {(memory.used / 1024 / 1024 / 1024).toFixed(2)} GB / {(memory.total / 1024 / 1024 / 1024).toFixed(2)} GB
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
