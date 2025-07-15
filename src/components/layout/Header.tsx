import { Link } from 'react-router-dom';
import { useMcp } from '../../context/McpContext';
import { FaGithub } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { isConnected, isConnecting } = useMcp();
  const status = isConnecting ? 'connecting' : isConnected ? 'connected' : 'disconnected';

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title-group">
          <Link to="/" className="header-title">
            MCP Client
          </Link>
          <p className="tagline">A React based MCP Client</p>
        </div>
        <div className="header-actions">
          <div className="connection-status">
            <span className={`status-dot ${status}`} />
          </div>
          <a
            href="https://github.com/your-username/your-repo-name"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <FaGithub size="1.5em" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;