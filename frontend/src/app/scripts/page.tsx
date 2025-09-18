'use client';

import { useEffect, useState } from 'react';

interface Script {
  id: number;
  name: string;
  content: string;
  created_at: string;
  executed_at: string | null;
  result: string | null;
}

export default function Scripts() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newScript, setNewScript] = useState({ name: '', content: '' });
  const [creating, setCreating] = useState(false);

  const fetchScripts = async () => {
    try {
      const response = await fetch('http://localhost:8000/scripts');
      if (!response.ok) {
        throw new Error('Failed to fetch scripts');
      }
      const data = await response.json();
      setScripts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScript.name.trim() || !newScript.content.trim()) return;
    setCreating(true);
    try {
      const response = await fetch('http://localhost:8000/scripts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newScript),
      });
      if (!response.ok) {
        throw new Error('Failed to create script');
      }
      setNewScript({ name: '', content: '' });
      fetchScripts(); // Refresh the list
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create script');
    } finally {
      setCreating(false);
    }
  };

  const executeScript = async (scriptId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/scripts/${scriptId}/execute`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to execute script');
      }
      const result = await response.json();
      alert(`Execution result: ${result.result}`);
      fetchScripts(); // Refresh to show updated executed_at and result
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to execute script');
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading scripts...</div>
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
      <h2 className="text-2xl font-bold mb-4">Script Management</h2>

      {/* Create Script Form */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2">Create New Script</h3>
        <form onSubmit={createScript}>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Script Name"
              value={newScript.name}
              onChange={(e) => setNewScript({ ...newScript, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <textarea
              placeholder="Script Content (Python code)"
              value={newScript.content}
              onChange={(e) => setNewScript({ ...newScript, content: e.target.value })}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Script'}
          </button>
        </form>
      </div>

      {/* Scripts List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Executed At</th>
              <th className="px-4 py-2 border">Result</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scripts.map((script) => (
              <tr key={script.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{script.id}</td>
                <td className="px-4 py-2 border">{script.name}</td>
                <td className="px-4 py-2 border">{new Date(script.created_at).toLocaleString()}</td>
                <td className="px-4 py-2 border">
                  {script.executed_at ? new Date(script.executed_at).toLocaleString() : 'Never'}
                </td>
                <td className="px-4 py-2 border">
                  {script.result ? (
                    <span className={script.result.includes('successfully') ? 'text-green-600' : 'text-red-600'}>
                      {script.result}
                    </span>
                  ) : 'N/A'}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => executeScript(script.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Execute
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
