'use client'

import { Etudiant } from "@/types/interfaces"
import { useState } from "react"

type FormulaireProps = {
  etudiant: Etudiant
  onClose: () => void
  onSave: (updated: Etudiant) => void
}

function FormulaireEdition({ etudiant, onClose, onSave }: FormulaireProps) {
  const [formData, setFormData] = useState({
    idUtilisateur: etudiant.idUtilisateur,
    Nom: etudiant.nom,
    Prenoms: etudiant.prenom,
    Email: etudiant.email,
    Role: "etudiant" // Forcé ici, non modifiable
})


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`http://localhost:4400/utilisateur/${formData.idUtilisateur}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      const updatedUser = await res.json()
      onSave(updatedUser)
      onClose()
    } else {
      const msg = await res.text()
      alert(`Erreur lors de la mise à jour : ${msg}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="modal-box space-y-4">
    <h3 className="text-lg font-bold">Modifier Utilisateur</h3>

    <input name="Nom" value={formData.Nom} onChange={handleChange} className="input input-bordered w-full" placeholder="Nom" />
    <input name="Prenoms" value={formData.Prenoms} onChange={handleChange} className="input input-bordered w-full" placeholder="Prénoms" />
    <input name="Email" value={formData.Email} onChange={handleChange} className="input input-bordered w-full" placeholder="Email" />

    <div className="modal-action">
        <button type="submit" className="btn btn-success">Enregistrer</button>
        <button type="button" onClick={onClose} className="btn btn-ghost">Annuler</button>
    </div>
    </form>

  )
}
