import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b72833b54def46e18b84b2073fb5be53',
  appName: 'subcircle-shared-vault',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: "https://b72833b5-4def-46e1-8b84-b2073fb5be53.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      androidScaleType: 'CENTER_CROP',
      splashImmersive: true,
      splashFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF"
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#000000'
    }
  },
};

export default config;