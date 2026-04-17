import { useState, useEffect } from "react";

export function useProfile(profilePath) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profilePath) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    fetch(profilePath)
      .then(res => {
        if (!res.ok) throw new Error(`Perfil no encontrado: ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (cancelled) return;
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [profilePath]);

  return { data, loading, error };
}
