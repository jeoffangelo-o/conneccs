import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { StatusBar } from 'expo-status-bar';
import { SvgIcon } from '../components/SvgIcon';
import { StatusBadge } from '../../components/StatusBadge';
import { RatingInput } from '../../components/RatingInput';
import { calculateA4, calculateFinalRating } from '../../utils/calculations';
import usersData from '../../assets/data/users.json';
import { User } from '../../types';
import { WebScrollView } from '../components/WebScrollView';

type TabType = 'Targets' | 'Accomplishments' | 'MOV' | 'Rating Summary';

export default function IPCRDetailScreen({ navigation, route }) {
  const { colors, isDark } = useTheme();
  const { ipcrs, updateIPCR } = useData();
  const styles = createStyles(colors);
  const [activeTab, setActiveTab] = useState<TabType>('Targets');
  
  const ipcrId = route.params?.id;
  const ipcr = ipcrs.find(i => i.id === ipcrId);
  const users = usersData as User[];
  const faculty = users.find(u => u.id === ipcr?.facultyId);

  if (!ipcr || !faculty) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>IPCR not found</Text>
      </View>
    );
  }

  const tabs: TabType[] = ['Targets', 'Accomplishments', 'MOV', 'Rating Summary'];
  
  const isEditable = ipcr.currentPhase === 'MID_YEAR_REVIEW' || ipcr.currentPhase === 'TERMINAL_REVIEW';
  const isTargetSettingPhase = ipcr.currentPhase === 'TARGET_SETTING';

  const ratingCalc = useMemo(() => {
    return calculateFinalRating(ipcr);
  }, [ipcr]);

  const handleRatingChange = (targetId: string, field: 'q1Rating' | 'e2Rating' | 't3Rating', value: number) => {
    const updatedIPCR = { ...ipcr };
    updatedIPCR.majorFunctions = updatedIPCR.majorFunctions.map(mf => ({
      ...mf,
      targets: mf.targets.map(t => {
        if (t.id === targetId) {
          const updated = { ...t, [field]: value };
          if (updated.q1Rating && updated.e2Rating && updated.t3Rating) {
            updated.a4Rating = calculateA4(updated.q1Rating, updated.e2Rating, updated.t3Rating);
          }
          return updated;
        }
        return t;
      }),
    }));
    updateIPCR(ipcr.id, updatedIPCR);
  };

  const renderTargetsTab = () => (
    <View>
      {ipcr.majorFunctions.map((mf) => (
        <View key={mf.id} style={styles.panel}>
          <Text style={styles.panelTitle}>{mf.title}</Text>
          <Text style={styles.categoryBadge}>{mf.category} ({(mf.weight * 100)}%)</Text>
          
          {mf.targets.map((target, tIndex) => (
            <View key={target.id} style={styles.targetCard}>
              <Text style={styles.targetLabel}>Target {tIndex + 1}</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.textArea, !isTargetSettingPhase && styles.inputDisabled]}
                  value={target.description}
                  editable={isTargetSettingPhase}
                  multiline
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Measures</Text>
                <TextInput
                  style={[styles.textArea, !isTargetSettingPhase && styles.inputDisabled]}
                  value={target.measures}
                  editable={isTargetSettingPhase}
                  multiline
                />
              </View>

              <Text style={styles.ratingsLabel}>Ratings</Text>
              <View style={styles.ratingsRow}>
                <RatingInput
                  label="Q1 - Quality"
                  value={target.q1Rating}
                  onChange={(val) => handleRatingChange(target.id, 'q1Rating', val)}
                  disabled={!isEditable}
                />
                <RatingInput
                  label="E2 - Efficiency"
                  value={target.e2Rating}
                  onChange={(val) => handleRatingChange(target.id, 'e2Rating', val)}
                  disabled={!isEditable}
                />
                <RatingInput
                  label="T3 - Timeliness"
                  value={target.t3Rating}
                  onChange={(val) => handleRatingChange(target.id, 't3Rating', val)}
                  disabled={!isEditable}
                />
              </View>

              <View style={styles.a4Container}>
                <Text style={styles.a4Label}>A4 - Average (Auto-calculated)</Text>
                <View style={styles.a4Value}>
                  <Text style={styles.a4Text}>
                    {target.a4Rating !== null ? target.a4Rating.toFixed(2) : '--'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderAccomplishmentsTab = () => (
    <View>
      {ipcr.majorFunctions.map((mf) => (
        <View key={mf.id} style={styles.panel}>
          <Text style={styles.panelTitle}>{mf.title}</Text>
          
          {mf.targets.map((target, tIndex) => (
            <View key={target.id} style={styles.targetCard}>
              <Text style={styles.targetLabel}>Target {tIndex + 1}: {target.description}</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Actual Accomplishments</Text>
                <TextInput
                  style={styles.textArea}
                  value={target.actualAccomplishments}
                  placeholder="Describe what was accomplished..."
                  placeholderTextColor={colors.text3}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Remarks</Text>
                <TextInput
                  style={styles.textArea}
                  value={target.remarks}
                  placeholder="Additional remarks..."
                  placeholderTextColor={colors.text3}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderMOVTab = () => (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Means of Verification (MOV)</Text>
      <Text style={styles.infoText}>
        Upload supporting documents for your accomplishments
      </Text>

      {ipcr.majorFunctions.map((mf) =>
        mf.targets.map((target, tIndex) => (
          <View key={target.id} style={styles.movCard}>
            <Text style={styles.movTargetTitle}>
              {mf.title} - Target {tIndex + 1}
            </Text>
            
            <View style={styles.fileGrid}>
              {target.movFileUrls.map((file, fIndex) => (
                <View key={fIndex} style={styles.fileCard}>
                  <SvgIcon name="document" size={32} color={colors.accent} style={{}} />
                  <Text style={styles.fileName}>{file}</Text>
                </View>
              ))}
              
              <TouchableOpacity style={styles.uploadCard}>
                <SvgIcon name="plus" size={24} color={colors.text3} style={{}} />
                <Text style={styles.uploadText}>Upload MOV</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderRatingSummaryTab = () => (
    <View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Rating Breakdown</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Strategic Priority Average:</Text>
          <Text style={styles.summaryValue}>{ratingCalc.strategicAvg.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Strategic Weighted (45%):</Text>
          <Text style={styles.summaryValue}>{ratingCalc.strategicWeighted.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Core Functions Average:</Text>
          <Text style={styles.summaryValue}>{ratingCalc.coreAvg.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Core Weighted (45%):</Text>
          <Text style={styles.summaryValue}>{ratingCalc.coreWeighted.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Support Functions Average:</Text>
          <Text style={styles.summaryValue}>{ratingCalc.supportAvg.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Support Weighted (10%):</Text>
          <Text style={styles.summaryValue}>{ratingCalc.supportWeighted.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.finalRatingCard}>
          <Text style={styles.finalRatingLabel}>Final Average Rating</Text>
          <Text style={styles.finalRatingValue}>{ratingCalc.final.toFixed(2)}</Text>
          <Text style={styles.adjectivalRating}>{ratingCalc.adjectival}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Fixed Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <SvgIcon name="arrowBack" size={24} color={colors.text} style={{}} />
        </TouchableOpacity>
        <View style={styles.topbarCenter}>
          <Text style={styles.topbarTitle}>IPCR Detail</Text>
          <Text style={styles.topbarBreadcrumb}>
            {faculty.firstName} {faculty.lastName} • {ipcr.period}
          </Text>
        </View>
        <TouchableOpacity>
          <SvgIcon name="moreVertical" size={22} color={colors.text2} style={{}} />
        </TouchableOpacity>
      </View>

      {/* Fixed Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.facultyName}>
              {faculty.firstName} {faculty.lastName}
            </Text>
            <Text style={styles.period}>{ipcr.period}</Text>
          </View>
          <StatusBadge status={ipcr.status} />
        </View>
        {ipcr.finalRating && (
          <View style={styles.ratingBadge}>
            <SvgIcon name="star" size={20} color="#f59e0b" style={{}} />
            <Text style={styles.ratingText}>{ipcr.finalRating.toFixed(1)}</Text>
            <Text style={styles.ratingLabel}>{ipcr.adjectivalRating}</Text>
          </View>
        )}
      </View>

      {/* Fixed Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Scrollable Content */}
      <WebScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Targets' && renderTargetsTab()}
        {activeTab === 'Accomplishments' && renderAccomplishmentsTab()}
        {activeTab === 'MOV' && renderMOVTab()}
        {activeTab === 'Rating Summary' && renderRatingSummaryTab()}
      </WebScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    ...(Platform.OS === 'web' ? { 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    } : {}),
  },
  topbar: {
    backgroundColor: colors.bg2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topbarCenter: {
    flex: 1,
    marginHorizontal: 16,
  },
  topbarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  topbarBreadcrumb: {
    fontSize: 11,
    color: colors.text3,
    marginTop: 2,
  },
  headerCard: {
    backgroundColor: colors.bg2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  facultyName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  period: {
    fontSize: 13,
    color: colors.text3,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  ratingLabel: {
    fontSize: 13,
    color: colors.text2,
  },
  tabsContainer: {
    backgroundColor: colors.bg2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 14,
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
  scrollView: {
    flex: 1,
    ...(Platform.OS === 'web' ? { 
      minHeight: 0,
      overflow: 'auto',
    } : {}),
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  panel: {
    backgroundColor: colors.bg2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  categoryBadge: {
    fontSize: 12,
    color: colors.text3,
    marginBottom: 16,
  },
  targetCard: {
    backgroundColor: colors.bg3,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  targetLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text2,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text2,
    marginBottom: 6,
  },
  textArea: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    opacity: 0.4,
  },
  ratingsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  ratingsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  a4Container: {
    backgroundColor: colors.bg,
    borderRadius: 8,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  a4Label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text3,
    marginBottom: 6,
  },
  a4Value: {
    alignItems: 'center',
  },
  a4Text: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accent,
  },
  infoText: {
    fontSize: 13,
    color: colors.text3,
    marginBottom: 16,
  },
  movCard: {
    marginBottom: 20,
  },
  movTargetTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  fileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fileCard: {
    backgroundColor: colors.bg3,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: 100,
  },
  fileName: {
    fontSize: 11,
    color: colors.text2,
    marginTop: 8,
    textAlign: 'center',
  },
  uploadCard: {
    backgroundColor: colors.bg3,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  uploadText: {
    fontSize: 11,
    color: colors.text3,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  finalRatingCard: {
    backgroundColor: colors.bg3,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  finalRatingLabel: {
    fontSize: 13,
    color: colors.text3,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  finalRatingValue: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.accent,
    marginBottom: 4,
  },
  adjectivalRating: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  errorText: {
    fontSize: 16,
    color: colors.text3,
    textAlign: 'center',
    marginTop: 40,
  },
});
