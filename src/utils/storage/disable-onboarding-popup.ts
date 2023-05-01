const isLocalStorageSupported = (): boolean => {
  try {
    const testKey = '__testLocalStorageSupport__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn('Getting localStorage is not supported (probably during SSR.');
    return false;
  }
};

const getStorage = (): Storage | undefined => {
  if (isLocalStorageSupported()) {
    return localStorage;
  }
};

const localStorageKey = 'disableOnboardingPopup';

export function saveDisableOnboardingPopup(disable: boolean | undefined): void {
  getStorage()?.setItem(localStorageKey, JSON.stringify(disable));
}

export function getDisableOnboardingPopup(): boolean | undefined {
  const value = getStorage()?.getItem(localStorageKey);
  return value ? JSON.parse(value) : undefined;
}

export function removeDisableOnboardingPopup(): void {
  getStorage()?.removeItem(localStorageKey);
}
