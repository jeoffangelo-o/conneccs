import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBar } from 'expo-status-bar';
import { SvgIcon } from '../components/SvgIcon';
import { IPCR, IPCRMajorFunction, IPCRTarget } from '../../types';

type Period = 'Jan-Jun' | 'Jul-Dec' | 'Jan-Dec';

export default function CreateIPCRScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { opcr, ipcrs, addIPCR } = useData();
  const styles = createStyles(colors);
  
  const [step, setStep] = useState(1);
  const [period, setPeriod] = useState<Period>('Jan-Jun');
  const [selectedMajorFunction, setSelectedMajorFunction] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [targetDescription, setTargetDescription] = useState('');
  const [targetMeasures, setTargetMeasures] = useState('');

  const periods: Period[] = ['Jan-Jun', 'Jul-Dec', 'Jan-Dec'];

  // Check for duplicate active IPCR
  const hasDuplicateIPCR = () => {
    return ipcrs.some(
      ipcr =>
        ipcr.facultyId === user?.id &&
        ipcr.period === `${period} 2025` &&
        ipcr.status !== 'COMPLETED'
    );
  };

  const handleNext = () => {
    if (step === 1) {
      if (hasDuplicateIPCR()) {
        Alert.alert('Error', 'You already have an active IPCR for this period.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedMajorFunction) {
        Alert.alert('Error', 'Please select a major function');
        return;
      }
      if (!selectedIndicator) {
        Alert.alert('Error', 'Please select a success indicator');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!targetDescription || !targetMeasures) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      setStep(4);
    }
  };

  const handleSubmit = () => {
    const mf = opcr.majorFunctions.find(m => m.id === selectedMajorFunction);
    if (!mf) return;

    const newTarget: IPCRTarget = {
      id: `it-${Date.now()}`,
      parentOpIndicatorId: selectedIndicator,
      description: targetDescription,
      measures: targetMeasures,
      q1Rating: null,
      e2Rating: null,
      t3Rating: null,
      a4Rating: null,
      actualAccomplishments: '',
      remarks: '',
      movFileUrls: [],
    };

    const newMajorFunction: IPCRMajorFunction = {
      id: `imf-${Date.now()}`,
      title: mf.title,
      category: mf.category,
      weight: mf.weight,
      targets: [newTarget],
    };

    const newIPCR: IPCR = {
      id: `ipcr-${Date.now()}`,
      year: 2026,
      period: `${period} 2025`,
      facultyId: user!.id,
      notedByChairId: null,
      verifiedByVpaa: null,
      approvedByDeanId: null,
      status: 'IN_PROGRESS',
      currentPhase: 'TARGET_SETTING',
      finalRating: null,
      adjectivalRating: null,
      majorFunctions: [newMajorFunction],
    };

    addIPCR(newIPCR);
    Alert.alert('Success', 'IPCR created successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const selectedMF = opcr.majorFunctions.find(m => m.id === selectedMajorFunction);
  const selectedSI = selectedMF?.successIndicators.find(si => si.id === selectedIndicator);

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <SvgIcon name="arrowBack" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.topbarCenter}>
          <Text style={styles.topbarTitle}>Create New IPCR</Text>
          <Text style={styles.topbarBreadcrumb}>Step {step} of 4</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4].map((s) => (
          <View
            key={s}
            style={[
              styles.progressDot,
              s <= step && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Select Period */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select Rating Period</Text>
            <Text style={styles.stepSubtitle}>
              Choose the period for this IPCR
            </Text>

            <View style={styles.periodGrid}>
              {periods.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.periodCard,
                    period === p && styles.periodCardActive,
                  ]}
                  onPress={() => setPeriod(p)}
                >
                  <Text
                    style={[
                      styles.periodText,
                      period === p && styles.periodTextActive,
                    ]}
                  >
                    {p} 2025
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Select OPCR Parent Target */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Select OPCR Parent Target</Text>
            <Text style={styles.stepSubtitle}>
              Link your IPCR to an office-level target
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Major Function</Text>
              {opcr.majorFunctions.map((mf) => (
                <TouchableOpacity
                  key={mf.id}
                  style={[
                    styles.selectCard,
                    selectedMajorFunction === mf.id && styles.selectCardActive,
                  ]}
                  onPress={() => {
                    setSelectedMajorFunction(mf.id);
                    setSelectedIndicator('');
                  }}
                >
                  <Text style={styles.selectTitle}>{mf.title}</Text>
                  <Text style={styles.selectSubtitle}>
                    {mf.category} • {(mf.weight * 100)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedMF && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Success Indicator</Text>
                {selectedMF.successIndicators.map((si) => (
                  <TouchableOpacity
                    key={si.id}
                    style={[
                      styles.selectCard,
                      selectedIndicator === si.id && styles.selectCardActive,
                    ]}
                    onPress={() => setSelectedIndicator(si.id)}
                  >
                    <Text style={styles.selectCode}>{si.code}</Text>
                    <Text style={styles.selectDescription}>{si.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Step 3: Enter Target Details */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Enter Target Details</Text>
            <Text style={styles.stepSubtitle}>
              Describe your individual target and measures
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Target Description *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe what you will accomplish..."
                placeholderTextColor={colors.text3}
                value={targetDescription}
                onChangeText={setTargetDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Measures *</Text>
              <TextInput
                style={styles.textArea}
                placeholder="How will success be measured..."
                placeholderTextColor={colors.text3}
                value={targetMeasures}
                onChangeText={setTargetMeasures}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Review & Submit</Text>
            <Text style={styles.stepSubtitle}>
              Please review your IPCR details before submitting
            </Text>

            <View style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Period:</Text>
                <Text style={styles.reviewValue}>{period} 2025</Text>
              </View>

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Major Function:</Text>
                <Text style={styles.reviewValue}>{selectedMF?.title}</Text>
              </View>

              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Success Indicator:</Text>
                <Text style={styles.reviewValue}>
                  {selectedSI?.code} - {selectedSI?.description}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.reviewSection}>
                <Text style={styles.reviewSectionTitle}>Target Description</Text>
                <Text style={styles.reviewText}>{targetDescription}</Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.reviewSectionTitle}>Measures</Text>
                <Text style={styles.reviewText}>{targetMeasures}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.btnSecondaryText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.btnPrimary, step === 1 && { flex: 1 }]}
          onPress={step === 4 ? handleSubmit : handleNext}
        >
          <Text style={styles.btnPrimaryText}>
            {step === 4 ? 'Submit IPCR' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: colors.bg2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressDot: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  progressDotActive: {
    backgroundColor: colors.accent,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: colors.text3,
    marginBottom: 24,
  },
  periodGrid: {
    gap: 12,
  },
  periodCard: {
    backgroundColor: colors.bg2,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  periodCardActive: {
    borderColor: colors.accent,
    backgroundColor: `${colors.accent}15`,
  },
  periodText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text2,
  },
  periodTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text2,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectCard: {
    backgroundColor: colors.bg2,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectCardActive: {
    borderColor: colors.accent,
    backgroundColor: `${colors.accent}10`,
  },
  selectTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  selectSubtitle: {
    fontSize: 12,
    color: colors.text3,
  },
  selectCode: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 6,
  },
  selectDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  textArea: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  reviewCard: {
    backgroundColor: colors.bg2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  reviewRow: {
    marginBottom: 12,
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text3,
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 14,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  reviewSection: {
    marginBottom: 16,
  },
  reviewSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text2,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: colors.bg2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
