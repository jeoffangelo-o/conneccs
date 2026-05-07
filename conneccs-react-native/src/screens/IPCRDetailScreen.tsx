import React, { useState, useMemo } from 'react';
import { TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { ScrollView, YStack, XStack, Text as TamaguiText } from 'tamagui';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { StatusBar } from 'expo-status-bar';
import { SvgIcon } from '../components/SvgIcon';
import { StatusBadge } from '../../components/StatusBadge';
import { RatingInput } from '../../components/RatingInput';
import { calculateA4, calculateFinalRating } from '../../utils/calculations';
import usersData from '../../assets/data/users.json';
import { User } from '../../types';

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
      <YStack f={1} bg="$bg" ai="center" jc="center">
        <TamaguiText color="$text3" fontSize={16}>IPCR not found</TamaguiText>
      </YStack>
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
    <YStack>
      {ipcr.majorFunctions.map((mf) => (
        <YStack key={mf.id} style={styles.panel}>
          <TamaguiText style={styles.panelTitle}>{mf.title}</TamaguiText>
          <TamaguiText style={styles.categoryBadge}>{mf.category} ({(mf.weight * 100)}%)</TamaguiText>
          
          {mf.targets.map((target, tIndex) => (
            <YStack key={target.id} style={styles.targetCard}>
              <TamaguiText style={styles.targetLabel}>Target {tIndex + 1}</TamaguiText>
              
              <YStack style={styles.formGroup}>
                <TamaguiText style={styles.label}>Description</TamaguiText>
                <TextInput
                  style={[styles.textArea, !isTargetSettingPhase && styles.inputDisabled]}
                  value={target.description}
                  editable={isTargetSettingPhase}
                  multiline
                />
              </YStack>

              <YStack style={styles.formGroup}>
                <TamaguiText style={styles.label}>Measures</TamaguiText>
                <TextInput
                  style={[styles.textArea, !isTargetSettingPhase && styles.inputDisabled]}
                  value={target.measures}
                  editable={isTargetSettingPhase}
                  multiline
                />
              </YStack>

              <TamaguiText style={styles.ratingsLabel}>Ratings</TamaguiText>
              <XStack gap="$3" mb="$3">
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
              </XStack>

              <YStack style={styles.a4Container}>
                <TamaguiText style={styles.a4Label}>A4 - Average (Auto-calculated)</TamaguiText>
                <YStack ai="center">
                  <TamaguiText style={styles.a4Text}>
                    {target.a4Rating !== null ? target.a4Rating.toFixed(2) : '--'}
                  </TamaguiText>
                </YStack>
              </YStack>
            </YStack>
          ))}
        </YStack>
      ))}
    </YStack>
  );

  const renderAccomplishmentsTab = () => (
    <YStack>
      {ipcr.majorFunctions.map((mf) => (
        <YStack key={mf.id} style={styles.panel}>
          <TamaguiText style={styles.panelTitle}>{mf.title}</TamaguiText>
          
          {mf.targets.map((target, tIndex) => (
            <YStack key={target.id} style={styles.targetCard}>
              <TamaguiText style={styles.targetLabel}>Target {tIndex + 1}: {target.description}</TamaguiText>
              
              <YStack style={styles.formGroup}>
                <TamaguiText style={styles.label}>Actual Accomplishments</TamaguiText>
                <TextInput
                  style={styles.textArea}
                  value={target.actualAccomplishments}
                  placeholder="Describe what was accomplished..."
                  placeholderTextColor={colors.text3}
                  multiline
                  numberOfLines={4}
                />
              </YStack>

              <YStack style={styles.formGroup}>
                <TamaguiText style={styles.label}>Remarks</TamaguiText>
                <TextInput
                  style={styles.textArea}
                  value={target.remarks}
                  placeholder="Additional remarks..."
                  placeholderTextColor={colors.text3}
                  multiline
                  numberOfLines={3}
                />
              </YStack>
            </YStack>
          ))}
        </YStack>
      ))}
    </YStack>
  );

  const renderMOVTab = () => (
    <YStack style={styles.panel}>
      <TamaguiText style={styles.panelTitle}>Means of Verification (MOV)</TamaguiText>
      <TamaguiText style={styles.infoText}>
        Upload supporting documents for your accomplishments
      </TamaguiText>

      {ipcr.majorFunctions.map((mf) =>
        mf.targets.map((target, tIndex) => (
          <YStack key={target.id} mb={20}>
            <TamaguiText style={styles.movTargetTitle}>
              {mf.title} - Target {tIndex + 1}
            </TamaguiText>
            
            <XStack flexWrap="wrap" gap="$3">
              {target.movFileUrls.map((file, fIndex) => (
                <YStack key={fIndex} style={styles.fileCard}>
                  <SvgIcon name="document" size={32} color={colors.accent} style={{}} />
                  <TamaguiText style={styles.fileName}>{file}</TamaguiText>
                </YStack>
              ))}
              
              <TouchableOpacity style={styles.uploadCard}>
                <SvgIcon name="plus" size={24} color={colors.text3} style={{}} />
                <TamaguiText style={styles.uploadText}>Upload MOV</TamaguiText>
              </TouchableOpacity>
            </XStack>
          </YStack>
        ))
      )}
    </YStack>
  );

  const renderRatingSummaryTab = () => (
    <YStack>
      <YStack style={styles.panel}>
        <TamaguiText style={styles.panelTitle}>Rating Breakdown</TamaguiText>
        
        <XStack jc="space-between" py="$2">
          <TamaguiText style={styles.summaryLabel}>Strategic Priority Average:</TamaguiText>
          <TamaguiText style={styles.summaryValue}>{ratingCalc.strategicAvg.toFixed(2)}</TamaguiText>
        </XStack>
        <XStack jc="space-between" py="$2">
          <TamaguiText style={styles.summaryLabel}>Strategic Weighted (45%):</TamaguiText>
          <TamaguiText style={styles.summaryValue}>{ratingCalc.strategicWeighted.toFixed(2)}</TamaguiText>
        </XStack>

        <YStack h={1} bg="$border" my="$3" />

        <XStack jc="space-between" py="$2">
          <TamaguiText style={styles.summaryLabel}>Core Functions Average:</TamaguiText>
          <TamaguiText style={styles.summaryValue}>{ratingCalc.coreAvg.toFixed(2)}</TamaguiText>
        </XStack>
        <XStack jc="space-between" py="$2">
          <TamaguiText style={styles.summaryLabel}>Core Weighted (45%):</TamaguiText>
          <TamaguiText style={styles.summaryValue}>{ratingCalc.coreWeighted.toFixed(2)}</TamaguiText>
        </XStack>

        <YStack h={1} bg="$border" my="$3" />

        <XStack jc="space-between" py="$2">
          <TamaguiText style={styles.summaryLabel}>Support Functions Average:</TamaguiText>
          <TamaguiText style={styles.summaryValue}>{ratingCalc.supportAvg.toFixed(2)}</TamaguiText>
        </XStack>
        <XStack jc="space-between" py="$2">
          <TamaguiText style={styles.summaryLabel}>Support Weighted (10%):</TamaguiText>
          <TamaguiText style={styles.summaryValue}>{ratingCalc.supportWeighted.toFixed(2)}</TamaguiText>
        </XStack>

        <YStack h={1} bg="$border" my="$3" />

        <YStack style={styles.finalRatingCard}>
          <TamaguiText style={styles.finalRatingLabel}>Final Average Rating</TamaguiText>
          <TamaguiText style={styles.finalRatingValue}>{ratingCalc.final.toFixed(2)}</TamaguiText>
          <TamaguiText style={styles.adjectivalRating}>{ratingCalc.adjectival}</TamaguiText>
        </YStack>
      </YStack>
    </YStack>
  );

  return (
    <YStack f={1} bg="$bg">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Fixed Topbar */}
      <XStack bg="$bg2" borderBottomWidth={1} borderBottomColor="$border" px="$4" py="$3" pt={48} ai="center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <SvgIcon name="arrowBack" size={24} color={colors.text} style={{}} />
        </TouchableOpacity>
        <YStack f={1} mx="$4">
          <TamaguiText fontSize={17} fontWeight="700" color="$text">IPCR Detail</TamaguiText>
          <TamaguiText fontSize={11} color="$text3" mt={2}>
            {faculty.firstName} {faculty.lastName} • {ipcr.period}
          </TamaguiText>
        </YStack>
        <TouchableOpacity>
          <SvgIcon name="moreVertical" size={22} color={colors.text2} style={{}} />
        </TouchableOpacity>
      </XStack>

      {/* Fixed Header Card */}
      <YStack bg="$bg2" borderBottomWidth={1} borderBottomColor="$border" p="$4">
        <XStack jc="space-between" ai="flex-start" mb="$3">
          <YStack>
            <TamaguiText fontSize={18} fontWeight="700" color="$text">
              {faculty.firstName} {faculty.lastName}
            </TamaguiText>
            <TamaguiText fontSize={13} color="$text3" mt={2}>{ipcr.period}</TamaguiText>
          </YStack>
          <StatusBadge status={ipcr.status} />
        </XStack>
        {ipcr.finalRating && (
          <XStack ai="center" gap="$2">
            <SvgIcon name="star" size={20} color="#f59e0b" style={{}} />
            <TamaguiText fontSize={20} fontWeight="800" color="$text">{ipcr.finalRating.toFixed(1)}</TamaguiText>
            <TamaguiText fontSize={13} color="$text2">{ipcr.adjectivalRating}</TamaguiText>
          </XStack>
        )}
      </YStack>

      {/* Fixed Tabs */}
      <YStack bg="$bg2" borderBottomWidth={1} borderBottomColor="$border">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <TamaguiText style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab}
                </TamaguiText>
              </TouchableOpacity>
            ))}
          </XStack>
        </ScrollView>
      </YStack>

      {/* Scrollable Content - Tamagui ScrollView with proper web support */}
      <ScrollView f={1}>
        <YStack p="$4" pb="$8">
          {activeTab === 'Targets' && renderTargetsTab()}
          {activeTab === 'Accomplishments' && renderAccomplishmentsTab()}
          {activeTab === 'MOV' && renderMOVTab()}
          {activeTab === 'Rating Summary' && renderRatingSummaryTab()}
        </YStack>
      </ScrollView>
    </YStack>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
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
  movTargetTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
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
  summaryLabel: {
    fontSize: 14,
    color: colors.text2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
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
});
