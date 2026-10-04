const customUrl = import.meta.env.VITE_API_URL;

async function apiFetch(endpoint, options = {}) {
  // If custom URL is explicitly set, use it
  if (customUrl) {
    const res = await fetch(`${customUrl}${endpoint}`, options);
    return res;
  }

  // Try Vite proxy /api first (same-origin, avoids any CORS/firewall quirks)
  try {
    const res = await fetch(`/api${endpoint}`, options);
    if (res.ok || res.status === 400 || res.status === 500) {
      return res;
    }
  } catch (err) {
    console.warn('Proxy /api falhou, tentando direto na porta 3001...', err);
  }

  // Fallback to direct backend URL http://localhost:3001
  return fetch(`http://localhost:3001${endpoint}`, options);
}

export async function fetchTiposLimpeza() {
  const response = await apiFetch('/tipos');
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao carregar tipos de limpeza');
  }
  return response.json();
}

export async function submitOrcamento(dados) {
  const response = await apiFetch('/orcamento', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome_cliente: dados.nome_cliente,
      telefone: dados.telefone,
      email: dados.email,
      metragem: Number(dados.metragem),
      tipo_limpeza_id: Number(dados.tipo_limpeza_id),
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao solicitar orçamento');
  }
  return data;
}

export async function fetchOrcamentos() {
  const response = await apiFetch('/orcamento');
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao carregar orçamentos');
  }
  return response.json();
}

export async function checkApiHealth() {
  try {
    const response = await apiFetch('/');
    if (!response.ok) return false;
    const data = await response.json();
    return !!data;
  } catch {
    return false;
  }
}
