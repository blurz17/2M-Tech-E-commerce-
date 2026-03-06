/**
 * Ensures the VITE_SERVER_URL has a protocol (https:// or http://).
 * If missing and not localhost, prepends https://.
 */
export const getViteServerUrl = (url: string | undefined): string => {
    if (!url) {
        console.warn('VITE_SERVER_URL is undefined');
        return '';
    }

    const trimmedUrl = url.trim();
    let result = '';

    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
        result = trimmedUrl;
    } else if (trimmedUrl.includes('localhost') || trimmedUrl.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
        result = `http://${trimmedUrl}`;
    } else {
        result = `https://${trimmedUrl}`;
    }

    // Ensure it doesn't end with a slash to avoid double slashes when joining paths
    return result.endsWith('/') ? result.slice(0, -1) : result;
};
