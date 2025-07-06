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
    const [livreDetail, setLivreDetail] = useState<Livre | null>(null)
    const [loadingDetail, setLoadingDetail] = useState(false)
    
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
        console.log(query)
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

    // Nouvelle fonction pour récupérer les détails du livre
    const fetchLivreDetail = async (isbn: string) => {
        setLoadingDetail(true)
        try {
            const res = await axios.get(`http://localhost:4400/api/livre/${isbn}`, {
                ...getAuthHeaders(),
                withCredentials: true
            })
            setLivreDetail(res.data)
        } catch (error) {
            console.error("Erreur lors du chargement des détails :", error)
            alert("Erreur lors du chargement des détails.")
            setLivreDetail(null)
        } finally {
            setLoadingDetail(false)
        }
    }

    return (
        <div style={{ marginTop: "75px",  marginBottom:"75px" }}>
            <EntetePage 
                Titre="Livres" 
                SousTitle="Notre catalogue de livres est à votre disposition."
            />
            <Recherche onSearch={handleRecherche}/>
            <div style={{ marginTop: "75px"}}>
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
                            onClick={() => fetchLivreDetail(livre.isbn)}
                        >
                            Détails
                        </button>
                    )}
                />
            </div>

            {/* Affichage conditionnel du composant Card avec les détails */}
            {loadingDetail && <p>Chargement des détails...</p>}
            {livreDetail && !loadingDetail && (
                <Card livre={livreDetail} />
            )}
        </div>
    )
}
