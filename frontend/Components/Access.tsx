"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const Access = () => {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp < now) {
                // Token expiré
                localStorage.removeItem('token');
                localStorage.removeItem('role')
            }
            }
    setHasToken(!!token);
  }, []);

  // Ne rien afficher tant que le token n'est pas encore vérifié
  if (hasToken === null || hasToken === true) return null;

  return (
    <div className="link-container">
      <Link
        href={"/connexion"}
        className="btn btn-sm md:btn-md btn-outline btn-accent "
      >
        Connexion
      </Link>
      <Link
        href={"/inscription"}
        className="btn btn-sm md:btn-md ml-2 btn-accent"
      >
        Inscription
      </Link>
    </div>
  );
};

export default Access;
