import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.rizky.studentos',
  appName: 'Student OS',
  webDir: 'www',
  bundledWebRuntime: false,
  android: { allowMixedContent: false }
};
export default config;
