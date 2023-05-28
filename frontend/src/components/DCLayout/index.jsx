import React, { useEffect, useState } from "react";
import "./index.css"; // Import the CSS file for styling

function DCLayout({ data }) {
  const [collapsedZones, setCollapsedZones] = useState([]);

  const toggleZone = (zoneKey) => {
    if (collapsedZones.includes(zoneKey)) {
      setCollapsedZones(collapsedZones.filter((key) => key !== zoneKey));
    } else {
      setCollapsedZones([...collapsedZones, zoneKey]);
    }
  };

  const renderServers = (rack) => {
    return Object.entries(rack).map(([serverKey, temperature]) => {
      const temperatureClass =
        temperature >= 80 ? "high" : temperature >= 60 ? "medium" : "low";

      return (
        <div key={serverKey} className="server">
          <span className="server-name">{serverKey}</span>
          <span className={`server-temperature ${temperatureClass}`}>
            {temperature}°C
          </span>
        </div>
      );
    });
  };

  const renderRacks = (zone) => {
    return Object.entries(zone).map(([rackKey, rack]) => {
      return (
        <div key={rackKey} className="rack expanded">
          <div className="rack-header">
            <h4>{rackKey}</h4>
          </div>
          <div className="servers">{renderServers(rack)}</div>
        </div>
      );
    });
  };

  return (
    <div className="dc-layout">
      <h1 className="app-header">DC Layout</h1>
      {Object.entries(data).map(([zoneKey, zone]) => {
        const isZoneCollapsed = collapsedZones.includes(zoneKey);
        return (
          <div
            key={zoneKey}
            className={`zone ${!isZoneCollapsed ? "expanded" : ""}`}
          >
            <div className="zone-header" onClick={() => toggleZone(zoneKey)}>
              <h3>{zoneKey}</h3>
            </div>
            {!isZoneCollapsed && (
              <div className="racks">{renderRacks(zone)}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DCLayout;
