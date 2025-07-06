'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import EntetePage from "@/Components/EntetePage"
import Recherche from "@/Components/Recherche"
import Listes from "@/Components/Listes"
import { Query, Etudiant } from "@/types/interfaces"

export default function EtudiantsAdminPage() {
    const [resultats, setResultats] = useState<Etudiant[]>([])
    const [etudiantEnEdition, setEtudiantEnEdition] = useState<Etudiant | null>(null)

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token")
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        }
    }

    const handleModifier = (etudiant: Etudiant) => {
        setEtudiantEnEdition(etudiant)
    }

    const handleSave = (updated: Etudiant) => {
        setResultats(prev =>
            prev.map(e => e.idUtilisateur === updated.idUtilisateur ? updated : e)
        )
    }

    useEffect(() => {
        const fetchEtudiants = async () => {
            try {
                const res = await axios.get("http://localhost:4400/api/utilisateur", getAuthHeaders())
                if (res.data.Error === true) {
        alert(res.data.Message);
        return;
      }
                const normalized = res.data.Utilisateurs.map((e: any) => ({
                    idUtilisateur: e.idUtilisateur,
                    nom: e.Nom,
                    prenom: e.Prenoms,
                    email: e.Email,
                }))
                setResultats(normalized)
            } catch (error) {
                console.error("Erreur lors du chargement des étudiants :", error)
                alert("Erreur lors du chargement des étudiants.")
            }
        }

        fetchEtudiants()
    }, [])

    const handleRecherche = async ({ query }: Query) => {
        try {
            const res = await axios.get(
                `http://localhost:4400/api/utilisateur/recherche?search=${query}`,
                getAuthHeaders()
            )
            setResultats(res.data)
        } catch (error) {
            console.error("Erreur lors de la recherche :", error)
            alert("Erreur lors de la recherche.")
        }
    }

    const handleSupprimer = async (id: number) => {
        const confirmation = confirm("Voulez-vous vraiment supprimer cet utilisateur ?")
        if (!confirmation) return

        try {
            await axios.delete(
                `http://localhost:4400/api/utilisateur/${id}`,
                getAuthHeaders()
            )
            setResultats(prev => prev.filter(user => user.idUtilisateur !== id))
        } catch (error: any) {
            const message = error?.response?.data?.message || "Erreur inconnue"
            console.error("Erreur lors de la suppression :", error)
            alert(`Erreur lors de la suppression : ${message}`)
        }
    }

    return (
        <div style={{ marginTop: "75px", marginBottom: "75px" }}>
            <EntetePage
                Titre="Etudiants"
                SousTitle="Cette section concerne la gestion de l'ensemble des étudiants ayant accès aux livres de cette bibliothèque."
            />
            <Recherche onSearch={handleRecherche} />
            <div style={{ marginTop: "75px" }}>
                <Listes
                    data={resultats}
                    columns={[
                        { label: "idUtilisateur", key: "idUtilisateur" },
                        { label: "Nom", key: "nom" },
                        { label: "Prénoms", key: "prenom" },
                        { label: "Email", key: "email" }
                    ]}
                    getRowKey={(etudiant) => etudiant.idUtilisateur}
                    renderActions={(etudiant) => (
                        <div className="flex gap-2">
                            <button onClick={() => handleModifier(etudiant)} className="btn btn-xs btn-outline btn-info">
                                Modifier
                            </button>
                            <button
                                onClick={() => handleSupprimer(etudiant.idUtilisateur)}
                                className="btn btn-xs btn-outline btn-error"
                            >
                                Supprimer
                            </button>
                        </div>
                    )}
                />
            </div>
        </div>
    )
}
