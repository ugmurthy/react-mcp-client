import { Link } from 'react-router-dom';
import { useMcp } from '../context/McpContext';
import './Home.css';

const Home = () => {
  const { isConnected, isConnecting, tools, error, connect } = useMcp();

  return (
    <div className="container">
      <header className="header">
        <h1>MCP Client</h1>
        <p>A React client for interacting with the Model Context Protocol server</p>
      </header>

      <section className="section">
        <h2>Connection Status</h2>
        <div className="card">
          <p>
            Status: {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
          </p>
          {error && (
            <p className="error">Error: {error}</p>
          )}
          {!isConnected && !isConnecting && (
            <button className="button" onClick={connect} disabled={isConnecting}>
              Connect to MCP Server
            </button>
          )}
        </div>
      </section>

      <section className="section">
        <h2>Available Tools</h2>
        <div className="grid">
          <div className="card">
            <h3>BMI Calculator</h3>
            <p>Calculate Body Mass Index (BMI) based on weight and height.</p>
            <Link
              to="/bmi-calculator"
              className={`button ${!isConnected ? 'button-disabled' : ''}`}
              onClick={(e) => !isConnected && e.preventDefault()}
            >
              Open BMI Calculator
            </Link>
          </div>

          <div className="card">
            <h3>JSON Fetcher</h3>
            <p>Fetch and display JSON data from a URL.</p>
            <Link
              to="/json-fetcher"
              className={`button ${!isConnected ? 'button-disabled' : ''}`}
              onClick={(e) => !isConnected && e.preventDefault()}
            >
              Open JSON Fetcher
            </Link>
          </div>

          <div className="card">
            <h3>Chart Visualizer</h3>
            <p>Generate interactive charts from your data.</p>
            <Link
              to="/chart-visualizer"
              className={`button ${!isConnected ? 'button-disabled' : ''}`}
              onClick={(e) => !isConnected && e.preventDefault()}
            >
              Open Chart Visualizer
            </Link>
          </div>
        </div>
      </section>

      {tools.length > 0 && (
        <section className="section">
          <h2>All Available Tools</h2>
          <div className="grid">
            {tools.map((tool) => (
              <div key={tool.name} className="card">
                <h3>{tool.name}</h3>
                <p>{tool.description || 'No description available'}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;