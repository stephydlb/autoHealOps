'use client';

import { useEffect, useState } from 'react';

interface Metrics {
  cpu_percent: number;
  total: number;
  available: number;
  used: number;
  percent: number;
}

export default function Dashboard() {
  const [cpu, setCpu] = useState<number | null>(null);
  const [memory, setMemory] = useState<Metrics | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const cpuRes = await fetch('http://localhost:8000/metrics/cpu');
        const cpuData = await cpuRes.json();
        setCpu(cpuData.cpu_percent);

        const memRes = await fetch('http://localhost:8000/metrics/memory');
        const memData = await memRes.json();
        setMemory(memData);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">System Metrics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">CPU Usage</h3>
          <p className="text-3xl">{cpu !== null ? `${cpu.toFixed(2)}%` : 'Loading...'}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Memory Usage</h3>
          {memory ? (
            <p className="text-3xl">{memory.percent.toFixed(2)}%</p>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
