'use client'
import { useEffect, useState } from "react"
import axios from "axios"
import EntetePage from "@/Components/EntetePage"
import Recherche from "@/Components/Recherche"
import Listes from "@/Components/Listes"
import { Query, Livre } from "@/types/interfaces"
import Card from "@/Components/Card"

export default function LivresEtudiantPage() {
    const [resultats, setResultats] = useState<Livre[]>([])
    const [selectedDetails, setSelectedDetails] = useState<{ livre: Livre | null, utilisateur: any | null }>({
        livre: null,
        utilisateur: null
    })

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token")
        console.log("Token utilisé pour l'API :", token)
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    }

    useEffect(() => {
        const fetchLivres = async () => {
            try {
                const res = await axios.get("http://localhost:4400/api/livre", {
                    ...getAuthHeaders(),
                    withCredentials: true
                })

                const normalized = res.data.Livres.map((e: any) => ({
                    isbn: e.isbn,
                    titre: e.titre,
                    auteur: e.auteur,
                    genre: e.genre,
                    note: e.note,
                    disponible: e.disponible,
                }))
                setResultats(normalized)
            } catch (error) {
                console.error("Erreur lors du chargement des livres :", error)
                alert("Erreur lors du chargement des livres.")
            }
        }

        fetchLivres()
    }, [])

    const handleRecherche = async ({ query }: Query) => {
        try {
            const res = await axios.get(`http://localhost:4400/api/livre/recherche?q=${encodeURIComponent(query)}`, {
                headers: {
                    ...getAuthHeaders().headers,
                },
                withCredentials: true
            });

            setResultats(res.data)
        } catch (error) {
            console.error("Erreur lors de la recherche :", error)
            alert("Erreur lors de la recherche.")
        }
    }

    // Fonction pour charger les détails du livre et de l'utilisateur
    const handleDetails = async (isbn: string) => {
        try {
            // Requête pour les détails du livre
            const livreRes = await axios.get(`http://localhost:4400/api/livre/${isbn}`, {
                ...getAuthHeaders(),
                withCredentials: true
            });

            // Requête pour l'utilisateur actif
            const userRes = await axios.get("http://localhost:4400/api/oneUser", {
                ...getAuthHeaders(),
                withCredentials: true
            });

            setSelectedDetails({
                livre: livreRes.data,
                utilisateur: userRes.data
            });

        } catch (error) {
            console.error("Erreur lors du chargement des détails :", error)
            alert("Erreur lors du chargement des détails.")
        }
    }

    return (
        <div style={{ marginTop: "75px", marginBottom:"75px" }}>
            <EntetePage 
                Titre="Livres" 
                SousTitle="Notre catalogue de livres est à votre disposition."
            />
            <Recherche onSearch={handleRecherche} />
            <div style={{ marginTop: "75px" }}>
                <Listes 
                    data={resultats}
                    columns={[
                        { label: "titre", key: "titre" },
                        { label: "auteur", key: "auteur" },
                        { label: "genre", key: "genre" },
                        { label: "note", key: "note" },
                        { label: "disponible", key: "disponible" }
                    ]}
                    getRowKey={(livre) => livre.isbn}
                    renderActions={(livre) => (
                        <button 
                            className="btn btn-xs btn-outline btn-info"
                            onClick={() => handleDetails(livre.isbn)} // Passe l'isbn à la fonction
                        >
                            Détails
                        </button>
                    )}
                />
            </div>

            {/* Affichage de la card si un livre et un utilisateur sont sélectionnés */}
            {selectedDetails.livre && selectedDetails.utilisateur && (
                <div style={{ marginTop: "30px" }}>
                    <Card livre={selectedDetails.livre} idUtilisateur={selectedDetails.utilisateur.idUtilisateur} />
                </div>
            )}
        </div>
    )
}
