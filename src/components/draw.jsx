import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

export default function MapAreaMeasure() {
  const mapRef = useRef(null);
  const [area, setArea] = useState(null);
  const [length, setLength] = useState(null);

  useEffect(() => {
    const map = L.map(mapRef.current, {
      maxZoom: 22,
    }).setView([32.7157, -117.1611], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 22,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polyline: true,
        marker: true,
        circle: false,
        rectangle: false,
        circlemarker: true,
        polygon: {
          allowIntersection: false,
          showArea: true,
          drawError: {
            color: "#e1e100",
            message: "Invalid shape!",
          },
          shapeOptions: {
            color: "#2196F3",
          },
        },
      },
      edit: {
        featureGroup: drawnItems,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (event) {
      const type = event.layerType;
      const layer = event.layer;
      drawnItems.addLayer(layer);

      if (type === "polygon") {
        const latlngs = layer.getLatLngs()[0];
        const areaMeters = L.GeometryUtil.geodesicArea(latlngs);
        const areaFeet = areaMeters * 10.7639;
        setArea(areaFeet.toFixed(2));
        setLength(null);
      } else if (type === "polyline") {
        const latlngs = layer.getLatLngs();
        let tempLength = 0;
        if (latlngs.length > 1) {
          for (let i = 0; i < latlngs.length - 1; i++) {
            tempLength += latlngs[i].distanceTo(latlngs[i + 1]);
          }
        }
        const lengthMeters = tempLength;
        const lengthFeet = lengthMeters * 3.28084;
        setLength(lengthFeet.toFixed(2));
        setArea(null);
      } else {
        setArea(null);
        setLength(null);
      }
    });
  }, []);

  return (
    <div className="p-4">
      <div className="text-lg font-semibold mb-2">地图测量工具</div>
      <div
        ref={mapRef}
        style={{ height: "500px", width: "100%" }}
        className="rounded-lg shadow"
      />
      {area && (
        <div className="mt-4 text-green-700 font-medium">
          测量面积: <span className="font-bold">{area} ft²</span>
        </div>
      )}
      {length && (
        <div className="mt-4 text-blue-700 font-medium">
          测量长度: <span className="font-bold">{length} ft</span>
        </div>
      )}
    </div>
  );
}
