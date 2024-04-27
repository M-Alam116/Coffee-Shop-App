/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE} from '../theme/theme';

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <View style={styles.innerContainer}>
          <Image source={require('../assets/icon.png')} style={styles.logo} />
          <View style={{width: '100%', gap: 30}}>
            <Text style={styles.heading}>Create your  Account</Text>
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={text => {
                setName(text);
              }}
              placeholderTextColor={COLORS.primaryLightGreyHex}
              style={styles.TextInputContainer}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={text => {
                setEmail(text);
              }}
              placeholderTextColor={COLORS.primaryLightGreyHex}
              style={styles.TextInputContainer}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={text => {
                setPassword(text);
              }}
              placeholderTextColor={COLORS.primaryLightGreyHex}
              style={styles.TextInputContainer}
            />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottom}>
            <Text style={styles.leftText}>Already have an account?</Text>
            <Text
              style={styles.rightText}
              onPress={() => navigation.navigate('SignIn')}>
              Sign In
            </Text>
          </View>
        </View>
      </ScrollView>
      <Text>SignInScreen</Text>
    </View>
  );
};

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
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logo: {
    width: 130,
    height: 100,
  },
  heading: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
  TextInputContainer: {
    width: '100%',
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryDarkGreyHex,
    padding: 20,
  },
  button: {
    backgroundColor: COLORS.primaryOrangeHex,
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: FONTSIZE.size_16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  leftText: {
    color: COLORS.primaryLightGreyHex,
    fontSize: FONTSIZE.size_14,
  },
  rightText: {
    color: 'white',
    fontSize: FONTSIZE.size_14,
    fontWeight: '600',
  },
});

export default SignUpScreen;
