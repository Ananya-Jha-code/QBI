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

    console.log('Calling backend at:', BACKEND_URL);
    console.log('Query:', query);

    // Call the backend API directly
    const backendResponse = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      timeout: 30000,
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend error:', backendResponse.status, errorText);
      return NextResponse.json(
        { error: `Backend returned ${backendResponse.status}: ${errorText}` },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log('Backend response:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search' },
      { status: 500 }
    );
  }
}
