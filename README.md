# React MCP Client

A React client application for interacting with a Model Context Protocol (MCP) server.

## Features

- Connect to an MCP server
- View available tools provided by the server
- Use the BMI Calculator tool to calculate BMI based on weight and height
- Use the JSON Fetcher tool to fetch and display JSON data from a URL
- Error handling with ErrorBoundary
- Responsive design

## Prerequisites

- Node.js (v16 or higher)
- Node.js (v16 or higher)
- pnpm (recommended), npm, or yarn
- An MCP server running locally

## Getting Started

1. Clone the repository
2. Install dependencies
3. Start the development server

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

## Project Structure

```
react-mcp-client/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # Service layer for API calls
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component
│   ├── index.css        # Global styles
│   └── main.tsx         # Entry point
├── .gitignore
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Available Pages

- **Home**: Displays connection status and available tools
- **BMI Calculator**: Calculate BMI based on weight and height
- **JSON Fetcher**: Fetch and display JSON data from a URL
- **404 Page**: Displayed when a route doesn't exist

## MCP Integration

This client connects to an MCP server using the Model Context Protocol SDK. The connection is managed through the `McpContext` provider, which provides hooks for components to access MCP functionality.

### Available Tools

- **BMI Calculator**: Calculate BMI based on weight and height
- **JSON Fetcher**: Fetch and display JSON data from a URL

## Error Handling

The application uses React's ErrorBoundary to catch and display errors gracefully. If an error occurs in a component, the ErrorBoundary will display an error message with details about the error.

## Development

### Adding a New Tool

To add a new tool:

1. Update the `mcpService.ts` file to add the new tool to the `knownTools` array
2. Create a new page component for the tool
3. Add a route for the new page in `App.tsx`
4. Add a link to the new tool on the Home page

### Adding a New Page

To add a new page:

1. Create a new component in the `pages` directory
2. Add a route for the new page in `App.tsx`
3. Add links to the new page where needed

## License

MIT
