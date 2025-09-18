'use client';

import { useEffect, useState } from 'react';

interface ProcessInfo {
  pid: number;
  name: string;
  username: string;
  cpu_percent: number;
  memory_percent: number;
}

export default function Processes() {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcesses = async () => {
    try {
      const response = await fetch('http://localhost:8000/processes');
      if (!response.ok) {
        throw new Error('Failed to fetch processes');
      }
      const data = await response.json();
      setProcesses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const killProcess = async (pid: number) => {
    if (!confirm(`Are you sure you want to kill process ${pid}?`)) return;
    try {
      const response = await fetch(`http://localhost:8000/processes/${pid}/kill`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to kill process');
      }
      alert('Process killed successfully');
      fetchProcesses(); // Refresh the list
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to kill process');
    }
  };

  useEffect(() => {
    fetchProcesses();
    const interval = setInterval(fetchProcesses, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading processes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Process Management</h2>
      <button
        onClick={fetchProcesses}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">PID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">CPU %</th>
              <th className="px-4 py-2 border">Memory %</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process) => (
              <tr key={process.pid} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{process.pid}</td>
                <td className="px-4 py-2 border">{process.name}</td>
                <td className="px-4 py-2 border">{process.username}</td>
                <td className="px-4 py-2 border">{process.cpu_percent.toFixed(2)}</td>
                <td className="px-4 py-2 border">{process.memory_percent.toFixed(2)}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => killProcess(process.pid)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Kill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
