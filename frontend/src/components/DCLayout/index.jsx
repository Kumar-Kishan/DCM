import React, { useState } from 'react';
import './index.css'; // Import the CSS file for styling

function DCLayout({ data }) {
  const [expandedZones, setExpandedZones] = useState([]);
  const [expandedRacks, setExpandedRacks] = useState([]);

  const toggleZone = (zoneKey) => {
    if (expandedZones.includes(zoneKey)) {
      setExpandedZones(expandedZones.filter((key) => key !== zoneKey));
    } else {
      setExpandedZones([...expandedZones, zoneKey]);
    }
  };

  const toggleRack = (rackKey) => {
    if (expandedRacks.includes(rackKey)) {
      setExpandedRacks(expandedRacks.filter((key) => key !== rackKey));
    } else {
      setExpandedRacks([...expandedRacks, rackKey]);
    }
  };

  const renderServers = (rack) => {
    return Object.entries(rack).map(([serverKey, temperature]) => {
      const temperatureClass =
        temperature >= 80
          ? 'high'
          : temperature >= 60
          ? 'medium'
          : 'low';

      return (
        <div key={serverKey} className="server">
          <span className="server-name">{serverKey}</span>
          <span className={`server-temperature ${temperatureClass}`}>{temperature}°C</span>
        </div>
      );
    });
  };

  const renderRacks = (zone, zoneKey) => {
    return Object.entries(zone).map(([rackKey, rack]) => {
      const isRackExpanded = expandedRacks.includes(rackKey);

      return (
        <div key={rackKey} className={`rack ${isRackExpanded ? 'expanded' : ''}`}>
          <div className="rack-header" onClick={() => toggleRack(rackKey)}>
            <h4>{rackKey}</h4>
          </div>
          {isRackExpanded && <div className="servers">{renderServers(rack)}</div>}
        </div>
      );
    });
  };

  return (
    <div className="dc-layout">
      {Object.entries(data).map(([zoneKey, zone]) => {
        const isZoneExpanded = expandedZones.includes(zoneKey);

        return (
          <div key={zoneKey} className={`zone ${isZoneExpanded ? 'expanded' : ''}`}>
            <div className="zone-header" onClick={() => toggleZone(zoneKey)}>
              <h3>{zoneKey}</h3>
            </div>
            {isZoneExpanded && <div className="racks">{renderRacks(zone, zoneKey)}</div>}
          </div>
        );
      })}
    </div>
  );
}

export default DCLayout;
