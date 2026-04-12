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
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  }

  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { searchParams } = new URL(request.url);
  const pwd = searchParams.get('pwd');

  if (pwd !== process.env.STATS_PASSWORD) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
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

  // Calculate past 7 days for the chart
  const past7Days = [];
  const past7DayKeys = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const d_yyyy = d.getFullYear();
    const d_mm = String(d.getMonth() + 1).padStart(2, '0');
    const d_dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${d_yyyy}-${d_mm}-${d_dd}`;
    const key = `visits:day:${dateStr}`;
    
    const shortDate = `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
    past7Days.push({ date: dateStr, shortDate });
    past7DayKeys.push(["GET", key]);
  }

  const pipelinePayload = [
    ["GET", dayKey],
    ["GET", weekKey],
    ["GET", monthKey],
    ["GET", totalKey],
    ...past7DayKeys
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

    const results = await response.json();
    
    const today = parseInt(results[0]?.result || 0, 10);
    const week = parseInt(results[1]?.result || 0, 10);
    const month = parseInt(results[2]?.result || 0, 10);
    const total = parseInt(results[3]?.result || 0, 10);
    
    const dailyChart = [];
    for (let i = 0; i < 7; i++) {
        dailyChart.push({
            date: past7Days[i].shortDate, 
            fullDate: past7Days[i].date,
            visits: parseInt(results[4 + i]?.result || 0, 10)
        });
    }

    return new Response(JSON.stringify({ 
      today, 
      week, 
      month, 
      total, 
      dailyChart 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
