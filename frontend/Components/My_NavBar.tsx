"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const My_NavBar1 = () => (
  <div className="navbar bg-base-100 shadow-sm">
    <div className="flex-1">
      <Link href="/" className="btn btn-ghost text-xl">Bibli-Project</Link>
    </div>
    <div className="flex-none">
      <ul className="menu menu-horizontal px-1">
        <li><Link href="/etudiant/livres">Livres</Link></li>
        <li><Link href="/etudiant/reservations">Réservations</Link></li>
        <li><Link href="/etudiant/historique">Historique</Link></li>
      </ul>
    </div>
  </div>
);

const My_NavBar2 = () => (
  <div className="navbar bg-base-100 shadow-sm">
    <div className="flex-1">
      <Link href="/" className="btn btn-ghost text-xl">Bibli-Project</Link>
    </div>
    <div className="flex-none">
      <ul className="menu menu-horizontal px-1">
        <li><Link href="/admin/livres">Livres</Link></li>
        <li><Link href="/admin/etudiants">Etudiants</Link></li>
        <li><Link href="/admin/reservations">Réservations</Link></li>
        <li><Link href="/admin/retours">Retours</Link></li>
      </ul>
    </div>
  </div>
);

function My_NavBar() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  if (role === null) {
    // Affichage temporaire ou spinner pendant la récupération du rôle
    return null;
  }

  return role === 'admin' ? <My_NavBar2 /> : <My_NavBar1 />;
}

export default My_NavBar;
