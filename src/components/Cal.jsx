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
    asphaltType: "Hot Mix",
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
    "Hot Mix": {
      name: "Hot Mix Asphalt (HMA)",
      densityRange: [2.1, 2.33],
      density: 2.17,
      basePrice: 600,
      priceRange: [550, 650],
    },
    "Warm Mix": {
      name: "Warm Mix Asphalt (WMA)",
      densityRange: [2.1, 2.33],
      density: 2.16,
      basePrice: 600,
      priceRange: [550, 650],
    },

    "Stone Matrix": {
      name: "Stone Matrix Asphalt (SMA)",
      densityRange: [2.17, 2.4],
      density: 2.25,
      basePrice: 600,
      priceRange: [550, 650],
    },
    "Open Graded": {
      name: "Open Graded Friction Course",
      densityRange: [1.73, 2.03],
      density: 1.87,
      basePrice: 600,
      priceRange: [550, 650],
    },
    "Cold Mix": {
      name: "Cold Mix Asphalt",
      densityRange: [1.8, 2.1],
      density: 2,
      basePrice: 600,
      priceRange: [550, 650],
    },
  };

  const references = {
    HotMix: [
      "AASHTO T 166 (Saturated Surface Dry Determination of HMA Density)",
      "ASTM D2726",
      " FHWA HMA Handbook (Federal Highway Administration)",
    ],
    WarmMix: [
      "AASHTO T 166/ASTM D2726 (Compaction Density Determination)",
      "FHWA WMA Technical Guidelines",
      "NAPA (American Asphalt Association) WMA Construction Manual",
    ],
    StoneMatrix: [
      "AASHTO T 166",
      "ASTM D2726",
      "FHWA (Federal Highway Administration)",
    ],
    OpenGraded: [
      "AASHTO T 166 / ASTM D2726",
      "FHWA Tech Brief – Open-Graded Friction Course",
      "NAPA IS 115 – OGFC Design Guide",
    ],
    ColdMix: [
      "ASTM D4215 – Cold-Mix Patching Materials",
      "FHWA Cold Mix Guidelines",
      "State DOT (e.g. TxDOT, Caltrans) Cold Patch Material Manual",
    ],
  };

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculate = () => {
    let {
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
      // thickness输入为inches，volume计算时应先转为feet
      const t_feet = t / 12; // 英寸转英尺
      // 体积先用英尺单位算
      const area_ft = parseFloat(length) * parseFloat(width); // 英尺²
      const volume_ft = area_ft * t_feet; // 立方英尺
      // 体积转为立方码
      const volume_yd = volume_ft / 27; // 1 yd³ = 27 ft³
      var area = area_ft; // 英尺²
      var displayVolume = volume_yd; // imperial下用于显示的体积（立方码）
    } else if (unit === "metric") {
      // 厚度从厘米转米
      t = t / 100;
      // 基础计算
      var area = l * w; // 平方米
      var volume = area * t; // 立方米
      var displayVolume = volume; // metric下用于显示的体积（立方米）
    }

    // 考虑压实系数和损耗系数
    if (!compactionFactor) {
      compactionFactor = 1;
    }
    const compactionFactorNum = parseFloat(compactionFactor);
    if (!wasteFactor) {
      wasteFactor = 0;
    }
    const wasteFactorNum = parseFloat(wasteFactor) / 100;

    let adjustedVolume;
    if (unit === "imperial") {
      adjustedVolume =
        displayVolume * compactionFactorNum * (1 + wasteFactorNum); // yd³
    } else {
      adjustedVolume =
        displayVolume * compactionFactorNum * (1 + wasteFactorNum); // m³
    }

    // 沥青重量计算
    const selectedAsphalt = asphaltTypes[asphaltType];
    const finalDensity =
      useCustomDensity && customDensity
        ? parseFloat(customDensity)
        : selectedAsphalt.density;

    let asphaltWeight, asphaltTons;
    if (unit === "imperial") {
      // 体积(yd³) × 密度(tons/yd³) = 重量(tons)
      let rawTons = adjustedVolume * finalDensity;
      asphaltTons = Math.round(rawTons * 100) / 100; // 保留两位小数
      asphaltWeight = asphaltTons * 2000; // lbs，严格对应
    } else {
      // 公制保持原有逻辑
      asphaltWeight = adjustedVolume * finalDensity * 1000; // 公斤
      asphaltTons = asphaltWeight / 1000; // 公吨
    }

    // 价格计算
    let finalPrice;
    if (customPrice) {
      finalPrice = parseFloat(customPrice);
    } else {
      finalPrice = 0;
    }

    // 成本估算
    const estimatedCost = asphaltTons * finalPrice;

    // 卡车载重估算 (按20吨/车计算)
    const truckLoads = Math.ceil(asphaltTons / 20);

    setResults({
      area: area,
      volume: displayVolume,
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
          inputs.unit === "metric" ? "cubic meter" : "cubic yard"
        }`,
        weight: `${
          inputs.unit === "metric"
            ? formatNumber(results.asphaltWeight)
            : results.asphaltWeight.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })
        }
          ${inputs.unit === "metric" ? " kg" : " lbs"}`,
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
                  onWheel={(e) => e.target.blur()}
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
                  onWheel={(e) => e.target.blur()}
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
                  onWheel={(e) => e.target.blur()}
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
                  onWheel={(e) => e.target.blur()}
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
                  onWheel={(e) => e.target.blur()}
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
                      Typical value range:{" "}
                      {asphaltTypes[inputs.asphaltType].densityRange[0]}-
                      {asphaltTypes[inputs.asphaltType].densityRange[1]}{" "}
                      tons/yd³
                    </p>
                    <p>
                      Common standard value:{" "}
                      {asphaltTypes[inputs.asphaltType].density} tons/yd³
                    </p>
                    <div>
                      <p style={{ fontWeight: "bold", color: "#475569" }}>
                        Density Reference Specifications and Sources:
                      </p>
                      <ul className="density-list">
                        {(function () {
                          // 动态获取references
                          const typeKeyMap = {
                            "Hot Mix": "HotMix",
                            "Warm Mix": "WarmMix",
                            "Stone Matrix": "StoneMatrix",
                            "Open Graded": "OpenGraded",
                            "Cold Mix": "ColdMix",
                          };
                          const refKey = typeKeyMap[inputs.asphaltType];
                          return (references[refKey] || []).map((ref, idx) => (
                            <li className="density-item" key={idx}>
                              • {ref}
                            </li>
                          ));
                        })()}
                      </ul>
                    </div>
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
                  placeholder="Enter the measured density value (tons/yd³)"
                  onWheel={(e) => e.target.blur()}
                />
              )}
            </div>

            {/* Price Settings */}
            <div className="form-group">
              <div className="form-group">
                <label className="form-label">Price ($/ton)</label>
                <input
                  type="number"
                  value={inputs.customPrice}
                  onChange={(e) =>
                    handleInputChange("customPrice", e.target.value)
                  }
                  placeholder="Enter actual quote ($/ton)"
                  className="form-input"
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              <div className="info-box info-box-yellow">
                <div className="info-content">
                  <Info className="info-text-yellow" />
                  <div className="info-text info-text-yellow">
                    <p className="form-hint">
                      * Prices may vary based on crude oil prices, supply and
                      demand, and transportation costs.
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
                  {inputs.unit === "metric" ? "m³" : "yd³"}
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
                  {inputs.unit === "metric"
                    ? formatNumber(results.asphaltWeight)
                    : results.asphaltWeight.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                  {inputs.unit === "metric" ? " kg" : " lbs"}
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
                <li className="suggestion-item">
                  • Consider base requirements: This calculator only estimates
                  the asphalt layer. Install a 4-8 inch compacted crushed stone
                  base under asphalt pavement for structural stability.
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
                <li className="density-item">• Mix design gradation</li>
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
