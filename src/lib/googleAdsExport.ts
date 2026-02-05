/**
 * Google Ads Editor CSV Export Utility
 * Generates properly formatted CSV files for bulk import into Google Ads Editor
 * 
 * Column names MUST match Google Ads Editor exactly:
 * - "Campaign" not "Campaign Name"
 * - "Ad group" not "Ad Group" 
 * - "Ad type" is required
 * - "Headline 1", "Headline 2" pattern (with space)
 */

const PUBLISHED_URL = 'https://leadershipbydesign.lovable.app';
const DEFAULT_BUDGET = '150';
const DEFAULT_BUDGET_TYPE = 'Daily';

interface ServiceConfig {
  label: string;
  path: string;
  pathParts: [string, string];
}

const SERVICE_CONFIGS: Record<string, ServiceConfig> = {
  'executive-coaching': {
    label: 'Executive Coaching',
    path: '/executive-coaching',
    pathParts: ['Leadership', 'Coaching'],
  },
  'team-workshops': {
    label: 'Team Workshops',
    path: '/programmes',
    pathParts: ['Team', 'Workshops'],
  },
  'shift-programme': {
    label: 'SHIFT Leadership',
    path: '/shift-leadership-development',
    pathParts: ['SHIFT', 'Leadership'],
  },
};

/**
 * Escapes a value for CSV format (handles quotes and commas)
 */
function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Pads an array to a specific length with empty strings
 */
function padArray(arr: string[], length: number): string[] {
  const result = [...arr];
  while (result.length < length) {
    result.push('');
  }
  return result.slice(0, length);
}

/**
 * Generates CSV for Responsive Search Ads
 * Required columns: Campaign, Campaign type, Budget, Budget type, Ad group, Ad type, Headline 1-15, Description 1-4, Final URL
 */
export function generateSearchAdsCSV(
  headlines: string[],
  descriptions: string[],
  service: string
): string {
  const config = SERVICE_CONFIGS[service] || SERVICE_CONFIGS['executive-coaching'];
  const campaignName = `LBD - ${config.label} - Search`;
  const adGroup = config.label;
  const finalUrl = `${PUBLISHED_URL}${config.path}`;

  // Build header row with exact Google Ads Editor column names
  const headerParts = [
    'Campaign',
    'Campaign type',
    'Budget',
    'Budget type',
    'Ad group',
    'Ad type',
    ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`),
    ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`),
    'Final URL',
    'Path 1',
    'Path 2',
  ];
  const header = headerParts.join(',');

  // Pad headlines (min 3 required) and descriptions (min 2 required)
  const paddedHeadlines = padArray(headlines, 15);
  const paddedDescriptions = padArray(descriptions, 4);

  // Build data row
  const dataParts = [
    escapeCSVValue(campaignName),
    escapeCSVValue('Search'),
    escapeCSVValue(DEFAULT_BUDGET),
    escapeCSVValue(DEFAULT_BUDGET_TYPE),
    escapeCSVValue(adGroup),
    escapeCSVValue('Responsive search ad'),
    ...paddedHeadlines.map(escapeCSVValue),
    ...paddedDescriptions.map(escapeCSVValue),
    escapeCSVValue(finalUrl),
    escapeCSVValue(config.pathParts[0]),
    escapeCSVValue(config.pathParts[1]),
  ];
  const dataRow = dataParts.join(',');

  return `${header}\n${dataRow}`;
}

/**
 * Generates CSV for Responsive Display Ads
 * Required columns: Campaign, Campaign type, Budget, Budget type, Ad group, Ad type, Short headline, Long headline, Description, Final URL, Business name
 */
export function generateDisplayAdsCSV(
  headlines: string[],
  descriptions: string[],
  service: string
): string {
  const config = SERVICE_CONFIGS[service] || SERVICE_CONFIGS['executive-coaching'];
  const campaignName = `LBD - ${config.label} - Display`;
  const adGroup = config.label;
  const finalUrl = `${PUBLISHED_URL}${config.path}`;
  const businessName = 'Leadership by Design';

  // Short headlines ≤25 chars, Long headlines ≤90 chars
  // Use first 5 headlines as short, rest as long
  const shortHeadlines = padArray(headlines.slice(0, 5), 5);
  const longHeadlines = padArray(headlines.slice(5, 10).length > 0 ? headlines.slice(5, 10) : [headlines[0] || ''], 5);
  const paddedDescriptions = padArray(descriptions, 5);

  const headerParts = [
    'Campaign',
    'Campaign type',
    'Budget',
    'Budget type',
    'Ad group',
    'Ad type',
    ...Array.from({ length: 5 }, (_, i) => `Short headline ${i + 1}`),
    ...Array.from({ length: 5 }, (_, i) => `Long headline ${i + 1}`),
    ...Array.from({ length: 5 }, (_, i) => `Description ${i + 1}`),
    'Business name',
    'Final URL',
  ];
  const header = headerParts.join(',');

  const dataParts = [
    escapeCSVValue(campaignName),
    escapeCSVValue('Display'),
    escapeCSVValue(DEFAULT_BUDGET),
    escapeCSVValue(DEFAULT_BUDGET_TYPE),
    escapeCSVValue(adGroup),
    escapeCSVValue('Responsive display ad'),
    ...shortHeadlines.map(escapeCSVValue),
    ...longHeadlines.map(escapeCSVValue),
    ...paddedDescriptions.map(escapeCSVValue),
    escapeCSVValue(businessName),
    escapeCSVValue(finalUrl),
  ];
  const dataRow = dataParts.join(',');

  return `${header}\n${dataRow}`;
}

/**
 * Generates CSV for Performance Max campaigns
 * Required columns: Campaign, Campaign type, Budget, Budget type, Asset group, Headlines, Long headlines, Descriptions, Business name, Final URL
 */
export function generatePMaxCSV(
  headlines: string[],
  descriptions: string[],
  service: string
): string {
  const config = SERVICE_CONFIGS[service] || SERVICE_CONFIGS['executive-coaching'];
  const campaignName = `LBD - ${config.label} - PMax`;
  const assetGroup = config.label;
  const finalUrl = `${PUBLISHED_URL}${config.path}`;
  const businessName = 'Leadership by Design';

  const headerParts = [
    'Campaign',
    'Campaign type',
    'Budget',
    'Budget type',
    'Asset group',
    ...Array.from({ length: 5 }, (_, i) => `Headline ${i + 1}`),
    ...Array.from({ length: 5 }, (_, i) => `Long headline ${i + 1}`),
    ...Array.from({ length: 5 }, (_, i) => `Description ${i + 1}`),
    'Business name',
    'Final URL',
    'Path 1',
    'Path 2',
  ];
  const header = headerParts.join(',');

  // PMax uses 5 short headlines, 5 long headlines, 5 descriptions
  const shortHeadlines = padArray(headlines.slice(0, 5), 5);
  const longHeadlines = padArray(headlines.slice(5, 10), 5);
  const paddedDescriptions = padArray(descriptions, 5);

  const dataParts = [
    escapeCSVValue(campaignName),
    escapeCSVValue('Performance Max'),
    escapeCSVValue(DEFAULT_BUDGET),
    escapeCSVValue(DEFAULT_BUDGET_TYPE),
    escapeCSVValue(assetGroup),
    ...shortHeadlines.map(escapeCSVValue),
    ...longHeadlines.map(escapeCSVValue),
    ...paddedDescriptions.map(escapeCSVValue),
    escapeCSVValue(businessName),
    escapeCSVValue(finalUrl),
    escapeCSVValue(config.pathParts[0]),
    escapeCSVValue(config.pathParts[1]),
  ];
  const dataRow = dataParts.join(',');

  return `${header}\n${dataRow}`;
}

/**
 * Main export function - generates appropriate CSV based on ad type
 */
export function generateGoogleAdsCSV(
  adType: string,
  headlines: string[],
  descriptions: string[],
  service: string
): string {
  switch (adType) {
    case 'search':
      return generateSearchAdsCSV(headlines, descriptions, service);
    case 'display':
      return generateDisplayAdsCSV(headlines, descriptions, service);
    case 'pmax':
      return generatePMaxCSV(headlines, descriptions, service);
    default:
      return generateSearchAdsCSV(headlines, descriptions, service);
  }
}

/**
 * Generates a descriptive filename for the CSV
 */
export function generateCSVFilename(adType: string, service: string): string {
  const date = new Date().toISOString().split('T')[0];
  const adTypeLabel = adType === 'pmax' ? 'pmax' : adType;
  return `google-ads-${adTypeLabel}-${service}-${date}.csv`;
}

/**
 * Triggers a CSV download in the browser
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
