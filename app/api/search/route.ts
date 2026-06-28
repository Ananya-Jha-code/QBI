import { NextRequest, NextResponse } from 'next/server';

// Mock database results - replace with actual DB query later
const MOCK_RESULTS = {
  "question": "Show me all p53 western blots in A549 cells treated with Nutlin",
  "generated_sql": "SELECT * FROM western_blot_records WHERE target ILIKE '%p53%' AND (sample ILIKE '%a549%' OR organism ILIKE '%a549%') AND (treatment_context ILIKE '%nutlin%' OR condition ILIKE '%nutlin%');",
  "count": 3,
  "results": [
    {
      "id": 10,
      "paper_id": "mmc2",
      "page": null,
      "western_blot_type": "phospho_signaling",
      "sample": "A549 cells",
      "organism": null,
      "treatment_context": null,
      "figure_label": null,
      "target": "p53",
      "condition": "Nutlin (µM) -",
      "band_detected": true,
      "confidence": null,
    },
    {
      "id": 11,
      "paper_id": "mmc2",
      "page": null,
      "western_blot_type": "phospho_signaling",
      "sample": "A549 cells",
      "organism": null,
      "treatment_context": null,
      "figure_label": null,
      "target": "p53",
      "condition": "Nutlin (µM) 10 +",
      "band_detected": true,
      "confidence": null,
    },
    {
      "id": 12,
      "paper_id": "mmc2",
      "page": null,
      "western_blot_type": "phospho_signaling",
      "sample": "A549 cells",
      "organism": null,
      "treatment_context": null,
      "figure_label": null,
      "target": "p53",
      "condition": "Nutlin (µM) 20 +",
      "band_detected": true,
      "confidence": null,
    },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || query.trim() === '') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database query
    // For now, return mock data
    // Later: call your SQL generation service and execute against actual DB

    return NextResponse.json(MOCK_RESULTS);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}
