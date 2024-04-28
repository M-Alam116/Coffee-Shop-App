/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
// import GradientBGIcon from './GradientBGIcon';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';

interface HeaderBarProps {
  title?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({title}) => {
  const handleLogout = () => {
    auth().signOut();
  };

  const navigation = useNavigation();

  const [image, setImage] = useState(null);

  const userId = auth().currentUser?.uid;
  const db = firestore();

  const fetchUserData = async () => {
    try {
      const userRef = db.collection('users').doc(userId);
      const unsubscribe = userRef.onSnapshot(doc => {
        const userData = doc?._data;
        if (userData) {
          setImage(userData.profileImg);
        }
      });

      return unsubscribe;
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.HeaderContainer}>
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
      <Text style={styles.HeaderText}>{title}</Text>
      <Pressable onPress={() => navigation.navigate('Profile')}>
        {image ? (
          <Image
            source={{uri: image}}
            style={styles.image}
          />
        ) : (
          <Image
            source={require('../assets/profile.png')}
            style={styles.image}
          />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    padding: SPACING.space_30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primaryDarkGreyHex,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
});

export default HeaderBar;
