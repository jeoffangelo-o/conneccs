import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { SvgIcon } from '../components/SvgIcon';
import { calculateTimelinessRating, parseDeadline } from '../../utils/timeliness';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

type Document = {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  status: 'pending' | 'approved' | 'rejected';
  qualityRating?: number;
  timelinessRating?: number;
  accomplishments?: string;
};

export default function ReportorialFolderScreen({ route, navigation }) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const styles = createStyles(colors);
  const { requirement } = route.params;

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Letter_of_Intent_JuanDelaCruz.pdf',
      uploadedBy: 'Prof. Juan Dela Cruz',
      uploadedAt: '2026-04-15 10:30 AM',
      size: '2.4 MB',
      status: 'approved',
      qualityRating: 5,
      timelinessRating: 5,
      accomplishments: 'Submitted complete letter with all required signatures',
    },
    {
      id: '2',
      name: 'Letter_of_Intent_MariaSantos.pdf',
      uploadedBy: 'Dr. Maria Santos',
      uploadedAt: '2026-04-14 3:45 PM',
      size: '1.8 MB',
      status: 'pending',
      qualityRating: 4,
      timelinessRating: 4,
      accomplishments: 'Submitted letter with supporting documents',
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [accomplishments, setAccomplishments] = useState<string>('');
  const [calculatedTimelinessRating, setCalculatedTimelinessRating] = useState<number>(5);

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile({
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uri: file.uri,
          type: file.mimeType,
        });

        // Calculate automatic timeliness rating based on deadline
        const submissionDate = new Date();
        const timelinessRating = calculateTimelinessRating(requirement.deadline, submissionDate);
        setCalculatedTimelinessRating(timelinessRating);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleImageSelect = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        setSelectedFile({
          name: `image_${Date.now()}.jpg`,
          size: `${((image.fileSize || 0) / 1024 / 1024).toFixed(2)} MB`,
          uri: image.uri,
          type: 'image/jpeg',
        });

        // Calculate automatic timeliness rating
        const submissionDate = new Date();
        const timelinessRating = calculateTimelinessRating(requirement.deadline, submissionDate);
        setCalculatedTimelinessRating(timelinessRating);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !accomplishments.trim()) return;

    const newDoc: Document = {
      id: String(Date.now()),
      name: selectedFile.name,
      uploadedBy: user?.name || 'Unknown',
      uploadedAt: new Date().toLocaleString(),
      size: selectedFile.size,
      status: 'pending',
      qualityRating: qualityRating,
      timelinessRating: calculatedTimelinessRating,
      accomplishments: accomplishments,
    };

    setDocuments([newDoc, ...documents]);
    setSelectedFile(null);
    setQualityRating(5);
    setAccomplishments('');
    setCalculatedTimelinessRating(5);
    setShowUploadModal(false);
  };

  const getTimelinessLabel = (rating: number) => {
    switch (rating) {
      case 5: return '5 - Submitted 2+ days early';
      case 4: return '4 - Submitted 1 day early';
      case 3: return '3 - Submitted on time';
      case 2: return '2 - Submitted late';
      case 1: return '1 - Not completed';
      default: return 'N/A';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return colors.green;
      case 'rejected': return colors.red;
      case 'pending': return colors.orange;
      default: return colors.text3;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return 'checkCircle';
      case 'rejected': return 'alertCircle';
      case 'pending': return 'clock';
      default: return 'document';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Topbar */}
      <View style={styles.topbar}>
        <View style={styles.topbarLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <SvgIcon name="arrowBack" size={24} color={colors.text} style={{}} />
          </TouchableOpacity>
          <View style={styles.topbarTitle}>
            <Text style={styles.topbarTitleText}>{requirement.requirement}</Text>
            <Text style={styles.topbarBreadcrumb}>
              Reportorial Requirements › {requirement.requirement}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.uploadBtn}
          onPress={() => setShowUploadModal(true)}
        >
          <SvgIcon name="plus" size={18} color="#fff" style={{}} />
          <Text style={styles.uploadBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Requirement Info */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Deadline:</Text>
            <Text style={[styles.infoValue, { color: colors.orange }]}>
              {requirement.deadline || 'TBA'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Required Copies:</Text>
            <Text style={styles.infoValue}>{requirement.copies}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Assigned Staff:</Text>
            <View style={styles.staffBadge}>
              <Text style={styles.staffBadgeText}>{requirement.staff}</Text>
            </View>
          </View>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Remarks:</Text>
          <Text style={styles.infoValue}>{requirement.remarks}</Text>
        </View>
      </View>

      {/* Documents List */}
      <ScrollView style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Uploaded Documents ({documents.length})</Text>
        </View>

        {documents.length === 0 ? (
          <View style={styles.emptyState}>
            <SvgIcon name="folder" size={48} color={colors.text3} style={{}} />
            <Text style={styles.emptyStateText}>No documents uploaded yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Click the Upload button to add documents
            </Text>
          </View>
        ) : (
          documents.map((doc) => (
            <View key={doc.id} style={styles.documentCard}>
              <View style={styles.documentIcon}>
                <SvgIcon name="document" size={24} color={colors.accent} style={{}} />
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{doc.name}</Text>
                <View style={styles.documentMeta}>
                  <Text style={styles.documentMetaText}>
                    Uploaded by {doc.uploadedBy}
                  </Text>
                  <Text style={styles.documentMetaText}>•</Text>
                  <Text style={styles.documentMetaText}>{doc.uploadedAt}</Text>
                  <Text style={styles.documentMetaText}>•</Text>
                  <Text style={styles.documentMetaText}>{doc.size}</Text>
                </View>
                {doc.qualityRating && doc.timelinessRating && (
                  <View style={styles.ratingsRow}>
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingLabel}>Q:</Text>
                      <Text style={styles.ratingValue}>{doc.qualityRating}/5</Text>
                    </View>
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingLabel}>T:</Text>
                      <Text style={styles.ratingValue}>{doc.timelinessRating}/5</Text>
                    </View>
                  </View>
                )}
                {doc.accomplishments && (
                  <Text style={styles.accomplishmentsText} numberOfLines={2}>
                    {doc.accomplishments}
                  </Text>
                )}
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(doc.status)}20` }]}>
                <SvgIcon 
                  name={getStatusIcon(doc.status)} 
                  size={14} 
                  color={getStatusColor(doc.status)} 
                  style={{}} 
                />
                <Text style={[styles.statusText, { color: getStatusColor(doc.status) }]}>
                  {doc.status}
                </Text>
              </View>
              <TouchableOpacity style={styles.documentAction}>
                <SvgIcon name="moreVertical" size={20} color={colors.text3} style={{}} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Upload Modal */}
      {showUploadModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Document</Text>
              <TouchableOpacity onPress={() => {
                setShowUploadModal(false);
                setSelectedFile(null);
                setQualityRating(5);
                setAccomplishments('');
                setCalculatedTimelinessRating(5);
              }}>
                <SvgIcon name="x" size={24} color={colors.text3} style={{}} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
              <TouchableOpacity 
                style={styles.fileSelectBtn}
                onPress={handleFileSelect}
              >
                <SvgIcon name="document" size={32} color={colors.accent} style={{}} />
                <Text style={styles.fileSelectText}>
                  {selectedFile ? selectedFile.name : 'Choose Document (PDF, DOC, DOCX)'}
                </Text>
                {selectedFile && (
                  <Text style={styles.fileSelectSize}>{selectedFile.size}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.fileSelectBtn}
                onPress={handleImageSelect}
              >
                <SvgIcon name="image" size={32} color={colors.teal} style={{}} />
                <Text style={styles.fileSelectText}>
                  Choose Image (JPG, PNG)
                </Text>
              </TouchableOpacity>

              {/* Accomplishments Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Accomplishments / Description *</Text>
                <TextInput
                  style={[styles.textArea, { 
                    color: colors.text, 
                    backgroundColor: colors.bg3,
                    borderColor: colors.border 
                  }]}
                  placeholder="Describe what you accomplished for this requirement..."
                  placeholderTextColor={colors.text3}
                  multiline
                  numberOfLines={4}
                  value={accomplishments}
                  onChangeText={setAccomplishments}
                />
              </View>

              {/* Self Quality Rating */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Self Quality Rating *</Text>
                <Text style={styles.inputHint}>Rate the quality of your work (1-5)</Text>
                <View style={styles.ratingButtons}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.ratingButton,
                        qualityRating === rating && styles.ratingButtonActive,
                        { borderColor: colors.border }
                      ]}
                      onPress={() => setQualityRating(rating)}
                    >
                      <Text style={[
                        styles.ratingButtonText,
                        { color: qualityRating === rating ? '#fff' : colors.text }
                      ]}>
                        {rating}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Automatic Timeliness Rating Display */}
              {selectedFile && (
                <View style={[styles.infoBox, { 
                  backgroundColor: `${colors.green}15`,
                  borderColor: colors.green 
                }]}>
                  <SvgIcon name="info" size={20} color={colors.green} style={{}} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.infoText, { color: colors.text }]}>
                      <Text style={{ fontWeight: '700' }}>Automatic Timeliness Rating: </Text>
                      {getTimelinessLabel(calculatedTimelinessRating)}
                    </Text>
                    <Text style={[styles.infoText, { color: colors.text3, fontSize: 11, marginTop: 4 }]}>
                      Based on submission date vs deadline: {requirement.deadline || 'No deadline'}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.uploadInfo}>
                <Text style={styles.uploadInfoText}>
                  • Accepted formats: PDF, DOC, DOCX, JPG, PNG
                </Text>
                <Text style={styles.uploadInfoText}>
                  • Maximum file size: 10 MB
                </Text>
                <Text style={styles.uploadInfoText}>
                  • Timeliness rating is calculated automatically
                </Text>
                <Text style={styles.uploadInfoText}>
                  • Files will be reviewed by {requirement.staff}
                </Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.modalBtnSecondary}
                  onPress={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setQualityRating(5);
                    setAccomplishments('');
                    setCalculatedTimelinessRating(5);
                  }}
                >
                  <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.modalBtnPrimary, 
                    (!selectedFile || !accomplishments.trim()) && styles.modalBtnDisabled
                  ]}
                  onPress={handleUpload}
                  disabled={!selectedFile || !accomplishments.trim()}
                >
                  <SvgIcon name="upload" size={18} color="#fff" style={{}} />
                  <Text style={styles.modalBtnPrimaryText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48,
  },
  topbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
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
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  uploadBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: colors.bg2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  infoItem: {
    flex: 1,
    minWidth: 150,
  },
  infoSection: {
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  staffBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: `${colors.accent}20`,
    alignSelf: 'flex-start',
  },
  staffBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text2,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: colors.text3,
    marginTop: 8,
  },
  documentCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  documentIcon: {
    width: 48,
    height: 48,
    backgroundColor: `${colors.accent}15`,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  documentMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  documentMetaText: {
    fontSize: 12,
    color: colors.text3,
  },
  ratingsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${colors.accent}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
  accomplishmentsText: {
    fontSize: 12,
    color: colors.text2,
    marginTop: 6,
    fontStyle: 'italic',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  documentAction: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: colors.bg2,
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    padding: 20,
  },
  fileSelectBtn: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg3,
    marginBottom: 12,
  },
  fileSelectText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  fileSelectSize: {
    fontSize: 12,
    color: colors.text3,
    marginTop: 4,
  },
  uploadInfo: {
    backgroundColor: colors.bg3,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  uploadInfoText: {
    fontSize: 12,
    color: colors.text2,
    marginBottom: 4,
    lineHeight: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtnSecondary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  modalBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text2,
  },
  modalBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.accent,
  },
  modalBtnDisabled: {
    opacity: 0.5,
  },
  modalBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
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
  inputHint: {
    fontSize: 11,
    color: colors.text3,
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg3,
  },
  ratingButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  ratingButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
