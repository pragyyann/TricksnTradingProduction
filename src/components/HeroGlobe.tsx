"use client";

import { useEffect, useRef, useState } from "react";

// Geographic coordinates of key continental clusters to map landmasses
const LAND_CENTERS = [
  // North America
  { lat: 55, lng: -100, r: 25 },
  { lat: 40, lng: -90, r: 18 },
  { lat: 45, lng: -70, r: 12 },
  { lat: 65, lng: -120, r: 15 },
  // Central America
  { lat: 15, lng: -90, r: 8 },
  // South America
  { lat: -5, lng: -60, r: 22 },
  { lat: -25, lng: -60, r: 18 },
  { lat: -45, lng: -70, r: 10 },
  // Europe
  { lat: 50, lng: 15, r: 15 },
  { lat: 60, lng: 30, r: 15 },
  { lat: 45, lng: -5, r: 10 },
  // United Kingdom
  { lat: 54, lng: -2, r: 5 },
  // Scandinavia
  { lat: 62, lng: 15, r: 8 },
  // Greenland
  { lat: 72, lng: -40, r: 12 },
  // Africa
  { lat: 22, lng: 15, r: 22 },
  { lat: 5, lng: 20, r: 15 },
  { lat: -15, lng: 25, r: 18 },
  { lat: -30, lng: 25, r: 10 },
  // Asia
  { lat: 60, lng: 80, r: 28 }, // Siberia/Northern Asia
  { lat: 55, lng: 120, r: 20 },
  { lat: 35, lng: 105, r: 22 }, // East Asia
  { lat: 35, lng: 80, r: 15 },  // Central Asia
  { lat: 22, lng: 78, r: 12 },  // India
  { lat: 25, lng: 45, r: 12 },  // Middle East
  { lat: 10, lng: 105, r: 8 },  // SE Asia
  // Japan
  { lat: 36, lng: 138, r: 6 },
  // Indonesia / Philippines
  { lat: -2, lng: 115, r: 10 },
  { lat: 8, lng: 122, r: 6 },
  // Australia
  { lat: -25, lng: 135, r: 16 },
  { lat: -35, lng: 145, r: 8 },
  { lat: -20, lng: 120, r: 8 },
  // Madagascar
  { lat: -20, lng: 47, r: 5 },
  // Antarctica
  { lat: -80, lng: 0, r: 25 },
  { lat: -82, lng: 90, r: 25 },
  { lat: -82, lng: -90, r: 25 }
];

// Helper to determine if a lat/lng falls within our land coordinate radius list
function isLand(lat: number, lng: number): boolean {
  for (const center of LAND_CENTERS) {
    let dLng = lng - center.lng;
    if (dLng > 180) dLng -= 360;
    if (dLng < -180) dLng += 360;
    
    const cosLat = Math.cos((lat * Math.PI) / 180);
    const dLat = lat - center.lat;
    
    const dist = Math.sqrt(dLat * dLat + (dLng * cosLat) * (dLng * cosLat));
    if (dist < center.r) {
      return true;
    }
  }
  return false;
}

// Global recruitment destination marker coordinates
const MARKERS = [
  { lat: 20.5937, lng: 78.9629, label: "India" },
  { lat: 25.2048, lng: 55.2708, label: "UAE" },
  { lat: 24.7136, lng: 46.6753, label: "Saudi" },
  { lat: 51.5072, lng: -0.1276, label: "UK" },
  { lat: 45.4215, lng: -75.6972, label: "Canada" }
];

export function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState(500);

  // Set explicit responsive dimensions
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setSize(300);
      else if (width < 1024) setSize(380);
      else setSize(500);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 2;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Generate sphere points using a Fibonacci spiral for uniform spacing
    const points: { x: number; y: number; z: number; isLandPoint: boolean }[] = [];
    const numPoints = 1600; 

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = i * Math.PI * (3 - Math.sqrt(5)); // Golden angle

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      const lat = Math.asin(y) * (180 / Math.PI);
      const lng = Math.atan2(z, x) * (180 / Math.PI);

      points.push({
        x,
        y,
        z,
        isLandPoint: isLand(lat, lng)
      });
    }

    // Set up Cartesian markers
    const markerPoints = MARKERS.map(m => {
      const latRad = (m.lat * Math.PI) / 180;
      const lngRad = (m.lng * Math.PI) / 180;
      return {
        x: Math.cos(latRad) * Math.sin(lngRad),
        y: Math.sin(latRad),
        z: Math.cos(latRad) * Math.cos(lngRad),
        label: m.label
      };
    });

    let animationId: number;
    let angle = 0;
    const rotationSpeed = 0.0025; // Rotates slowly

    // Pitch tilt angle constants (tilt northern hemisphere slightly forward)
    const tiltAngle = 0.25; 
    const cosTilt = Math.cos(tiltAngle);
    const sinTilt = Math.sin(tiltAngle);

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = (size / 2) * 0.85; // Fit inside boundary with room for outer glow rings

      // Draw subtle circular boundary
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(216, 204, 184, 0.7)";
      ctx.lineWidth = 1;
      ctx.stroke();

      angle += rotationSpeed;
      const cosRot = Math.cos(angle);
      const sinRot = Math.sin(angle);

      // Render world land/ocean points
      for (const p of points) {
        // Y-axis rotation
        let rx = p.x * cosRot - p.z * sinRot;
        let rz = p.x * sinRot + p.z * cosRot;
        let ry = p.y;

        // Apply pitch tilt
        const ty = ry * cosTilt - rz * sinTilt;
        const tz = ry * sinTilt + rz * cosTilt;

        // Draw only front-facing points (tz > 0)
        if (tz > 0) {
          // Shading: front-most are brightest, edge dots fade away
          const shade = tz; 

          let color: string;
          let dotRadius: number;

          if (p.isLandPoint) {
            color = `rgba(184, 149, 90, ${shade * 0.9})`; // Brand gold land dots
            dotRadius = 1.5 + shade * 0.8;
          } else {
            color = `rgba(73, 106, 130, ${shade * 0.25})`; // Globe blue ocean dots
            dotRadius = 1.0 + shade * 0.4;
          }

          const px = centerX + rx * radius;
          const py = centerY - ty * radius;

          ctx.beginPath();
          ctx.arc(px, py, dotRadius, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }

      // Render golden markers
      const pulseScale = (Date.now() % 1600) / 1600;

      for (const m of markerPoints) {
        let rx = m.x * cosRot - m.z * sinRot;
        let rz = m.x * sinRot + m.z * cosRot;
        let ry = m.y;

        const ty = ry * cosTilt - rz * sinTilt;
        const tz = ry * sinTilt + rz * cosTilt;

        // Draw active markers on the visible face (tz > 0)
        if (tz > 0.05) {
          const px = centerX + rx * radius;
          const py = centerY - ty * radius;
          const shade = tz;

          // Animated pulse ring
          ctx.beginPath();
          ctx.arc(px, py, 4 + pulseScale * 10, 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(184, 149, 90, ${(1 - pulseScale) * shade * 0.8})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Central solid marker dot
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, 2 * Math.PI);
          ctx.fillStyle = `rgba(212, 183, 122, ${shade})`; 
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [size]);

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      {/* Badge above globe */}
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#B8955A] bg-[#EEE7D8] px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8B6F42] z-20">
        <span className="h-1.5 w-1.5 rounded-full bg-[#B8955A] animate-pulse" />
        Verified Global Hiring Network
      </div>

      <div
        className="relative flex items-center justify-center select-none"
        style={{
          width: size,
          height: size,
        }}
      >
        <canvas
          ref={canvasRef}
          className="relative z-10 block pointer-events-none"
          style={{
            width: size,
            height: size,
            maxWidth: "100%",
            aspectRatio: "1 / 1",
          }}
        />
      </div>

      {/* Caption below globe */}
      <p className="mt-4 max-w-sm text-center text-sm text-[#756B5D] font-sans leading-relaxed italic z-20">
        Connecting Indian talent with verified overseas opportunities.
      </p>
    </div>
  );
}
