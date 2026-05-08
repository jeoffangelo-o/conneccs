import React, { useState } from 'react';
import { Platform } from 'react-native';
import { YStack, XStack, ScrollView, Text as TamaguiText } from 'tamagui';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { StatusBar } from 'expo-status-bar';
import { SvgIcon } from '../components/SvgIcon';
import { ProgressBar } from '../../components/ProgressBar';
import { countLinkedIPCRs } from '../../utils/calculations';

export default function OPCRScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { opcr, ipcrs } = useData();
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
    <YStack f={1} bg="$bg">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Topbar */}
      <XStack
        bg="$bg2"
        bw={1}
        bbc="$border"
        px="$4"
        py="$3"
        pt={48}
        ai="center"
      >
        <XStack
          pressStyle={{ opacity: 0.7 }}
          onPress={() => navigation.openDrawer()}
          cursor="pointer"
        >
          <SvgIcon name="menu" size={24} color={colors.text} />
        </XStack>
        <YStack f={1} mx="$4">
          <TamaguiText fontSize={17} fontWeight="700" color="$text">
            OPCR
          </TamaguiText>
          <TamaguiText fontSize={11} color="$text3" mt={2}>
            Office Performance Commitment Review
          </TamaguiText>
        </YStack>
        <XStack pressStyle={{ opacity: 0.7 }} cursor="pointer">
          <SvgIcon name="bell" size={22} color={colors.text2} />
        </XStack>
      </XStack>

      <ScrollView
        f={1}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <YStack
          bg="$bg2"
          br="$4"
          bw={1}
          bc="$border"
          p="$5"
          mb="$5"
        >
          <TamaguiText fontSize={20} fontWeight="800" color="$text" mb="$1">
            {opcr.officeName}
          </TamaguiText>
          <TamaguiText fontSize={14} color="$text3" mb="$3">
            {opcr.period}
          </TamaguiText>
          <XStack
            bg="rgba(16, 185, 129, 0.15)"
            px="$3"
            py="$2"
            br="$3"
            alignSelf="flex-start"
          >
            <TamaguiText fontSize={12} fontWeight="600" color="$green">
              {opcr.status}
            </TamaguiText>
          </XStack>
        </YStack>

        {/* Major Functions */}
        {opcr.majorFunctions.map((mf) => {
          const isExpanded = expandedSections.includes(mf.id);
          const categoryColor = getCategoryColor(mf.category);

          return (
            <YStack
              key={mf.id}
              bg="$bg2"
              br="$4"
              bw={1}
              bc="$border"
              mb="$3"
              overflow="hidden"
            >
              {/* Accordion Header */}
              <XStack
                p="$4"
                ai="center"
                jc="space-between"
                pressStyle={{ opacity: 0.7 }}
                onPress={() => toggleSection(mf.id)}
                cursor="pointer"
              >
                <XStack f={1} ai="center" gap="$3">
                  <YStack
                    w={12}
                    h={12}
                    br={6}
                    backgroundColor={categoryColor}
                  />
                  <YStack f={1}>
                    <TamaguiText fontSize={15} fontWeight="600" color="$text" mb={2}>
                      {mf.title}
                    </TamaguiText>
                    <TamaguiText fontSize={12} color="$text3">
                      {mf.category} • Weight: {(mf.weight * 100)}%
                    </TamaguiText>
                  </YStack>
                </XStack>
                <SvgIcon
                  name={isExpanded ? 'chevronUp' : 'chevronDown'}
                  size={20}
                  color={colors.text3}
                />
              </XStack>

              {/* Accordion Content */}
              {isExpanded && (
                <YStack
                  btw={1}
                  btc="$border"
                  p="$4"
                  gap="$3"
                  bg="$bg2"
                >
                  {mf.successIndicators.map((si, index) => {
                    const linkedCount = countLinkedIPCRs(si.id, ipcrs);
                    
                    return (
                      <YStack
                        key={si.id}
                        bg="$bg3"
                        br="$3"
                        p="$3.5"
                      >
                        {/* Indicator Header */}
                        <XStack jc="space-between" ai="center" mb="$2">
                          <TamaguiText
                            fontSize={12}
                            fontWeight="700"
                            color="$accent"
                            textTransform="uppercase"
                          >
                            {si.code}
                          </TamaguiText>
                          <XStack
                            bg="$bg"
                            px="$2.5"
                            py="$1"
                            br="$3"
                          >
                            <TamaguiText fontSize={11} fontWeight="600" color="$text3">
                              {si.timeline}
                            </TamaguiText>
                          </XStack>
                        </XStack>

                        <TamaguiText fontSize={14} color="$text" mb="$2.5" lineHeight={20}>
                          {si.description}
                        </TamaguiText>
                        
                        {/* Measures */}
                        <XStack mb="$3">
                          <TamaguiText fontSize={12} fontWeight="600" color="$text3" mr="$2">
                            Measures:
                          </TamaguiText>
                          <TamaguiText fontSize={12} color="$text2" f={1}>
                            {si.measures}
                          </TamaguiText>
                        </XStack>

                        {/* Progress */}
                        <YStack mb="$3">
                          <XStack jc="space-between" ai="center" mb="$2">
                            <TamaguiText fontSize={12} fontWeight="600" color="$text3" f={1}>
                              Progress
                            </TamaguiText>
                            <TamaguiText fontSize={12} fontWeight="600" color="$text" mr="$2">
                              {si.actualValue} / {si.targetValue}
                            </TamaguiText>
                            <TamaguiText fontSize={14} fontWeight="700" color="$accent">
                              {si.percentAccomplished}%
                            </TamaguiText>
                          </XStack>
                          <ProgressBar
                            percent={si.percentAccomplished}
                            color={categoryColor}
                            height={8}
                          />
                        </YStack>

                        {/* Accountable */}
                        <XStack mb="$2">
                          <TamaguiText fontSize={12} fontWeight="600" color="$text3" mr="$2">
                            Accountable:
                          </TamaguiText>
                          <TamaguiText fontSize={12} color="$text2" f={1}>
                            {si.accountableUnits}
                          </TamaguiText>
                        </XStack>

                        {/* Linked IPCRs */}
                        <XStack
                          ai="center"
                          gap="$2"
                          pt="$2"
                          btw={1}
                          btc="$border"
                        >
                          <SvgIcon name="link" size={16} color={colors.accent} />
                          <TamaguiText fontSize={12} fontWeight="600" color="$accent">
                            Linked IPCRs: {linkedCount}
                          </TamaguiText>
                        </XStack>
                      </YStack>
                    );
                  })}
                </YStack>
              )}
            </YStack>
          );
        })}
      </ScrollView>
    </YStack>
  );
}
