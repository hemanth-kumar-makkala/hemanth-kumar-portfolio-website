export const config = {
  runtime: 'edge',
};

const getISOWeek = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

export default async function handler(request) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return new Response('Server configuration error', { status: 500 });
  }

  const now = new Date();
  
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  
  const dayKey = `visits:day:${yyyy}-${mm}-${dd}`;
  const weekKey = `visits:week:${yyyy}-W${String(getISOWeek(now)).padStart(2, '0')}`;
  const monthKey = `visits:month:${yyyy}-${mm}`;
  const totalKey = `visits:total`;

  // Use Upstash REST Pipeline to run all commands in one HTTP request
  const pipelinePayload = [
    ["INCR", totalKey],
    ["INCR", dayKey],
    ["INCR", weekKey],
    ["INCR", monthKey],
    ["EXPIRE", dayKey, 90 * 24 * 60 * 60], // 90 days
    ["EXPIRE", weekKey, 180 * 24 * 60 * 60], // 180 days
    ["EXPIRE", monthKey, 365 * 24 * 60 * 60] // 365 days
  ];

  try {
    const response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pipelinePayload),
    });

    if (!response.ok) {
      throw new Error(`Upstash error: ${response.status}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
