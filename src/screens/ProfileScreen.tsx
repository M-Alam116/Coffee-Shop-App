/* eslint-disable prettier/prettier */
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONTFAMILY, FONTSIZE} from '../theme/theme';
import GradientBGIcon from '../components/GradientBGIcon';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import DocumentPicker from 'react-native-document-picker';

const ProfileScreen = ({navigation}) => {
  const currentUser = auth().currentUser;

  const [name, setName] = useState(currentUser?.name);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [image, setImage] = useState(null);

  const userId = currentUser?.uid;
  const db = firestore();

  const fetchUserData = async () => {
    try {
      const userRef = db.collection('users').doc(userId);
      const unsubscribe = userRef.onSnapshot(doc => {
        const userData = doc?._data;
        if (userData) {
          setName(userData.name);
          setImage(userData.profileImg);
        }
      });

      return unsubscribe;
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const userRef = db.collection('users').doc(userId);

      // Update name
      if (name) {
        await userRef.update({
          name: name,
        });
      }

      // Change password
      if (oldPassword && newPassword) {
        // Re-authenticate the user with their old password
        const credential = auth.EmailAuthProvider.credential(
          currentUser.email,
          oldPassword,
        );
        const response = await currentUser.reauthenticateWithCredential(
          credential,
        );

        // If re-authentication is successful, update the password
        await currentUser.updatePassword(newPassword);
      }

      ToastAndroid.show('Profile updated successfully', ToastAndroid.LONG);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setNewPassword('');
      setOldPassword('');
    }
  };

  const handleImageUpload = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
        copyTo: 'cachesDirectory', // for solving storage error
      });

      setImageData(response);
      setImageLoading(true);

      const reference = storage().ref(`/userImages/${userId}`);
      const uploadTask = reference.putFile(response.fileCopyUri);

      uploadTask.on(
        'state_changed',
        snapshot => {
          // Progress function, can be used to show progress bar
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        error => {
          // Handle unsuccessful uploads
          console.error(error);
          setError('Image upload failed');
        },
        () => {
          // Handle successful uploads on complete
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            const userRef = db.collection('users').doc(userId);
            userRef
              .update({
                profileImg: downloadURL,
              })
              .then(() => {
                console.log('Image uploaded successfully');
                setImageData(null);
                setImageLoading(false);
              })
              .catch(error => {
                setError(error.message);
                setImageLoading(false);
              });
          });
        },
      );
    } catch (err) {
      setError(err.message);
    }
  };

  setTimeout(() => {
    setError('');
  }, 5000);

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.pop()}>
              <GradientBGIcon
                name="left"
                color={COLORS.primaryLightGreyHex}
                size={FONTSIZE.size_16}
              />
            </TouchableOpacity>
            <Text style={styles.HeaderText}>Edit Profile</Text>
            <Text></Text>
          </View>

          <View style={{marginTop: 20, alignItems: 'center'}}>
            {image ? (
              <Image source={{uri: image}} style={styles.image} />
            ) : (
              <Image
                source={require('../assets/profile.png')}
                style={styles.image}
              />
            )}
            <Pressable onPress={handleImageUpload}>
              <Text style={styles.uploadText}>Upload Image</Text>
            </Pressable>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <Text style={styles.progressText}>
                {uploadProgress.toFixed(2)}%
              </Text>
            )}
          </View>

          <View style={{gap: 30}}>
            <View>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={text => setName(text)}
              />
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={currentUser?.email}
                readOnly
              />
            </View>

            <View>
              <Text style={styles.passwordText}>Change Password</Text>
              <Text style={styles.inputLabel}>Old Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={oldPassword}
                onChangeText={value => setOldPassword(value)}
              />
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={newPassword}
                onChangeText={value => setNewPassword(value)}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
              {loading ? (
                <ActivityIndicator size="small" color={'white'} />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
    padding: 20,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  innerContainer: {
    flexGrow: 1,
    gap: 20,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  uploadText: {
    color: COLORS.primaryOrangeHex,
    fontSize: FONTSIZE.size_16,
    fontWeight: '600',
    marginTop: 20,
  },
  inputLabel: {
    fontSize: FONTSIZE.size_18,
    color: 'white',
    fontWeight: '600',
    marginTop: 25,
  },
  input: {
    borderBottomColor: COLORS.primaryGreyHex,
    borderBottomWidth: 2,
    color: 'white',
    fontSize: 16,
    padding: 10,
  },
  passwordText: {
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryOrangeHex,
    fontWeight: '600',
    marginTop: 20,
  },
  button: {
    backgroundColor: COLORS.primaryOrangeHex,
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: FONTSIZE.size_18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  progressText: {
    color: COLORS.primaryOrangeHex,
    fontSize: FONTSIZE.size_16,
    fontWeight: '600',
    marginTop: 10,
  },
  errorText: {
    color: COLORS.primaryRedHex,
    textAlign: 'center',
  },
});
