import { useState } from "react";
import { PreferencesContext } from "@/context/preferences-context";

export function PreferencesProvider({ children }) {

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    nationality: "",
    position: "",
    ageMin: "",
    ageMax: "",
    sport: "",
   
  });

  return (
    <PreferencesContext.Provider
      value={{
        query,
        setQuery,
        filters,
        setFilters,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}