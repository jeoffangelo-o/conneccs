import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Modal,
  TextInput as RNTextInput,
} from 'react-native';
import { ScrollView } from 'tamagui';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useReportorial } from '../../context/ReportorialContext';
import { StatusBar } from 'expo-status-bar';
import { SvgIcon } from '../components/SvgIcon';
import * as DocumentPicker from 'expo-document-picker';
import usersData from '../../assets/data/users.json';

export default function ReportorialFolderScreen({ navigation, route }) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const {
    requirements,
    submissions,
    uploadTemplate,
    getSubmissionsForRequirement,
    getFacultySubmission,
    rateSubmission,
    sendBulkReminder,
    generateSubmittedReport,
    generateNotSubmittedReport,
    generateSummaryReport,
    submitRequirement,
  } = useReportorial();
  
  // Log version to verify new code is loaded
  console.log('🔄 ReportorialFolderScreen loaded - Version 2.0 (Fixed)');
  
  // Safety check for colors
  if (!colors) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const requirementId = route.params?.requirementId;
  const requirement = requirements.find(req => req.id === requirementId);
  
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [qualityRating, setQualityRating] = useState('');
  const [timelinessRating, setTimelinessRating] = useState('');
  const [remarks, setRemarks] = useState('');

  const isSecretary = user?.role === 'SECRETARY';
  const isFaculty = user?.role === 'FACULTY';

  if (!requirement) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Requirement not found</Text>
      </View>
    );
  }

  const requirementSubmissions = getSubmissionsForRequirement(requirementId);
  const allFaculty = usersData.filter((u: any) => 
    u.role === 'FACULTY' || u.role === 'CHAIR' || u.role === 'COORDINATOR'
  );
  
  const submittedCount = requirementSubmissions.length;
  const totalCount = allFaculty.length;
  const notSubmittedCount = totalCount - submittedCount;
  const submissionRate = totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0;

  // Handle faculty submission upload
  const handleFacultyUpload = async () => {
    if (!user) return;

    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx,.xls,.xlsx';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const mockUrl = `https://example.com/submissions/${user.id}/${file.name}`;
          const submission = {
            id: `sub-${Date.now()}`,
            requirementId,
            facultyId: user.id,
            facultyName: user.name,
            submittedAt: new Date().toISOString(),
            fileUrl: mockUrl,
            fileName: file.name,
            status: 'SUBMITTED' as const,
          };
          submitRequirement(submission);
          Alert.alert('Success', `File uploaded: ${file.name}`);
        }
      };
      input.click();
    } else {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: '*/*',
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const file = result.assets[0];
          const mockUrl = `https://example.com/submissions/${user.id}/${file.name}`;
          const submission = {
            id: `sub-${Date.now()}`,
            requirementId,
            facultyId: user.id,
            facultyName: user.name,
            submittedAt: new Date().toISOString(),
            fileUrl: mockUrl,
            fileName: file.name,
            status: 'SUBMITTED' as const,
          };
          submitRequirement(submission);
          Alert.alert('Success', `File uploaded: ${file.name}`);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to upload file');
      }
    }
  };

  // Handle template upload (Secretary only)
  const handleUploadTemplate = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx,.xls,.xlsx';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const mockUrl = `https://example.com/templates/${file.name}`;
          uploadTemplate(requirementId, mockUrl);
          Alert.alert('Success', `Template uploaded: ${file.name}`);
        }
      };
      input.click();
    } else {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: '*/*',
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const file = result.assets[0];
          const mockUrl = `https://example.com/templates/${file.name}`;
          uploadTemplate(requirementId, mockUrl);
          Alert.alert('Success', `Template uploaded: ${file.name}`);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to upload template');
      }
    }
  };

  // Handle send reminder to all non-submitters
  const handleSendReminder = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        `Send reminder to ${notSubmittedCount} faculty members who haven't submitted?`
      );
      if (confirmed) {
        sendBulkReminder(requirementId);
        window.alert('Reminders sent successfully!');
      }
    } else {
      Alert.alert(
        'Send Reminder',
        `Send reminder to ${notSubmittedCount} faculty members who haven't submitted?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Send',
            onPress: () => {
              sendBulkReminder(requirementId);
              Alert.alert('Success', 'Reminders sent successfully!');
            },
          },
        ]
      );
    }
  };

  // Handle generate report
  const handleGenerateReport = (type: 'SUBMITTED' | 'NOT_SUBMITTED' | 'SUMMARY') => {
    let report;
    if (type === 'SUBMITTED') {
      report = generateSubmittedReport(requirementId);
    } else if (type === 'NOT_SUBMITTED') {
      report = generateNotSubmittedReport(requirementId);
    } else {
      report = generateSummaryReport(requirementId);
    }

    // In production, this would export to PDF/Excel
    const message = `Report generated:\n\n${report.facultyList.map(f => 
      `${f.facultyName}: ${f.status}${f.submittedAt ? ` (${new Date(f.submittedAt).toLocaleDateString()})` : ''}`
    ).join('\n')}`;

    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Report Generated', message);
    }
  };

  // Handle rate submission
  const handleRateSubmission = (submission: any) => {
    setSelectedSubmission(submission);
    setQualityRating(submission.qualityRating?.toString() || '');
    setTimelinessRating(submission.timelinessRating?.toString() || '');
    setRemarks(submission.remarks || '');
    setRatingModalVisible(true);
  };

  const handleSaveRating = () => {
    if (!selectedSubmission) return;

    const q = parseFloat(qualityRating);
    const t = parseFloat(timelinessRating);

    if (isNaN(q) || q < 1 || q > 5) {
      Alert.alert('Invalid Rating', 'Quality rating must be between 1 and 5');
      return;
    }

    if (isNaN(t) || t < 1 || t > 5) {
      Alert.alert('Invalid Rating', 'Timeliness rating must be between 1 and 5');
      return;
    }

    rateSubmission(selectedSubmission.id, q, t, remarks);
    setRatingModalVisible(false);
    
    if (Platform.OS === 'web') {
      window.alert('Rating saved successfully!');
    } else {
      Alert.alert('Success', 'Rating saved successfully!');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <SvgIcon name="arrowLeft" size={24} color={colors.text} style={{}} />
        </TouchableOpacity>
        <View style={styles.topbarTitle}>
          <Text style={styles.topbarTitleText}>{requirement.requirement}</Text>
          <Text style={styles.topbarBreadcrumb}>Requirement #{requirement.no}</Text>
        </View>
      </View>

      <ScrollView flex={1} contentContainerStyle={styles.content}>
        {/* Faculty View - Simple folder view */}
        {isFaculty && (
          <>
            {/* Requirement Details */}
            <View style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>Requirement Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Template:</Text>
                <Text style={styles.detailValue}>{requirement.template || 'N/A'}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Copies:</Text>
                <Text style={styles.detailValue}>{requirement.copies}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Deadline:</Text>
                <Text style={[styles.detailValue, { color: colors.orange, fontWeight: '600' }]}>
                  {requirement.deadline || 'TBA'}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Remarks:</Text>
                <Text style={styles.detailValue}>{requirement.remarks}</Text>
              </View>
            </View>

            {/* Template File */}
            {requirement.templateFileUrl && (
              <View style={styles.templateCard}>
                <Text style={styles.sectionTitle}>Template File</Text>
                <View style={styles.templateInfo}>
                  <SvgIcon name="fileText" size={24} color={colors.accent} style={{}} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.templateName}>Template Available</Text>
                    <Text style={styles.templateUrl}>{requirement.templateFileUrl}</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.replaceButton}>Download</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* My Submission */}
            <View style={styles.submissionsCard}>
              <Text style={styles.sectionTitle}>My Submission</Text>
              
              {getFacultySubmission(requirementId, user?.id) ? (
                <View style={styles.submissionBox}>
                  <View style={styles.submissionHeader}>
                    <SvgIcon name="checkCircle" size={20} color={colors.green} style={{}} />
                    <Text style={[styles.submissionStatus, { color: colors.green }]}>Submitted</Text>
                  </View>
                  <Text style={styles.submissionDate}>
                    {new Date(getFacultySubmission(requirementId, user?.id)?.submittedAt || '').toLocaleDateString()}
                  </Text>
                  {getFacultySubmission(requirementId, user?.id)?.qualityRating && (
                    <View style={styles.ratingInfo}>
                      <Text style={styles.ratingLabel}>Rating:</Text>
                      <Text style={styles.ratingValue}>
                        Quality: {getFacultySubmission(requirementId, user?.id)?.qualityRating}/5 | 
                        Timeliness: {getFacultySubmission(requirementId, user?.id)?.timelinessRating}/5
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.submissionBox}>
                  <View style={styles.submissionHeader}>
                    <SvgIcon name="alertCircle" size={20} color={colors.orange} style={{}} />
                    <Text style={[styles.submissionStatus, { color: colors.orange }]}>Not Submitted</Text>
                  </View>
                  <TouchableOpacity style={styles.uploadButton} onPress={handleFacultyUpload}>
                    <SvgIcon name="upload" size={18} color="#fff" style={{}} />
                    <Text style={styles.uploadButtonText}>Upload Submission</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        )}

        {/* Secretary View - Full dashboard */}
        {isSecretary && (
          <>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Submission Summary</Text>
            <View style={[styles.badge, { backgroundColor: `${colors.accent}20` }]}>
              <Text style={[styles.badgeText, { color: colors.accent }]}>
                {submissionRate}% Complete
              </Text>
            </View>
          </View>
          
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{submittedCount}</Text>
              <Text style={styles.statLabel}>Submitted</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.orange }]}>{notSubmittedCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCount}</Text>
              <Text style={styles.statLabel}>Total Faculty</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${submissionRate}%`, backgroundColor: colors.accent }]} />
          </View>
        </View>

        {/* Requirement Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Requirement Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Template:</Text>
            <Text style={styles.detailValue}>{requirement.template || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Copies:</Text>
            <Text style={styles.detailValue}>{requirement.copies}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Deadline:</Text>
            <Text style={[styles.detailValue, { color: colors.orange, fontWeight: '600' }]}>
              {requirement.deadline || 'TBA'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Assigned to:</Text>
            <Text style={styles.detailValue}>{requirement.staff}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Remarks:</Text>
            <Text style={styles.detailValue}>{requirement.remarks}</Text>
          </View>
        </View>

        {/* Template Section (Secretary only) */}
        {isSecretary && (
          <View style={styles.templateCard}>
            <Text style={styles.sectionTitle}>Template File</Text>
            
            {requirement.templateFileUrl ? (
              <View style={styles.templateInfo}>
                <SvgIcon name="fileText" size={24} color={colors.accent} style={{}} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.templateName}>Template uploaded</Text>
                  <Text style={styles.templateUrl}>{requirement.templateFileUrl}</Text>
                </View>
                <TouchableOpacity onPress={handleUploadTemplate}>
                  <Text style={styles.replaceButton}>Replace</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={handleUploadTemplate}>
                <SvgIcon name="upload" size={20} color="#fff" style={{}} />
                <Text style={styles.uploadButtonText}>Upload Template</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Secretary Actions */}
        {isSecretary && (
          <View style={styles.actionsCard}>
            <Text style={styles.sectionTitle}>Actions</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.accent }]}
                onPress={handleSendReminder}
                disabled={notSubmittedCount === 0}
              >
                <SvgIcon name="bell" size={18} color="#fff" style={{}} />
                <Text style={styles.actionButtonText}>
                  Send Reminder ({notSubmittedCount})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.teal }]}
                onPress={() => handleGenerateReport('SUMMARY')}
              >
                <SvgIcon name="fileText" size={18} color="#fff" style={{}} />
                <Text style={styles.actionButtonText}>Generate Report</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.green, flex: 1 }]}
                onPress={() => handleGenerateReport('SUBMITTED')}
              >
                <Text style={styles.actionButtonText}>Submitted List</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.orange, flex: 1 }]}
                onPress={() => handleGenerateReport('NOT_SUBMITTED')}
              >
                <Text style={styles.actionButtonText}>Pending List</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
                <Text style={styles.actionButtonText}>Pending List</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submissions List */}
          <View style={styles.submissionsCard}>
            <Text style={styles.sectionTitle}>Faculty Submissions</Text>
            
            {allFaculty.map((faculty: any) => {
            const submission = getFacultySubmission(requirementId, faculty.id);
            const hasSubmitted = !!submission;
            
            return (
              <View key={faculty.id} style={styles.facultyRow}>
                <View style={styles.facultyInfo}>
                  <View style={[
                    styles.facultyAvatar,
                    { backgroundColor: hasSubmitted ? colors.green : colors.text3 }
                  ]}>
                    <Text style={styles.facultyInitial}>
                      {faculty.firstName?.[0] || faculty.name[0]}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.facultyName}>{faculty.name}</Text>
                    {hasSubmitted && submission ? (
                      <Text style={styles.submissionDate}>
                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                      </Text>
                    ) : (
                      <Text style={[styles.submissionDate, { color: colors.orange }]}>
                        Not submitted
                      </Text>
                    )}
                  </View>
                </View>
                
                {hasSubmitted && submission && (
                  <View style={styles.submissionActions}>
                    {submission.qualityRating && submission.timelinessRating ? (
                      <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>
                          Q: {submission.qualityRating} | T: {submission.timelinessRating}
                        </Text>
                      </View>
                    ) : isSecretary ? (
                      <TouchableOpacity
                        style={styles.rateButton}
                        onPress={() => handleRateSubmission(submission)}
                        <Text style={styles.rateButtonText}>Rate</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                )}
              </View>
            );
          })}
        </View>
        </>
        )}
        {/* End Secretary View */}
      </ScrollView>

      {/* Rating Modal */}
      <Modal
        visible={ratingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRatingModalVisible(false)}
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bg2 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate Submission</Text>
              <TouchableOpacity onPress={() => setRatingModalVisible(false)}>
                <SvgIcon name="close" size={24} color={colors.text} style={{}} />
              </TouchableOpacity>
            </View>

            {selectedSubmission && (
              <View style={styles.modalBody}>
                <Text style={styles.modalSubtitle}>{selectedSubmission.facultyName}</Text>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Quality Rating (1-5)</Text>
                  <RNTextInput
                    style={[styles.input, { backgroundColor: colors.bg3, color: colors.text, borderColor: colors.border }]}
                    value={qualityRating}
                    onChangeText={setQualityRating}
                    keyboardType="numeric"
                    placeholder="Enter 1-5"
                    placeholderTextColor={colors.text3}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Timeliness Rating (1-5)</Text>
                  <RNTextInput
                    style={[styles.input, { backgroundColor: colors.bg3, color: colors.text, borderColor: colors.border }]}
                    value={timelinessRating}
                    onChangeText={setTimelinessRating}
                    keyboardType="numeric"
                    placeholder="Enter 1-5"
                    placeholderTextColor={colors.text3}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Remarks (Optional)</Text>
                  <RNTextInput
                    style={[styles.textArea, { backgroundColor: colors.bg3, color: colors.text, borderColor: colors.border }]}
                    value={remarks}
                    onChangeText={setRemarks}
                    multiline
                    numberOfLines={4}
                    placeholder="Enter remarks..."
                    placeholderTextColor={colors.text3}
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.bg3 }]}
                    onPress={() => setRatingModalVisible(false)}
                    <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.accent }]}
                    onPress={handleSaveRating}
                    <Text style={[styles.modalButtonText, { color: '#fff' }]}>Save Rating</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topbar: {
    backgroundColor: colors.bg2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 48,
  },
  topbarTitle: {
    flex: 1,
  },
  topbarTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  topbarBreadcrumb: {
    fontSize: 11,
    color: colors.text3,
    marginTop: 2,
  },
  content: {
    padding: 12,
  },
  summaryCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text3,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.bg3,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  detailsCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text3,
    width: 90,
  },
  detailValue: {
    flex: 1,
    fontSize: 12,
    color: colors.text2,
  },
  templateCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  templateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  templateUrl: {
    fontSize: 11,
    color: colors.text3,
    marginTop: 4,
  },
  replaceButton: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  actionsCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  submissionsCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  facultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  facultyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  facultyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  facultyInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  facultyName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  submissionDate: {
    fontSize: 11,
    color: colors.text3,
    marginTop: 2,
  },
  submissionActions: {
    flexDirection: 'row',
    gap: 6,
  },
  ratingBadge: {
    backgroundColor: `${colors.green}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.green,
  },
  rateButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rateButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  submissionBox: {
    backgroundColor: colors.bg3,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  submissionStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  submissionDate: {
    fontSize: 12,
    color: colors.text3,
    marginBottom: 12,
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text2,
  },
  ratingValue: {
    fontSize: 12,
    color: colors.text,
  },
  errorText: {
    fontSize: 16,
    color: colors.text3,
    textAlign: 'center',
    marginTop: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 12,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalBody: {
    gap: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.text2,
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
}
