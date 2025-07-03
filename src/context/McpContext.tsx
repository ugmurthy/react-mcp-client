import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { mcpService } from '../services/mcpService';
import type {
  McpTool,
  ChartData,
  ChartOptions,
  ChartGeneratorParams
} from '../services/mcpService';

// Define the shape of the context
interface McpContextType {
  isConnected: boolean;
  isConnecting: boolean;
  tools: McpTool[];
  error: string | null;
  connect: () => Promise<boolean>;
  calculateBmi: (weight: number, height: number) => Promise<string>;
  fetchJson: (url: string, method: 'GET' | 'POST', body?: Record<string, unknown>) => Promise<any>;
  generateChart: (
    type: 'bar' | 'line' | 'pie' | 'scatter',
    data: ChartData,
    options?: ChartOptions,
    format?: 'html' | 'image'
  ) => Promise<string>;
  callTool: (toolName: string, args: Record<string, unknown>) => Promise<any>;
}

// Create the context with a default value
const McpContext = createContext<McpContextType | undefined>(undefined);

// Provider props
interface McpProviderProps {
  children: ReactNode;
}

// Provider component
export const McpProvider = ({ children }: McpProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [tools, setTools] = useState<McpTool[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Connect to the MCP server
  const connect = async (): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const connected = await mcpService.connect();
      setIsConnected(connected);
      
      if (connected) {
        // Get the list of available tools
        const availableTools = await mcpService.listTools();
        setTools(availableTools);
      } else {
        setError('Failed to connect to MCP server');
      }
      
      return connected;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error connecting to MCP server: ${errorMessage}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Calculate BMI
  const calculateBmi = async (weight: number, height: number): Promise<string> => {
    setError(null);
    
    try {
      if (!isConnected) {
        await connect();
      }
      
      return await mcpService.calculateBmi({ weightKg: weight, heightCm: height });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error calculating BMI: ${errorMessage}`);
      throw err;
    }
  };

  // Fetch JSON
  const fetchJson = async (
    url: string, 
    method: 'GET' | 'POST', 
    body?: Record<string, unknown>
  ): Promise<any> => {
    setError(null);
    
    try {
      if (!isConnected) {
        await connect();
      }
      
      return await mcpService.fetchJson({ url, method, body });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error fetching JSON: ${errorMessage}`);
      throw err;
    }
  };

  // Generic tool caller
  const callTool = async (toolName: string, args: Record<string, unknown>): Promise<any> => {
    setError(null);
    
    try {
      if (!isConnected) {
        await connect();
      }
      
      if (!mcpService.isClientConnected()) {
        throw new Error('MCP service is not connected');
      }
      
      // Call the tool using the mcpService's callTool method
      return await mcpService.callTool(toolName, args);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error calling tool ${toolName}: ${errorMessage}`);
      throw err;
    }
  };

  // Generate Chart
  const generateChart = async (
    type: 'bar' | 'line' | 'pie' | 'scatter',
    data: ChartData,
    options?: ChartOptions,
    format: 'html' | 'image' = 'html'
  ): Promise<string> => {
    setError(null);
    
    try {
      if (!isConnected) {
        await connect();
      }
      
      // Validate chart type
      if (!['bar', 'line', 'pie', 'scatter'].includes(type)) {
        throw new Error(`Unsupported chart type: ${type}`);
      }
      
      // Validate data structure
      if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
        throw new Error('Invalid chart data structure');
      }
      
      // Create params object
      const params: ChartGeneratorParams = {
        type,
        data,
        options,
        format
      };
      
      // Call the service method
      return await mcpService.generateChart(params);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error generating chart: ${errorMessage}`);
      throw err;
    }
  };

  // Connect on mount
  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      mcpService.disconnect();
    };
  }, []);

  // Context value
  const value: McpContextType = {
    isConnected,
    isConnecting,
    tools,
    error,
    connect,
    calculateBmi,
    fetchJson,
    generateChart,
    callTool
  };

  return <McpContext.Provider value={value}>{children}</McpContext.Provider>;
};

// Custom hook to use the MCP context
export const useMcp = (): McpContextType => {
  const context = useContext(McpContext);
  
  if (context === undefined) {
    throw new Error('useMcp must be used within a McpProvider');
  }
  
  return context;
};