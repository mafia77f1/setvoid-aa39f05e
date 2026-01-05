import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.highest.setvoid',
  appName: 'setvoid',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#2d8a6e',
      sound: 'beep.wav'
    }
  }
};

export default config;
