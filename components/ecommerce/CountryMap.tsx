import React from "react";
// Temporarily commenting out JVectorMap due to React 19 compatibility issues
// import { worldMill } from "@react-jvectormap/world";
// import dynamic from "next/dynamic";

// const VectorMap = dynamic(
//   () => import("@react-jvectormap/core").then((mod) => mod.VectorMap),
//   { ssr: false }
// );

// Define the component props
interface CountryMapProps {
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg text-center">
      <p>Map visualization temporarily unavailable</p>
      <p className="text-sm text-gray-500">Compatibility issue with React 19</p>
    </div>
  );
};

export default CountryMap;
