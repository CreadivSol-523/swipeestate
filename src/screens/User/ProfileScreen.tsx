import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/Features/authState';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const userData = useSelector((state: RootState) => state?.userData?.data);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Icon
              name="person-circle-outline"
              size={80}
              color={colors.PrimaryColor}
            />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{userData?.name || 'N/A'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{userData?.email || 'N/A'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('EditProfileScreen')}
        >
          <Icon name="create-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Edit Profile</Text>
          <Icon name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ChangePasswordScreen')}
        >
          <Icon name="lock-closed-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Change Password</Text>
          <Icon name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.SecondaryColor,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: Font.font500,
    color: '#000',
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    gap: 16,
  },
  infoRow: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontFamily: Font.font400,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontFamily: Font.font500,
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: Font.font500,
    color: '#000',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 12,
  },
  logoutText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Font.font500,
    color: '#fff',
  },
});
