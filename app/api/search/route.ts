import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://blot-backend.onrender.com/search';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.trim() === '') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Call the backend API
    const backendResponse = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!backendResponse.ok) {
      console.error('Backend error:', backendResponse.status, backendResponse.statusText);
      return NextResponse.json(
        { error: 'Backend search failed' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search' },
      { status: 500 }
    );
  }
}
