import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';

const ResetPasswordScreen = ({ navigation }: { navigation: any }) => {
  const [data, setData] = useState({ newPassword: '', reenterNewPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = () => {
    if (!data.newPassword || !data.reenterNewPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (data.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (data.newPassword !== data.reenterNewPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      navigation.navigate('LoginScreen');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your new password</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#999"
            value={data.newPassword}
            onChangeText={text => {
              setData({ ...data, newPassword: text });
              setError('');
            }}
            secureTextEntry
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Re-enter New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter new password"
            placeholderTextColor="#999"
            value={data.reenterNewPassword}
            onChangeText={text => {
              setData({ ...data, reenterNewPassword: text });
              setError('');
            }}
            secureTextEntry
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.SecondaryColor,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: Font.font500,
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Font.font400,
    color: '#666',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: Font.font500,
    color: '#000',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Font.font400,
    color: '#000',
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    backgroundColor: colors.PrimaryColor,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Font.font500,
    color: '#fff',
  },
  errorText: {
    fontSize: 14,
    fontFamily: Font.font400,
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
});
