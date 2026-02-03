/**
 * Google Ads Editor CSV Export Utility
 * Generates properly formatted CSV files for bulk import into Google Ads Editor
 */

const PUBLISHED_URL = 'https://leadershipbydesign.lovable.app';

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
 */
export function generateSearchAdsCSV(
  headlines: string[],
  descriptions: string[],
  service: string
): string {
  const config = SERVICE_CONFIGS[service] || SERVICE_CONFIGS['executive-coaching'];
  const campaignName = `Leadership by Design - ${config.label}`;
  const adGroup = config.label;
  const finalUrl = `${PUBLISHED_URL}${config.path}`;

  // Build header row
  const headerParts = [
    'Campaign',
    'Ad Group',
    ...Array.from({ length: 15 }, (_, i) => `Headline ${i + 1}`),
    ...Array.from({ length: 4 }, (_, i) => `Description ${i + 1}`),
    'Final URL',
    'Path 1',
    'Path 2',
  ];
  const header = headerParts.join(',');

  // Pad headlines and descriptions
  const paddedHeadlines = padArray(headlines, 15);
  const paddedDescriptions = padArray(descriptions, 4);

  // Build data row
  const dataParts = [
    escapeCSVValue(campaignName),
    escapeCSVValue(adGroup),
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
 * Generates CSV for Display Ads
 */
export function generateDisplayAdsCSV(
  headlines: string[],
  descriptions: string[],
  service: string
): string {
  const config = SERVICE_CONFIGS[service] || SERVICE_CONFIGS['executive-coaching'];
  const campaignName = `Leadership by Design - ${config.label}`;
  const adGroup = config.label;
  const finalUrl = `${PUBLISHED_URL}${config.path}`;
  const businessName = 'Leadership by Design';

  const headerParts = [
    'Campaign',
    'Ad Group',
    'Short Headline',
    'Long Headline',
    'Description',
    'Business Name',
    'Final URL',
  ];
  const header = headerParts.join(',');

  // For display ads, use first headline as short, second as long
  const shortHeadline = headlines[0] || '';
  const longHeadline = headlines[1] || headlines[0] || '';
  const description = descriptions[0] || '';

  const dataParts = [
    escapeCSVValue(campaignName),
    escapeCSVValue(adGroup),
    escapeCSVValue(shortHeadline),
    escapeCSVValue(longHeadline),
    escapeCSVValue(description),
    escapeCSVValue(businessName),
    escapeCSVValue(finalUrl),
  ];
  const dataRow = dataParts.join(',');

  return `${header}\n${dataRow}`;
}

/**
 * Generates CSV for Performance Max campaigns
 */
export function generatePMaxCSV(
  headlines: string[],
  descriptions: string[],
  service: string
): string {
  const config = SERVICE_CONFIGS[service] || SERVICE_CONFIGS['executive-coaching'];
  const campaignName = `Leadership by Design - ${config.label}`;
  const assetGroup = config.label;
  const finalUrl = `${PUBLISHED_URL}${config.path}`;
  const businessName = 'Leadership by Design';

  const headerParts = [
    'Campaign',
    'Asset Group',
    ...Array.from({ length: 5 }, (_, i) => `Headline ${i + 1}`),
    ...Array.from({ length: 5 }, (_, i) => `Long Headline ${i + 1}`),
    ...Array.from({ length: 5 }, (_, i) => `Description ${i + 1}`),
    'Business Name',
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
