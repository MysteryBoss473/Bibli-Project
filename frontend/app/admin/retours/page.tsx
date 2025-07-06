'use client'
import EntetePage from "@/Components/EntetePage"
import Recherche from "@/Components/Recherche"
import AdminList2 from "@/Components/AdminList1"

export default function EmpruntsAdminPage() {
    return (
        <div style={{ marginTop: "75px",  marginBottom:"75px" }}>
            <EntetePage 
                Titre="Retours" 
                SousTitle="Cette section concerne la gestion des retours des livres de cette bibliothèque qui sont en cours d'emprunt."
            />
            <Recherche/>
            <div style={{ marginTop: "75px"}}>
            <AdminList2 data = {[]}/>
            </div>
        </div>
    )
}