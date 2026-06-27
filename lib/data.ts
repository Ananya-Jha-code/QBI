// Data processing and caching for VOC Triage

interface VOC {
  id: string;
  name: string;
  formula: string;
  molecularWeight: number;
  cas: string;
  pubchemId: string;
  timesFound: number;
  class: string;
  superclass: string;
  chebId?: string;
  hmdbId?: string;
}

interface Disease {
  id: string;
  name: string;
  vocBiomarkers: string[];
  receptors: string[];
}

interface Receptor {
  id: string;
  name: string;
  vocLigands: string[];
  diseases: string[];
  tissueExpression?: string[];
}

let cachedData: {
  vocs: VOC[];
  diseases: Disease[];
  receptors: Receptor[];
} | null = null;

export async function loadData() {
  if (cachedData) return cachedData;

  try {
    const response = await fetch('/combined_urinevolatilome_datasets.json');
    const rawData = await response.json();

    // Extract VOCs from Table S1
    const vocs: VOC[] = [];
    const vocMap = new Map<string, VOC>();

    if (rawData.datasets?.[0]?.sheets) {
      const tableS1 = rawData.datasets[0].sheets.find((s: any) => s.name === 'Table S1');
      if (tableS1?.rows) {
        tableS1.rows.forEach((row: any, idx: number) => {
          if (row['Chemical name']) {
            const voc: VOC = {
              id: `voc-${idx}`,
              name: row['Chemical name'],
              formula: row['Chemical Formula'] || '',
              molecularWeight: parseFloat(row['Molecular Weight (g/mol)']) || 0,
              cas: row['CAS'] || '',
              pubchemId: row['PubChem CID']?.toString() || '',
              timesFound: parseInt(row['Times found in analyzed articles']) || 0,
              class: row['Class'] || '',
              superclass: row['Superclass'] || '',
              chebId: row['ChEBI ID']?.toString(),
              hmdbId: row['HMDB ID'],
            };
            vocs.push(voc);
            vocMap.set(voc.name.toLowerCase(), voc);
          }
        });
      }

    }

    // Extract disease associations from Table S5 or use mock data
    let diseases: Disease[] = [];
    const tableS5 = rawData.datasets?.[0]?.sheets?.find((s: any) => s.name === 'Table S5');
    if (tableS5?.rows) {
      const diseaseMap = new Map<string, Set<string>>();
      tableS5.rows.forEach((row: any) => {
        if (row['Application'] && row['Chemical name']) {
          const app = row['Application'].toLowerCase();
          const compound = row['Chemical name'];
          if (!diseaseMap.has(app)) {
            diseaseMap.set(app, new Set());
          }
          diseaseMap.get(app)!.add(compound);
        }
      });

      let diseaseIdx = 0;
      diseaseMap.forEach((compounds, diseaseName) => {
        diseases.push({
          id: `disease-${diseaseIdx}`,
          name: diseaseName
            .split(/[-_\s]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          vocBiomarkers: Array.from(compounds),
          receptors: [], // Will be populated with mock receptor data
        });
        diseaseIdx++;
      });
    } else {
      // Fallback: Create mock diseases if Table S5 is not found
      diseases = [
        {
          id: 'disease-0',
          name: 'Lung Cancer',
          vocBiomarkers: vocs.slice(0, 8).map(v => v.name),
          receptors: [],
        },
        {
          id: 'disease-1',
          name: 'Diabetes',
          vocBiomarkers: vocs.slice(5, 13).map(v => v.name),
          receptors: [],
        },
        {
          id: 'disease-2',
          name: 'Parkinsons Disease',
          vocBiomarkers: vocs.slice(10, 18).map(v => v.name),
          receptors: [],
        },
      ];
    }

    // Create mock receptors based on VOC data
    const receptors: Receptor[] = [
      {
        id: 'or51e1',
        name: 'OR51E1',
        vocLigands: vocs.slice(0, 10).map(v => v.name),
        diseases: ['Lung cancer', 'Diabetes'],
        tissueExpression: ['Olfactory epithelium', 'Respiratory tract'],
      },
      {
        id: 'taar5',
        name: 'TAAR5',
        vocLigands: vocs.slice(5, 15).map(v => v.name),
        diseases: ['Parkinsons', 'Diabetes'],
        tissueExpression: ['Brain', 'Olfactory epithelium'],
      },
      {
        id: 'or1a1',
        name: 'OR1A1',
        vocLigands: vocs.slice(10, 20).map(v => v.name),
        diseases: ['Lung cancer'],
        tissueExpression: ['Olfactory epithelium'],
      },
    ];

    cachedData = { vocs, diseases, receptors };
    return cachedData;
  } catch (error) {
    console.error('Error loading data:', error);
    // Return empty structure if loading fails
    return { vocs: [], diseases: [], receptors: [] };
  }
}

export async function searchVOCs(query: string): Promise<VOC[]> {
  const data = await loadData();
  const lowerQuery = query.toLowerCase();
  return data.vocs.filter(
    voc =>
      voc.name.toLowerCase().includes(lowerQuery) ||
      voc.formula.toLowerCase().includes(lowerQuery) ||
      voc.cas.includes(query)
  );
}

export async function searchDiseases(query: string): Promise<Disease[]> {
  const data = await loadData();
  const lowerQuery = query.toLowerCase();
  return data.diseases.filter(disease => disease.name.toLowerCase().includes(lowerQuery));
}

export async function searchReceptors(query: string): Promise<Receptor[]> {
  const data = await loadData();
  const lowerQuery = query.toLowerCase();
  return data.receptors.filter(
    receptor =>
      receptor.name.toLowerCase().includes(lowerQuery) ||
      receptor.id.includes(lowerQuery)
  );
}

export async function getVOCById(id: string): Promise<VOC | null> {
  const data = await loadData();
  return data.vocs.find(v => v.id === id) || null;
}

export async function getDiseaseById(id: string): Promise<Disease | null> {
  const data = await loadData();
  return data.diseases.find(d => d.id === id) || null;
}

export async function getReceptorById(id: string): Promise<Receptor | null> {
  const data = await loadData();
  return data.receptors.find(r => r.id === id) || null;
}

export type { VOC, Disease, Receptor };
