import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Ionicons } from '@expo/vector-icons';

export default function CoordinatorQueueScreen() {
  const { user } = useAuth();
  const { getCoordinatorQueue, coordinatorEndorseTarget, coordinatorReturnTarget } = useData();
  
  const [activeTab, setActiveTab] = useState<'pending' | 'endorsed' | 'returned'>('pending');
  const [selectedTarget, setSelectedTarget] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState<'endorse' | 'return'>('endorse');
  const [note, setNote] = useState('');

  if (!user || user.role !== 'COORDINATOR') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Access denied. Coordinator role required.</Text>
      </View>
    );
  }

  const coordinatorType = user.coordinatorType || 'RESEARCH';
  const queue = getCoordinatorQueue(coordinatorType);

  // Filter by tab
  const filteredQueue = queue.filter(item => {
    if (activeTab === 'pending') return item.target.status === 'SUBMITTED';
    if (activeTab === 'endorsed') return item.target.status === 'ENDORSED';
    if (activeTab === 'returned') return item.target.status === 'RETURNED' && item.target.returnedBy === 'COORDINATOR';
    return false;
  });

  const handleEndorse = (item: any) => {
    setSelectedTarget(item);
    setActionType('endorse');
    setNote('');
    setModalVisible(true);
  };

  const handleReturn = (item: any) => {
    setSelectedTarget(item);
    setActionType('return');
    setNote('');
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!selectedTarget) return;

    if (actionType === 'return' && !note.trim()) {
      Alert.alert('Error', 'Please provide a reason for returning this target');
      return;
    }

    try {
      if (actionType === 'endorse') {
        await coordinatorEndorseTarget(
          selectedTarget.ipcr.id,
          selectedTarget.target.id,
          note || 'Verified and endorsed'
        );
        Alert.alert('Success', 'Target endorsed successfully');
      } else {
        await coordinatorReturnTarget(
          selectedTarget.ipcr.id,
          selectedTarget.target.id,
          note
        );
        Alert.alert('Success', 'Target returned to faculty');
      }
      setModalVisible(false);
      setSelectedTarget(null);
      setNote('');
    } catch (error) {
      Alert.alert('Error', 'Failed to process target');
    }
  };

  const renderTargetCard = (item: any) => {
    const { ipcr, target, majorFunction } = item;
    
    return (
      <View key={target.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.facultyName}>{ipcr.facultyName}</Text>
          <View style={[styles.badge, styles[`badge${target.status}`]]}>
            <Text style={styles.badgeText}>{target.status}</Text>
          </View>
        </View>

        <Text style={styles.kraType}>{target.kraType} - {majorFunction.title}</Text>
        <Text style={styles.targetDescription}>{target.description}</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            Submitted: {target.submittedAt ? new Date(target.submittedAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>

        {target.isLate && (
          <View style={styles.lateWarning}>
            <Ionicons name="warning" size={16} color="#ef4444" />
            <Text style={styles.lateText}>LATE SUBMISSION</Text>
          </View>
        )}

        <View style={styles.accomplishmentSection}>
          <Text style={styles.sectionTitle}>Accomplishment:</Text>
          <Text style={styles.accomplishmentText}>{target.actualAccomplishments || 'N/A'}</Text>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Self-Rating:</Text>
          <View style={styles.ratingRow}>
            {target.selfRatingQ && <Text style={styles.ratingItem}>Q: {target.selfRatingQ}</Text>}
            {target.selfRatingE && <Text style={styles.ratingItem}>E: {target.selfRatingE}</Text>}
            {target.selfRatingT && <Text style={styles.ratingItem}>T: {target.selfRatingT}</Text>}
            {target.selfRatingAvg && (
              <Text style={styles.ratingAvg}>Avg: {target.selfRatingAvg.toFixed(2)}</Text>
            )}
          </View>
        </View>

        {target.movFileUrls && target.movFileUrls.length > 0 && (
          <View style={styles.documentsSection}>
            <Text style={styles.sectionTitle}>Documents: {target.movFileUrls.length} file(s)</Text>
          </View>
        )}

        {activeTab === 'pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.endorseButton]}
              onPress={() => handleEndorse(item)}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Endorse</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.returnButton]}
              onPress={() => handleReturn(item)}
            >
              <Ionicons name="arrow-back-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>Return</Text>
            </TouchableOpacity>
          </View>
        )}

        {target.coordinatorNote && (
          <View style={styles.noteSection}>
            <Text style={styles.noteLabel}>Coordinator Note:</Text>
            <Text style={styles.noteText}>{target.coordinatorNote}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {coordinatorType === 'RESEARCH' ? 'Research' : 'Extension'} Verification Queue
        </Text>
        <Text style={styles.subtitle}>
          {coordinatorType === 'RESEARCH' ? 'KRA 2' : 'KRA 3'} Targets
        </Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending ({queue.filter(i => i.target.status === 'SUBMITTED').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'endorsed' && styles.activeTab]}
          onPress={() => setActiveTab('endorsed')}
        >
          <Text style={[styles.tabText, activeTab === 'endorsed' && styles.activeTabText]}>
            Endorsed ({queue.filter(i => i.target.status === 'ENDORSED').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'returned' && styles.activeTab]}
          onPress={() => setActiveTab('returned')}
        >
          <Text style={[styles.tabText, activeTab === 'returned' && styles.activeTabText]}>
            Returned ({queue.filter(i => i.target.status === 'RETURNED' && i.target.returnedBy === 'COORDINATOR').length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {filteredQueue.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No targets in this category</Text>
          </View>
        ) : (
          filteredQueue.map(renderTargetCard)
        )}
      </ScrollView>

      {/* Action Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {actionType === 'endorse' ? 'Endorse Target' : 'Return Target'}
            </Text>

            {selectedTarget && (
              <View style={styles.modalTargetInfo}>
                <Text style={styles.modalTargetText}>
                  {selectedTarget.ipcr.facultyName}
                </Text>
                <Text style={styles.modalTargetDesc}>
                  {selectedTarget.target.description.substring(0, 100)}...
                </Text>
              </View>
            )}

            <Text style={styles.inputLabel}>
              {actionType === 'endorse' ? 'Verification Note (Optional):' : 'Reason for Return:'}
            </Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={note}
              onChangeText={setNote}
              placeholder={
                actionType === 'endorse'
                  ? 'Add verification notes...'
                  : 'Explain why this target is being returned...'
              }
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {actionType === 'endorse' ? 'Endorse' : 'Return'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  facultyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeSUBMITTED: {
    backgroundColor: '#fef3c7',
  },
  badgeENDORSED: {
    backgroundColor: '#d1fae5',
  },
  badgeRETURNED: {
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  kraType: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: 8,
  },
  targetDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  lateWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  lateText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
    marginLeft: 6,
  },
  accomplishmentSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  accomplishmentText: {
    fontSize: 13,
    color: '#666',
  },
  ratingSection: {
    marginTop: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  ratingItem: {
    fontSize: 13,
    color: '#666',
  },
  ratingAvg: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
  documentsSection: {
    marginTop: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    gap: 6,
  },
  endorseButton: {
    backgroundColor: '#10b981',
  },
  returnButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noteSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 4,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 13,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalTargetInfo: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  modalTargetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  modalTargetDesc: {
    fontSize: 12,
    color: '#666',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
