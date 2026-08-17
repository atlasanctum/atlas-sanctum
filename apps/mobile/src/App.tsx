/**
 * Atlas Sanctum Mobile — App Entry Point
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { startSyncListener } from './lib/sync';

export default function App() {
  useEffect(() => {
    const unsubscribe = startSyncListener(result => {
      console.info(`[Atlas Mobile] Auto-synced ${result.synced} actions`);
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
