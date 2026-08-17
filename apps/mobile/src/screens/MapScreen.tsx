/**
 * Atlas Sanctum Mobile — Map Screen
 * Bioregional map with sensor locations and twin divergence overlays.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';

interface SensorMarker {
  id: string;
  type: string;
  lat: number;
  lng: number;
  bioregion: string;
  status: 'online' | 'offline' | 'degraded';
  lastReading?: string;
}

const SENSORS: SensorMarker[] = [
  { id: 'soil-amazon-001',    type: '🌱 Soil',     lat: -3.4,  lng: -62.2, bioregion: 'Amazon Basin',       status: 'online',   lastReading: 'Moisture: 42%' },
  { id: 'bio-amazon-001',     type: '🔊 Bioacoustic', lat: -3.5, lng: -62.3, bioregion: 'Amazon Basin',      status: 'online',   lastReading: 'Biodiversity: 0.81' },
  { id: 'ocean-coral-001',    type: '🌊 Ocean',    lat: -18.3, lng: 147.7, bioregion: 'Coral Triangle',      status: 'online',   lastReading: 'Temp: 29.2°C' },
  { id: 'air-sahel-001',      type: '💨 Air',      lat: 13.5,  lng: 2.1,   bioregion: 'Sahel',               status: 'degraded', lastReading: 'AQI: 88' },
  { id: 'water-himalaya-001', type: '💧 Water',    lat: 28.0,  lng: 84.0,  bioregion: 'Himalayan Watershed', status: 'online',   lastReading: 'pH: 7.2' },
  { id: 'weather-congo-001',  type: '🌦 Weather',  lat: -0.2,  lng: 21.8,  bioregion: 'Congo Basin',         status: 'online',   lastReading: 'Temp: 26°C' },
];

const STATUS_COLOR: Record<SensorMarker['status'], string> = {
  online: '#16a34a', degraded: '#d97706', offline: '#6b7280',
};

export default function MapScreen() {
  const [selected, setSelected] = useState<SensorMarker | null>(null);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{ latitude: 0, longitude: 20, latitudeDelta: 80, longitudeDelta: 120 }}
      >
        {SENSORS.map(s => (
          <React.Fragment key={s.id}>
            <Circle
              center={{ latitude: s.lat, longitude: s.lng }}
              radius={400_000}
              fillColor={`${STATUS_COLOR[s.status]}22`}
              strokeColor={STATUS_COLOR[s.status]}
              strokeWidth={1}
            />
            <Marker
              coordinate={{ latitude: s.lat, longitude: s.lng }}
              title={s.type}
              description={s.bioregion}
              pinColor={STATUS_COLOR[s.status]}
              onPress={() => setSelected(s)}
            />
          </React.Fragment>
        ))}
      </MapView>

      {/* Selected sensor panel */}
      {selected && (
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>{selected.type}</Text>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={styles.panelClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.panelBioregion}>{selected.bioregion}</Text>
          <View style={styles.panelRow}>
            <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[selected.status] }]} />
            <Text style={styles.panelStatus}>{selected.status}</Text>
          </View>
          {selected.lastReading && (
            <Text style={styles.panelReading}>{selected.lastReading}</Text>
          )}
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries(STATUS_COLOR).map(([status, color]) => (
          <View key={status} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{status}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1 },
  map:            { flex: 1 },
  panel:          { position: 'absolute', bottom: 20, left: 16, right: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 },
  panelHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  panelTitle:     { fontSize: 15, fontWeight: '700', color: '#111827' },
  panelClose:     { fontSize: 16, color: '#9ca3af', padding: 4 },
  panelBioregion: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
  panelRow:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot:      { width: 8, height: 8, borderRadius: 4 },
  panelStatus:    { fontSize: 12, fontWeight: '600', color: '#374151', textTransform: 'capitalize' },
  panelReading:   { fontSize: 13, color: '#374151', marginTop: 6, fontWeight: '500' },
  legend:         { position: 'absolute', top: 12, right: 12, backgroundColor: '#ffffffee', borderRadius: 10, padding: 8, gap: 4 },
  legendItem:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot:      { width: 8, height: 8, borderRadius: 4 },
  legendLabel:    { fontSize: 11, color: '#374151', textTransform: 'capitalize' },
});
