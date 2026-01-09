// Configuração centralizada da API
// Em produção (PROD), usa URL relativa (o Nginx cuida do proxy)
// Em desenvolvimento, usa localhost:3000
export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');
