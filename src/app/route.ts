import { kv } from '@vercel/kv';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const DEFAULT_URL = 'https://view.bbsv5.net/bbext/?p=land&id=7D74F828C53F44259485BC83FF1A777D';

export async function GET() {
  let url: string | null = null;

  try {
    url = await kv.get<string>('current_url');
  } catch (error) {
    // KV not configured yet, use default
    console.log('KV not available, using default URL');
  }

  const targetUrl = url || DEFAULT_URL;
  redirect(targetUrl);
}
