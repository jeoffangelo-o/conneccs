import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { StatusBar } from 'expo-status-bar';
import { SvgIcon } from '../components/SvgIcon';
import { ProgressBar } from '../../components/ProgressBar';
import { countLinkedIPCRs } from '../../utils/calculations';
import { WebScrollView } from '../components/WebScrollView';

export default function OPCRScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { opcr, ipcrs } = useData();
  const styles = createStyles(colors);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'STRATEGIC':
        return colors.accent;
      case 'CORE':
        return colors.teal;
      case 'SUPPORT':
        return colors.orange;
      default:
        return colors.text3;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <SvgIcon name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.topbarCenter}>
          <Text style={styles.topbarTitle}>OPCR</Text>
          <Text style={styles.topbarBreadcrumb}>Office Performance Commitment Review</Text>
        </View>
        <TouchableOpacity>
          <SvgIcon name="bell" size={22} color={colors.text2} />
        </TouchableOpacity>
      </View>

      <WebScrollView 
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{opcr.officeName}</Text>
          <Text style={styles.headerSubtitle}>{opcr.period}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{opcr.status}</Text>
          </View>
        </View>

        {/* Major Functions */}
        {opcr.majorFunctions.map((mf) => {
          const isExpanded = expandedSections.includes(mf.id);
          const categoryColor = getCategoryColor(mf.category);

          return (
            <View key={mf.id} style={styles.accordion}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => toggleSection(mf.id)}
              >
                <View style={styles.accordionLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
                  <View style={styles.accordionTitleContainer}>
                    <Text style={styles.accordionTitle}>{mf.title}</Text>
                    <Text style={styles.accordionSubtitle}>
                      {mf.category} • Weight: {(mf.weight * 100)}%
                    </Text>
                  </View>
                </View>
                <SvgIcon
                  name={isExpanded ? 'chevronUp' : 'chevronDown'}
                  size={20}
                  color={colors.text3}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.accordionContent}>
                  {mf.successIndicators.map((si, index) => {
                    const linkedCount = countLinkedIPCRs(si.id, ipcrs);
                    
                    return (
                      <View key={si.id} style={styles.indicatorCard}>
                        <View style={styles.indicatorHeader}>
                          <Text style={styles.indicatorCode}>{si.code}</Text>
                          <View style={styles.timelinePill}>
                            <Text style={styles.timelineText}>{si.timeline}</Text>
                          </View>
                        </View>

                        <Text style={styles.indicatorDescription}>{si.description}</Text>
                        
                        <View style={styles.measuresRow}>
                          <Text style={styles.measuresLabel}>Measures:</Text>
                          <Text style={styles.measuresText}>{si.measures}</Text>
                        </View>

                        <View style={styles.progressSection}>
                          <View style={styles.progressHeader}>
                            <Text style={styles.progressLabel}>Progress</Text>
                            <Text style={styles.progressValue}>
                              {si.actualValue} / {si.targetValue}
                            </Text>
                            <Text style={styles.progressPercent}>
                              {si.percentAccomplished}%
                            </Text>
                          </View>
                          <ProgressBar
                            percent={si.percentAccomplished}
                            color={categoryColor}
                            height={8}
                          />
                        </View>

                        <View style={styles.accountableRow}>
                          <Text style={styles.accountableLabel}>Accountable:</Text>
                          <Text style={styles.accountableText}>{si.accountableUnits}</Text>
                        </View>

                        <View style={styles.linkedRow}>
                          <SvgIcon name="link" size={16} color={colors.accent} />
                          <Text style={styles.linkedText}>
                            Linked IPCRs: {linkedCount}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </WebScrollView>
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
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    backgroundColor: colors.bg2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text3,
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.green,
  },
  accordion: {
    backgroundColor: colors.bg2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  accordionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  accordionTitleContainer: {
    flex: 1,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  accordionSubtitle: {
    fontSize: 12,
    color: colors.text3,
  },
  accordionContent: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
    gap: 12,
  },
  indicatorCard: {
    backgroundColor: colors.bg3,
    borderRadius: 8,
    padding: 14,
  },
  indicatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  indicatorCode: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
  },
  timelinePill: {
    backgroundColor: colors.bg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timelineText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text3,
  },
  indicatorDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 20,
  },
  measuresRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  measuresLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text3,
    marginRight: 6,
  },
  measuresText: {
    fontSize: 12,
    color: colors.text2,
    flex: 1,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text3,
    flex: 1,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  accountableRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  accountableLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text3,
    marginRight: 6,
  },
  accountableText: {
    fontSize: 12,
    color: colors.text2,
    flex: 1,
  },
  linkedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  linkedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
});
