/**
 * Atlas Sanctum Mobile — Report Screen
 * GPS-tagged field impact report with offline queue support.
 */

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { enqueue } from '../lib/offline-queue';
import { syncQueue } from '../lib/sync';

type ReportType = 'restoration' | 'degradation' | 'biodiversity' | 'water' | 'community';

const REPORT_TYPES: { value: ReportType; label: string; icon: string }[] = [
  { value: 'restoration',  label: 'Restoration',  icon: '🌱' },
  { value: 'degradation',  label: 'Degradation',  icon: '⚠️' },
  { value: 'biodiversity', label: 'Biodiversity', icon: '🦋' },
  { value: 'water',        label: 'Water',        icon: '💧' },
  { value: 'community',    label: 'Community',    icon: '🤝' },
];

export default function ReportScreen() {
  const [type, setType]           = useState<ReportType>('restoration');
  const [title, setTitle]         = useState('');
  const [description, setDesc]    = useState('');
  const [location, setLocation]   = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getLocation = async () => {
    setLocating(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location access is required for GPS tagging.');
      setLocating(false);
      return;
    }
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    setLocating(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) { Alert.alert('Required', 'Please enter a report title.'); return; }
    setSubmitting(true);
    await enqueue({
      type: 'field_report',
      payload: { type, title, description, location, submittedAt: Date.now() },
    });
    const result = await syncQueue();
    setSubmitting(false);
    const msg = result.synced > 0
      ? 'Report submitted successfully.'
      : 'Report saved offline. It will sync when you have connectivity.';
    Alert.alert('Report Filed', msg);
    setTitle(''); setDesc(''); setLocation(null);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>📋 Field Report</Text>
      <Text style={styles.sub}>Document what you observe. Reports sync automatically.</Text>

      {/* Type selector */}
      <Text style={styles.label}>Report Type</Text>
      <View style={styles.typeRow}>
        {REPORT_TYPES.map(t => (
          <TouchableOpacity
            key={t.value}
            style={[styles.typeBtn, type === t.value && styles.typeBtnActive]}
            onPress={() => setType(t.value)}
          >
            <Text style={styles.typeIcon}>{t.icon}</Text>
            <Text style={[styles.typeLabel, type === t.value && styles.typeLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Title */}
      <Text style={styles.label}>Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Reforestation progress at site A"
        value={title}
        onChangeText={setTitle}
        maxLength={120}
      />

      {/* Description */}
      <Text style={styles.label}>Observations</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Describe what you observed…"
        value={description}
        onChangeText={setDesc}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
      />

      {/* GPS */}
      <Text style={styles.label}>GPS Location</Text>
      <TouchableOpacity style={styles.gpsBtn} onPress={getLocation} disabled={locating}>
        {locating
          ? <ActivityIndicator color="#16a34a" />
          : <Text style={styles.gpsBtnText}>
              {location ? `📍 ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : '📍 Tag Location'}
            </Text>
        }
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.submitText}>Submit Report</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  heading:          { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 4 },
  sub:              { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  label:            { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 14 },
  typeRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn:          { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#fff', alignItems: 'center' },
  typeBtnActive:    { backgroundColor: '#15803d', borderColor: '#15803d' },
  typeIcon:         { fontSize: 16 },
  typeLabel:        { fontSize: 11, color: '#374151', marginTop: 2 },
  typeLabelActive:  { color: '#fff' },
  input:            { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, fontSize: 14, color: '#111827' },
  textarea:         { height: 110 },
  gpsBtn:           { backgroundColor: '#fff', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 14, alignItems: 'center' },
  gpsBtnText:       { fontSize: 14, color: '#15803d', fontWeight: '600' },
  submitBtn:        { backgroundColor: '#15803d', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  submitBtnDisabled:{ opacity: 0.6 },
  submitText:       { color: '#fff', fontSize: 15, fontWeight: '700' },
});
