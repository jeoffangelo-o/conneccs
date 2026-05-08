import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Ionicons } from '@expo/vector-icons';
import { getAdjectivalRating } from '../../utils/calculations';

export default function DeanOPCRConsolidationScreen() {
  const { user } = useAuth();
  const { ipcrs, opcr } = useData();
  const [consolidated, setConsolidated] = useState(false);

  if (!user || user.role !== 'DEAN') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Access denied. Dean role required.</Text>
      </View>
    );
  }

  // Get all approved/final IPCRs
  const approvedIPCRs = ipcrs.filter(
    ipcr =>
      ipcr.overallStatus === 'APPROVED' ||
      ipcr.overallStatus === 'FINAL' ||
      (ipcr.finalRating !== null && ipcr.finalRating > 0)
  );

  // Calculate college-level statistics
  const totalFaculty = ipcrs.length;
  const approvedCount = approvedIPCRs.length;
  const pendingCount = totalFaculty - approvedCount;
  
  const averageRating =
    approvedIPCRs.length > 0
      ? approvedIPCRs.reduce((sum, ipcr) => sum + (ipcr.finalRating || 0), 0) / approvedIPCRs.length
      : 0;

  const collegeAdjectival = getAdjectivalRating(averageRating);

  // Rating distribution
  const ratingDistribution = {
    outstanding: approvedIPCRs.filter(i => (i.finalRating || 0) >= 4.5).length,
    verySatisfactory: approvedIPCRs.filter(i => (i.finalRating || 0) >= 3.5 && (i.finalRating || 0) < 4.5).length,
    satisfactory: approvedIPCRs.filter(i => (i.finalRating || 0) >= 2.5 && (i.finalRating || 0) < 3.5).length,
    unsatisfactory: approvedIPCRs.filter(i => (i.finalRating || 0) >= 1.5 && (i.finalRating || 0) < 2.5).length,
    poor: approvedIPCRs.filter(i => (i.finalRating || 0) < 1.5).length,
  };

  const handleSubmitCertification = () => {
    Alert.alert(
      'Submit OPCR Certification',
      'This will submit the consolidated OPCR report to IPDU. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            setConsolidated(true);
            Alert.alert('Success', 'OPCR certification submitted to IPDU');
          },
        },
      ]
    );
  };

  const handleExportReport = () => {
    Alert.alert('Export Report', 'Export functionality will be implemented');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>OPCR Consolidation</Text>
        <Text style={styles.subtitle}>College of Computer Studies - {opcr.year}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, styles.primaryCard]}>
            <Ionicons name="people" size={32} color="#3b82f6" />
            <Text style={styles.summaryValue}>{totalFaculty}</Text>
            <Text style={styles.summaryLabel}>Total Faculty</Text>
          </View>

          <View style={[styles.summaryCard, styles.successCard]}>
            <Ionicons name="checkmark-circle" size={32} color="#10b981" />
            <Text style={styles.summaryValue}>{approvedCount}</Text>
            <Text style={styles.summaryLabel}>Approved</Text>
          </View>

          <View style={[styles.summaryCard, styles.warningCard]}>
            <Ionicons name="time" size={32} color="#f59e0b" />
            <Text style={styles.summaryValue}>{pendingCount}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>

          <View style={[styles.summaryCard, styles.ratingCard]}>
            <Ionicons name="star" size={32} color="#8b5cf6" />
            <Text style={styles.summaryValue}>{averageRating.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>College Avg</Text>
          </View>
        </View>

        {/* College Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall College Rating</Text>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingValue}>{averageRating.toFixed(3)}</Text>
            <Text style={styles.ratingAdjectival}>{collegeAdjectival}</Text>
          </View>
        </View>

        {/* Rating Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rating Distribution</Text>
          <View style={styles.distributionList}>
            <View style={styles.distributionItem}>
              <View style={[styles.distributionBar, { width: `${(ratingDistribution.outstanding / approvedCount) * 100}%`, backgroundColor: '#10b981' }]} />
              <Text style={styles.distributionLabel}>Outstanding: {ratingDistribution.outstanding}</Text>
            </View>
            <View style={styles.distributionItem}>
              <View style={[styles.distributionBar, { width: `${(ratingDistribution.verySatisfactory / approvedCount) * 100}%`, backgroundColor: '#3b82f6' }]} />
              <Text style={styles.distributionLabel}>Very Satisfactory: {ratingDistribution.verySatisfactory}</Text>
            </View>
            <View style={styles.distributionItem}>
              <View style={[styles.distributionBar, { width: `${(ratingDistribution.satisfactory / approvedCount) * 100}%`, backgroundColor: '#f59e0b' }]} />
              <Text style={styles.distributionLabel}>Satisfactory: {ratingDistribution.satisfactory}</Text>
            </View>
            <View style={styles.distributionItem}>
              <View style={[styles.distributionBar, { width: `${(ratingDistribution.unsatisfactory / approvedCount) * 100}%`, backgroundColor: '#ef4444' }]} />
              <Text style={styles.distributionLabel}>Unsatisfactory: {ratingDistribution.unsatisfactory}</Text>
            </View>
            <View style={styles.distributionItem}>
              <View style={[styles.distributionBar, { width: `${(ratingDistribution.poor / approvedCount) * 100}%`, backgroundColor: '#991b1b' }]} />
              <Text style={styles.distributionLabel}>Poor: {ratingDistribution.poor}</Text>
            </View>
          </View>
        </View>

        {/* Faculty List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Faculty Ratings</Text>
          {approvedIPCRs.map(ipcr => (
            <View key={ipcr.id} style={styles.facultyCard}>
              <View style={styles.facultyInfo}>
                <Text style={styles.facultyName}>{ipcr.facultyName}</Text>
                <Text style={styles.facultyPeriod}>{ipcr.period}</Text>
              </View>
              <View style={styles.facultyRating}>
                <Text style={styles.facultyRatingValue}>{ipcr.finalRating?.toFixed(2)}</Text>
                <Text style={styles.facultyRatingAdjectival}>{ipcr.adjectivalRating}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {!consolidated ? (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.exportButton]}
                onPress={handleExportReport}
              >
                <Ionicons name="download-outline" size={20} color="#3b82f6" />
                <Text style={styles.exportButtonText}>Export Report</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.submitButton]}
                onPress={handleSubmitCertification}
                disabled={pendingCount > 0}
              >
                <Ionicons name="send" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>
                  Submit Certification to IPDU
                </Text>
              </TouchableOpacity>

              {pendingCount > 0 && (
                <Text style={styles.warningText}>
                  ⚠️ {pendingCount} IPCR(s) still pending approval
                </Text>
              )}
            </>
          ) : (
            <View style={styles.consolidatedBanner}>
              <Ionicons name="checkmark-circle" size={32} color="#10b981" />
              <Text style={styles.consolidatedText}>
                OPCR Consolidated and Submitted to IPDU
              </Text>
              <Text style={styles.consolidatedDate}>
                {new Date().toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  successCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  ratingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  ratingBox: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  ratingValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  ratingAdjectival: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  distributionList: {
    gap: 12,
  },
  distributionItem: {
    position: 'relative',
  },
  distributionBar: {
    height: 32,
    borderRadius: 4,
    marginBottom: 4,
  },
  distributionLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  facultyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    marginBottom: 8,
  },
  facultyInfo: {
    flex: 1,
  },
  facultyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  facultyPeriod: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  facultyRating: {
    alignItems: 'flex-end',
  },
  facultyRatingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  facultyRatingAdjectival: {
    fontSize: 11,
    color: '#666',
  },
  actionSection: {
    marginTop: 8,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  exportButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
  },
  exportButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  warningText: {
    fontSize: 14,
    color: '#f59e0b',
    textAlign: 'center',
    marginTop: 8,
  },
  consolidatedBanner: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#d1fae5',
    borderRadius: 8,
  },
  consolidatedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginTop: 12,
    textAlign: 'center',
  },
  consolidatedDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 40,
  },
});
