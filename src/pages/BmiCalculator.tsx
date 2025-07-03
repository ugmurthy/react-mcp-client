import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMcp } from '../context/McpContext';
import './BmiCalculator.css';

const BmiCalculator = () => {
  const { calculateBmi, isConnected, isConnecting, error } = useMcp();
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [result, setResult] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (weight === '' || height === '') {
      setLocalError('Please enter both weight and height');
      return;
    }
    
    if (typeof weight !== 'number' || typeof height !== 'number') {
      setLocalError('Weight and height must be numbers');
      return;
    }
    
    if (weight <= 0 || height <= 0) {
      setLocalError('Weight and height must be positive numbers');
      return;
    }
    
    setLocalError(null);
    setCalculating(true);
    
    try {
      const bmiResult = await calculateBmi(weight, height);
      setResult(bmiResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLocalError(`Error calculating BMI: ${errorMessage}`);
    } finally {
      setCalculating(false);
    }
  };

  // Helper function to interpret BMI result
  const interpretBmi = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <div className="container">
      <header className="header">
        <h1>BMI Calculator</h1>
        <p>Calculate your Body Mass Index using the MCP server</p>
      </header>

      <div className="card">
        {!isConnected && (
          <div className="connection-warning">
            <p>Not connected to MCP server. Please connect first.</p>
            <Link to="/" className="button">
              Go to Home
            </Link>
          </div>
        )}

        {isConnected && (
          <form onSubmit={handleCalculate} className="form">
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                placeholder="Enter weight in kilograms"
                min="1"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')}
                placeholder="Enter height in centimeters"
                min="1"
                step="0.1"
                required
              />
            </div>

            <button 
              type="submit" 
              className="button" 
              disabled={calculating || !isConnected}
            >
              {calculating ? 'Calculating...' : 'Calculate BMI'}
            </button>
          </form>
        )}

        {(localError || error) && (
          <p className="error">{localError || error}</p>
        )}

        {result && (
          <div className="result">
            <h3>Result</h3>
            <p className="bmi-value">BMI: {result}</p>
            {!isNaN(Number(result)) && (
              <p className="bmi-interpretation">
                Category: {interpretBmi(Number(result))}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="navigation">
        <Link to="/" className="button button-secondary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default BmiCalculator;