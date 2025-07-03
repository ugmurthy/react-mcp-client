import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { McpProvider } from './context/McpContext';
import Home from './pages/Home';
import BmiCalculator from './pages/BmiCalculator';
import JsonFetcher from './pages/JsonFetcher';
import ChartVisualizer from './pages/ChartVisualizer';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <McpProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bmi-calculator" element={<BmiCalculator />} />
            <Route path="/json-fetcher" element={<JsonFetcher />} />
            <Route path="/chart-visualizer" element={<ChartVisualizer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </McpProvider>
    </ErrorBoundary>
  );
}

export default App;
