import { useState } from 'react';
import { useMcp } from '../context/McpContext';
import './JsonFetcher.css';

interface JsonResponse {
  data: any;
  status: number;
  headers: Record<string, string>;
}

const JsonFetcher: React.FC = () => {
  const { isConnected, fetchJson } = useMcp();
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<JsonResponse | null>(null);
  const [formattedJson, setFormattedJson] = useState<string>('');
  const [isMetaVisible, setIsMetaVisible] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);
    setFormattedJson('');

    try {
      const result = await fetchJson(url, 'GET');
      
      if (result && typeof result === 'object') {
        setResponse(result as JsonResponse);
        
        // Format the JSON for display
        try {
          const formatted = JSON.stringify(result.data, null, 2);
          setFormattedJson(formatted);
        } catch (err) {
          console.error('Error formatting JSON:', err);
          setFormattedJson(JSON.stringify(result.data));
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error fetching JSON:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h2>JSON Fetcher</h2>
        <p>Fetch and display data from any URL returns JSON data</p>
      </div>

      {!isConnected && (
        <div className="connection-warning">
          Not connected to MCP server. Please connect from the home page.
        </div>
      )}

      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="url">URL to fetch JSON from:</label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://jsonplaceholder.typicode.com/todos/1"
              disabled={!isConnected || loading}
            />
          </div>

          <button 
            type="submit" 
            className="button"
            disabled={!isConnected || loading || !url}
          >
            {loading ? 'Fetching...' : 'Fetch JSON'}
          </button>
        </form>

        {error && (
          <div className="error">
            {error}
          </div>
        )}
      </div>

      {response && (
        <div className="card result">
          <div className="response-header" onClick={() => setIsMetaVisible(!isMetaVisible)}>
            <h3>Response</h3>
            <button className="toggle-button">
              {isMetaVisible ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          
          {isMetaVisible && (
            <div className="response-meta">
              <div><strong>Status:</strong> {response.status || 200}</div>
              <div className="headers">
                <strong>Headers:</strong>
                <ul>
                  {response.headers && Object.entries(response.headers).map(([key, value]) => (
                    <li key={key}><span>{key}:</span> {value}</li>
                  ))}
                  {(!response.headers || Object.keys(response.headers).length === 0) && (
                    <li><em>No headers available</em></li>
                  )}
                </ul>
              </div>
            </div>
          )}
          
          <div className="json-result">
            <h4>Data:</h4>
            <pre>{formattedJson}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonFetcher;