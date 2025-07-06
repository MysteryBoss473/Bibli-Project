'use client'

// Livre
export interface Livre {
  isbn: string
  titre: string
  auteur: string
  genre: string
  note: number
  disponible: boolean
}

//Etudiant
export interface Etudiant {
  idUtilisateur: number;
  nom: string;
  prenom: string;
  email: string;
}

//Emprunt
export interface Emprunt {
  idEmprunt: number;
  nom: string;
  prenom: string;
  titre: string;
}

//Livre détails
export interface LivreDetails {
  titre: string;
  auteur: string;
  genre: string;
  note: number;
  isbn: string;
  datePublication: string;
  disponible: boolean;
  image?: string;
}

//Liste livres
export interface ListeLivres {
  data: Livre[];
}

//Liste étudiants
export interface ListeEtudiants {
  data: Etudiant[];
}

//Liste emprunts
export interface ListeEmprunts {
  data: Emprunt[];
}

//Query
export interface Query {
  query: string;
}