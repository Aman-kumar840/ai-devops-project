import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { logService } from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import { ArrowLeft, Terminal, AlertCircle, CheckCircle, Code } from 'lucide-react';

const BuildDetails = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [logDetails, setLogDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await logService.getLogById(id);
        setLogDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch build details.');
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-500">Loading AI Analysis...</div>;
  if (error || !logDetails) return <div className="flex justify-center items-center h-screen text-red-500">{error || 'Log not found'}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Navigation & Header */}
      <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-mono mb-2">
            {logDetails.buildName}
          </h1>
          <StatusBadge status={logDetails.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* AI Analysis Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">AI Root Cause Analysis</h2>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{logDetails.rootCause}</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {logDetails.explanation}
            </p>
          </div>
        </div>

        {/* Suggested Fixes Section */}
        {logDetails.suggestedFixes && logDetails.suggestedFixes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="font-semibold text-gray-900">Suggested Fixes</h2>
            </div>
            <div className="p-6 space-y-6">
              {logDetails.suggestedFixes.map((fix) => (
                <div key={fix.id} className="border border-gray-100 rounded-md p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-mono rounded font-semibold">
                      {fix.type}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{fix.description}</span>
                  </div>
                  {/* Terminal Window Mockup */}
                  <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                    <code className="text-green-400 font-mono text-sm whitespace-pre">
                      {fix.snippet}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Log Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Raw Jenkins Log</h2>
          </div>
          <div className="bg-gray-950 p-4 overflow-x-auto max-h-96">
            <pre className="text-gray-300 font-mono text-xs">
              {logDetails.rawLog}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildDetails;