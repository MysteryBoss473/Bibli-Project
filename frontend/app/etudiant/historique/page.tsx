'use client'
import EntetePage from "@/Components/EntetePage"
import Recherche from "@/Components/Recherche"
import Listes from "@/Components/Listes"

export default function HistoriqueEtudiantPage() {
    return (
        <div style={{ marginTop: "75px",  marginBottom:"75px" }}>
            <EntetePage 
                Titre="Historique" 
                SousTitle="Cette section vous permet de garder une trace de vos anciennes lectures."
            />
            <Recherche/>
            <div style={{ marginTop: "75px"}}>
            <Listes data = {[]}/>
            </div>
        </div>
    )
}
