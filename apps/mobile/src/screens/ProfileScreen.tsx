/**
 * Atlas Sanctum Mobile — Profile Screen
 * User identity, DID, reputation, and offline queue status.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { loadQueue, clearQueue } from '../lib/offline-queue';
import { syncQueue } from '../lib/sync';

const LANGUAGES = ['EN', 'ES', 'FR', 'SW', 'PT', 'HI', 'ZH', 'AR'];

export default function ProfileScreen() {
  const [queueCount, setQueueCount] = useState(0);
  const [lang, setLang]             = useState('EN');

  useEffect(() => {
    loadQueue().then(q => setQueueCount(q.length));
  }, []);

  const handleSync = async () => {
    const result = await syncQueue();
    const q = await loadQueue();
    setQueueCount(q.length);
    Alert.alert('Sync Complete', `${result.synced} synced · ${result.failed} failed`);
  };

  const handleClearQueue = () => {
    Alert.alert('Clear Queue', 'This will discard all pending offline actions. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
        await clearQueue();
        setQueueCount(0);
      }},
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Identity */}
      <View style={styles.identityCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🌍</Text>
        </View>
        <Text style={styles.name}>Field Agent</Text>
        <Text style={styles.did}>did:sanctum:field-agent-mobile</Text>
        <View style={styles.badges}>
          <View style={styles.badge}><Text style={styles.badgeText}>✓ Verified</Text></View>
          <View style={[styles.badge, styles.badgeGreen]}><Text style={styles.badgeText}>Field Agent</Text></View>
        </View>
      </View>

      {/* Reputation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reputation</Text>
        <View style={styles.reputationRow}>
          {[
            { label: 'Reports Filed',  value: '24' },
            { label: 'Votes Cast',     value: '12' },
            { label: 'Trust Score',    value: '0.91' },
            { label: 'Contributions',  value: '36' },
          ].map(r => (
            <View key={r.label} style={styles.repCard}>
              <Text style={styles.repValue}>{r.value}</Text>
              <Text style={styles.repLabel}>{r.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        <View style={styles.langRow}>
          {LANGUAGES.map(l => (
            <TouchableOpacity
              key={l}
              style={[styles.langBtn, lang === l && styles.langBtnActive]}
              onPress={() => setLang(l)}
            >
              <Text style={[styles.langText, lang === l && styles.langTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Offline Queue */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offline Queue</Text>
        <View style={styles.queueCard}>
          <Text style={styles.queueCount}>{queueCount}</Text>
          <Text style={styles.queueLabel}>pending action{queueCount !== 1 ? 's' : ''}</Text>
        </View>
        <View style={styles.queueActions}>
          <TouchableOpacity style={styles.syncBtn} onPress={handleSync}>
            <Text style={styles.syncBtnText}>↑ Sync Now</Text>
          </TouchableOpacity>
          {queueCount > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearQueue}>
              <Text style={styles.clearBtnText}>Clear Queue</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Low-bandwidth mode */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>🌐 Low-bandwidth mode</Text>
          <Text style={styles.settingValue}>Auto</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>🔔 Push notifications</Text>
          <Text style={styles.settingValue}>On</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>📡 Background sync</Text>
          <Text style={styles.settingValue}>On</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#f9fafb' },
  identityCard:    { backgroundColor: '#15803d', padding: 28, alignItems: 'center' },
  avatar:          { width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText:      { fontSize: 36 },
  name:            { fontSize: 20, fontWeight: '800', color: '#fff' },
  did:             { fontSize: 11, color: '#bbf7d0', marginTop: 4, marginBottom: 10 },
  badges:          { flexDirection: 'row', gap: 8 },
  badge:           { backgroundColor: '#ffffff33', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeGreen:      { backgroundColor: '#166534' },
  badgeText:       { fontSize: 11, color: '#fff', fontWeight: '600' },
  section:         { backgroundColor: '#fff', margin: 12, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  sectionTitle:    { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 12 },
  reputationRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  repCard:         { width: '47%', backgroundColor: '#f9fafb', borderRadius: 10, padding: 12, alignItems: 'center' },
  repValue:        { fontSize: 22, fontWeight: '800', color: '#15803d' },
  repLabel:        { fontSize: 11, color: '#6b7280', marginTop: 2, textAlign: 'center' },
  langRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langBtn:         { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#f9fafb' },
  langBtnActive:   { backgroundColor: '#15803d', borderColor: '#15803d' },
  langText:        { fontSize: 12, fontWeight: '600', color: '#374151' },
  langTextActive:  { color: '#fff' },
  queueCard:       { backgroundColor: '#f0fdf4', borderRadius: 10, padding: 16, alignItems: 'center', marginBottom: 12 },
  queueCount:      { fontSize: 36, fontWeight: '800', color: '#15803d' },
  queueLabel:      { fontSize: 13, color: '#166534' },
  queueActions:    { flexDirection: 'row', gap: 8 },
  syncBtn:         { flex: 1, backgroundColor: '#15803d', borderRadius: 10, padding: 12, alignItems: 'center' },
  syncBtnText:     { color: '#fff', fontWeight: '700', fontSize: 13 },
  clearBtn:        { flex: 1, backgroundColor: '#fee2e2', borderRadius: 10, padding: 12, alignItems: 'center' },
  clearBtnText:    { color: '#dc2626', fontWeight: '700', fontSize: 13 },
  settingRow:      { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  settingLabel:    { fontSize: 13, color: '#374151' },
  settingValue:    { fontSize: 13, color: '#15803d', fontWeight: '600' },
});
