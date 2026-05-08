import React, { useState, useEffect } from 'react';
import { Platform, Alert, TextInput as RNTextInput, Modal, TouchableOpacity } from 'react-native';
import { YStack, XStack, ScrollView, Text as TamaguiText, Input } from 'tamagui';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBar } from 'expo-status-bar';
import { SvgIcon } from '../components/SvgIcon';
import { calculateFinalRating, calculateA4, isValidRating } from '../../utils/calculations';
import { IPCR, IPCRTarget } from '../../types';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyIPCRScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { ipcrs, updateIPCR, deleteIPCR, generateIPCRForFaculty } = useData();
  const [myIPCR, setMyIPCR] = useState<IPCR | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [editingTarget, setEditingTarget] = useState<string | null>(null);
  const [showRatingGuide, setShowRatingGuide] = useState(false);
  const [showImageChoice, setShowImageChoice] = useState(false);
  const [currentTargetId, setCurrentTargetId] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [ratingInputs, setRatingInputs] = useState<{
    q1: string;
    e2: string;
    t3: string;
    accomplishments: string;
  }>({
    q1: '',
    e2: '',
    t3: '',
    accomplishments: '',
  });

  const handleRegenerateIPCR = async () => {
    if (!user) return;
    
    Alert.alert(
      'Regenerate IPCR',
      'This will refresh your IPCR with the latest targets from OPCR. Any unsaved ratings will be lost. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Regenerate',
          style: 'destructive',
          onPress: async () => {
            setIsRegenerating(true);
            try {
              console.log('=== Starting IPCR Regeneration ===');
              
              // Step 1: Delete ALL IPCRs for this user from state
              const userIPCRs = ipcrs.filter(ipcr => ipcr.facultyId === user.id);
              console.log(`Found ${userIPCRs.length} IPCRs for user ${user.id}`);
              
              userIPCRs.forEach(ipcr => {
                console.log('Deleting IPCR:', ipcr.id);
                deleteIPCR(ipcr.id);
              });
              
              setMyIPCR(null);
              
              // Step 2: Clear AsyncStorage to remove cached IPCRs
              console.log('Clearing AsyncStorage...');
              await AsyncStorage.removeItem('ipcrs');
              
              // Step 3: Wait for state to update
              await new Promise(resolve => setTimeout(resolve, 500));
              
              console.log('Generating new IPCR for user:', user.id);
              
              // Step 4: Generate fresh IPCR
              const newIPCR = await generateIPCRForFaculty(user.id);
              
              console.log('New IPCR generated:', newIPCR?.id);
              
              if (newIPCR) {
                setMyIPCR(newIPCR);
                const targetCount = newIPCR.majorFunctions?.reduce((sum: number, mf: any) => sum + (mf.targets?.length || 0), 0) || 0;
                console.log('Total targets in new IPCR:', targetCount);
                Alert.alert('Success', `IPCR regenerated with ${targetCount} targets!`);
              } else {
                Alert.alert('No Targets', 'No targets found for you in the current OPCR.');
              }
            } catch (error) {
              console.error('Regeneration error:', error);
              Alert.alert('Error', 'Failed to regenerate IPCR');
            } finally {
              setIsRegenerating(false);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    // Find the IPCR for the current user
    if (user && ipcrs && user.lastName) {
      const userIPCR = ipcrs.find(ipcr => 
        ipcr.facultyName && ipcr.facultyName.toLowerCase().includes(user.lastName.toLowerCase())
      );
      
      // Only set IPCR if it has majorFunctions with targets
      if (userIPCR && userIPCR.majorFunctions && userIPCR.majorFunctions.length > 0) {
        const hasTargets = userIPCR.majorFunctions.some(mf => mf.targets && mf.targets.length > 0);
        if (hasTargets) {
          setMyIPCR(userIPCR);
        } else {
          setMyIPCR(null); // Empty IPCR, show empty state
        }
      } else {
        setMyIPCR(null); // No valid IPCR, show empty state
      }
    }
  }, [user, ipcrs]);

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

  const handleEditRating = (target: IPCRTarget) => {
    setEditingTarget(target.id);
    setRatingInputs({
      q1: target.q1Rating?.toString() || '',
      e2: target.e2Rating?.toString() || '',
      t3: target.t3Rating?.toString() || '',
      accomplishments: target.actualAccomplishments || '',
    });
  };

  const handleSaveRating = (targetId: string, majorFunctionId: string) => {
    if (!myIPCR) return;

    // Find the target to check required ratings
    let currentTarget: IPCRTarget | null = null;
    for (const mf of myIPCR.majorFunctions) {
      const found = mf.targets.find(t => t.id === targetId);
      if (found) {
        currentTarget = found;
        break;
      }
    }

    if (!currentTarget) return;

    const requiredRatings = currentTarget.requiredRatings || ['Q', 'E', 'T'];
    
    const q1 = ratingInputs.q1 ? parseFloat(ratingInputs.q1) : null;
    const e2 = ratingInputs.e2 ? parseFloat(ratingInputs.e2) : null;
    const t3 = ratingInputs.t3 ? parseFloat(ratingInputs.t3) : null;

    // Validate that all required ratings are provided
    const missingRatings: string[] = [];
    if (requiredRatings.includes('Q') && !q1) missingRatings.push('Quality (Q)');
    if (requiredRatings.includes('E') && !e2) missingRatings.push('Efficiency (E)');
    if (requiredRatings.includes('T') && !t3) missingRatings.push('Timeliness (T)');

    if (missingRatings.length > 0) {
      Alert.alert('Missing Required Ratings', `Please provide: ${missingRatings.join(', ')}`);
      return;
    }

    // Validate each provided rating is between 1 and 5
    if (q1 && !isValidRating(ratingInputs.q1)) {
      Alert.alert('Invalid Rating', 'Quality rating must be between 1 and 5');
      return;
    }
    if (e2 && !isValidRating(ratingInputs.e2)) {
      Alert.alert('Invalid Rating', 'Efficiency rating must be between 1 and 5');
      return;
    }
    if (t3 && !isValidRating(ratingInputs.t3)) {
      Alert.alert('Invalid Rating', 'Timeliness rating must be between 1 and 5');
      return;
    }

    // Calculate A4 based on available ratings
    const ratings = [q1, e2, t3].filter(r => r !== null) as number[];
    const a4 = ratings.length > 0 
      ? parseFloat((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2))
      : 0;

    // Update the IPCR
    const updatedIPCR = {
      ...myIPCR,
      majorFunctions: myIPCR.majorFunctions.map(mf => {
        if (mf.id === majorFunctionId) {
          return {
            ...mf,
            targets: mf.targets.map(t => {
              if (t.id === targetId) {
                return {
                  ...t,
                  q1Rating: q1,
                  e2Rating: e2,
                  t3Rating: t3,
                  a4Rating: a4,
                  actualAccomplishments: ratingInputs.accomplishments,
                };
              }
              return t;
            }),
          };
        }
        return mf;
      }),
    };

    setMyIPCR(updatedIPCR);
    updateIPCR(updatedIPCR.id, updatedIPCR);
    setEditingTarget(null);
    Alert.alert('Success', 'Rating saved successfully!');
  };

  const handleCancelEdit = () => {
    setEditingTarget(null);
    setRatingInputs({ q1: '', e2: '', t3: '', accomplishments: '' });
  };

  const handleUploadDocument = async (targetId: string) => {
    if (Platform.OS === 'web') {
      // On web, use HTML file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx,.xls,.xlsx';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file && myIPCR) {
          // Create a mock URL (in production, upload to server and get real URL)
          const mockUrl = `https://example.com/documents/${file.name}`;
          
          // Update the target with the file URL
          const updatedIPCR = {
            ...myIPCR,
            majorFunctions: myIPCR.majorFunctions.map(mf => ({
              ...mf,
              targets: mf.targets.map(t => {
                if (t.id === targetId) {
                  return {
                    ...t,
                    movFileUrls: [...(t.movFileUrls || []), mockUrl],
                  };
                }
                return t;
              }),
            })),
          };
          
          setMyIPCR(updatedIPCR);
          updateIPCR(updatedIPCR.id, updatedIPCR);
          Alert.alert('Success', `Document uploaded: ${file.name}`);
        }
      };
      input.click();
    } else {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: '*/*',
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0 && myIPCR) {
          const file = result.assets[0];
          const mockUrl = `https://example.com/documents/${file.name}`;
          
          const updatedIPCR = {
            ...myIPCR,
            majorFunctions: myIPCR.majorFunctions.map(mf => ({
              ...mf,
              targets: mf.targets.map(t => {
                if (t.id === targetId) {
                  return {
                    ...t,
                    movFileUrls: [...(t.movFileUrls || []), mockUrl],
                  };
                }
                return t;
              }),
            })),
          };
          
          setMyIPCR(updatedIPCR);
          updateIPCR(updatedIPCR.id, updatedIPCR);
          Alert.alert('Success', `Document uploaded: ${file.name}`);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const handleUploadImage = async (targetId: string) => {
    setCurrentTargetId(targetId);
    
    if (Platform.OS === 'web') {
      // On web, show custom modal
      setShowImageChoice(true);
    } else {
      // On mobile, show native dialog
      Alert.alert(
        'Add Image',
        'Choose an option',
        [
          {
            text: 'Take Photo',
            onPress: () => handleTakePhoto(targetId),
          },
          {
            text: 'Choose from Gallery',
            onPress: () => handleChooseFromGallery(targetId),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const handleTakePhoto = async (targetId: string) => {
    setShowImageChoice(false);
    
    if (Platform.OS === 'web') {
      // On web, use file input with capture
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file && myIPCR) {
          const imageUrl = URL.createObjectURL(file);
          updateTargetWithImage(targetId, imageUrl);
          Alert.alert('Success', 'Photo captured!');
        }
      };
      input.click();
    } else {
      // On mobile, use camera
      try {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        
        if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'Permission to access camera is required!');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          updateTargetWithImage(targetId, result.assets[0].uri);
          Alert.alert('Success', 'Photo captured successfully!');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const handleChooseFromGallery = async (targetId: string) => {
    setShowImageChoice(false);
    
    if (Platform.OS === 'web') {
      // On web, use file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file && myIPCR) {
          const imageUrl = URL.createObjectURL(file);
          updateTargetWithImage(targetId, imageUrl);
          Alert.alert('Success', `Image uploaded: ${file.name}`);
        }
      };
      input.click();
    } else {
      // On mobile, use gallery
      try {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'Permission to access gallery is required!');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          updateTargetWithImage(targetId, result.assets[0].uri);
          Alert.alert('Success', 'Image uploaded successfully!');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to pick image');
      }
    }
  };

  const updateTargetWithImage = (targetId: string, imageUrl: string) => {
    if (!myIPCR) return;
    
    const updatedIPCR = {
      ...myIPCR,
      majorFunctions: myIPCR.majorFunctions.map(mf => ({
        ...mf,
        targets: mf.targets.map(t => {
          if (t.id === targetId) {
            return {
              ...t,
              movFileUrls: [...(t.movFileUrls || []), imageUrl],
            };
          }
          return t;
        }),
      })),
    };
    
    setMyIPCR(updatedIPCR);
    updateIPCR(updatedIPCR.id, updatedIPCR);
  };

  const handleSubmitIPCR = () => {
    if (!myIPCR) return;

    // Check if all targets have ratings
    const allRated = myIPCR.majorFunctions.every(mf =>
      mf.targets.every(t => t.a4Rating && t.a4Rating > 0)
    );

    if (!allRated) {
      Alert.alert(
        'Incomplete IPCR',
        'Please rate all targets before submitting.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Submit IPCR',
      'Are you sure you want to submit your IPCR for review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            const updatedIPCR = {
              ...myIPCR,
              status: 'PENDING_REVIEW' as const,
            };
            setMyIPCR(updatedIPCR);
            updateIPCR(updatedIPCR);
            Alert.alert('Success', 'IPCR submitted for review!');
          },
        },
      ]
    );
  };

  if (!myIPCR) {
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
              My IPCR
            </TamaguiText>
            <TamaguiText fontSize={11} color="$text3" mt={2}>
              Individual Performance Commitment Review
            </TamaguiText>
          </YStack>
          <XStack gap="$2">
            <XStack
              pressStyle={{ opacity: 0.7 }}
              onPress={handleRegenerateIPCR}
              cursor="pointer"
              bg="$bg3"
              px="$3"
              py="$2"
              br="$2"
              ai="center"
              gap="$1.5"
            >
              <SvgIcon name="refresh" size={18} color={colors.accent} />
              <TamaguiText fontSize={12} fontWeight="600" color="$accent">
                Refresh Targets
              </TamaguiText>
            </XStack>
            <XStack pressStyle={{ opacity: 0.7 }} cursor="pointer">
              <SvgIcon name="bell" size={22} color={colors.text2} />
            </XStack>
          </XStack>
        </XStack>

        {/* Empty State */}
        <YStack f={1} ai="center" jc="center" p="$6">
          <YStack
            w={80}
            h={80}
            bg="$bg2"
            br="$10"
            ai="center"
            jc="center"
            mb="$4"
          >
            <SvgIcon name="fileText" size={40} color={colors.text3} />
          </YStack>
          <TamaguiText fontSize={18} fontWeight="700" color="$text" mb="$2">
            No IPCR Found
          </TamaguiText>
          <TamaguiText fontSize={14} color="$text3" textAlign="center" mb="$4" px="$6">
            Your IPCR will be automatically generated when the secretary uploads the OPCR.
          </TamaguiText>
          <XStack
            bg="$accent"
            px="$5"
            py="$3"
            br="$3"
            ai="center"
            jc="center"
            gap="$2"
            pressStyle={{ opacity: 0.8 }}
            onPress={async () => {
              if (user) {
                const newIPCR = await generateIPCRForFaculty(user.id);
                if (newIPCR) {
                  setMyIPCR(newIPCR);
                  Alert.alert('Success', 'IPCR generated successfully!');
                } else {
                  Alert.alert('No Targets', 'No targets found for you in the current OPCR.');
                }
              }
            }}
            cursor="pointer"
          >
            <SvgIcon name="refresh" size={18} color="#fff" />
            <TamaguiText fontSize={14} fontWeight="600" color="#fff">
              Generate My IPCR
            </TamaguiText>
          </XStack>
        </YStack>
      </YStack>
    );
  }

  const rating = myIPCR.majorFunctions ? calculateFinalRating(myIPCR) : {
    strategicAvg: 0,
    coreAvg: 0,
    supportAvg: 0,
    strategicWeighted: 0,
    coreWeighted: 0,
    supportWeighted: 0,
    final: 0,
    adjectival: 'Not Rated',
  };
  const totalTargets = myIPCR.majorFunctions ? myIPCR.majorFunctions.reduce((sum, mf) => sum + mf.targets.length, 0) : 0;
  const ratedTargets = myIPCR.majorFunctions ? myIPCR.majorFunctions.reduce(
    (sum, mf) => sum + mf.targets.filter(t => t.a4Rating && t.a4Rating > 0).length,
    0
  ) : 0;
  const completionPercent = totalTargets > 0 ? Math.round((ratedTargets / totalTargets) * 100) : 0;

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
            My IPCR
          </TamaguiText>
          <TamaguiText fontSize={11} color="$text3" mt={2}>
            Individual Performance Commitment Review
          </TamaguiText>
        </YStack>
        <XStack gap="$2" ai="center">
          <XStack
            pressStyle={{ opacity: 0.7 }}
            onPress={handleRegenerateIPCR}
            cursor="pointer"
            bg="$bg3"
            px="$3"
            py="$2"
            br="$2"
            ai="center"
            gap="$1.5"
          >
            <SvgIcon name="refresh" size={18} color={colors.accent} />
            <TamaguiText fontSize={12} fontWeight="600" color="$accent">
              Refresh
            </TamaguiText>
          </XStack>
          <XStack pressStyle={{ opacity: 0.7 }} cursor="pointer">
            <SvgIcon name="bell" size={22} color={colors.text2} />
          </XStack>
        </XStack>
      </XStack>

      <ScrollView
        f={1}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <YStack
          bg="$bg2"
          br="$4"
          bw={1}
          bc="$border"
          p="$5"
          mb="$4"
        >
          <XStack ai="center" mb="$3">
            <YStack
              w={60}
              h={60}
              bg="$accent"
              br={30}
              ai="center"
              jc="center"
              mr="$4"
            >
              <TamaguiText color="#fff" fontSize={24} fontWeight="800">
                {user?.firstName?.[0] || user?.lastName?.[0] || '?'}
              </TamaguiText>
            </YStack>
            <YStack f={1}>
              <TamaguiText fontSize={20} fontWeight="800" color="$text">
                {myIPCR.facultyName}
              </TamaguiText>
              <TamaguiText fontSize={14} color="$text3" mt={2}>
                {myIPCR.period}
              </TamaguiText>
              <XStack
                bg={myIPCR.status === 'COMPLETED' ? 'rgba(34,197,94,0.15)' : 'rgba(234,179,8,0.15)'}
                px="$2.5"
                py="$1"
                br="$2"
                alignSelf="flex-start"
                mt="$2"
              >
                <TamaguiText
                  fontSize={11}
                  fontWeight="600"
                  color={myIPCR.status === 'COMPLETED' ? '$green' : '$yellow'}
                >
                  {myIPCR.status.replace('_', ' ')}
                </TamaguiText>
              </XStack>
            </YStack>
          </XStack>

          {/* Progress Bar */}
          <YStack bg="$bg3" br="$3" p="$3" mb="$3">
            <XStack jc="space-between" mb="$2">
              <TamaguiText fontSize={13} fontWeight="600" color="$text3">
                Completion Progress
              </TamaguiText>
              <TamaguiText fontSize={13} fontWeight="700" color="$accent">
                {ratedTargets}/{totalTargets} targets
              </TamaguiText>
            </XStack>
            <YStack bg="$border" h={8} br="$2" overflow="hidden">
              <YStack
                bg="$accent"
                h={8}
                width={`${completionPercent}%`}
              />
            </YStack>
            <TamaguiText fontSize={12} color="$text3" mt="$2" textAlign="center">
              {completionPercent}% Complete
            </TamaguiText>
          </YStack>

          {/* Rating Summary */}
          {ratedTargets > 0 && (
            <YStack bg="$bg3" br="$3" p="$4">
              <XStack jc="space-between" ai="center" mb="$3">
                <TamaguiText fontSize={14} fontWeight="600" color="$text3">
                  Current Rating
                </TamaguiText>
                <XStack ai="center" gap="$2">
                  <SvgIcon name="star" size={18} color={colors.accent} />
                  <TamaguiText fontSize={24} fontWeight="800" color="$accent">
                    {rating.final.toFixed(2)}
                  </TamaguiText>
                </XStack>
              </XStack>
              <TamaguiText fontSize={16} fontWeight="700" color="$text" textAlign="center">
                {rating.adjectival}
              </TamaguiText>
            </YStack>
          )}
        </YStack>

        {/* Submit Button */}
        {myIPCR.status === 'IN_PROGRESS' && ratedTargets > 0 && (
          <XStack
            bg="$accent"
            p="$4"
            br="$3"
            ai="center"
            jc="center"
            gap="$2"
            mb="$4"
            pressStyle={{ opacity: 0.8 }}
            onPress={handleSubmitIPCR}
            cursor="pointer"
          >
            <SvgIcon name="checkCircle" size={20} color="#fff" />
            <TamaguiText fontSize={15} fontWeight="700" color="#fff">
              Submit IPCR for Review
            </TamaguiText>
          </XStack>
        )}

        {/* Regenerate Button - Show when no targets */}
        {totalTargets === 0 && (
          <YStack bg="$bg2" br="$4" bw={1} bc="$border" p="$5" mb="$4" ai="center">
            <SvgIcon name="alertCircle" size={48} color={colors.text3} mb="$3" />
            <TamaguiText fontSize={16} fontWeight="700" color="$text" mb="$2" textAlign="center">
              No Targets Assigned
            </TamaguiText>
            <TamaguiText fontSize={14} color="$text3" mb="$4" textAlign="center" px="$4">
              Click below to generate your IPCR from the current OPCR targets
            </TamaguiText>
            <XStack
              bg="$accent"
              px="$5"
              py="$3"
              br="$3"
              ai="center"
              jc="center"
              gap="$2"
              pressStyle={{ opacity: 0.8 }}
              onPress={async () => {
                if (user) {
                  const newIPCR = await generateIPCRForFaculty(user.id);
                  if (newIPCR) {
                    setMyIPCR(newIPCR);
                    Alert.alert('Success', `IPCR generated with ${newIPCR.majorFunctions?.reduce((sum: number, mf: any) => sum + (mf.targets?.length || 0), 0) || 0} targets!`);
                  } else {
                    Alert.alert('No Targets', 'No targets found for you in the current OPCR. Please contact your administrator.');
                  }
                }
              }}
              cursor="pointer"
            >
              <SvgIcon name="refresh" size={18} color="#fff" />
              <TamaguiText fontSize={14} fontWeight="600" color="#fff">
                Generate My IPCR
              </TamaguiText>
            </XStack>
          </YStack>
        )}

        {/* Major Functions */}
        {myIPCR.majorFunctions && myIPCR.majorFunctions.map((mf) => {
          const isExpanded = expandedSections.includes(mf.id);
          const categoryColor = getCategoryColor(mf.category);
          const completedTargets = mf.targets.filter(t => t.a4Rating && t.a4Rating > 0).length;
          const totalTargets = mf.targets.length;

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
                      {mf.category} • {completedTargets}/{totalTargets} rated
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
                  {mf.targets.map((target) => {
                    const isEditing = editingTarget === target.id;
                    const hasRating = target.a4Rating && target.a4Rating > 0;
                    
                    return (
                      <YStack
                        key={target.id}
                        bg="$bg3"
                        br="$3"
                        p="$3.5"
                      >
                        {/* Target Header */}
                        <XStack jc="space-between" ai="center" mb="$2">
                          <TamaguiText
                            fontSize={12}
                            fontWeight="700"
                            color="$accent"
                            textTransform="uppercase"
                          >
                            Target {target.id}
                          </TamaguiText>
                          {hasRating && !isEditing && (
                            <XStack
                              bg="$bg"
                              px="$2.5"
                              py="$1"
                              br="$3"
                              ai="center"
                              gap="$1.5"
                            >
                              <SvgIcon name="star" size={12} color={colors.accent} />
                              <TamaguiText fontSize={13} fontWeight="700" color="$accent">
                                {target.a4Rating?.toFixed(2)}
                              </TamaguiText>
                            </XStack>
                          )}
                        </XStack>

                        <TamaguiText fontSize={14} color="$text" mb="$2.5" lineHeight={20}>
                          {target.description}
                        </TamaguiText>

                        {/* Editing Mode */}
                        {isEditing ? (
                          <YStack gap="$3" bg="$bg" br="$2" p="$3">
                            <XStack jc="space-between" ai="center" mb="$2">
                              <TamaguiText fontSize={13} fontWeight="600" color="$text">
                                Enter Required Ratings (1-5)
                              </TamaguiText>
                              <XStack
                                bg="$accent"
                                px="$3"
                                py="$1.5"
                                br="$2"
                                ai="center"
                                gap="$1.5"
                                pressStyle={{ opacity: 0.7 }}
                                onPress={() => setShowRatingGuide(true)}
                                cursor="pointer"
                              >
                                <SvgIcon name="info" size={14} color="#fff" />
                                <TamaguiText fontSize={11} fontWeight="600" color="#fff">
                                  View Rating Guide
                                </TamaguiText>
                              </XStack>
                            </XStack>

                            {/* Info about required ratings */}
                            {target.requiredRatings && target.requiredRatings.length < 3 && (
                              <YStack bg="rgba(244,196,48,0.1)" br="$2" p="$2.5" mb="$2">
                                <TamaguiText fontSize={11} color="$text2" lineHeight={16}>
                                  This target requires: {target.requiredRatings.map(r => {
                                    if (r === 'Q') return 'Quality';
                                    if (r === 'E') return 'Efficiency';
                                    if (r === 'T') return 'Timeliness';
                                    return r;
                                  }).join(', ')}
                                </TamaguiText>
                              </YStack>
                            )}
                            
                            {/* Q1 Rating - Only show if required */}
                            {(!target.requiredRatings || target.requiredRatings.includes('Q')) && (
                              <YStack>
                                <TamaguiText fontSize={12} fontWeight="600" color="$text3" mb="$1.5">
                                  Quality (Q) {target.requiredRatings?.includes('Q') ? '- Required' : '- Optional'}
                                </TamaguiText>
                                <RNTextInput
                                  style={{
                                    backgroundColor: colors.bg3,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                    borderRadius: 8,
                                    padding: 10,
                                    fontSize: 14,
                                    color: colors.text,
                                  }}
                                  placeholder="1, 2, 3, 4, or 5"
                                  placeholderTextColor={colors.text3}
                                  value={ratingInputs.q1}
                                  onChangeText={(text) => {
                                    // Only allow whole numbers 1-5
                                    const num = parseInt(text);
                                    if (text === '' || (num >= 1 && num <= 5 && !text.includes('.'))) {
                                      setRatingInputs(prev => ({ ...prev, q1: text }));
                                    }
                                  }}
                                  keyboardType="number-pad"
                                  maxLength={1}
                                />
                              </YStack>
                            )}

                            {/* E2 Rating - Only show if required */}
                            {(!target.requiredRatings || target.requiredRatings.includes('E')) && (
                              <YStack>
                                <TamaguiText fontSize={12} fontWeight="600" color="$text3" mb="$1.5">
                                  Efficiency (E) {target.requiredRatings?.includes('E') ? '- Required' : '- Optional'}
                                </TamaguiText>
                                <RNTextInput
                                  style={{
                                    backgroundColor: colors.bg3,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                    borderRadius: 8,
                                    padding: 10,
                                    fontSize: 14,
                                    color: colors.text,
                                  }}
                                  placeholder="1, 2, 3, 4, or 5"
                                  placeholderTextColor={colors.text3}
                                  value={ratingInputs.e2}
                                  onChangeText={(text) => {
                                    // Only allow whole numbers 1-5
                                  const num = parseInt(text);
                                  if (text === '' || (num >= 1 && num <= 5 && !text.includes('.'))) {
                                    setRatingInputs(prev => ({ ...prev, e2: text }));
                                  }
                                }}
                                keyboardType="number-pad"
                                maxLength={1}
                              />
                            </YStack>
                            )}

                            {/* T3 Rating - Only show if required */}
                            {(!target.requiredRatings || target.requiredRatings.includes('T')) && (
                              <YStack>
                                <TamaguiText fontSize={12} fontWeight="600" color="$text3" mb="$1.5">
                                  Timeliness (T) {target.requiredRatings?.includes('T') ? '- Required' : '- Optional'}
                                </TamaguiText>
                                <RNTextInput
                                  style={{
                                    backgroundColor: colors.bg3,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                    borderRadius: 8,
                                    padding: 10,
                                    fontSize: 14,
                                    color: colors.text,
                                  }}
                                  placeholder="1, 2, 3, 4, or 5"
                                  placeholderTextColor={colors.text3}
                                  value={ratingInputs.t3}
                                  onChangeText={(text) => {
                                    // Only allow whole numbers 1-5
                                    const num = parseInt(text);
                                    if (text === '' || (num >= 1 && num <= 5 && !text.includes('.'))) {
                                      setRatingInputs(prev => ({ ...prev, t3: text }));
                                  }
                                }}
                                keyboardType="number-pad"
                                maxLength={1}
                              />
                            </YStack>
                            )}

                            {/* Accomplishments */}
                            <YStack>
                              <TamaguiText fontSize={12} fontWeight="600" color="$text3" mb="$1.5">
                                Actual Accomplishments
                              </TamaguiText>
                              <RNTextInput
                                style={{
                                  backgroundColor: colors.bg3,
                                  borderWidth: 1,
                                  borderColor: colors.border,
                                  borderRadius: 8,
                                  padding: 10,
                                  fontSize: 14,
                                  color: colors.text,
                                  minHeight: 80,
                                  textAlignVertical: 'top',
                                }}
                                placeholder="Describe your accomplishments..."
                                placeholderTextColor={colors.text3}
                                value={ratingInputs.accomplishments}
                                onChangeText={(text) => setRatingInputs(prev => ({ ...prev, accomplishments: text }))}
                                multiline
                                numberOfLines={4}
                              />
                            </YStack>

                            {/* Upload Evidence */}
                            <YStack>
                              <TamaguiText fontSize={12} fontWeight="600" color="$text3" mb="$2">
                                Upload Evidence (Optional)
                              </TamaguiText>
                              <XStack gap="$2">
                                <XStack
                                  f={1}
                                  bg="$bg3"
                                  px="$3"
                                  py="$2.5"
                                  br="$2"
                                  ai="center"
                                  jc="center"
                                  gap="$2"
                                  bw={1}
                                  bc="$border"
                                  pressStyle={{ opacity: 0.7 }}
                                  onPress={() => handleUploadDocument(target.id)}
                                  cursor="pointer"
                                >
                                  <SvgIcon name="upload" size={14} color={colors.text} />
                                  <TamaguiText fontSize={12} fontWeight="600" color="$text">
                                    Document
                                  </TamaguiText>
                                </XStack>
                                <XStack
                                  f={1}
                                  bg="$bg3"
                                  px="$3"
                                  py="$2.5"
                                  br="$2"
                                  ai="center"
                                  jc="center"
                                  gap="$2"
                                  bw={1}
                                  bc="$border"
                                  pressStyle={{ opacity: 0.7 }}
                                  onPress={() => handleUploadImage(target.id)}
                                  cursor="pointer"
                                >
                                  <SvgIcon name="image" size={14} color={colors.text} />
                                  <TamaguiText fontSize={12} fontWeight="600" color="$text">
                                    Image
                                  </TamaguiText>
                                </XStack>
                              </XStack>
                            </YStack>

                            {/* Action Buttons */}
                            <XStack gap="$2" mt="$2">
                              <XStack
                                f={1}
                                bg="$accent"
                                p="$2.5"
                                br="$2"
                                ai="center"
                                jc="center"
                                pressStyle={{ opacity: 0.7 }}
                                onPress={() => handleSaveRating(target.id, mf.id)}
                                cursor="pointer"
                              >
                                <TamaguiText fontSize={13} fontWeight="600" color="#fff">
                                  Save Rating
                                </TamaguiText>
                              </XStack>
                              <XStack
                                f={1}
                                bg="$border"
                                p="$2.5"
                                br="$2"
                                ai="center"
                                jc="center"
                                pressStyle={{ opacity: 0.7 }}
                                onPress={handleCancelEdit}
                                cursor="pointer"
                              >
                                <TamaguiText fontSize={13} fontWeight="600" color="$text">
                                  Cancel
                                </TamaguiText>
                              </XStack>
                            </XStack>
                          </YStack>
                        ) : (
                          <>
                            {/* View Mode */}
                            {hasRating && (
                              <YStack bg="$bg" br="$2" p="$3" gap="$2" mb="$3">
                                <XStack jc="space-between">
                                  <TamaguiText fontSize={12} color="$text3">Quality (Q1)</TamaguiText>
                                  <TamaguiText fontSize={12} fontWeight="600" color="$text">
                                    {target.q1Rating?.toFixed(2)}
                                  </TamaguiText>
                                </XStack>
                                <XStack jc="space-between">
                                  <TamaguiText fontSize={12} color="$text3">Efficiency (E2)</TamaguiText>
                                  <TamaguiText fontSize={12} fontWeight="600" color="$text">
                                    {target.e2Rating?.toFixed(2)}
                                  </TamaguiText>
                                </XStack>
                                <XStack jc="space-between">
                                  <TamaguiText fontSize={12} color="$text3">Timeliness (T3)</TamaguiText>
                                  <TamaguiText fontSize={12} fontWeight="600" color="$text">
                                    {target.t3Rating?.toFixed(2)}
                                  </TamaguiText>
                                </XStack>
                                <XStack jc="space-between" pt="$2" btw={1} btc="$border">
                                  <TamaguiText fontSize={13} fontWeight="600" color="$text">Average (A4)</TamaguiText>
                                  <TamaguiText fontSize={14} fontWeight="700" color="$accent">
                                    {target.a4Rating?.toFixed(2)}
                                  </TamaguiText>
                                </XStack>
                                {target.actualAccomplishments && (
                                  <YStack pt="$2" btw={1} btc="$border">
                                    <TamaguiText fontSize={12} fontWeight="600" color="$text3" mb="$1">
                                      Accomplishments:
                                    </TamaguiText>
                                    <TamaguiText fontSize={12} color="$text2">
                                      {target.actualAccomplishments}
                                    </TamaguiText>
                                  </YStack>
                                )}

                                {/* Uploaded Documents/Images Preview */}
                                {target.movFileUrls && target.movFileUrls.length > 0 && (
                                  <YStack pt="$2" btw={1} btc="$border">
                                    <TamaguiText fontSize={12} fontWeight="600" color="$text3" mb="$2">
                                      Means of Verification:
                                    </TamaguiText>
                                    <XStack gap="$2" flexWrap="wrap">
                                      {target.movFileUrls.map((fileUrl, idx) => {
                                        const isImage = fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                                        
                                        if (isImage) {
                                          // Image preview
                                          return (
                                            <YStack
                                              key={idx}
                                              w={80}
                                              h={80}
                                              br="$2"
                                              overflow="hidden"
                                              bw={1}
                                              bc="$border"
                                              pressStyle={{ opacity: 0.7 }}
                                              cursor="pointer"
                                              onPress={() => {
                                                // Open image in new tab
                                                if (Platform.OS === 'web') {
                                                  window.open(fileUrl, '_blank');
                                                }
                                              }}
                                            >
                                              <img
                                                src={fileUrl}
                                                style={{
                                                  width: '100%',
                                                  height: '100%',
                                                  objectFit: 'cover',
                                                }}
                                                alt={`Evidence ${idx + 1}`}
                                              />
                                            </YStack>
                                          );
                                        } else {
                                          // Document preview
                                          const fileName = fileUrl.split('/').pop() || `Document ${idx + 1}`;
                                          return (
                                            <XStack
                                              key={idx}
                                              bg="$bg3"
                                              px="$3"
                                              py="$2"
                                              br="$2"
                                              ai="center"
                                              gap="$2"
                                              bw={1}
                                              bc="$border"
                                              pressStyle={{ opacity: 0.7 }}
                                              cursor="pointer"
                                              onPress={() => {
                                                // Open document in new tab
                                                if (Platform.OS === 'web') {
                                                  window.open(fileUrl, '_blank');
                                                }
                                              }}
                                            >
                                              <SvgIcon name="fileText" size={16} color={colors.accent} />
                                              <TamaguiText fontSize={11} color="$text" numberOfLines={1} maxWidth={120}>
                                                {fileName}
                                              </TamaguiText>
                                            </XStack>
                                          );
                                        }
                                      })}
                                    </XStack>
                                  </YStack>
                                )}
                              </YStack>
                            )}

                            {/* Action Buttons */}
                            <XStack gap="$2" mt="$2">
                              <XStack
                                f={1}
                                bg="$accent"
                                px="$3"
                                py="$2.5"
                                br="$2"
                                ai="center"
                                jc="center"
                                gap="$2"
                                pressStyle={{ opacity: 0.7 }}
                                onPress={() => handleEditRating(target)}
                                cursor="pointer"
                              >
                                <SvgIcon name="edit" size={14} color="#fff" />
                                <TamaguiText fontSize={12} fontWeight="600" color="#fff">
                                  {hasRating ? 'Edit' : 'Add Rating'}
                                </TamaguiText>
                              </XStack>
                            </XStack>
                          </>
                        )}
                      </YStack>
                    );
                  })}
                </YStack>
              )}
            </YStack>
          );
        })}
      </ScrollView>

      {/* Rating Guide Modal */}
      <Modal
        visible={showRatingGuide}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRatingGuide(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
          }}
          activeOpacity={1}
          onPress={() => setShowRatingGuide(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 600 }}
          >
            <YStack bg="$bg2" br="$4" p="$5" maxWidth={600} width="100%">
              {/* Modal Header */}
              <XStack jc="space-between" ai="center" mb="$4">
                <TamaguiText fontSize={20} fontWeight="800" color="$text">
                  Rating Guide
                </TamaguiText>
                <XStack
                  w={32}
                  h={32}
                  bg="$bg3"
                  br={16}
                  ai="center"
                  jc="center"
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => setShowRatingGuide(false)}
                  cursor="pointer"
                >
                  <SvgIcon name="x" size={18} color={colors.text} />
                </XStack>
              </XStack>

              <ScrollView maxHeight={500} showsVerticalScrollIndicator={false}>
                {/* Overall Rating Scale */}
                <YStack mb="$4">
                  <TamaguiText fontSize={16} fontWeight="700" color="$text" mb="$3">
                    Overall Rating Scale
                  </TamaguiText>
                  <YStack bg="$bg3" br="$3" overflow="hidden" bw={1} bc="$border">
                    {[
                      { rating: '5', label: 'Outstanding', desc: 'Performance far exceeds expectations' },
                      { rating: '4', label: 'Very Good', desc: 'Performance exceeds expectations' },
                      { rating: '3', label: 'Acceptable', desc: 'Performance meets expectations' },
                      { rating: '2', label: 'Needs Improvement', desc: 'Performance below expectations' },
                      { rating: '1', label: 'Unacceptable', desc: 'Performance significantly below expectations' },
                    ].map((item, idx) => (
                      <XStack
                        key={item.rating}
                        p="$3"
                        btw={idx > 0 ? 1 : 0}
                        btc="$border"
                        gap="$3"
                      >
                        <YStack
                          w={40}
                          h={40}
                          bg="$accent"
                          br={20}
                          ai="center"
                          jc="center"
                        >
                          <TamaguiText fontSize={18} fontWeight="800" color="#fff">
                            {item.rating}
                          </TamaguiText>
                        </YStack>
                        <YStack f={1}>
                          <TamaguiText fontSize={14} fontWeight="700" color="$text">
                            {item.label}
                          </TamaguiText>
                          <TamaguiText fontSize={12} color="$text3" mt={2}>
                            {item.desc}
                          </TamaguiText>
                        </YStack>
                      </XStack>
                    ))}
                  </YStack>
                </YStack>

                {/* Quality (Q) Criteria */}
                <YStack mb="$4">
                  <TamaguiText fontSize={16} fontWeight="700" color="$text" mb="$3">
                    Quality (Q)
                  </TamaguiText>
                  
                  {/* Written Work */}
                  <YStack bg="$bg3" br="$3" p="$3" mb="$3" bw={1} bc="$border">
                    <TamaguiText fontSize={13} fontWeight="700" color="$text" mb="$2">
                      For Written Work:
                    </TamaguiText>
                    <TamaguiText fontSize={12} color="$text2" lineHeight={18}>
                      <TamaguiText fontWeight="700">5:</TamaguiText> Work is exemplary, error-free, and exceeds standards{'\n'}
                      <TamaguiText fontWeight="700">4:</TamaguiText> Work is high quality with minimal errors{'\n'}
                      <TamaguiText fontWeight="700">3:</TamaguiText> Work meets acceptable standards{'\n'}
                      <TamaguiText fontWeight="700">2:</TamaguiText> Work has noticeable errors or gaps{'\n'}
                      <TamaguiText fontWeight="700">1:</TamaguiText> Work is poor quality with significant errors
                    </TamaguiText>
                  </YStack>

                  {/* Non-Written Work */}
                  <YStack bg="$bg3" br="$3" p="$3" bw={1} bc="$border">
                    <TamaguiText fontSize={13} fontWeight="700" color="$text" mb="$2">
                      For Non-Written Work:
                    </TamaguiText>
                    <TamaguiText fontSize={12} color="$text2" lineHeight={18}>
                      <TamaguiText fontWeight="700">5:</TamaguiText> Excellent results, all aspects thoroughly covered, no mistakes{'\n'}
                      <TamaguiText fontWeight="700">4:</TamaguiText> One or two minor errors, results still very good (1-2 mistakes){'\n'}
                      <TamaguiText fontWeight="700">3:</TamaguiText> More than two minor errors, results acceptable (3 mistakes){'\n'}
                      <TamaguiText fontWeight="700">2:</TamaguiText> One major error or deficiency, 4-5 mistakes, caused delays{'\n'}
                      <TamaguiText fontWeight="700">1:</TamaguiText> Haphazard execution, unacceptable results, 6+ mistakes
                    </TamaguiText>
                  </YStack>
                </YStack>

                {/* Efficiency (E) Criteria */}
                <YStack mb="$4">
                  <TamaguiText fontSize={16} fontWeight="700" color="$text" mb="$3">
                    Efficiency (E)
                  </TamaguiText>
                  <YStack bg="$bg3" br="$3" p="$3" bw={1} bc="$border">
                    <TamaguiText fontSize={12} color="$text3" mb="$2" fontStyle="italic">
                      Rate of turn-over of accomplishment; subsuming available resources
                    </TamaguiText>
                    <TamaguiText fontSize={12} color="$text2" lineHeight={18}>
                      <TamaguiText fontWeight="700">5:</TamaguiText> Target exceeded by 30% or more{'\n'}
                      <TamaguiText fontWeight="700">4:</TamaguiText> Target exceeded by 15-29%{'\n'}
                      <TamaguiText fontWeight="700">3:</TamaguiText> Target accomplished as expected or exceeded up to 14%{'\n'}
                      <TamaguiText fontWeight="700">2:</TamaguiText> Only 51-99% of target accomplished{'\n'}
                      <TamaguiText fontWeight="700">1:</TamaguiText> Less than 50% of target accomplished
                    </TamaguiText>
                  </YStack>
                </YStack>

                {/* Timeliness (T) Criteria */}
                <YStack mb="$4">
                  <TamaguiText fontSize={16} fontWeight="700" color="$text" mb="$3">
                    Timeliness (T)
                  </TamaguiText>
                  <YStack bg="$bg3" br="$3" p="$3" bw={1} bc="$border">
                    <TamaguiText fontSize={12} color="$text2" lineHeight={18}>
                      <TamaguiText fontWeight="700">5:</TamaguiText> Completed at least 2 days before deadline{'\n'}
                      <TamaguiText fontWeight="700">4:</TamaguiText> Completed at least 1 day before deadline{'\n'}
                      <TamaguiText fontWeight="700">3:</TamaguiText> Completed on the scheduled date/deadline{'\n'}
                      <TamaguiText fontWeight="700">2:</TamaguiText> Completed after the deadline{'\n'}
                      <TamaguiText fontWeight="700">1:</TamaguiText> Task not completed at all
                    </TamaguiText>
                  </YStack>
                </YStack>

                {/* Note */}
                <YStack bg="rgba(244,196,48,0.1)" br="$3" p="$3" bw={1} bc="rgba(244,196,48,0.3)">
                  <XStack ai="center" gap="$2" mb="$2">
                    <SvgIcon name="info" size={16} color={colors.accent} />
                    <TamaguiText fontSize={13} fontWeight="700" color="$text">
                      Automatic Rating Detection
                    </TamaguiText>
                  </XStack>
                  <TamaguiText fontSize={12} color="$text2" lineHeight={18}>
                    The system automatically determines which ratings (Q, E, T) are required for each target based on its description. You only need to rate the applicable criteria shown.
                  </TamaguiText>
                </YStack>
              </ScrollView>

              {/* Close Button */}
              <XStack
                bg="$accent"
                p="$3.5"
                br="$3"
                ai="center"
                jc="center"
                mt="$4"
                pressStyle={{ opacity: 0.8 }}
                onPress={() => setShowRatingGuide(false)}
                cursor="pointer"
              >
                <TamaguiText fontSize={14} fontWeight="700" color="#fff">
                  Got it!
                </TamaguiText>
              </XStack>
            </YStack>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Image Choice Modal */}
      <Modal
        visible={showImageChoice}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageChoice(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
          }}
          activeOpacity={1}
          onPress={() => setShowImageChoice(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 400 }}
          >
            <YStack bg="$bg2" br="$4" p="$5" maxWidth={400} width="100%">
              {/* Modal Header */}
              <XStack jc="space-between" ai="center" mb="$4">
                <TamaguiText fontSize={20} fontWeight="800" color="$text">
                  Add Image
                </TamaguiText>
                <XStack
                  w={32}
                  h={32}
                  bg="$bg3"
                  br={16}
                  ai="center"
                  jc="center"
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => setShowImageChoice(false)}
                  cursor="pointer"
                >
                  <SvgIcon name="x" size={18} color={colors.text} />
                </XStack>
              </XStack>

              <TamaguiText fontSize={14} color="$text3" mb="$4">
                Choose how you want to add an image
              </TamaguiText>

              {/* Take Photo Button */}
              <XStack
                bg="$accent"
                p="$4"
                br="$3"
                ai="center"
                gap="$3"
                mb="$3"
                pressStyle={{ opacity: 0.8 }}
                onPress={() => currentTargetId && handleTakePhoto(currentTargetId)}
                cursor="pointer"
              >
                <YStack
                  w={48}
                  h={48}
                  bg="rgba(255,255,255,0.2)"
                  br={24}
                  ai="center"
                  jc="center"
                >
                  <SvgIcon name="camera" size={24} color="#fff" />
                </YStack>
                <YStack f={1}>
                  <TamaguiText fontSize={16} fontWeight="700" color="#fff" mb={2}>
                    Take Photo
                  </TamaguiText>
                  <TamaguiText fontSize={12} color="rgba(255,255,255,0.8)">
                    Use your camera to capture a photo
                  </TamaguiText>
                </YStack>
              </XStack>

              {/* Choose from Files Button */}
              <XStack
                bg="$bg3"
                p="$4"
                br="$3"
                ai="center"
                gap="$3"
                bw={1}
                bc="$border"
                pressStyle={{ opacity: 0.7 }}
                onPress={() => currentTargetId && handleChooseFromGallery(currentTargetId)}
                cursor="pointer"
              >
                <YStack
                  w={48}
                  h={48}
                  bg="$accent"
                  br={24}
                  ai="center"
                  jc="center"
                >
                  <SvgIcon name="image" size={24} color="#fff" />
                </YStack>
                <YStack f={1}>
                  <TamaguiText fontSize={16} fontWeight="700" color="$text" mb={2}>
                    Choose from Files
                  </TamaguiText>
                  <TamaguiText fontSize={12} color="$text3">
                    Select an existing image from your device
                  </TamaguiText>
                </YStack>
              </XStack>

              {/* Cancel Button */}
              <XStack
                bg="$border"
                p="$3.5"
                br="$3"
                ai="center"
                jc="center"
                mt="$4"
                pressStyle={{ opacity: 0.8 }}
                onPress={() => setShowImageChoice(false)}
                cursor="pointer"
              >
                <TamaguiText fontSize={14} fontWeight="700" color="$text">
                  Cancel
                </TamaguiText>
              </XStack>
            </YStack>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </YStack>
  );
}
