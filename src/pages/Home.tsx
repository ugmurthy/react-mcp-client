import { Link } from 'react-router-dom';
import { useMcp } from '../context/McpContext';
import './Home.css';

const Home = () => {
  const { isConnected } = useMcp();

  const pages = [
    {
      name: 'Chart Visualizer',
      description: 'Generate interactive charts from your data.',
      tools: ['generate_chart'],
      path: '/tools/chart-visualizer',
    },
    {
      name: 'JSON Fetcher',
      description: 'Fetch and display JSON data from a URL.',
      tools: ['fetch_json'],
      path: '/tools/json-fetcher',
    },
    {
      name: 'BMI Calculator',
      description: 'Calculate Body Mass Index (BMI).',
      tools: ['calculate_bmi'],
      path: '/tools/bmi-calculator',
    },
  ];

  return (
    <div className="home-container">
      <div className="tool-list">
        {pages.map((page) => (
          <Link
            key={page.name}
            to={page.path}
            className={`tool-card-link ${!isConnected ? 'disabled' : ''}`}
            onClick={(e) => !isConnected && e.preventDefault()}
          >
            <div className="tool-card">
              <h3>{page.name}</h3>
              <p className="tool-description">{page.description}</p>
              <div className="tool-names">
                {page.tools.map((t) => (
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