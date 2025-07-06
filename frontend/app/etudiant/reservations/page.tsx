'use client'
import EntetePage from "@/Components/EntetePage"
import Recherche from "@/Components/Recherche"
import Listes from "@/Components/Listes"

export default function ReservationsEtudiantPage() {
    return (
        <div style={{ marginTop: "75px",  marginBottom:"75px" }}>
            <EntetePage 
                Titre="Réservations" 
                SousTitle="Ici, vous trouverez les livres que vous avez réservés et que vous n'avez pas encore récupérés."
            />
            <Recherche/>
            <div style={{ marginTop: "75px"}}>
            <Listes data = {[]}/>
            </div>
        </div>
    )
}
