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

type Document = {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  status: 'pending' | 'approved' | 'rejected';
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
    },
    {
      id: '2',
      name: 'Letter_of_Intent_MariaSantos.pdf',
      uploadedBy: 'Dr. Maria Santos',
      uploadedAt: '2026-04-14 3:45 PM',
      size: '1.8 MB',
      status: 'pending',
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleFileSelect = () => {
    // In a real app, this would open file picker
    // For web: <input type="file" />
    // For mobile: DocumentPicker or ImagePicker
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx,.xls,.xlsx';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          setSelectedFile({
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            type: file.type,
          });
        }
      };
      input.click();
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const newDoc: Document = {
      id: String(Date.now()),
      name: selectedFile.name,
      uploadedBy: user?.name || 'Unknown',
      uploadedAt: new Date().toLocaleString(),
      size: selectedFile.size,
      status: 'pending',
    };

    setDocuments([newDoc, ...documents]);
    setSelectedFile(null);
    setShowUploadModal(false);
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
              }}>
                <SvgIcon name="alertCircle" size={24} color={colors.text3} style={{}} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.fileSelectBtn}
                onPress={handleFileSelect}
              >
                <SvgIcon name="folder" size={32} color={colors.accent} style={{}} />
                <Text style={styles.fileSelectText}>
                  {selectedFile ? selectedFile.name : 'Choose File'}
                </Text>
                {selectedFile && (
                  <Text style={styles.fileSelectSize}>{selectedFile.size}</Text>
                )}
              </TouchableOpacity>

              <View style={styles.uploadInfo}>
                <Text style={styles.uploadInfoText}>
                  • Accepted formats: PDF, DOC, DOCX, XLS, XLSX
                </Text>
                <Text style={styles.uploadInfoText}>
                  • Maximum file size: 10 MB
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
                  }}
                >
                  <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalBtnPrimary, !selectedFile && styles.modalBtnDisabled]}
                  onPress={handleUpload}
                  disabled={!selectedFile}
                >
                  <SvgIcon name="plus" size={18} color="#fff" style={{}} />
                  <Text style={styles.modalBtnPrimaryText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalContent: {
    padding: 20,
  },
  fileSelectBtn: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg3,
    marginBottom: 20,
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
    padding: 16,
    marginBottom: 20,
  },
  uploadInfoText: {
    fontSize: 12,
    color: colors.text2,
    marginBottom: 6,
    lineHeight: 18,
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
});
