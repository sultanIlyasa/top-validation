"use client";
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

interface LocationData {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

interface GeocodeResult {
  display_name?: string;
  error?: string;
}

const CompanyLocationDashboard: React.FC = () => {
  // State management for location and geocoding
  const [currentPosition, setCurrentPosition] = useState<LocationData | null>(
    null
  );
  const [geocodeResult, setGeocodeResult] = useState<GeocodeResult>({});
  const [isGeolocationEnabled, setIsGeolocationEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Map reference for programmatic control
  const mapRef = useRef(null);

  // Custom hook to handle map view updates
  function MapController() {
    const map = useMap();

    useEffect(() => {
      if (currentPosition) {
        const { latitude, longitude } = currentPosition.coords;
        map.setView([latitude, longitude], 13);
      }
    }, [currentPosition, map]);

    return null;
  }

  // Reverse geocoding function
  async function reverseGeocode(
    lat: number,
    lon: number
  ): Promise<GeocodeResult> {
    const baseUrl = "https://nominatim.openstreetmap.org/reverse";
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      format: "json",
    });

    try {
      const response = await fetch(`${baseUrl}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Geocoding error:", error);
      return { error: "Failed to retrieve address" };
    }
  }

  // Handle switch toggle to check geolocation permissions
  const handleGeolocationToggle = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    // If enabling, prompt for permission
    if (!isGeolocationEnabled) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Permission granted
          setIsGeolocationEnabled(true);
        },
        (error) => {
          if (error.code === 1) {
            alert(
              "Geolocation permission denied. Please allow access in your browser settings."
            );
          } else {
            alert("Cannot access geolocation.");
          }
        }
      );
    } else {
      // If disabling, reset location
      setIsGeolocationEnabled(false);
      setCurrentPosition(null);
      setGeocodeResult({});
    }
  };

  // Initial location retrieval
  const initializeLocation = () => {
    // Ensure geolocation is enabled and not already loading
    if (!isGeolocationEnabled || isLoading) return;

    // Set loading state
    setIsLoading(true);

    // Get current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Update current position
          setCurrentPosition(position);

          // Perform reverse geocoding
          const { latitude, longitude } = position.coords;
          const result = await reverseGeocode(latitude, longitude);

          // Update geocode result
          setGeocodeResult(result);
          console.log(result);

          // Reset loading state
          setIsLoading(false);
        } catch (error) {
          // Handle any errors during geocoding
          console.error("Location initialization error:", error);
          alert("Failed to initialize location");
          setIsLoading(false);
        }
      },
      (error) => {
        // Handle geolocation errors
        if (error.code === 1) {
          alert("Please allow geolocation access");
        } else {
          alert("Cannot get current location");
        }

        // Always reset loading state
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen">
      <h1 className="mx-3 sm:mx-8 lg border-b-2 pb-3">Check your location</h1>

      <div className="flex flex-col sm:items-center sm:justify-center mx-auto sm:flex-row w-full sm:w-[95%]">
        {/* Geolocation Permission Switch */}
        <div className="flex mx-auto w-[95%] h-full border border-green-700 my-4 rounded-xl px-1 py-2">
          <div className="flex flex-row w-full ">
            <div className="flex flex-col border-r p-2 w-full">
              <p className="text-xs font-bold sm:text-base ">Allow my GPS</p>
              <p className="text-[8px] sm:text-sm text-[#8A8A8A]">
                Enable GPS to check your current location and verify your
                position.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center p-3">
              <Switch
                checked={isGeolocationEnabled}
                onCheckedChange={handleGeolocationToggle}
              />
            </div>
          </div>
        </div>
        {/* Location Check Button */}
        <div className="my-4">
          <button
            onClick={initializeLocation}
            className={`flex flex-row items-center justify-center mx-auto w-[95%] px-2 py-4  rounded-lg text-xs sm:text-sm ${
              !isGeolocationEnabled || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 text-white"
            }`}
            disabled={!isGeolocationEnabled || isLoading}
          >
            {isLoading ? "Locating..." : "Check My Location"}
          </button>
        </div>
      </div>

      {/* Map and Location details  */}
      <div className="flex flex-col gap-3 sm:justify-center mx-auto sm:flex-row-reverse w-[95%]">
        {/* Map Container */}
        {currentPosition && (
          <MapContainer
            center={[
              currentPosition.coords.latitude,
              currentPosition.coords.longitude,
            ]}
            zoom={13}
            scrollWheelZoom={true}
            ref={mapRef}
            className="flex flex-row items-center justify-center h-96 w-[95%] border border-green-700 z-0 rounded-xl mx-auto"
          >
            <MapController />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
              className="h-full z-0"
            />
            <Marker
              position={[
                currentPosition.coords.latitude,
                currentPosition.coords.longitude,
              ]}
            />
            <Circle
              center={[
                currentPosition.coords.latitude,
                currentPosition.coords.longitude,
              ]}
              radius={currentPosition.coords.accuracy}
              pathOptions={{ color: "blue", fillColor: "blue" }}
            />
          </MapContainer>
        )}
        {!currentPosition && (
          <div className="flex flex-row items-center justify-center h-60 w-[95%] border border-green-700 z-0 rounded-xl mx-auto bg-[#464748]">
            <div className="flex flex-row gap-1 items-center justify-center bg-[#FFF7E5] px-3 py-3 w-[90%] sm:w-[40%] text-[8px] rounded-xl">
              <Image
                alt="test"
                src={"/dashboard/checklist.png"}
                width={10}
                height={10}
              ></Image>
              <p>
                Please initiate your live location on the map.{" "}
                <span className="font-bold">Check My Location</span>
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col mx-auto w-[95%] sm:w-[50%] sm:my-0 h-60 border border-green-700 my-4 rounded-xl px-3 py-3">
          <p className="font-bold text-sm sm:text-base">Current Location</p>
          {/* Location Details */}
          {geocodeResult.display_name && (
            <div>
              <p className="text-xs sm:text-sm text-[#8A8A8A]">
                {geocodeResult.display_name}
              </p>
            </div>
          )}
          {!geocodeResult.display_name && <p className="text-xs">-</p>}
        </div>
      </div>
    </div>
  );
};

export default CompanyLocationDashboard;
