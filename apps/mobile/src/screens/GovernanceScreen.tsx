/**
 * Atlas Sanctum Mobile — Governance Screen
 * Active DAO proposals with offline vote queuing.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { enqueue } from '../lib/offline-queue';
import { syncQueue } from '../lib/sync';

interface Proposal {
  id: string;
  title: string;
  type: string;
  status: 'active' | 'passed' | 'rejected' | 'vetoed';
  yesWeight: number;
  noWeight: number;
  totalWeight: number;
  deadline: string;
  sevenGenImpact: string;
}

const PROPOSALS: Proposal[] = [
  {
    id: 'prop-001',
    title: 'Amazon Basin Emergency Restoration Fund — $12M Allocation',
    type: 'Resource Allocation',
    status: 'active',
    yesWeight: 6800, noWeight: 1200, totalWeight: 10000,
    deadline: '2026-07-10',
    sevenGenImpact: 'Restores 500,000 ha of primary forest, sequestering 90M tonnes CO₂ over 175 years.',
  },
  {
    id: 'prop-002',
    title: 'Indigenous Data Sovereignty Amendment — CARE Principles Codification',
    type: 'Constitutional Amendment',
    status: 'active',
    yesWeight: 7400, noWeight: 400, totalWeight: 10000,
    deadline: '2026-07-12',
    sevenGenImpact: 'Permanently protects indigenous knowledge rights for all future generations on the platform.',
  },
  {
    id: 'prop-003',
    title: 'Chainlink Oracle Integration — Carbon Price Feed',
    type: 'Partnership',
    status: 'active',
    yesWeight: 4200, noWeight: 2800, totalWeight: 10000,
    deadline: '2026-07-15',
    sevenGenImpact: 'Enables transparent, manipulation-resistant carbon pricing for 7+ generations of credit markets.',
  },
];

const STATUS_COLOR: Record<Proposal['status'], string> = {
  active: '#15803d', passed: '#0284c7', rejected: '#dc2626', vetoed: '#7c3aed',
};

export default function GovernanceScreen() {
  const [voted, setVoted] = useState<Record<string, 'yes' | 'no' | 'abstain'>>({});

  const handleVote = async (proposalId: string, vote: 'yes' | 'no' | 'abstain') => {
    await enqueue({ type: 'governance_vote', payload: { proposalId, vote, castAt: Date.now() } });
    setVoted(prev => ({ ...prev, [proposalId]: vote }));
    const result = await syncQueue();
    const msg = result.synced > 0 ? 'Vote submitted.' : 'Vote saved offline — will sync when connected.';
    Alert.alert('Vote Cast', msg);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>🏛 DAO Governance</Text>
      <Text style={styles.sub}>Vote on active proposals. Requires 67% supermajority + 50% quorum.</Text>

      {PROPOSALS.map(p => {
        const yesPct = Math.round((p.yesWeight / p.totalWeight) * 100);
        const noPct  = Math.round((p.noWeight  / p.totalWeight) * 100);
        const myVote = voted[p.id];

        return (
          <View key={p.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[p.status] }]}>
                <Text style={styles.statusText}>{p.status.toUpperCase()}</Text>
              </View>
              <Text style={styles.typeText}>{p.type}</Text>
            </View>

            <Text style={styles.title}>{p.title}</Text>

            <View style={styles.impactBox}>
              <Text style={styles.impactLabel}>7-Generation Impact</Text>
              <Text style={styles.impactText}>{p.sevenGenImpact}</Text>
            </View>

            {/* Vote bar */}
            <View style={styles.barContainer}>
              <View style={[styles.barYes, { flex: yesPct }]} />
              <View style={[styles.barNo,  { flex: noPct  }]} />
              <View style={[styles.barAbs, { flex: 100 - yesPct - noPct }]} />
            </View>
            <View style={styles.barLabels}>
              <Text style={styles.barLabelYes}>Yes {yesPct}%</Text>
              <Text style={styles.barLabelNo}>No {noPct}%</Text>
            </View>

            <Text style={styles.deadline}>Deadline: {p.deadline}</Text>

            {myVote ? (
              <View style={styles.votedBadge}>
                <Text style={styles.votedText}>✓ You voted: {myVote}</Text>
              </View>
            ) : (
              <View style={styles.voteRow}>
                {(['yes', 'no', 'abstain'] as const).map(v => (
                  <TouchableOpacity
                    key={v}
                    style={[styles.voteBtn, v === 'yes' && styles.voteBtnYes, v === 'no' && styles.voteBtnNo]}
                    onPress={() => handleVote(p.id, v)}
                  >
                    <Text style={[styles.voteBtnText, (v === 'yes' || v === 'no') && styles.voteBtnTextLight]}>
                      {v === 'yes' ? '✓ Yes' : v === 'no' ? '✗ No' : '— Abstain'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#f9fafb', padding: 16 },
  heading:          { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 4 },
  sub:              { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  card:             { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  cardHeader:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  statusBadge:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText:       { fontSize: 10, fontWeight: '700', color: '#fff' },
  typeText:         { fontSize: 11, color: '#6b7280' },
  title:            { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 10, lineHeight: 20 },
  impactBox:        { backgroundColor: '#f0fdf4', borderRadius: 8, padding: 10, marginBottom: 12 },
  impactLabel:      { fontSize: 10, fontWeight: '700', color: '#15803d', marginBottom: 3 },
  impactText:       { fontSize: 12, color: '#166534', lineHeight: 17 },
  barContainer:     { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  barYes:           { backgroundColor: '#16a34a' },
  barNo:            { backgroundColor: '#dc2626' },
  barAbs:           { backgroundColor: '#e5e7eb' },
  barLabels:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  barLabelYes:      { fontSize: 11, color: '#16a34a', fontWeight: '600' },
  barLabelNo:       { fontSize: 11, color: '#dc2626', fontWeight: '600' },
  deadline:         { fontSize: 11, color: '#9ca3af', marginBottom: 12 },
  voteRow:          { flexDirection: 'row', gap: 8 },
  voteBtn:          { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', alignItems: 'center' },
  voteBtnYes:       { backgroundColor: '#15803d', borderColor: '#15803d' },
  voteBtnNo:        { backgroundColor: '#dc2626', borderColor: '#dc2626' },
  voteBtnText:      { fontSize: 12, fontWeight: '700', color: '#374151' },
  voteBtnTextLight: { color: '#fff' },
  votedBadge:       { backgroundColor: '#f0fdf4', borderRadius: 8, padding: 10, alignItems: 'center' },
  votedText:        { fontSize: 13, color: '#15803d', fontWeight: '700' },
});
