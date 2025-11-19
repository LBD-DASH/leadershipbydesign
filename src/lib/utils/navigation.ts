// Navigation utility function
export const createPageUrl = (pageName: string): string => {
  return `/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
};
