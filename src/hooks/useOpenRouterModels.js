import { useState, useEffect } from "react";

export function useOpenRouterModels() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch("https://openrouter.ai/api/v1/models")
      .then(res => {
        if (!res.ok) throw new Error(`OpenRouter API ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (cancelled) return;
        const parsed = (json.data || [])
          .filter(m => m.pricing && m.pricing.prompt != null && m.pricing.completion != null)
          .map(m => {
            const inputPer1M = parseFloat(m.pricing.prompt) * 1_000_000;
            const outputPer1M = parseFloat(m.pricing.completion) * 1_000_000;
            return {
              id: m.id,
              name: m.name || m.id,
              inputPer1M,
              outputPer1M,
              context: m.context_length || 0,
              isFree: inputPer1M === 0 && outputPer1M === 0,
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));
        setModels(parsed);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { models, loading, error };
}
