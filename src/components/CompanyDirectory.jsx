import React, { useState, useEffect } from "react";
import { SearchIcon, MapPinIcon, CameraIcon } from "lucide-react";

export default function CompanyDirectory({ companies }) {
  const [nameFilter, setNameFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState(companies);

  useEffect(() => {
    const name = nameFilter.trim().toLowerCase();
    const loc = locationFilter.trim().toLowerCase();

    const filtered = companies.filter(
      (c) =>
        (!name || c.name.toLowerCase().includes(name)) &&
        (!loc ||
          c.state.toLowerCase().includes(loc) ||
          c.city.toLowerCase().includes(loc) ||
          c.county.toLowerCase().includes(loc))
    );
    setFilteredCompanies(filtered);
  }, [nameFilter, locationFilter, companies]);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 16px" }}>
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        Asphalt companies near me
      </h1>
      <div style={{ display: "flex", gap: "16px", marginBottom: "2rem" }}>
        <div
          style={{
            position: "relative",
            flex: 1,
          }}
        >
          <SearchIcon
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#555",
              width: "20px",
              height: "20px",
            }}
          />
          <input
            id="nameInput"
            type="text"
            placeholder="Find A Company"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 48px",
              fontSize: "1rem",
              border: "1px solid #3257a7",
              borderRadius: "6px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div
          style={{
            position: "relative",
            flex: 1,
          }}
        >
          <MapPinIcon
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#555",
              width: "20px",
              height: "20px",
            }}
          />
          <input
            id="locationInput"
            type="text"
            placeholder="Search by location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 48px",
              fontSize: "1rem",
              border: "1px solid #3257a7",
              borderRadius: "6px",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
      <div
        id="companyList"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "30px",
        }}
      >
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="company-card"
            style={{
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px #0001",
              padding: "0 0 16px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {company.image ? (
              <img
                src={company.image}
                alt={company.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px 10px 0 0",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "180px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f5f5f5",
                  borderRadius: "10px 10px 0 0",
                  color: "#888",
                  fontSize: "1.2rem",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CameraIcon />{" "}
                  <span
                    style={{
                      paddingLeft: "10px",
                    }}
                  >
                    No image available at this time.
                  </span>
                </span>
              </div>
            )}
            <div style={{ padding: "16px", width: "100%" }}>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                {company.name}
              </div>

              <div
                style={{
                  color: "#888",
                  fontSize: "0.95rem",
                  margin: "2px 0",
                }}
              >
                State: {company.state || "Unknown"}, County:{" "}
                {company.county || "Unknown"}, City: {company.city || "Unknown"}
              </div>
              <div
                style={{
                  color: "#666",
                  fontSize: "0.95rem",
                  margin: "4px 0 2px 0",
                }}
              >
                {company.address}
              </div>
              {company.Category && (
                <div
                  style={{
                    color: "#888",
                    fontSize: "0.95rem",
                    margin: "2px 0",
                  }}
                >
                  <strong>Category:</strong> {company.Category}
                </div>
              )}
              {company.Phone && (
                <div
                  style={{
                    color: "#888",
                    fontSize: "0.95rem",
                    margin: "2px 0",
                  }}
                >
                  <strong>Phone:</strong> {company.Phone}
                </div>
              )}
              {company.Emails && (
                <div
                  style={{
                    color: "#888",
                    fontSize: "0.95rem",
                    margin: "2px 0",
                  }}
                >
                  <strong>Email:</strong>{" "}
                  {Array.isArray(company.Emails)
                    ? company.Emails[0]
                    : company.Emails.split
                    ? company.Emails.split(/[,;\s]+/)[0]
                    : company.Emails}
                </div>
              )}
              {company["Open Hours"] && (
                <div
                  style={{
                    color: "#888",
                    fontSize: "0.95rem",
                    margin: "2px 0",
                  }}
                >
                  <strong>Open Hours:</strong> {company["Open Hours"]}
                </div>
              )}
              <div style={{ margin: "6px 0 2px 0", fontSize: "0.95rem" }}>
                {company.description}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "4px",
                }}
              >
                <span style={{ color: "#f5b50a", fontSize: "1.1rem" }}>★</span>
                <span style={{ fontWeight: "bold" }}>{company.Rating}</span>
                <span
                  style={{
                    color: "#888",
                    fontSize: "0.95rem",
                    marginLeft: "6px",
                  }}
                >
                  Rating Info: {company.RatingInfo ? company.RatingInfo : "N/A"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
