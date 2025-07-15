import { Link } from 'react-router-dom';
import { useMcp } from '../context/McpContext';
import './Home.css';

const Home = () => {
  const { isConnected } = useMcp();

  const tools = [
    {
      name: 'Chart Visualizer',
      description: 'Generate interactive charts from your data.',
      tools: ['generate_chart'],
      path: '/chart-visualizer',
    },
    {
      name: 'JSON Fetcher',
      description: 'Fetch and display JSON data from a URL.',
      tools: ['fetch_json'],
      path: '/json-fetcher',
    },
    {
      name: 'BMI Calculator',
      description: 'Calculate Body Mass Index (BMI).',
      tools: ['calculate_bmi'],
      path: '/bmi-calculator',
    },
  ];

  return (
    <div className="home-container">
      <div className="tool-list">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            to={tool.path}
            className={`tool-card-link ${!isConnected ? 'disabled' : ''}`}
            onClick={(e) => !isConnected && e.preventDefault()}
          >
            <div className="tool-card">
              <h3>{tool.name}</h3>
              <p className="tool-description">{tool.description}</p>
              <div className="tool-names">
                {tool.tools.map((t) => (
                  <span key={t} className="tool-name">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;