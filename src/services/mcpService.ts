// Import types only from MCP SDK
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";

// Define types for the MCP tools
export interface BmiCalculatorParams extends Record<string, unknown> {
  weightKg: number;
  heightCm: number;
}

export interface JsonFetcherParams extends Record<string, unknown> {
  url: string;
  method: 'GET' | 'POST';
  body?: Record<string, unknown>;
}

export interface ChartDataset {
  label: string;
  data: number[] | Array<{x: number, y: number}>;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartOptions {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  enableZoom?: boolean;
  enablePan?: boolean;
}

export interface ChartGeneratorParams extends Record<string, unknown> {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  data: ChartData;
  options?: ChartOptions;
  format?: 'html' | 'image';
  width?: number;
  height?: number;
}

export interface McpTool {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

export interface McpToolResult {
  content: Array<{
    type: string;
    text: string;
  }>;
}

// Define the shape of the response from the MCP server
interface McpToolResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

class McpService {
  private client: Client | null = null;
  private isConnected = false;
  private knownTools: McpTool[] = [
    {
      name: 'calculate_bmi',
      description: 'Calculate BMI based on weight and height',
      inputSchema: {
        weightKg: 'number',
        heightCm: 'number'
      }
    },
    {
      name: 'fetch_json',
      description: 'Fetch JSON data from a URL',
      inputSchema: {
        url: 'string',
        method: 'string',
        body: 'object (optional)'
      }
    },
    {
      name: 'generate_chart',
      description: 'Generate interactive charts from provided data',
      inputSchema: {
        type: 'string (bar, line, pie, scatter)',
        data: 'object with labels and datasets',
        options: 'object (optional)',
        format: 'string (html or image, optional)',
        width: 'number (optional)',
        height: 'number (optional)'
      }
    }
  ];

  constructor() {
    // No initialization needed for browser mock
    console.log('Using browser-compatible mock MCP service');
  }

  async connect(): Promise<boolean> {
    console.log('Connecting to mock MCP service...');
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.isConnected = true;
    console.log('Connected to mock MCP service');
    return true;
  }

  async listTools(): Promise<McpTool[]> {
    console.log('Listing mock MCP tools');
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.knownTools;
  }

  async calculateBmi(params: BmiCalculatorParams): Promise<string> {
    console.log('Calculating BMI with mock service', params);
    
    if (!this.isConnected) {
      throw new Error('Mock service not connected');
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Actual BMI calculation
    const heightM = params.heightCm / 100;
    const bmi = params.weightKg / (heightM * heightM);
    
    return bmi.toFixed(2);
  }

  async fetchJson(params: JsonFetcherParams): Promise<any> {
    console.log('Fetching JSON with mock service', params);
    
    if (!this.isConnected) {
      throw new Error('Mock service not connected');
    }

    // Actually use the browser's fetch API directly
    try {
      const response = await fetch(params.url, {
        method: params.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: params.method === 'POST' && params.body ? JSON.stringify(params.body) : undefined
      });
      
      const data = await response.json();
      
      // Return a properly structured response that matches the JsonResponse interface
      return {
        data: data,
        status: response.status,
        headers: Object.fromEntries([...response.headers.entries()])
      };
    } catch (error) {
      console.error('Failed to fetch JSON:', error);
      throw error;
    }
  }

  async callTool(toolName: string, args: Record<string, unknown>): Promise<any> {
    console.log(`Calling mock tool ${toolName} with args:`, args);
    
    if (!this.isConnected) {
      throw new Error('Mock service not connected');
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Handle known tools
    if (toolName === 'calculate_bmi') {
      return this.calculateBmi(args as BmiCalculatorParams);
    } else if (toolName === 'fetch_json') {
      return this.fetchJson(args as JsonFetcherParams);
    } else if (toolName === 'generate_chart') {
      return this.generateChart(args as ChartGeneratorParams);
    }
    
    throw new Error(`Unknown tool: ${toolName}`);
  }

  async getPrompt(name: string, args: Record<string, unknown>): Promise<any> {
    console.log(`Getting mock prompt ${name} with args:`, args);
    
    if (!this.isConnected) {
      throw new Error('Mock service not connected');
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return a mock prompt
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `This is a mock prompt for ${name} with args: ${JSON.stringify(args)}`
          }
        }
      ]
    };
  }

  async generateChart(params: ChartGeneratorParams): Promise<string> {
    console.log('Generating chart with mock service', params);
    console.log('Chart type:', params.type);
    console.log('Chart data structure:');
    console.log('- Has labels:', !!params.data?.labels);
    console.log('- Labels length:', params.data?.labels?.length);
    console.log('- Has datasets:', !!params.data?.datasets);
    console.log('- Datasets length:', params.data?.datasets?.length);
    console.log('- Connection status:', this.isConnected ? 'Connected' : 'Disconnected');
    
    // Always ensure we're connected before generating a chart
    // This helps maintain connection when chart types change
    if (!this.isConnected) {
      console.log('Not connected to MCP service, attempting to reconnect');
      try {
        await this.connect();
        
        if (!this.isConnected) {
          throw new Error('Failed to connect to MCP service');
        }
        console.log('Successfully reconnected to MCP service');
      } catch (error) {
        console.error('Connection error:', error);
        throw new Error('Failed to connect to MCP service: ' +
          (error instanceof Error ? error.message : String(error)));
      }
    } else {
      console.log('Already connected to MCP service');
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Validate required parameters
      if (!params.type) {
        throw new Error('Chart type is required');
      }
      
      if (!params.data || !params.data.labels || !params.data.datasets) {
        throw new Error('Invalid chart data structure');
      }
      
      // For scatter plots, validate x,y structure
      if (params.type === 'scatter') {
        const hasInvalidData = params.data.datasets.some(dataset =>
          dataset.data.some((point: any) =>
            typeof point !== 'object' || point.x === undefined || point.y === undefined
          )
        );
        
        if (hasInvalidData) {
          throw new Error('Scatter plots require data points in {x, y} format');
        }
      }
      
      // In a real implementation, this would call the MCP server
      // For now, we'll return a mock HTML chart
      if (params.format === 'image') {
        // Return a mock base64 image (a 1x1 transparent pixel)
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      } else {
        // Return a mock HTML chart
        return `
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
              <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.0.0"></script>
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .chart-container { width: 100%; max-width: 800px; margin: 0 auto; }
                .debug-info { background: #f0f0f0; border: 1px solid #ccc; padding: 10px; margin: 10px 0; font-family: monospace; white-space: pre-wrap; }
                .error-message { color: red; padding: 10px; border: 1px solid red; margin: 10px 0; }
              </style>
            </head>
            <body>
              <div class="chart-container">
                <canvas id="chart"></canvas>
              </div>
              <div id="debug-output" class="debug-info">Loading chart...</div>
              <script>
                const debugOutput = document.getElementById('debug-output');
                
                function logDebug(message) {
                  // debugOutput.textContent += "\\n" + message;
                  console.log(message);
                }
                
                logDebug("Script started");
                
                try {
                  logDebug("Loading Chart.js...");
                  if (typeof Chart === 'undefined') {
                    throw new Error("Chart.js failed to load");
                  }
                  logDebug("Chart.js loaded successfully");
                  
                  logDebug("Loading ChartZoom plugin...");
                  if (typeof ChartZoom === 'undefined') {
                    throw new Error("ChartZoom plugin failed to load");
                  }
                  logDebug("ChartZoom plugin loaded successfully");
                  
                  // Register zoom plugin
                  logDebug("Registering ChartZoom plugin...");
                  // The ChartZoom plugin might not have a default export
                  // Try different ways to register it
                  try {
                    logDebug("Attempting to register ChartZoom plugin");
                    if (typeof ChartZoom === 'undefined') {
                      logDebug("ChartZoom is undefined");
                      throw new Error("ChartZoom plugin is not defined");
                    }
                    
                    logDebug("ChartZoom type: " + typeof ChartZoom);
                    if (ChartZoom.default) {
                      logDebug("Using ChartZoom.default");
                      Chart.register(ChartZoom.default);
                    } else if (ChartZoom) {
                      logDebug("Using ChartZoom directly");
                      Chart.register(ChartZoom);
                    } else {
                      throw new Error("ChartZoom plugin is not properly defined");
                    }
                    logDebug("ChartZoom plugin registered successfully");
                    
                    // Add a small delay to ensure the plugin is fully registered
                    setTimeout(() => {
                      logDebug("Continuing after ChartZoom registration");
                    }, 100);
                  } catch (e) {
                    logDebug("Error registering ChartZoom: " + e.message);
                    if (e.stack) {
                      logDebug("Stack trace: " + e.stack);
                    }
                    // Continue without zoom functionality
                  }
                  logDebug("ChartZoom plugin registered");
                  
                  logDebug("Parsing chart configuration...");
                  const config = ${JSON.stringify({
                    type: params.type,
                    data: params.data,
                    options: {
                      responsive: true,
                      plugins: {
                        zoom: {
                          zoom: {
                            wheel: {
                              enabled: params.options?.enableZoom ?? true,
                            },
                            pinch: {
                              enabled: params.options?.enableZoom ?? true,
                            },
                            mode: 'xy',
                          },
                          pan: {
                            enabled: params.options?.enablePan ?? true,
                            mode: 'xy',
                          },
                        },
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: params.options?.title || 'Chart',
                        },
                      },
                      scales: {
                        x: {
                          title: {
                            display: !!params.options?.xAxisLabel,
                            text: params.options?.xAxisLabel,
                          },
                        },
                        y: {
                          title: {
                            display: !!params.options?.yAxisLabel,
                            text: params.options?.yAxisLabel,
                          },
                        },
                      },
                    }
                  })};
                  
                  logDebug("Configuration parsed successfully");
                  
                  logDebug("Getting canvas context...");
                  const canvas = document.getElementById('chart');
                  if (!canvas) {
                    throw new Error("Canvas element not found");
                  }
                  
                  const ctx = canvas.getContext('2d');
                  if (!ctx) {
                    throw new Error("Failed to get canvas context");
                  }
                  logDebug("Canvas context obtained");
                  
                  logDebug("Creating chart instance...");
                  const chartInstance = new Chart(ctx, config);
                  logDebug("Chart instance created successfully");
                  
                  // Log chart data for debugging
                  logDebug("Chart data: " + JSON.stringify(config.data).substring(0, 100) + "...");
                  
                } catch (error) {
                  logDebug("ERROR: " + error.message);
                  if (error.stack) {
                    logDebug("Stack trace: " + error.stack);
                  }
                  document.querySelector('.chart-container').innerHTML =
                    '<div class="error-message">Error rendering chart: ' + error.message + '</div>';
                  console.error('Chart error:', error);
                }
              </script>
            </body>
          </html>
        `;
      }
    } catch (error) {
      console.error('Failed to generate chart:', error);
      
      // Provide more specific error messages based on error type
      if (error instanceof TypeError) {
        return `Error: Invalid data type - ${error.message}`;
      } else if (error instanceof SyntaxError) {
        return `Error: Syntax error - ${error.message}`;
      } else if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      
      return 'Error: Unknown error occurred while generating chart';
    }
  }

  disconnect(): void {
    console.log('Disconnecting from mock MCP service');
    this.isConnected = false;
  }

  isClientConnected(): boolean {
    return this.isConnected;
  }
}

// Export a singleton instance
export const mcpService = new McpService();