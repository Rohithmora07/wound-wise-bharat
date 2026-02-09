import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Navigation, Phone, Clock, Star, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface Hospital {
  id: number;
  name: string;
  nameHi: string;
  type: "govt" | "private";
  distance: string;
  eta: string;
  rating: number;
  is24x7: boolean;
  phone: string;
  lat: number;
  lng: number;
}

const mockHospitals: Hospital[] = [
  {
    id: 1, name: "District Government Hospital", nameHi: "जिला सरकारी अस्पताल",
    type: "govt", distance: "2.3 km", eta: "8 min", rating: 4.1, is24x7: true,
    phone: "+911234567890", lat: 28.6139, lng: 77.209,
  },
  {
    id: 2, name: "City Care Private Hospital", nameHi: "सिटी केयर प्राइवेट अस्पताल",
    type: "private", distance: "3.8 km", eta: "14 min", rating: 4.5, is24x7: true,
    phone: "+911234567891", lat: 28.6229, lng: 77.218,
  },
  {
    id: 3, name: "Community Health Centre", nameHi: "सामुदायिक स्वास्थ्य केंद्र",
    type: "govt", distance: "5.1 km", eta: "18 min", rating: 3.8, is24x7: false,
    phone: "+911234567892", lat: 28.6339, lng: 77.225,
  },
];

const HospitalMapPage = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 28.6139, lng: 77.209 }) // Delhi fallback
      );
    } else {
      setUserLocation({ lat: 28.6139, lng: 77.209 });
    }
  }, []);

  const openDirections = (hospital: Hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => navigate(-1)} className="rounded-xl p-2 hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="font-bold text-foreground">{t("hospitalTitle")}</span>
        <div className="flex-1" />
        <button onClick={() => navigate("/")} className="rounded-xl p-2 hover:bg-muted">
          <Home className="h-5 w-5 text-foreground" />
        </button>
      </header>

      {/* Map placeholder */}
      <div className="mx-4 mb-4 overflow-hidden rounded-2xl card-shadow">
        <div className="flex h-48 items-center justify-center bg-accent">
          <div className="text-center">
            <Navigation className="mx-auto mb-2 h-8 w-8 text-primary" />
            <p className="text-sm font-medium text-accent-foreground">
              {userLocation
                ? `📍 ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                : "Detecting location…"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {lang === "hi" ? "गूगल मैप्स में दिशा-निर्देश पाने के लिए नीचे क्लिक करें" : "Click a hospital below for Google Maps directions"}
            </p>
          </div>
        </div>
      </div>

      {/* Hospital list */}
      <div className="flex-1 px-4 pb-8">
        <div className="space-y-3">
          {mockHospitals.map((hospital, i) => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedHospital(hospital)}
              className={`cursor-pointer rounded-2xl bg-card p-4 card-shadow transition-all ${
                selectedHospital?.id === hospital.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-foreground">
                    {lang === "hi" ? hospital.nameHi : hospital.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      hospital.type === "govt"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {hospital.type === "govt" ? t("govtHospital") : t("privateHospital")}
                    </span>
                    {hospital.is24x7 && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-severity-minor">
                        <Clock className="h-3 w-3" /> {t("available24x7")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-bold text-foreground">
                    <Star className="h-3.5 w-3.5 text-severity-moderate" fill="currentColor" />
                    {hospital.rating}
                  </div>
                  <p className="text-xs text-muted-foreground">{hospital.distance}</p>
                  <p className="text-xs font-semibold text-primary">{hospital.eta}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); openDirections(hospital); }}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  <Navigation className="h-4 w-4" />
                  {t("directions")}
                </button>
                <a
                  href={`tel:${hospital.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  {t("callNow")}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalMapPage;
