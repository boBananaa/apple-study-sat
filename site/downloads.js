/* The page always has usable release-page links, including without JavaScript. */
const APPLESAT_RELEASES = 'https://github.com/boBananaa/apple-study-sat/releases/latest';
const APPLESAT_RELEASE_API = 'https://api.github.com/repos/boBananaa/apple-study-sat/releases/latest';

function safeInstaller(asset) {
  if (!asset || typeof asset.name !== 'string' || typeof asset.browser_download_url !== 'string' || asset.state !== 'uploaded' || !(asset.size > 0)) return null;
  try {
    const url = new URL(asset.browser_download_url);
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.port || url.username || url.password || url.search || url.hash) return null;
    const parts = url.pathname.split('/');
    if (parts.length !== 7 || parts[1].toLowerCase() !== 'bobananaa' || parts[2] !== 'apple-study-sat' || parts[3] !== 'releases' || parts[4] !== 'download' || !parts[5] || decodeURIComponent(parts[6]) !== asset.name) return null;
    return url.href;
  } catch { return null; }
}

function selectInstallers(release) {
  if (!release || release.draft || release.prerelease || !Array.isArray(release.assets)) return {mac: null, windows: null};
  const assets = release.assets.map(asset => ({asset, url: safeInstaller(asset)})).filter(item => item.url);
  // A universal Mac label must never point to an architecture-specific installer.
  const mac = assets.find(({asset}) => /universal.*\.dmg$/i.test(asset.name));
  const windows = assets.find(({asset}) => /(?:^|[-_])setup\.exe$/i.test(asset.name));
  return {mac: mac?.url || null, windows: windows?.url || null};
}

async function refreshDownloads() {
  const status = document.getElementById('release-status');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(APPLESAT_RELEASE_API, {headers: {Accept: 'application/vnd.github+json'}, signal: controller.signal, credentials: 'omit'});
    if (!response.ok) throw new Error('No published release available.');
    const release = await response.json();
    const installers = selectInstallers(release);
    for (const [platform, url] of Object.entries(installers)) {
      for (const button of document.querySelectorAll(`[data-download="${platform}"]`)) {
        button.href = url || APPLESAT_RELEASES;
        button.textContent = url ? `Download for ${platform === 'mac' ? 'Mac' : 'Windows'}` : `${platform === 'mac' ? 'Mac' : 'Windows'} releases`;
      }
    }
    const tag = typeof release.tag_name === 'string' ? release.tag_name.slice(0, 60) : '';
    if (status) status.textContent = installers.mac && installers.windows
      ? `Latest release${tag ? ': ' + tag : ''}. Downloads come directly from this project’s GitHub release.`
      : 'Some installers are not published yet. The release page lists the downloads currently available.';
  } catch {
    if (status) status.textContent = 'Open the releases page to see available installers. Direct downloads appear here when a published release can be checked.';
  } finally { clearTimeout(timeout); }
}

if (typeof document !== 'undefined') refreshDownloads();
