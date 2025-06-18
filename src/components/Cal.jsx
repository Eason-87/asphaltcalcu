import React, { useState, useEffect } from "react";
import "../styles/calculator.css";

// Info icon component
const Info = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`info-icon ${className}`}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const AsphaltCalculator = () => {
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    thickness: "",
    asphaltType: "PG 64-22",
    customDensity: "",
    useCustomDensity: false,
    customPrice: "",
    useCustomPrice: false,
    priceMode: "base",
    region: "northeast",
    season: "spring",
    compactionFactor: "1.25",
    wasteFactor: "5",
    unit: "imperial",
  });

  const [results, setResults] = useState({
    area: 0,
    volume: 0,
    asphaltWeight: 0,
    asphaltTons: 0,
    estimatedCost: 0,
    truckLoads: 0,
  });

  // Asphalt types configuration - includes density ranges and base prices
  const asphaltTypes = {
    "PG 58-28": {
      name: "PG 58-28 Performance Grade Asphalt",
      densityRange: [2.35, 2.45],
      density: 2.4,
      basePrice: 85,
      priceRange: [75, 95],
    },
    "PG 64-22": {
      name: "PG 64-22 Performance Grade Asphalt",
      densityRange: [2.35, 2.45],
      density: 2.4,
      basePrice: 90,
      priceRange: [80, 100],
    },
    "PG 76-22": {
      name: "PG 76-22 Performance Grade Asphalt",
      densityRange: [2.35, 2.45],
      density: 2.4,
      basePrice: 95,
      priceRange: [85, 105],
    },
    Superpave: {
      name: "Superpave Mix Design",
      densityRange: [2.35, 2.45],
      density: 2.4,
      basePrice: 88,
      priceRange: [78, 98],
    },
    "Stone Matrix": {
      name: "Stone Matrix Asphalt (SMA)",
      densityRange: [2.35, 2.45],
      density: 2.4,
      basePrice: 100,
      priceRange: [90, 110],
    },
    "Open Graded": {
      name: "Open Graded Friction Course",
      densityRange: [2.2, 2.3],
      density: 2.25,
      basePrice: 95,
      priceRange: [85, 105],
    },
  };

  // Regional price factors
  const regionFactors = {
    northeast: { name: "Northeast", factor: 1.1 },
    southeast: { name: "Southeast", factor: 1.0 },
    midwest: { name: "Midwest", factor: 0.95 },
    southwest: { name: "Southwest", factor: 0.9 },
    west: { name: "West", factor: 1.05 },
    northwest: { name: "Northwest", factor: 1.0 },
  };

  // Seasonal price factors
  const seasonFactors = {
    spring: { name: "Spring (Mar-May)", factor: 1.0 },
    summer: { name: "Summer (Jun-Aug)", factor: 1.15 },
    autumn: { name: "Autumn (Sep-Nov)", factor: 1.05 },
    winter: { name: "Winter (Dec-Feb)", factor: 0.85 },
  };

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculate = () => {
    const {
      length,
      width,
      thickness,
      asphaltType,
      compactionFactor,
      wasteFactor,
      unit,
      customDensity,
      useCustomDensity,
      customPrice,
      useCustomPrice,
      priceMode,
      region,
      season,
    } = inputs;

    if (!length || !width || !thickness) return;

    let l = parseFloat(length);
    let w = parseFloat(width);
    let t = parseFloat(thickness);

    // 单位转换
    if (unit === "imperial") {
      // 英制转公制
      l = l * 0.3048; // 英尺转米
      w = w * 0.3048;
      t = t * 0.0254; // 英寸转米
    } else if (unit === "metric") {
      // 厚度从厘米转米
      t = t / 100;
    }

    // 基础计算
    const area = l * w; // 平方米
    const volume = area * t; // 立方米

    // 考虑压实系数和损耗系数
    const compactionFactorNum = parseFloat(compactionFactor);
    const wasteFactorNum = parseFloat(wasteFactor) / 100;

    const adjustedVolume = volume * compactionFactorNum * (1 + wasteFactorNum);

    // 沥青重量计算
    const selectedAsphalt = asphaltTypes[asphaltType];
    const finalDensity =
      useCustomDensity && customDensity
        ? parseFloat(customDensity)
        : selectedAsphalt.density;

    const asphaltWeight = adjustedVolume * finalDensity * 1000; // 公斤
    const asphaltTons = asphaltWeight / 1000; // 吨

    // 价格计算
    let finalPrice;
    if (useCustomPrice && customPrice) {
      finalPrice = parseFloat(customPrice);
    } else {
      let basePrice = selectedAsphalt.basePrice;

      if (priceMode === "seasonal") {
        basePrice *= seasonFactors[season].factor;
      } else if (priceMode === "regional") {
        basePrice *= regionFactors[region].factor;
      }

      finalPrice = basePrice;
    }

    // 成本估算
    const estimatedCost = asphaltTons * finalPrice;

    // 卡车载重估算 (按20吨/车计算)
    const truckLoads = Math.ceil(asphaltTons / 20);

    setResults({
      area: area,
      volume: volume,
      asphaltWeight: asphaltWeight,
      asphaltTons: asphaltTons,
      estimatedCost: estimatedCost,
      truckLoads: truckLoads,
      finalPrice: finalPrice,
    });
  };

  useEffect(() => {
    calculate();
  }, [inputs]);

  const formatNumber = (num, decimals = 2) => {
    return num.toLocaleString("zh-CN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const resetForm = () => {
    setInputs({
      length: "",
      width: "",
      thickness: "",
      asphaltType: "PG 64-22",
      customDensity: "",
      useCustomDensity: false,
      customPrice: "",
      useCustomPrice: false,
      priceMode: "base",
      region: "northeast",
      season: "spring",
      compactionFactor: "1.25",
      wasteFactor: "5",
      unit: "imperial",
    });
  };

  const exportResults = () => {
    const data = {
      parameter: {
        length: `${inputs.length} ${inputs.unit === "metric" ? "m" : "foot"}`,
        width: `${inputs.width} ${inputs.unit === "metric" ? "m" : "foot"}`,
        thickness: `${inputs.thickness} ${
          inputs.unit === "metric" ? "cm" : "inch"
        }`,
        type: asphaltTypes[inputs.asphaltType].name,
        CompactionCoefficient: inputs.compactionFactor,
        LossCoefficient: `${inputs.wasteFactor}%`,
      },
      result: {
        area: `${formatNumber(results.area)} ${
          inputs.unit === "metric" ? "square meter" : "square foot"
        }`,
        volume: `${formatNumber(results.volume)} ${
          inputs.unit === "metric" ? "cubic meter" : "cubic foot"
        }`,
        weight: `${formatNumber(results.asphaltWeight)} ${
          inputs.unit === "metric" ? "kilogram" : "pound"
        }`,
        tons: `${formatNumber(results.asphaltTons)} ton`,
        EstimatedCost: `$${formatNumber(results.estimatedCost)}`,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Results.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="calculator-container">
      <div className="calculator-card">
        <div className="calculator-header">
          <div>
            <h2 className="calculator-title">
              Professional Asphalt Calculator
            </h2>
          </div>
          <div className="button-group">
            <button onClick={resetForm} className="button button-reset">
              Reset
            </button>
            <button onClick={exportResults} className="button button-export">
              Export Results
            </button>
          </div>
        </div>

        <div className="calculator-grid">
          {/* Input Parameters Section */}
          <div className="section">
            <h2 className="section-title">Input Parameters</h2>

            {/* Unit Selection */}
            <div className="form-group">
              <label className="form-label">Measurement Unit</label>
              <select
                value={inputs.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
                className="form-select"
              >
                <option value="imperial">Imperial (ft/in)</option>
                <option value="metric">Metric (m/cm)</option>
              </select>
            </div>

            {/* Dimensions Input */}
            <div className="form-group">
              <div className="form-group">
                <label className="form-label">
                  Length ({inputs.unit === "metric" ? "meters" : "feet"})
                </label>
                <input
                  type="number"
                  value={inputs.length}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                  placeholder="Enter length"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Width ({inputs.unit === "metric" ? "meters" : "feet"})
                </label>
                <input
                  type="number"
                  value={inputs.width}
                  onChange={(e) => handleInputChange("width", e.target.value)}
                  placeholder="Enter width"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Thickness (
                  {inputs.unit === "metric" ? "centimeters" : "inches"})
                </label>
                <input
                  type="number"
                  value={inputs.thickness}
                  onChange={(e) =>
                    handleInputChange("thickness", e.target.value)
                  }
                  placeholder="Enter thickness"
                  className="form-input"
                />
              </div>
            </div>

            {/* Advanced Parameters */}
            <div className="form-group">
              <div className="form-group">
                <label className="form-label">Compaction Factor</label>
                <input
                  type="number"
                  step="0.05"
                  value={inputs.compactionFactor}
                  onChange={(e) =>
                    handleInputChange("compactionFactor", e.target.value)
                  }
                  className="form-input"
                />
                <p className="form-hint">Typically 1.20-1.30</p>
              </div>
              <div className="form-group">
                <label className="form-label">Waste Factor (%)</label>
                <input
                  type="number"
                  value={inputs.wasteFactor}
                  onChange={(e) =>
                    handleInputChange("wasteFactor", e.target.value)
                  }
                  className="form-input"
                />
                <p className="form-hint">Typically 3-10%</p>
              </div>
            </div>

            {/* Asphalt Type */}
            <div className="form-group">
              <label className="form-label">Asphalt Type</label>
              <select
                value={inputs.asphaltType}
                onChange={(e) =>
                  handleInputChange("asphaltType", e.target.value)
                }
                className="form-select"
              >
                {Object.entries(asphaltTypes).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.name}
                  </option>
                ))}
              </select>
              <div className="info-box info-box-blue">
                <div className="info-content">
                  <Info className="info-text-blue" />
                  <div className="info-text info-text-blue">
                    <p>
                      Density Range:{" "}
                      {asphaltTypes[inputs.asphaltType].densityRange[0]}-
                      {asphaltTypes[inputs.asphaltType].densityRange[1]}{" "}
                      tons/cubic yard
                    </p>
                    <p>
                      Recommended Density:{" "}
                      {asphaltTypes[inputs.asphaltType].density} tons/cubic yard
                    </p>
                    <p>
                      Base Price: ${asphaltTypes[inputs.asphaltType].basePrice}{" "}
                      per ton
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 自定义密度选项 */}
            <div className="form-group">
              <label
                className="form-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  checked={inputs.useCustomDensity}
                  onChange={(e) =>
                    handleInputChange("useCustomDensity", e.target.checked)
                  }
                  style={{
                    width: "50px",
                  }}
                />
                Use custom density
              </label>
              {inputs.useCustomDensity && (
                <input
                  type="number"
                  step="0.01"
                  value={inputs.customDensity}
                  onChange={(e) =>
                    handleInputChange("customDensity", e.target.value)
                  }
                  placeholder="Enter the measured density value"
                />
              )}
            </div>

            {/* Price Settings */}
            <div className="form-group">
              <h3 className="section-title">Price Settings</h3>
              <div className="form-group">
                <label className="form-label">Price Mode</label>
                <select
                  value={inputs.priceMode}
                  onChange={(e) =>
                    handleInputChange("priceMode", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="base">Base Price</option>
                  <option value="seasonal">Seasonal Price</option>
                  <option value="regional">Regional Price</option>
                </select>
              </div>

              {inputs.priceMode === "seasonal" && (
                <div className="form-group">
                  <label className="form-label">Construction Season</label>
                  <select
                    value={inputs.season}
                    onChange={(e) =>
                      handleInputChange("season", e.target.value)
                    }
                    className="form-select"
                  >
                    {Object.entries(seasonFactors).map(([key, season]) => (
                      <option key={key} value={key}>
                        {season.name}
                      </option>
                    ))}
                  </select>
                  <p className="form-hint">
                    Factor: {seasonFactors[inputs.season].factor}x (Higher
                    prices during summer peak season)
                  </p>
                </div>
              )}

              {inputs.priceMode === "regional" && (
                <div className="form-group">
                  <label className="form-label">Region</label>
                  <select
                    value={inputs.region}
                    onChange={(e) =>
                      handleInputChange("region", e.target.value)
                    }
                    className="form-select"
                  >
                    {Object.entries(regionFactors).map(([key, region]) => (
                      <option key={key} value={key}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  <p className="form-hint">
                    Factor: {regionFactors[inputs.region].factor}x (Based on
                    local market conditions)
                  </p>
                </div>
              )}

              <div className="form-group">
                <label
                  className="form-label"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={inputs.useCustomPrice}
                    onChange={(e) =>
                      handleInputChange("useCustomPrice", e.target.checked)
                    }
                    style={{
                      width: "50px",
                    }}
                  />
                  Use Custom Price
                </label>
                {inputs.useCustomPrice && (
                  <input
                    type="number"
                    value={inputs.customPrice}
                    onChange={(e) =>
                      handleInputChange("customPrice", e.target.value)
                    }
                    placeholder="Enter actual quote ($/ton)"
                    className="form-input"
                  />
                )}
              </div>

              <div className="info-box info-box-yellow">
                <div className="info-content">
                  <Info className="info-text-yellow" />
                  <div className="info-text info-text-yellow">
                    <p>
                      Base Price: ${asphaltTypes[inputs.asphaltType].basePrice}{" "}
                      per ton
                    </p>
                    <p>
                      Price Range: $
                      {asphaltTypes[inputs.asphaltType].priceRange[0]}-
                      {asphaltTypes[inputs.asphaltType].priceRange[1]} per ton
                    </p>
                    <p className="form-hint">
                      * Prices may vary based on crude oil prices, supply and
                      demand, and transportation costs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="section">
            <h2 className="section-title">Calculation Results</h2>

            <div className="result-card result-card-blue">
              <h3 className="result-title result-title-blue">Basic Data</h3>
              <div className="result-row">
                <span className="result-label">Area:</span>
                <span className="result-value">
                  {formatNumber(results.area)}{" "}
                  {inputs.unit === "metric" ? "m²" : "ft²"}
                </span>
              </div>
              <div className="result-row">
                <span className="result-label">Volume:</span>
                <span className="result-value">
                  {formatNumber(results.volume)}{" "}
                  {inputs.unit === "metric" ? "m³" : "ft³"}
                </span>
              </div>
            </div>

            <div className="result-card result-card-green">
              <h3 className="result-title result-title-green">
                Material Requirements
              </h3>
              <div className="result-row">
                <span className="result-label">Asphalt Weight:</span>
                <span className="result-value">
                  {formatNumber(results.asphaltWeight)}{" "}
                  {inputs.unit === "metric" ? "kg" : "lbs"}
                </span>
              </div>
              <div className="result-row">
                <span className="result-label">Asphalt Tons:</span>
                <span className="result-value result-value-large">
                  {formatNumber(results.asphaltTons)} tons
                </span>
              </div>
              <div className="result-row">
                <span className="result-label">Truck Loads:</span>
                <span className="result-value">{results.truckLoads} loads</span>
              </div>
            </div>

            <div className="result-card result-card-orange">
              <h3 className="result-title result-title-orange">
                Cost Estimate
              </h3>
              <div className="result-row">
                <span className="result-label">Material Cost:</span>
                <span className="result-value result-value-large">
                  ${formatNumber(results.estimatedCost)}
                </span>
              </div>
              <p className="form-hint">
                * Material cost only, excluding labor and equipment
              </p>
            </div>

            {/* Construction Tips */}
            <div className="suggestion-box">
              <h3 className="result-title">Construction Tips</h3>
              <ul className="suggestion-list">
                <li className="suggestion-item">
                  • Allow 10-15% material surplus
                </li>
                <li className="suggestion-item">
                  • Ensure proper base compaction
                </li>
                <li className="suggestion-item">
                  • Control paving temperature and rolling timing
                </li>
                <li className="suggestion-item">
                  • Consider weather conditions
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="density-info">
          <h3 className="section-title">Density Information</h3>
          <div className="density-grid">
            <div>
              <h4>Density Factors:</h4>
              <ul className="density-list">
                <li className="density-item">• Aggregate type and source</li>
                <li className="density-item">
                  • Asphalt content (binder ratio)
                </li>
                <li className="density-item">• Mix gradation</li>
                <li className="density-item">• Compaction and air voids</li>
              </ul>
            </div>
            <div>
              <h4>Recommendations:</h4>
              <ul className="density-list">
                <li className="density-item">
                  • Use measured density when available
                </li>
                <li className="density-item">
                  • Follow AASHTO T 166 for density testing
                </li>
                <li className="density-item">• Consider seasonal conditions</li>
                <li className="density-item">
                  • Regular density parameter verification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsphaltCalculator;
