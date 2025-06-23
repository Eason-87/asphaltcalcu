import React, { useState, useEffect } from "react";
import {
  Calculator,
  Info,
  FileText,
  AlertCircle,
  LightbulbIcon,
} from "lucide-react";
import "./AsphaltTonnageCalculator.css";

const AsphaltTonnageCalculator = () => {
  const [measurements, setMeasurements] = useState({
    length: "",
    width: "",
    thickness: "",
    unit: "feet",
    compactionFactor: 1.25,
    wastePercentage: 5,
  });

  const [results, setResults] = useState({
    area: 0,
    volume: 0,
    tonnage: 0,
    cost: 0,
  });

  const [asphaltType, setAsphaltType] = useState("hot-mix");
  const [customDensity, setCustomDensity] = useState("");
  const [costPerTon, setCostPerTon] = useState(100);

  // Asphalt densities in lbs/cubic foot
  const asphaltDensities = {
    "hot-mix": 145, // Hot Mix Asphalt (HMA)
    "warm-mix": 143, // Warm Mix Asphalt (WMA)
    "cold-mix": 140, // Cold Mix Asphalt
    recycled: 142, // Recycled Asphalt Pavement (RAP)
    custom: 0, // Placeholder, will be replaced by user input
  };

  const asphaltTypes = {
    "hot-mix": "Hot Mix Asphalt (HMA)",
    "warm-mix": "Warm Mix Asphalt (WMA)",
    "cold-mix": "Cold Mix Asphalt",
    recycled: "Recycled Asphalt (RAP)",
    custom: "Custom Density",
  };

  const handleInputChange = (field, value) => {
    setMeasurements((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateTonnage = () => {
    const {
      length,
      width,
      thickness,
      unit,
      compactionFactor,
      wastePercentage,
    } = measurements;

    if (!length || !width || !thickness) return;

    let lengthFt = parseFloat(length);
    let widthFt = parseFloat(width);
    let thicknessFt = parseFloat(thickness);

    // Convert to feet if needed
    if (unit === "inches") {
      thicknessFt = thicknessFt / 12;
    }

    // Calculate area in square feet
    const area = lengthFt * widthFt;

    // Calculate volume in cubic feet
    const volume = area * thicknessFt;

    // Get density for selected asphalt type
    const density =
      asphaltType === "custom"
        ? parseFloat(customDensity) || 0
        : asphaltDensities[asphaltType];

    // Calculate weight in pounds
    const weightLbs = volume * density * compactionFactor;

    // Add waste percentage
    const totalWeightLbs = weightLbs * (1 + wastePercentage / 100);

    // Convert to tons (2000 lbs = 1 ton in US)
    const tonnage = totalWeightLbs / 2000;

    // Calculate cost
    const cost = tonnage * costPerTon;

    setResults({
      area: area,
      volume: volume,
      tonnage: tonnage,
      cost: cost,
    });
  };

  useEffect(() => {
    calculateTonnage();
  }, [measurements, asphaltType, costPerTon]);

  const formatNumber = (num, decimals = 2) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  return (
    <div className="calculator-wrapper">
      <div className="calculator-card">
        {/* Header */}
        <div className="calculator-header">
          <div className="header-content">
            <Calculator />
            <div>
              <h1
                style={{
                  color: "white",
                }}
              >
                Asphalt Tonnage Calculator
              </h1>
              <p>Accurate calculations for road construction</p>
            </div>
          </div>
        </div>

        <div className="calculator-body">
          <div className="grid-container">
            {/* Input Section */}
            <div className="input-section">
              <div className="form-section">
                <h2 className="form-section-title">
                  <FileText />
                  Project Measurements
                </h2>

                <div className="input-grid">
                  <div>
                    <label>Length (ft)</label>
                    <input
                      type="number"
                      min="0"
                      value={measurements.length}
                      onChange={(e) =>
                        handleInputChange("length", e.target.value)
                      }
                      placeholder="Enter length"
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                  <div>
                    <label>Width (ft)</label>
                    <input
                      type="number"
                      min="0"
                      value={measurements.width}
                      onChange={(e) =>
                        handleInputChange("width", e.target.value)
                      }
                      placeholder="Enter width"
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                </div>

                <div className="thickness-group">
                  <label>Thickness</label>
                  <div className="input-container">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={measurements.thickness}
                      onChange={(e) =>
                        handleInputChange("thickness", e.target.value)
                      }
                      placeholder="Enter thickness"
                      onWheel={(e) => e.target.blur()}
                    />
                    <select
                      value={measurements.unit}
                      onChange={(e) =>
                        handleInputChange("unit", e.target.value)
                      }
                    >
                      <option value="feet">Feet</option>
                      <option value="inches">Inches</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label>Asphalt Type</label>
                  <p style={{}}>
                    <span
                      style={{
                        color: "#235ce0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {/* <LightbulbIcon /> */}
                      (You can also choose "Custom Density" to custom density)
                    </span>
                  </p>
                  <select
                    value={asphaltType}
                    onChange={(e) => setAsphaltType(e.target.value)}
                  >
                    {Object.entries(asphaltTypes).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                {asphaltType === "custom" && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label>Custom Density (lbs/cu ft)</label>
                    <input
                      type="number"
                      min="0"
                      value={customDensity}
                      onChange={(e) => setCustomDensity(e.target.value)}
                      placeholder="Enter custom density"
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                )}

                <div className="input-grid">
                  <div>
                    <label>Compaction Factor</label>
                    <input
                      type="number"
                      step="0.05"
                      min="1"
                      value={measurements.compactionFactor}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange(
                          "compactionFactor",
                          value === "" ? "" : parseFloat(value)
                        );
                      }}
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                  <div>
                    <label>Waste % (5-10%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={measurements.wastePercentage}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange(
                          "wastePercentage",
                          value === "" ? "" : parseFloat(value)
                        );
                      }}
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                </div>

                {/* <div className="cost-input">
                  <label>Cost per Ton (USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={costPerTon}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCostPerTon(value === "" ? "" : parseFloat(value));
                    }}
                    placeholder="Enter cost per ton"
                  />
                </div> */}
              </div>

              {/* Important Notes */}
              <div className="notes-section">
                <div className="notes-content">
                  <AlertCircle />
                  <div>
                    <h3>Important Notes</h3>
                    <ul>
                      <li>
                        Compaction factor accounts for material compression
                        during installation
                      </li>
                      <li>
                        Waste percentage covers material loss during transport
                        and application
                      </li>
                      <li>
                        Typical asphalt thickness: 2-4 inches for residential,
                        4-6 inches for commercial
                      </li>
                      <li>
                        Always consult with local suppliers for accurate pricing
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="results-section">
              <div className="results-card">
                <h2 className="results-title">Calculation Results</h2>

                <div className="results-grid">
                  <div className="result-item">
                    <div className="result-item-content">
                      <span className="result-item-label">Surface Area:</span>
                      <span className="result-item-value">
                        {formatNumber(results.area)} sq ft
                      </span>
                    </div>
                  </div>

                  <div className="result-item">
                    <div className="result-item-content">
                      <span className="result-item-label">Volume:</span>
                      <span className="result-item-value">
                        {formatNumber(results.volume)} cu ft
                      </span>
                    </div>
                  </div>

                  <div className="result-item tonnage-result">
                    <div className="result-item-content">
                      <span className="tonnage-label">Required Tonnage:</span>
                      <span className="tonnage-value">
                        {formatNumber(results.tonnage)} tons
                      </span>
                    </div>
                  </div>

                  {/* <div className="result-item cost-result">
                    <div className="result-item-content">
                      <span className="cost-label">Estimated Cost:</span>
                      <span className="cost-value">
                        {formatCurrency(results.cost)}
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="specs-card">
                <h3 className="card-title">
                  <Info />
                  Technical Specifications
                </h3>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span>Asphalt Type:</span>
                    <span className="spec-item-value">
                      {asphaltTypes[asphaltType]}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span>Density:</span>
                    <span className="spec-item-value">
                      {asphaltType === "custom"
                        ? `${customDensity || 0} lbs/cu ft`
                        : `${asphaltDensities[asphaltType]} lbs/cu ft`}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span>Compaction Factor:</span>
                    <span className="spec-item-value">
                      {measurements.compactionFactor}x
                    </span>
                  </div>
                  <div className="spec-item">
                    <span>Waste Allowance:</span>
                    <span className="spec-item-value">
                      {measurements.wastePercentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Reference */}
              <div className="reference-card">
                <h3 className="card-title">Quick Reference Guide</h3>
                <div className="reference-card-content">
                  <div>
                    <h4 className="reference-section-title">
                      Typical Thickness Standards:
                    </h4>
                    <ul className="reference-section-list">
                      <li>Residential driveways: 2-3 inches</li>
                      <li>Commercial parking lots: 3-4 inches</li>
                      <li>Heavy traffic areas: 4-6 inches</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="reference-section-title">Cost Factors:</h4>
                    <ul className="reference-section-list">
                      <li>Material costs vary by region</li>
                      <li>Transportation distance affects pricing</li>
                      <li>Seasonal demand impacts availability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsphaltTonnageCalculator;
