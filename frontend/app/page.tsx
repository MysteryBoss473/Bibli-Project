'use client'

import EntetePage from "@/Components/EntetePage"
import Access from "@/Components/Access"

export default function Texte() {
    return (
        <div className="hero min-h-screen">
  <div className="hero-content text-center">
    <div className="max-w-md">
            <EntetePage 
                Titre="Bibli-Project" 
                SousTitle="Grâce à ce système de gestion de dernière génération, vous pourrez rechercher et réserver des livres à tout moment"
            />
            <Access />
        </div>
  </div>
</div>
    )
}
