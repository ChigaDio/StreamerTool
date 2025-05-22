// /functions/api/create-item.js
export async function onRequestPost(context) {
  try {
    SUPABASE_URL = "https://jjawdtpufzszfdzhesfx.supabase.co"
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYXdkdHB1ZnpzemZkemhlc2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjE4NzEsImV4cCI6MjA2MzMzNzg3MX0.QMFzlwOICX6QHpBP7Iusfn-jWHuvbQoABYGd2iUzfB4"
    SUPABASE_SCHEMA = "clock_items"
    const body = await context.request.json();
    const { title_name } = body;

    if (!title_name) {
      return new Response(JSON.stringify({ error: 'title_name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 既存レコードのtitle_nameを取得
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/clock_items?select=title_name&schema=${SUPABASE_SCHEMA}`, {
      headers: {
        'Apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const existingItems = await checkResponse.json();

    // title_nameが完全一致するかチェック
    if (existingItems.some(item => item.title_name === title_name)) {
      return new Response(JSON.stringify({ error: 'title_name already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 新しいレコードを作成
    const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/clock_items?schema=${SUPABASE_SCHEMA}`, {
      method: 'POST',
      headers: {
        'Apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({ title_name, use_flag: false }),
    });

    const newItem = await createResponse.json();
    return new Response(JSON.stringify(newItem), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}