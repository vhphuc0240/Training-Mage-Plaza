export const CRM_ENV_KEY = 'avada-crm-environment';
export const CRM_APP_KEY = 'avada-crm-app';
export const REPORT_KEY = 'avada-report';

export const CRM_WORKSPACE = 'avada-crm-workspace';

export function getStorageData(key, blank = {}) {
  return JSON.parse(localStorage.getItem(key)) || blank;
}

export function setStorageData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
