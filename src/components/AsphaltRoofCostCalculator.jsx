import { useState } from "react";
import "./AsphaltRoofCostCalculator.css";

export default function AsphaltRoofCostCalculator() {
  const [area, setArea] = useState(2000); // default 2000 sq ft
  const [shingleType, setShingleType] = useState("architectural");
  const [includeRemoval, setIncludeRemoval] = useState(false);
  const [removalCostPerSqFt, setRemovalCostPerSqFt] = useState(1.5);
  const [includeLabor, setIncludeLabor] = useState(false);
  const [laborCostPerSqFt, setLaborCostPerSqFt] = useState(3.0);

  const costPerSqFt = {
    "3-tab": 3.5,
    architectural: 5.0,
    luxury: 7.5,
  };

  const calculateCost = () => {
    const baseCost = area * costPerSqFt[shingleType];
    const removal = includeRemoval ? area * removalCostPerSqFt : 0;
    const labor = includeLabor ? area * laborCostPerSqFt : 0;
    return baseCost + removal + labor;
  };

  return (
    <div className="calculator-container">
      <h1 className="calculator-title">Asphalt Shingle Roof Cost Calculator</h1>

      <div className="input-group">
        <label className="input-label">Roof Area (sq ft):</label>
        <input
          type="number"
          className="input-field"
          value={area}
          onChange={(e) => setArea(Number(e.target.value))}
          min="100"
        />
      </div>

      <div className="input-group">
        <label className="input-label">Shingle Type:</label>
        <select
          className="input-field"
          value={shingleType}
          onChange={(e) => setShingleType(e.target.value)}
        >
          <option value="3-tab">3-Tab</option>
          <option value="architectural">Architectural</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>

      <div className="checkbox-group">
        <input
          id="includeRemoval"
          type="checkbox"
          className="checkbox-input"
          checked={includeRemoval}
          onChange={(e) => setIncludeRemoval(e.target.checked)}
        />
        <label htmlFor="includeRemoval" className="checkbox-label">
          Include old roof removal
        </label>
      </div>

      {includeRemoval && (
        <div className="input-group">
          <label className="input-label">Removal Cost per sq ft ($):</label>
          <input
            type="number"
            className="input-field"
            value={removalCostPerSqFt}
            onChange={(e) => setRemovalCostPerSqFt(Number(e.target.value))}
            min="0"
            step="0.1"
          />
        </div>
      )}

      <div className="checkbox-group">
        <input
          id="includeLabor"
          type="checkbox"
          className="checkbox-input"
          checked={includeLabor}
          onChange={(e) => setIncludeLabor(e.target.checked)}
        />
        <label htmlFor="includeLabor" className="checkbox-label">
          Include installation labor
        </label>
      </div>

      {includeLabor && (
        <div className="input-group">
          <label className="input-label">Labor Cost per sq ft ($):</label>
          <input
            type="number"
            className="input-field"
            value={laborCostPerSqFt}
            onChange={(e) => setLaborCostPerSqFt(Number(e.target.value))}
            min="0"
            step="0.1"
          />
        </div>
      )}

      <div className="result-container">
        <h2 className="result-title">Estimated Total Cost:</h2>
        <p className="result-amount">${calculateCost().toLocaleString()}</p>
        {(includeRemoval || includeLabor) && (
          <div className="cost-breakdown">
            <p className="breakdown-item">
              <span>Base Cost:</span>
              <span>${(area * costPerSqFt[shingleType]).toLocaleString()}</span>
            </p>
            {includeRemoval && (
              <p className="breakdown-item">
                <span>Removal Cost:</span>
                <span>${(area * removalCostPerSqFt).toLocaleString()}</span>
              </p>
            )}
            {includeLabor && (
              <p className="breakdown-item">
                <span>Labor Cost:</span>
                <span>${(area * laborCostPerSqFt).toLocaleString()}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
