import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export interface CapacitorInfo {
  isNative: boolean;
  platform: string;
  isAndroid: boolean;
  isIOS: boolean;
}

export const useCapacitor = () => {
  const [capacitorInfo, setCapacitorInfo] = useState<CapacitorInfo>({
    isNative: false,
    platform: 'web',
    isAndroid: false,
    isIOS: false
  });

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    const platform = Capacitor.getPlatform();
    
    setCapacitorInfo({
      isNative,
      platform,
      isAndroid: platform === 'android',
      isIOS: platform === 'ios'
    });

    // 初始化移动端设置
    if (isNative) {
      initializeMobileApp();
    }
  }, []);

  const initializeMobileApp = async () => {
    try {
      // 隐藏启动屏
      await SplashScreen.hide();
      
      // 设置状态栏样式
      if (Capacitor.isPluginAvailable('StatusBar')) {
        await StatusBar.setStyle({ style: Style.Default });
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
      }
    } catch (error) {
      console.warn('Failed to initialize mobile app:', error);
    }
  };

  const updateStatusBar = async (isDark: boolean) => {
    if (capacitorInfo.isNative && Capacitor.isPluginAvailable('StatusBar')) {
      try {
        await StatusBar.setStyle({ 
          style: isDark ? Style.Dark : Style.Light 
        });
        await StatusBar.setBackgroundColor({ 
          color: isDark ? '#1a1a1a' : '#ffffff' 
        });
      } catch (error) {
        console.warn('Failed to update status bar:', error);
      }
    }
  };

  return {
    ...capacitorInfo,
    updateStatusBar
  };
};