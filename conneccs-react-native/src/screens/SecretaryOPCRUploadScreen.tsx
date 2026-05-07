import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { ScrollView, YStack, XStack, Text as TamaguiText } from 'tamagui';
import { useTheme } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { SvgIcon } from '../components/SvgIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useData } from '../../context/DataContext';
import * as XLSX from 'xlsx';
// Note: PDF parsing uses basic text extraction from PDF bytes (web-only)

type OPCRTarget = {
  id: string;
  kra: string;
  function: string;
  indicator: string;
  targetValue: string;
  weight: 'Strategic' | 'Core' | 'Support';
  period: string;
  accountable: string[];
  ratingDimensions: string[];
};

export default function SecretaryOPCRUploadScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { updateOPCRTargets } = useData();
  const styles = createStyles(colors);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [extractedTargets, setExtractedTargets] = useState<OPCRTarget[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileSelect = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.xlsx,.xls';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          setUploadedFile({
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            type: file.type,
            file: file,
          });
        }
      };
      input.click();
    }
  };

  const extractOPCRData = async () => {
    if (!uploadedFile) return;

    // Validate file type
    const validExtensions = ['.pdf', '.xlsx', '.xls'];
    const fileName = uploadedFile.name.toLowerCase();
    const isValidType = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidType) {
      if (Platform.OS === 'web') {
        window.alert('Invalid file type. Please upload a PDF or Excel file.');
      } else {
        Alert.alert('Invalid File', 'Please upload a PDF or Excel file.');
      }
      return;
    }

    // Strictly check if filename contains "opcr" - REQUIRED
    if (!fileName.includes('opcr')) {
      if (Platform.OS === 'web') {
        window.alert(
          'Invalid OPCR Document\n\nThis file does not appear to be an OPCR document. The filename must contain "OPCR".\n\nPlease upload a valid OPCR document.'
        );
      } else {
        Alert.alert(
          'Invalid OPCR Document',
          'This file does not appear to be an OPCR document. The filename must contain "OPCR". Please upload a valid OPCR document.',
          [{ text: 'OK' }]
        );
      }
      return;
    }

    processExtraction();
  };

  const processExtraction = async () => {
    setIsProcessing(true);

    try {
      const file = uploadedFile.file;
      const fileName = uploadedFile.name.toLowerCase();
      
      console.log('Starting extraction for file:', fileName);
      console.log('File type:', file.type);
      console.log('File size:', file.size);
      
      let extractedData: OPCRTarget[] = [];

      if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        console.log('Parsing as Excel file...');
        extractedData = await parseExcelFile(file);
      } else if (fileName.endsWith('.pdf')) {
        console.log('Parsing as PDF file...');
        extractedData = await parsePDFFile(file);
      }

      console.log('Extracted data:', extractedData);
      console.log('Number of targets extracted:', extractedData.length);

      if (extractedData.length === 0) {
        setIsProcessing(false);
        if (Platform.OS === 'web') {
          window.alert('No OPCR targets found in the document. Please check the file format.');
        } else {
          Alert.alert('No Data Found', 'No OPCR targets found in the document. Please check the file format.');
        }
        return;
      }

      setExtractedTargets(extractedData);
      setIsProcessing(false);
      
      if (Platform.OS === 'web') {
        window.alert(`Successfully extracted ${extractedData.length} OPCR targets from the document.`);
      } else {
        Alert.alert(
          'Extraction Complete',
          `Successfully extracted ${extractedData.length} OPCR targets from the document.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      setIsProcessing(false);
      console.error('Extraction error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      if (Platform.OS === 'web') {
        window.alert(`Error extracting data: ${error.message}\n\nPlease check the browser console for details.`);
      } else {
        Alert.alert('Extraction Error', `Error: ${error.message}`);
      }
    }
  };

  const parseExcelFile = async (file: File): Promise<OPCRTarget[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          console.log('FileReader loaded successfully');
          const data = e.target?.result;
          console.log('Data type:', typeof data);
          console.log('Data length:', data ? (typeof data === 'string' ? data.length : 'ArrayBuffer') : 'null');
          
          const workbook = XLSX.read(data, { type: 'binary' });
          console.log('Workbook loaded, sheets:', workbook.SheetNames);
          
          const sheetName = workbook.SheetNames[0];
          console.log('Using sheet:', sheetName);
          
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          console.log('Total rows in sheet:', jsonData.length);
          console.log('First 3 rows:', jsonData.slice(0, 3));

          const targets: OPCRTarget[] = [];
          
          // Parse the Excel data
          // Assuming format: ID | KRA | Function | Indicator | Target | Weight | Period | Accountable | Ratings
          for (let i = 1; i < jsonData.length; i++) {
            const row: any = jsonData[i];
            console.log(`Processing row ${i}:`, row);
            
            if (!row || row.length < 4) {
              console.log(`Skipping row ${i}: insufficient columns`);
              continue;
            }

            const id = row[0]?.toString().trim() || '';
            const kra = row[1]?.toString().trim() || '';
            const func = row[2]?.toString().trim() || '';
            const indicator = row[3]?.toString().trim() || '';
            const targetValue = row[4]?.toString().trim() || '';
            const weight = row[5]?.toString().trim() || 'Core';
            const period = row[6]?.toString().trim() || 'Jan-Dec';
            const accountableStr = row[7]?.toString().trim() || '';
            const accountable = accountableStr ? accountableStr.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
            const ratingsStr = row[8]?.toString().trim() || 'Q,E,T';
            const ratings = ratingsStr.split(',').map((s: string) => s.trim()).filter(Boolean);

            console.log(`Row ${i} parsed:`, { id, kra, indicator, hasData: !!(id && indicator) });

            if (id && indicator) {
              targets.push({
                id,
                kra,
                function: func,
                indicator,
                targetValue,
                weight: weight as 'Strategic' | 'Core' | 'Support',
                period,
                accountable,
                ratingDimensions: ratings.length > 0 ? ratings : ['Q', 'E', 'T'],
              });
              console.log(`Added target ${targets.length}:`, targets[targets.length - 1]);
            } else {
              console.log(`Skipping row ${i}: missing required fields (id or indicator)`);
            }
          }

          console.log('Total targets extracted:', targets.length);
          resolve(targets);
        } catch (error) {
          console.error('Error in parseExcelFile:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        console.error('FileReader error');
        reject(new Error('Failed to read file'));
      };
      
      console.log('Starting to read file as binary string...');
      reader.readAsBinaryString(file);
    });
  };

  const parsePDFFile = async (file: File): Promise<OPCRTarget[]> => {
    try {
      // For web platform, we'll use a simple text extraction approach
      // Read the PDF as text using FileReader
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Convert ArrayBuffer to text (basic extraction)
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          let text = '';
          
          // Simple text extraction from PDF bytes
          // This is a basic approach - looks for readable text in the PDF structure
          for (let i = 0; i < uint8Array.length; i++) {
            const byte = uint8Array[i];
            // Only include printable ASCII characters and common punctuation
            if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13) {
              text += String.fromCharCode(byte);
            }
          }
          
          resolve(text);
        };
        reader.onerror = () => reject(new Error('Failed to read PDF file'));
        reader.readAsArrayBuffer(file);
      });

      // Parse the extracted text to find OPCR targets
      const targets: OPCRTarget[] = [];
      const lines = text.split(/[\n\r]+/).filter(line => line.trim().length > 3);

      // Look for patterns that indicate OPCR targets
      let currentTarget: Partial<OPCRTarget> | null = null;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Look for ID pattern (e.g., "1.1.1", "2.3.4", "1.1", "2.3")
        const idMatch = line.match(/^(\d+\.\d+\.?\d*)\s+/);
        if (idMatch) {
          // Save previous target if exists
          if (currentTarget && currentTarget.id && currentTarget.indicator) {
            targets.push({
              id: currentTarget.id,
              kra: currentTarget.kra || 'Extracted from PDF',
              function: currentTarget.function || '',
              indicator: currentTarget.indicator,
              targetValue: currentTarget.targetValue || 'See document',
              weight: currentTarget.weight || 'Core',
              period: currentTarget.period || 'Jan-Dec',
              accountable: currentTarget.accountable || [],
              ratingDimensions: currentTarget.ratingDimensions || ['Q', 'E', 'T'],
            });
          }
          
          // Start new target
          currentTarget = {
            id: idMatch[1],
            kra: '',
            function: '',
            indicator: line.replace(idMatch[0], '').trim(),
            targetValue: '',
            weight: 'Core',
            period: 'Jan-Dec',
            accountable: [],
            ratingDimensions: ['Q', 'E', 'T'],
          };
        }
        
        // Look for KRA indicators
        if (line.toUpperCase().includes('KRA') || line.toUpperCase().includes('INSTRUCTION') || 
            line.toUpperCase().includes('RESEARCH') || line.toUpperCase().includes('EXTENSION') ||
            line.toUpperCase().includes('COMMUNITY')) {
          if (currentTarget) {
            currentTarget.kra = line;
          }
        }
        
        // Look for Strategic/Core/Support
        if (line.toUpperCase().includes('STRATEGIC')) {
          if (currentTarget) currentTarget.weight = 'Strategic';
        } else if (line.toUpperCase().includes('SUPPORT')) {
          if (currentTarget) currentTarget.weight = 'Support';
        }
        
        // Look for names (common Filipino surnames and first names)
        const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
        const potentialNames = line.match(namePattern);
        if (potentialNames && currentTarget) {
          // Filter to likely names (2-3 words, capitalized)
          const likelyNames = potentialNames.filter(name => {
            const words = name.split(' ');
            return words.length >= 1 && words.length <= 3 && 
                   !['KRA', 'OPCR', 'IPCR', 'Strategic', 'Core', 'Support', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].includes(name);
          });
          if (likelyNames.length > 0) {
            currentTarget.accountable = [...new Set([...(currentTarget.accountable || []), ...likelyNames])];
          }
        }
        
        // Look for percentage or numeric targets
        const targetMatch = line.match(/(\d+%|\d+\s*(?:trainings?|publications?|programs?|activities?|projects?))/i);
        if (targetMatch && currentTarget && !currentTarget.targetValue) {
          currentTarget.targetValue = targetMatch[1];
        }
        
        // Look for time periods
        const periodMatch = line.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[-\s]+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i);
        if (periodMatch && currentTarget) {
          currentTarget.period = periodMatch[0];
        }
      }
      
      // Add last target
      if (currentTarget && currentTarget.id && currentTarget.indicator) {
        targets.push({
          id: currentTarget.id,
          kra: currentTarget.kra || 'Extracted from PDF',
          function: currentTarget.function || '',
          indicator: currentTarget.indicator,
          targetValue: currentTarget.targetValue || 'See document',
          weight: currentTarget.weight || 'Core',
          period: currentTarget.period || 'Jan-Dec',
          accountable: currentTarget.accountable || [],
          ratingDimensions: currentTarget.ratingDimensions || ['Q', 'E', 'T'],
        });
      }

      // If no targets found, show helpful message
      if (targets.length === 0) {
        throw new Error('No OPCR targets found in PDF. For best results, please use Excel format (.xlsx or .xls).');
      }

      return targets;
    } catch (error) {
      console.error('PDF parsing error:', error);
      if (error instanceof Error && error.message.includes('No OPCR targets found')) {
        throw error;
      }
      throw new Error('Failed to parse PDF file. For best results, please use Excel format (.xlsx or .xls).');
    }
  };

  const handleSaveTargets = async () => {
    setIsSaving(true);
    
    try {
      // Convert extracted targets to OPCR format
      const newSuccessIndicators = extractedTargets.map((target, index) => ({
        id: `si-uploaded-${Date.now()}-${index}`,
        code: target.id,
        description: target.indicator,
        measures: target.function,
        timeline: target.period,
        targetValue: target.targetValue,
        actualValue: null,
        percentAccomplished: 0,
        accountableUnits: target.accountable.join(', '),
      }));

      // Group by weight category
      const strategicTargets = newSuccessIndicators.filter((_, i) => extractedTargets[i].weight === 'Strategic');
      const coreTargets = newSuccessIndicators.filter((_, i) => extractedTargets[i].weight === 'Core');
      const supportTargets = newSuccessIndicators.filter((_, i) => extractedTargets[i].weight === 'Support');

      // Create new major functions
      const newMajorFunctions = [];
      
      if (strategicTargets.length > 0) {
        newMajorFunctions.push({
          id: `mf-strategic-${Date.now()}`,
          title: 'Strategic Functions (Uploaded)',
          category: 'STRATEGIC',
          weight: 0.45,
          successIndicators: strategicTargets,
        });
      }
      
      if (coreTargets.length > 0) {
        newMajorFunctions.push({
          id: `mf-core-${Date.now()}`,
          title: 'Core Functions (Uploaded)',
          category: 'CORE',
          weight: 0.45,
          successIndicators: coreTargets,
        });
      }
      
      if (supportTargets.length > 0) {
        newMajorFunctions.push({
          id: `mf-support-${Date.now()}`,
          title: 'Support Functions (Uploaded)',
          category: 'SUPPORT',
          weight: 0.10,
          successIndicators: supportTargets,
        });
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem('uploaded_opcr_targets', JSON.stringify(newMajorFunctions));
      
      // Update DataContext
      await updateOPCRTargets(newMajorFunctions);

      setIsSaving(false);
      
      if (Platform.OS === 'web') {
        const confirmed = window.confirm(
          `${extractedTargets.length} OPCR targets have been saved to the system. Faculty IPCRs will be auto-generated when they log in. Click OK to return.`
        );
        if (confirmed) {
          navigation.goBack();
        }
      } else {
        Alert.alert(
          'Save Successful',
          `${extractedTargets.length} OPCR targets have been saved to the system. Faculty IPCRs will be auto-generated when they log in.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      setIsSaving(false);
      console.error('Error saving OPCR targets:', error);
      
      if (Platform.OS === 'web') {
        window.alert('Error saving OPCR targets. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to save OPCR targets. Please try again.');
      }
    }
  };

  const getWeightColor = (weight: string) => {
    switch (weight) {
      case 'Strategic': return colors.red;
      case 'Core': return colors.accent;
      case 'Support': return colors.teal;
      default: return colors.text3;
    }
  };

  return (
    <YStack f={1} bg="$bg">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Topbar */}
      <XStack bg="$bg2" borderBottomWidth={1} borderBottomColor="$border" px="$4" py="$3" pt={48} ai="center" jc="space-between">
        <XStack ai="center" gap="$3" f={1}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <SvgIcon name="arrowBack" size={24} color={colors.text} style={{}} />
          </TouchableOpacity>
          <YStack f={1}>
            <TamaguiText fontSize={18} fontWeight="700" color="$text">Upload OPCR</TamaguiText>
            <TamaguiText fontSize={11} color="$text3" mt={2}>
              Office Performance Commitment Review
            </TamaguiText>
          </YStack>
        </XStack>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <SvgIcon name="bell" size={22} color={colors.text2} style={{}} />
        </TouchableOpacity>
      </XStack>

      <ScrollView f={1} contentContainerStyle={styles.contentContainer}>
        {/* Upload Section */}
        <YStack style={styles.section}>
          <TamaguiText style={styles.sectionTitle}>Step 1: Upload OPCR Document</TamaguiText>
          <TamaguiText style={styles.sectionDescription}>
            Upload the official OPCR document (PDF or Excel format). The system will automatically extract targets and accountable persons.
          </TamaguiText>

          <TouchableOpacity 
            style={styles.uploadArea}
            onPress={handleFileSelect}
          >
            <SvgIcon name="document" size={48} color={colors.accent} style={{}} />
            <TamaguiText style={styles.uploadText}>
              {uploadedFile ? uploadedFile.name : 'Click to select OPCR file'}
            </TamaguiText>
            {uploadedFile && (
              <TamaguiText style={styles.uploadSize}>{uploadedFile.size}</TamaguiText>
            )}
            <TamaguiText style={styles.uploadHint}>
              Supported formats: PDF, Excel (.xlsx, .xls)
            </TamaguiText>
          </TouchableOpacity>

          {uploadedFile && !isProcessing && extractedTargets.length === 0 && (
            <TouchableOpacity 
              style={styles.extractBtn}
              onPress={extractOPCRData}
            >
              <SvgIcon name="settings" size={20} color="#fff" style={{}} />
              <TamaguiText style={styles.extractBtnText}>Extract OPCR Data</TamaguiText>
            </TouchableOpacity>
          )}

          {isProcessing && (
            <YStack style={styles.processingCard}>
              <TamaguiText style={styles.processingText}>Processing document...</TamaguiText>
              <TamaguiText style={styles.processingSubtext}>
                Extracting targets, KRAs, and accountable persons
              </TamaguiText>
            </YStack>
          )}
        </YStack>

        {/* Extracted Data Section - Always visible */}
        <YStack style={styles.section}>
          <XStack style={styles.sectionHeader}>
            <TamaguiText style={styles.sectionTitle}>
              Step 2: Review Extracted Targets ({extractedTargets.length})
            </TamaguiText>
            {extractedTargets.length > 0 && (
              <TouchableOpacity 
                style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
                onPress={handleSaveTargets}
                disabled={isSaving}
              >
                <SvgIcon name="checkCircle" size={18} color="#fff" style={{}} />
                <TamaguiText style={styles.saveBtnText}>
                  {isSaving ? 'Saving...' : 'Save to System'}
                </TamaguiText>
              </TouchableOpacity>
            )}
          </XStack>

          {/* Summary Cards - Always visible */}
          <XStack style={styles.summaryGrid}>
            <YStack style={styles.summaryCard}>
              <YStack style={styles.summaryIcon}>
                <SvgIcon name="document" size={24} color={colors.accent} style={{}} />
              </YStack>
              <TamaguiText style={styles.summaryValue}>{extractedTargets.length}</TamaguiText>
              <TamaguiText style={styles.summaryLabel}>Total Targets</TamaguiText>
            </YStack>

            <YStack style={styles.summaryCard}>
              <YStack style={[styles.summaryIcon, { backgroundColor: `${colors.red}20` }]}>
                <SvgIcon name="star" size={24} color={colors.red} style={{}} />
              </YStack>
              <TamaguiText style={styles.summaryValue}>
                {extractedTargets.filter(t => t.weight === 'Strategic').length}
              </TamaguiText>
              <TamaguiText style={styles.summaryLabel}>Strategic</TamaguiText>
            </YStack>

            <YStack style={styles.summaryCard}>
              <YStack style={[styles.summaryIcon, { backgroundColor: `${colors.accent}20` }]}>
                <SvgIcon name="briefcase" size={24} color={colors.accent} style={{}} />
              </YStack>
              <TamaguiText style={styles.summaryValue}>
                {extractedTargets.filter(t => t.weight === 'Core').length}
              </TamaguiText>
              <TamaguiText style={styles.summaryLabel}>Core</TamaguiText>
            </YStack>

            <YStack style={styles.summaryCard}>
              <YStack style={[styles.summaryIcon, { backgroundColor: `${colors.teal}20` }]}>
                <SvgIcon name="settings" size={24} color={colors.teal} style={{}} />
              </YStack>
              <TamaguiText style={styles.summaryValue}>
                {extractedTargets.filter(t => t.weight === 'Support').length}
              </TamaguiText>
              <TamaguiText style={styles.summaryLabel}>Support</TamaguiText>
            </YStack>

            <YStack style={styles.summaryCard}>
              <YStack style={[styles.summaryIcon, { backgroundColor: `${colors.green}20` }]}>
                <SvgIcon name="people" size={24} color={colors.green} style={{}} />
              </YStack>
              <TamaguiText style={styles.summaryValue}>
                {extractedTargets.length > 0 ? [...new Set(extractedTargets.flatMap(t => t.accountable))].length : 0}
              </TamaguiText>
              <TamaguiText style={styles.summaryLabel}>Unique Faculty</TamaguiText>
            </YStack>

            <YStack style={styles.summaryCard}>
              <YStack style={[styles.summaryIcon, { backgroundColor: `${colors.blue}20` }]}>
                <SvgIcon name="calendar" size={24} color={colors.blue} style={{}} />
              </YStack>
              <TamaguiText style={styles.summaryValue}>
                {extractedTargets.length > 0 ? [...new Set(extractedTargets.map(t => t.period))].length : 0}
              </TamaguiText>
              <TamaguiText style={styles.summaryLabel}>Time Periods</TamaguiText>
            </YStack>
          </XStack>

          {extractedTargets.length > 0 && (
            <>
              <XStack style={styles.infoCard}>
                <SvgIcon name="alertCircle" size={20} color={colors.accent} style={{}} />
                <YStack style={styles.infoContent}>
                  <TamaguiText style={styles.infoTitle}>Auto-Generation Ready</TamaguiText>
                  <TamaguiText style={styles.infoText}>
                    Once saved, the system will automatically generate individual IPCRs for each faculty member based on their names in the "Accountable" column.
                  </TamaguiText>
                </YStack>
              </XStack>

              {extractedTargets.map((target, index) => (
                <YStack key={index} style={styles.targetCard}>
                  <XStack style={styles.targetHeader}>
                    <YStack style={styles.targetId}>
                      <TamaguiText style={styles.targetIdText}>{target.id}</TamaguiText>
                    </YStack>
                    <YStack style={[styles.weightBadge, { backgroundColor: `${getWeightColor(target.weight)}20` }]}>
                      <TamaguiText style={[styles.weightText, { color: getWeightColor(target.weight) }]}>
                        {target.weight}
                      </TamaguiText>
                    </YStack>
                  </XStack>

                  <TamaguiText style={styles.targetKRA}>{target.kra}</TamaguiText>
                  <TamaguiText style={styles.targetFunction}>{target.function}</TamaguiText>
                  <TamaguiText style={styles.targetIndicator}>{target.indicator}</TamaguiText>

                  <XStack style={styles.targetMeta}>
                    <XStack style={styles.metaItem}>
                      <TamaguiText style={styles.metaLabel}>Target:</TamaguiText>
                      <TamaguiText style={styles.metaValue}>{target.targetValue}</TamaguiText>
                    </XStack>
                    <XStack style={styles.metaItem}>
                      <TamaguiText style={styles.metaLabel}>Period:</TamaguiText>
                      <TamaguiText style={styles.metaValue}>{target.period}</TamaguiText>
                    </XStack>
                    <XStack style={styles.metaItem}>
                      <TamaguiText style={styles.metaLabel}>Ratings:</TamaguiText>
                      <TamaguiText style={styles.metaValue}>{target.ratingDimensions.join(', ')}</TamaguiText>
                    </XStack>
                  </XStack>

                  <YStack style={styles.accountableSection}>
                    <TamaguiText style={styles.accountableLabel}>
                      Accountable ({target.accountable.length}):
                    </TamaguiText>
                    <XStack style={styles.accountableList}>
                      {target.accountable.map((person, idx) => (
                        <YStack key={idx} style={styles.accountableBadge}>
                          <TamaguiText style={styles.accountableName}>{person}</TamaguiText>
                        </YStack>
                      ))}
                    </XStack>
                  </YStack>
                </YStack>
              ))}
            </>
          )}

          {extractedTargets.length === 0 && (
            <YStack style={styles.emptyState}>
              <SvgIcon name="document" size={64} color={colors.text3} style={{}} />
              <TamaguiText style={styles.emptyStateText}>No targets extracted yet</TamaguiText>
              <TamaguiText style={styles.emptyStateSubtext}>
                Upload and extract an OPCR document to see the targets here
              </TamaguiText>
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.text2,
    lineHeight: 20,
    marginBottom: 20,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    backgroundColor: colors.bg2,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  uploadSize: {
    fontSize: 13,
    color: colors.text3,
    marginTop: 4,
  },
  uploadHint: {
    fontSize: 12,
    color: colors.text3,
    marginTop: 12,
  },
  extractBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  extractBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  processingCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  processingText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  processingSubtext: {
    fontSize: 13,
    color: colors.text3,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.green,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.accent}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text3,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: `${colors.accent}10`,
    borderWidth: 1,
    borderColor: `${colors.accent}30`,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: colors.text2,
    lineHeight: 18,
  },
  targetCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  targetId: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  targetIdText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  weightBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  weightText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  targetKRA: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  targetFunction: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  targetIndicator: {
    fontSize: 13,
    color: colors.text2,
    lineHeight: 18,
    marginBottom: 12,
  },
  targetMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    gap: 6,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text3,
  },
  metaValue: {
    fontSize: 12,
    color: colors.text,
  },
  accountableSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  accountableLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text3,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  accountableList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accountableBadge: {
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  accountableName: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.text2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text2,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: colors.text3,
    textAlign: 'center',
    lineHeight: 18,
  },
});
