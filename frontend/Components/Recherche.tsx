'use client'

import { useState } from "react"
import { Query } from "@/types/interfaces";

interface RechercheProps {
  onSearch: (query: Query) => void;
  placeholder?: string;
  buttonLabel?: string;
}

const Recherche = ({
  onSearch,
  placeholder = "Rechercher",
  buttonLabel = "Rechercher"
}: RechercheProps) => {
  const [query, setQuery] = useState("")

  const handleClick = () => {
    if (query.trim()) {
      onSearch({query})
    }
  }

  return (
    <div className="max-w-[550px] w-full bg-white rounded-xl shadow-lg p-8 mx-auto">
      <div className="flex gap-4 items-center">
        <label className="input input-bordered bg-white flex items-center gap-2">
          <input
            type="text"
            className="w-[300px]"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
          />
        </label>
        <button
          className="btn btn-sm md:btn-md btn-outline btn-accent"
          onClick={handleClick}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}

export default Recherche
