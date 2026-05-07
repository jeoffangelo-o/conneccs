import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { SvgIcon } from '../components/SvgIcon';

type Requirement = {
  no: string;
  requirement: string;
  template: string;
  copies: string;
  fileSize: string;
  deadline: string;
  remarks: string;
  staff: string;
};

const requirements: Requirement[] = [
  {
    no: '1',
    requirement: 'LETTER OF INTENT',
    template: 'Letter of Intent',
    copies: '3 COPIES',
    fileSize: 'LONG',
    deadline: 'May 2026',
    remarks: 'ALL COS AND ADMIN PART-TIME',
    staff: 'JO',
  },
  {
    no: '2',
    requirement: 'PERMIT TO TEACH',
    template: 'Permit to Teach COS Full-Time / Part-Time / Admin Part-Time',
    copies: '3 COPIES',
    fileSize: 'LONG',
    deadline: 'Effective upon the approval of Letter of Intent',
    remarks: 'COS FULL-TIME / COS PART-TIME / ADMIN PART-TIME',
    staff: 'JO',
  },
  {
    no: '3',
    requirement: 'WORKLOAD SCHEDULE OF FACULTY',
    template: 'Workload Schedule',
    copies: '1 COPY',
    fileSize: 'LONG',
    deadline: 'Effective upon the approval and signing of Subject Load Notice',
    remarks: 'ALL FACULTY MEMBERS',
    staff: 'JO',
  },
  {
    no: '4',
    requirement: 'APPROVED SYLLABUS',
    template: 'DRIVE FOLDER: Syllabus 25-2',
    copies: 'SOFT COPY',
    fileSize: 'LONG',
    deadline: '',
    remarks: 'ALL FACULTY MEMBERS',
    staff: 'STEPH',
  },
  {
    no: '5',
    requirement: 'CLASS MONITORING CHECKLIST',
    template: 'DRIVE FOLDER: CMC Template',
    copies: '1 COPY',
    fileSize: 'LONG',
    deadline: '1st Week of the following month',
    remarks: 'All Faculty Members handling Non-Laboratory Subjects/courses',
    staff: 'JO',
  },
  {
    no: '6',
    requirement: 'COMPUTATION OF MIDTERM GRADES',
    template: '',
    copies: '1 COPY',
    fileSize: 'LONG',
    deadline: 'March 25, 2026',
    remarks: 'ALL FACULTY MEMBERS',
    staff: 'CHEN',
  },
  {
    no: '7',
    requirement: 'LIST OF DROPPED STUDENT',
    template: 'List of Dropped Student',
    copies: '1 COPY',
    fileSize: 'LONG',
    deadline: 'March 24, 2026',
    remarks: 'ALL FACULTY MEMBERS',
    staff: 'CHEN',
  },
  {
    no: '8',
    requirement: 'CLASS OBSERVATION',
    template: 'Class Observation',
    copies: 'SOFT COPY',
    fileSize: 'LONG',
    deadline: 'March 31, 2026',
    remarks: 'PROGRAM CHAIRS',
    staff: 'CHEN',
  },
  {
    no: '9',
    requirement: 'APPROVED TOS W/ Test Question & KEY to correction',
    template: 'DRIVE FOLDER: TOS/RUBRIC 25-2',
    copies: 'SOFT COPY',
    fileSize: 'LONG',
    deadline: 'March 13, 2026',
    remarks: 'ALL FACULTY MEMBERS',
    staff: 'STEPH',
  },
  {
    no: '10',
    requirement: 'APPROVED RUBRIC OF ASSESSMENT W/ ATTACHED PROBLEM/ SAMPLE OUTPUT',
    template: 'DRIVE FOLDER: TOS/RUBRIC 25-2',
    copies: 'SOFT COPY',
    fileSize: 'LONG',
    deadline: 'March 13, 2026',
    remarks: 'ALL FACULTY MEMBERS',
    staff: 'STEPH',
  },
  {
    no: '11',
    requirement: 'SIAS GRADE SHEET',
    template: '',
    copies: '3 COPIES',
    fileSize: 'LONG',
    deadline: 'Graduate 5/20/2026 / Undergrad 5/27/2026',
    remarks: 'ALL FACULTY MEMBERS',
    staff: 'CHEN',
  },
  {
    no: '12',
    requirement: 'LIST OF TOP TEN',
    template: 'List of Top Ten',
    copies: '1 COPY',
    fileSize: 'LONG',
    deadline: 'May 27, 2026',
    remarks: 'All Class Advisers',
    staff: 'JO',
  },
  {
    no: '13',
    requirement: 'DELIQUENCY REPORT',
    template: 'Delinquency Report',
    copies: '1 COPY',
    fileSize: 'LONG',
    deadline: 'May 27, 2026',
    remarks: 'All Class Advisers',
    staff: 'JO',
  },
  {
    no: '14',
    requirement: 'DEAN\'S & PRESIDENT LIST',
    template: 'DRIVE FOLDER: Dean\'s List 25-2',
    copies: 'SOFTCOPY',
    fileSize: 'LONG',
    deadline: 'May 27, 2026',
    remarks: 'All Class Advisers',
    staff: 'JO',
  },
  {
    no: '15',
    requirement: 'APPROVED CLASS RECORD',
    template: '',
    copies: '1 COPY',
    fileSize: 'LONG',
    deadline: 'Graduate 5/20/2026 / Undergrad 5/27/2026',
    remarks: 'All Class Advisers',
    staff: 'STEPH',
  },
];

const otherDocuments: Requirement[] = [
  {
    no: '1',
    requirement: 'MAKE UP CLASS REQUEST',
    template: 'Attachments: Class and Faculty Plotting; Proof of Agreement with Students on the Make-Up Class Schedule',
    copies: 'Two (2) COPIES of the Request form; One (1) copy of the supporting attachments',
    fileSize: 'LONG',
    deadline: 'AS REQUIRED',
    remarks: 'AS REQUESTED BY FACULTY',
    staff: 'JO',
  },
  {
    no: '2',
    requirement: 'LEAVE FORM',
    template: 'STANDARD FORMS AVAILABLE AT DEANS OFFICE',
    copies: '',
    fileSize: '',
    deadline: 'AS NEEDED',
    remarks: 'WHEN APPLICABLE/FILED BY FACULTY',
    staff: 'JO',
  },
];

export default function ReportorialRequirementsScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);
  const [activeTab, setActiveTab] = useState<'requirements' | 'other'>('requirements');

  const renderRequirementCard = (req: Requirement) => (
    <TouchableOpacity 
      key={req.no} 
      style={styles.card}
      onPress={() => navigation.navigate('ReportorialFolder', { requirement: req })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardNumber}>
          <Text style={styles.cardNumberText}>{req.no}</Text>
        </View>
        <View style={styles.cardStaff}>
          <Text style={styles.cardStaffText}>{req.staff}</Text>
        </View>
      </View>
      
      <Text style={styles.cardTitle}>{req.requirement}</Text>
      
      <View style={styles.cardSection}>
        <Text style={styles.cardLabel}>Template:</Text>
        <Text style={styles.cardValue}>{req.template || 'N/A'}</Text>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.cardColumn}>
          <Text style={styles.cardLabel}>Copies:</Text>
          <Text style={styles.cardValue}>{req.copies}</Text>
        </View>
        <View style={styles.cardColumn}>
          <Text style={styles.cardLabel}>Size:</Text>
          <Text style={styles.cardValue}>{req.fileSize}</Text>
        </View>
      </View>

      <View style={styles.cardSection}>
        <Text style={styles.cardLabel}>Deadline:</Text>
        <Text style={[styles.cardValue, styles.deadlineText]}>{req.deadline || 'TBA'}</Text>
      </View>

      <View style={styles.cardSection}>
        <Text style={styles.cardLabel}>Remarks:</Text>
        <Text style={styles.cardValue}>{req.remarks}</Text>
      </View>
      
      <View style={styles.cardFooter}>
        <SvgIcon name="folder" size={16} color={colors.accent} style={{}} />
        <Text style={styles.cardFooterText}>Click to open folder</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Topbar */}
      <View style={styles.topbar}>
        <View style={styles.topbarLeft}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <SvgIcon name="menu" size={24} color={colors.text} style={{}} />
          </TouchableOpacity>
          <View style={styles.topbarTitle}>
            <Text style={styles.topbarTitleText}>Reportorial Requirements</Text>
            <Text style={styles.topbarBreadcrumb}>CCS Faculty Portal › Reportorial Requirements</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requirements' && styles.tabActive]}
          onPress={() => setActiveTab('requirements')}
        >
          <Text style={[styles.tabText, activeTab === 'requirements' && styles.tabTextActive]}>
            Reportorial Requirements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'other' && styles.tabActive]}
          onPress={() => setActiveTab('other')}
        >
          <Text style={[styles.tabText, activeTab === 'other' && styles.tabTextActive]}>
            Other Documents
          </Text>
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <ScrollView style={styles.content}>
        <View style={styles.grid}>
          {activeTab === 'requirements'
            ? requirements.map(renderRequirementCard)
            : otherDocuments.map(renderRequirementCard)}
        </View>
      </ScrollView>
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 24,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text3,
  },
  tabTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    minWidth: 300,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  cardStaff: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: `${colors.accent}20`,
  },
  cardStaffText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.accent,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardSection: {
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  cardColumn: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text3,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 13,
    color: colors.text2,
    lineHeight: 18,
  },
  deadlineText: {
    fontWeight: '600',
    color: colors.orange,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cardFooterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
});
