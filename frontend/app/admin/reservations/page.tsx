'use client'
import EntetePage from "@/Components/EntetePage"
import Recherche from "@/Components/Recherche"
import AdminList2 from "@/Components/AdminList1"

export default function ReservationsAdminPage() {
    return (
        <div style={{ marginTop: "75px",  marginBottom:"75px" }}>
            <EntetePage 
                Titre="Etudiants" 
                SousTitle="Cette section concerne la gestion de l'ensemble des réservations des livres de cette bibliothèque."
            />
            <Recherche/>
            <div style={{ marginTop: "75px"}}>
            <AdminList2 data = {[]}/>
            </div>
        </div>
    )
}