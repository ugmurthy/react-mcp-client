import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useMcp } from '../context/McpContext';
import type { ChartData, ChartOptions } from '../services/mcpService';
import './ChartVisualizer.css';

// Sample data for demonstration
const sampleData: Record<string, ChartData> = {
  bar: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  },
  line: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Revenue',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  },
  pie: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
    datasets: [
      {
        label: 'Colors',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
      },
    ],
  },
  scatter: {
    labels: ['Scatter'],
    datasets: [
      {
        label: 'Points',
        data: [
          { x: -10, y: 0 },
          { x: 0, y: 10 },
          { x: 10, y: 5 },
          { x: 0.5, y: 5.5 },
        ] as any, // Type assertion to handle scatter plot data
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  },
};

const ChartVisualizer = () => {
  const { generateChart, isConnected, isConnecting, error, connect } = useMcp();
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar');
  const [chartData, setChartData] = useState<string>('');
  const [customData, setCustomData] = useState<string>(JSON.stringify(sampleData.bar, null, 2));
  const [title, setTitle] = useState<string>('Sample Chart');
  const [xAxisLabel, setXAxisLabel] = useState<string>('X Axis');
  const [yAxisLabel, setYAxisLabel] = useState<string>('Y Axis');
  const [enableZoom, setEnableZoom] = useState<boolean>(true);
  const [enablePan, setEnablePan] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Initialize the iframe reference when the component mounts
  useEffect(() => {
    console.log('Component mounted, iframe reference initialized');
    // Set chart data to empty string on mount to ensure clean state
    setChartData('');
  }, []);

  // Update sample data when chart type changes
  useEffect(() => {
    console.log('Chart type changed to:', chartType);
    setCustomData(JSON.stringify(sampleData[chartType], null, 2));
    
    // Ensure we're still connected to the MCP server
    if (!isConnected && !isConnecting) {
      console.log('Reconnecting to MCP server after chart type change');
      connect().catch(err => {
        console.error('Failed to reconnect to MCP server:', err);
      });
    }
  }, [chartType, isConnected, isConnecting, connect]);

  const handleGenerateChart = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Starting chart generation process');
    setLocalError(null);
    setErrorDetails(null);
    setGenerating(true);
    
    try {
      // Parse and validate the custom data
      let parsedData: ChartData;
      try {
        parsedData = JSON.parse(customData);
        
        // Basic validation
        if (!parsedData.labels || !Array.isArray(parsedData.labels)) {
          throw new Error('Chart data must include an array of labels');
        }
        
        if (!parsedData.datasets || !Array.isArray(parsedData.datasets) || parsedData.datasets.length === 0) {
          throw new Error('Chart data must include at least one dataset');
        }
        
        // Validate each dataset
        parsedData.datasets.forEach((dataset, index) => {
          if (!dataset.label) {
            throw new Error(`Dataset at index ${index} is missing a label`);
          }
          
          if (!dataset.data || !Array.isArray(dataset.data) || dataset.data.length === 0) {
            throw new Error(`Dataset at index ${index} must include data array`);
          }
          
          // For scatter plots, validate x,y structure
          if (chartType === 'scatter') {
            dataset.data.forEach((point: any, pointIndex) => {
              if (typeof point !== 'object' || point.x === undefined || point.y === undefined) {
                throw new Error(`Invalid point data at dataset ${index}, point ${pointIndex}. Scatter plots require {x, y} format.`);
              }
            });
          }
        });
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Invalid JSON data format';
        setLocalError(errorMessage);
        setGenerating(false);
        return;
      }
      
      // Validate chart options
      if (title.trim() === '') {
        setLocalError('Chart title is required');
        setGenerating(false);
        return;
      }
      
      // Create options object
      const options: ChartOptions = {
        title,
        xAxisLabel,
        yAxisLabel,
        enableZoom,
        enablePan,
      };
      
      // Generate the chart
      console.log('Calling generateChart with:', { chartType, options });
      const htmlContent = await generateChart(chartType, parsedData, options, 'html');
      console.log('Chart HTML content received, length:', htmlContent.length);
      
      // Check if the response indicates an error
      if (htmlContent.startsWith('Error:')) {
        setLocalError(htmlContent);
        setGenerating(false);
        return;
      }
      
      setChartData(htmlContent);
      
      // Update iframe content
      console.log('Updating iframe content');
      if (iframeRef.current) {
        console.log('Iframe ref is available. Setting srcdoc.');
        iframeRef.current.srcdoc = htmlContent;
      } else {
        console.error('Iframe ref is NOT available when trying to set srcdoc.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLocalError(`Error generating chart: ${errorMessage}`);
      
      // Set detailed error information
      if (err instanceof Error && err.stack) {
        setErrorDetails(err.stack);
      } else {
        setErrorDetails(JSON.stringify(err, null, 2));
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleSampleDataClick = () => {
    // Make sure we're using the complete sample data
    console.log('Setting sample data for chart type:', chartType);
    const data = sampleData[chartType];
    console.log('Sample data:', data);
    
    // Format with proper indentation for readability
    const formattedData = JSON.stringify(data, null, 2);
    console.log('Formatted data length:', formattedData.length);
    console.log('Sample data structure validation:');
    console.log('- Has labels:', !!data.labels);
    console.log('- Labels length:', data.labels?.length);
    console.log('- Has datasets:', !!data.datasets);
    console.log('- Datasets length:', data.datasets?.length);
    
    setCustomData(formattedData);
  };

  return (
    <div className="container">
      <header className="header">
        <h2>Chart Visualizer</h2>
        <p>Generate interactive charts using the MCP server</p>
      </header>

      <div className="chart-container">
        {!isConnected && (
          <div className="connection-warning">
            <p>Not connected to MCP server. Please connect first.</p>
            <Link to="/" className="button">
              Go to Home
            </Link>
          </div>
        )}

        {isConnected && (
          <div className="chart-content">
            <div className="chart-form-container">
              <form onSubmit={handleGenerateChart} className="chart-form">
                <div className="form-group">
                  <label htmlFor="chartType">Chart Type</label>
                  <div className="input-wrapper">
                    <select
                      id="chartType"
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value as any)}
                      className="select-input"
                    >
                      <option value="bar">Bar Chart</option>
                      <option value="line">Line Chart</option>
                      <option value="pie">Pie Chart</option>
                      <option value="scatter">Scatter Plot</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="title">Chart Title</label>
                  <div className="input-wrapper">
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="xAxisLabel">XAxis Label</label>
                  <div className="input-wrapper">
                    <input
                      id="xAxisLabel"
                      type="text"
                      value={xAxisLabel}
                      onChange={(e) => setXAxisLabel(e.target.value)}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="yAxisLabel">YAxis Label</label>
                  <div className="input-wrapper">
                    <input
                      id="yAxisLabel"
                      type="text"
                      value={yAxisLabel}
                      onChange={(e) => setYAxisLabel(e.target.value)}
                      className="text-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Options</label>
                  <div className="input-wrapper checkbox-container">
                    <label htmlFor="enableZoom" className="checkbox-label">
                      <input
                        id="enableZoom"
                        type="checkbox"
                        checked={enableZoom}
                        onChange={(e) => setEnableZoom(e.target.checked)}
                      />
                      Zoom
                    </label>
                    <label htmlFor="enablePan" className="checkbox-label">
                      <input
                        id="enablePan"
                        type="checkbox"
                        checked={enablePan}
                        onChange={(e) => setEnablePan(e.target.checked)}
                      />
                      Pan
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="customData">Data(JSON)</label>
                  <div className="input-wrapper">
                    <div className="textarea-container">
                      <textarea
                        id="customData"
                        value={customData}
                        onChange={(e) => setCustomData(e.target.value)}
                        className="json-textarea"
                        rows={10}
                      />
                     {/*} <button
                        type="button"
                        onClick={handleSampleDataClick}
                        className="button button-small"
                      >
                        Use Sample Data
                      </button>*/}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="button"
                  disabled={generating || !isConnected}
                >
                  {generating ? 'Generating...' : 'Generate Chart'}
                </button>
              </form>
            </div>

            <div className="chart-preview">
              <h2>Chart Preview</h2>
              <div className={chartData ? 'iframe-container' : 'empty-chart'}>
                {/* Always render the iframe but hide it when no chart data */}
                <iframe
                  ref={iframeRef}
                  className="chart-iframe"
                  title="Chart Preview"
                  sandbox="allow-scripts allow-same-origin"
                  style={{
                    width: '100%',
                    height: '400px',
                    border: 'none',
                    display: chartData ? 'block' : 'none',
                    position: 'relative',
                    zIndex: 10,
                    backgroundColor: 'white'
                  }}
                />
                {!chartData && (
                  <p>Chart will appear here after generation</p>
                )}
              </div>
            </div>
          </div>
        )}

        {(localError || error) && (
          <div className="error-container">
            <p className="error">{localError || error}</p>
            {errorDetails && (
              <>
                <button 
                  className="button button-small" 
                  onClick={() => setShowErrorDetails(!showErrorDetails)}
                >
                  {showErrorDetails ? 'Hide Details' : 'Show Details'}
                </button>
                {showErrorDetails && (
                  <pre className="error-details">{errorDetails}</pre>
                )}
              </>
            )}
          </div>
        )}
      </div>

      
    </div>
  );
};

export default ChartVisualizer;