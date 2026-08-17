/**
 * Atlas Sanctum Mobile — Home Screen
 * Mission dashboard: sync status, offline queue, quick actions.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { loadQueue } from '../lib/offline-queue';
import { syncQueue } from '../lib/sync';

interface Stat { label: string; value: string; icon: string }

const STATS: Stat[] = [
  { label: 'Hectares Protected', value: '12M',    icon: '🌳' },
  { label: 'Active Sensors',     value: '15,000', icon: '📡' },
  { label: 'Carbon Verified',    value: '99.9%',  icon: '✅' },
  { label: 'Global Nodes',       value: '4,000+', icon: '🌐' },
];

export default function HomeScreen() {
  const [queueCount, setQueueCount] = useState(0);
  const [syncing, setSyncing]       = useState(false);
  const [lastSync, setLastSync]     = useState<string | null>(null);

  const refresh = async () => {
    const q = await loadQueue();
    setQueueCount(q.length);
  };

  const handleSync = async () => {
    setSyncing(true);
    const result = await syncQueue();
    setSyncing(false);
    setLastSync(`${result.synced} synced, ${result.failed} failed`);
    await refresh();
  };

  useEffect(() => { refresh(); }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={syncing} onRefresh={handleSync} />}
    >
      {/* Header */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>🌍 Atlas Field</Text>
        <Text style={styles.heroSub}>Regenerating Earth's Future</Text>
      </View>

      {/* Sync Banner */}
      {queueCount > 0 && (
        <TouchableOpacity style={styles.syncBanner} onPress={handleSync}>
          <Text style={styles.syncText}>
            {syncing ? 'Syncing…' : `${queueCount} action${queueCount !== 1 ? 's' : ''} pending sync — tap to sync`}
          </Text>
        </TouchableOpacity>
      )}
      {lastSync && (
        <View style={styles.syncResult}>
          <Text style={styles.syncResultText}>Last sync: {lastSync}</Text>
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsGrid}>
        {STATS.map(s => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actions}>
        {[
          { icon: '📋', label: 'File Report' },
          { icon: '📸', label: 'Upload Evidence' },
          { icon: '🗺', label: 'View Map' },
          { icon: '🏛', label: 'Vote' },
        ].map(a => (
          <TouchableOpacity key={a.label} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>{a.icon}</Text>
            <Text style={styles.actionLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#f9fafb' },
  hero:            { backgroundColor: '#15803d', padding: 24, paddingTop: 40 },
  heroTitle:       { fontSize: 24, fontWeight: '800', color: '#fff' },
  heroSub:         { fontSize: 13, color: '#bbf7d0', marginTop: 4 },
  syncBanner:      { backgroundColor: '#fef3c7', padding: 12, margin: 16, borderRadius: 10, borderWidth: 1, borderColor: '#fcd34d' },
  syncText:        { fontSize: 13, color: '#92400e', textAlign: 'center', fontWeight: '600' },
  syncResult:      { paddingHorizontal: 16, marginTop: -8, marginBottom: 4 },
  syncResultText:  { fontSize: 11, color: '#6b7280', textAlign: 'center' },
  statsGrid:       { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8 },
  statCard:        { width: '47%', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  statIcon:        { fontSize: 24, marginBottom: 6 },
  statValue:       { fontSize: 20, fontWeight: '800', color: '#111827' },
  statLabel:       { fontSize: 11, color: '#6b7280', textAlign: 'center', marginTop: 2 },
  sectionTitle:    { fontSize: 15, fontWeight: '700', color: '#111827', paddingHorizontal: 16, marginTop: 8, marginBottom: 10 },
  actions:         { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, paddingBottom: 32 },
  actionBtn:       { width: '47%', backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  actionIcon:      { fontSize: 28, marginBottom: 6 },
  actionLabel:     { fontSize: 12, fontWeight: '600', color: '#374151' },
});
