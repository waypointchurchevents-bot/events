import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Check for API secret
  const authHeader = request.headers.get('authorization');
  const apiSecret = process.env.API_SECRET;

  if (!apiSecret) {
    return NextResponse.json(
      { error: 'Server not configured' },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${apiSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Get the URL from query params or body
  const { searchParams } = new URL(request.url);
  let url = searchParams.get('url');

  // Also check body if not in query params
  if (!url) {
    try {
      const body = await request.json();
      url = body.url;
    } catch {
      // No JSON body
    }
  }

  if (!url) {
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 }
    );
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch {
    return NextResponse.json(
      { error: 'Invalid URL' },
      { status: 400 }
    );
  }

  // Store the URL
  try {
    await kv.set('current_url', url);
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Failed to store URL:', error);
    return NextResponse.json(
      { error: 'Failed to store URL' },
      { status: 500 }
    );
  }
}

// Also support GET for easier testing
export async function GET(request: NextRequest) {
  const apiSecret = process.env.API_SECRET;

  if (!apiSecret) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  try {
    const currentUrl = await kv.get<string>('current_url');
    return NextResponse.json({ current_url: currentUrl || 'not set' });
  } catch {
    return NextResponse.json({ current_url: 'KV not configured' });
  }
}
