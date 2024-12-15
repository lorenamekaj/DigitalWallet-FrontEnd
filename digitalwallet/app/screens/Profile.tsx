import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import SecondaryButton from '../ common/SecondaryButton';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

const Profile = () => {

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [profile, setProfile] = useState(null);
    const { onLogout } = useAuth();

    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const fetchData = async () => {
            const storedFullname = await SecureStore.getItemAsync('fullname');
            const storedEmail = await SecureStore.getItemAsync('email');
            const storedRole = await SecureStore.getItemAsync('role');
        
            if (storedFullname) setFullname(storedFullname);
            if (storedEmail) setEmail(storedEmail);
            if (storedRole) setRole(storedRole);
        };
        const fetchProfile = async () => {
            try {
                const result = await axios.get(`${API_URL}/api/v1/profile/my-profile`);
                console.log('Profile Data: ', result.data);
                if (result.data) setProfile(result.data);
            }
            catch (error) {
                console.error('Error fetching profile: ', error);
            }
            finally {
                setIsLoading(false);
            }
          };

        fetchData();
        fetchProfile();
        console.log(profile);
    }, []);
    
    const logout = async () => {
        await onLogout!();
    }

    if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="blue" />
            <Text>Loading...</Text>
          </View>
        );
      }

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>

                <Image 
                source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' }} 
                style={styles.profileImage} 
                />

                {fullname && <Text style={styles.text}>{fullname}</Text>}

                {role && <Text style={styles.text}>ROLE: {role}</Text>}

                {email && <Text style={styles.email}>{email}</Text>}

                {profile?.balance && (
                    <Text style={styles.balance}>Balance: {profile.balance}</Text>
                )}

                <SecondaryButton
                    onPress={logout}
                    title='Log Out'
                ></SecondaryButton>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    profileInfo: {
      alignItems: 'center',
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 20,
    },
    email: {
        fontSize: 18,
        marginVertical: 5,
        fontWeight: '500',
        color: 'blue',
        marginBottom: 30
    },
    text: {
        fontSize: 18,
        marginVertical: 5,
        fontWeight: '500',
    },
    balance: {
        fontSize: 20,
        marginVertical: 10,
        fontWeight: '600',
        color: 'green'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
  });

export default Profile;