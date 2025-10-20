// Centralized logo handling for all streaming services
// This ensures consistent logo display across all components

interface StreamingService {
  name?: string;
  logo_url?: string | null;
  website_url?: string | null;
}

// High-quality logo overrides for services with problematic database URLs
const LOGO_OVERRIDES: Record<string, string> = {
  'Disney+': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Disney%2B_logo.svg/512px-Disney%2B_logo.svg.png',
  'Netflix': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/512px-Netflix_2015_logo.svg.png',
  'Hulu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Hulu_Logo.svg/512px-Hulu_Logo.svg.png',
  'HBO Max': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/512px-HBO_Max_Logo.svg.png',
  'Amazon Prime Video': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Prime_Video.png/512px-Prime_Video.png',
  'Prime Video': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Prime_Video.png/512px-Prime_Video.png',
  'Spotify': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/512px-Spotify_logo_without_text.svg.png',
  'Apple Music': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Apple_Music_icon.svg/512px-Apple_Music_icon.svg.png',
  'Apple TV+': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Apple_TV_Plus_Logo.svg/512px-Apple_TV_Plus_Logo.svg.png',
  'YouTube Premium': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
  'YouTube': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png',
  'Crunchyroll': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Crunchyroll_Logo.svg/512px-Crunchyroll_Logo.svg.png',
  'Shudder': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Shudder_2017.svg/512px-Shudder_2017.svg.png',
  'Kayo': 'https://icon.horse/icon/kayosports.com.au',
  'Kayo Sports': 'https://icon.horse/icon/kayosports.com.au'
};

// Generate fallback logo from website domain using icon.horse
const getIconHorseLogo = (website_url?: string | null): string | undefined => {
  try {
    if (website_url) {
      const hostname = new URL(website_url).hostname;
      return `https://icon.horse/icon/${hostname}`;
    }
  } catch {}
  return undefined;
};

// Main logo resolution function with fallback chain
export const getServiceLogo = (service: StreamingService): string => {
  const serviceName = service.name || '';
  
  // Priority order:
  // 1. High-quality override (for known problematic services)
  // 2. Icon.horse from website_url
  // 3. Database logo_url
  // 4. Placeholder
  
  const override = LOGO_OVERRIDES[serviceName];
  if (override) return override;
  
  const iconHorse = getIconHorseLogo(service.website_url);
  if (iconHorse) return iconHorse;
  
  if (service.logo_url) return service.logo_url;
  
  return '/placeholder.svg';
};

// Error handling for img onError events
export const handleLogoError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  service: StreamingService
) => {
  const img = event.currentTarget;
  const currentSrc = img.src;
  
  // Prevent infinite loops
  if (img.dataset.errorHandled === 'true') {
    img.src = '/placeholder.svg';
    return;
  }
  
  const serviceName = service.name || '';
  const override = LOGO_OVERRIDES[serviceName];
  const iconHorse = getIconHorseLogo(service.website_url);
  const dbLogo = service.logo_url;
  
  // Try next fallback in order
  if (currentSrc === override && iconHorse && iconHorse !== currentSrc) {
    img.src = iconHorse;
    return;
  }
  
  if ((currentSrc === override || currentSrc === iconHorse) && dbLogo && dbLogo !== currentSrc) {
    img.src = dbLogo;
    return;
  }
  
  // Final fallback - create a colored initial instead of placeholder.svg
  img.dataset.errorHandled = 'true';
  const fallbackName = service.name || 'S';
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#1d4ed8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    // Add the initial
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fallbackName.charAt(0).toUpperCase(), 32, 32);
    
    img.src = canvas.toDataURL();
  } else {
    img.src = '/placeholder.svg';
  }
};

// Check if a service has a logo available
export const hasServiceLogo = (service: StreamingService): boolean => {
  const serviceName = service.name || '';
  // Always return true since we have fallback logic in getServiceLogo
  return true;
};