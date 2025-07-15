import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { McpProvider } from './context/McpContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import BmiCalculator from './pages/BmiCalculator';
import JsonFetcher from './pages/JsonFetcher';
import ChartVisualizer from './pages/ChartVisualizer';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <McpProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools/bmi-calculator" element={<BmiCalculator />} />
            <Route path="/tools/json-fetcher" element={<JsonFetcher />} />
            <Route path="/tools/chart-visualizer" element={<ChartVisualizer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </McpProvider>
  );
};

export default App;
