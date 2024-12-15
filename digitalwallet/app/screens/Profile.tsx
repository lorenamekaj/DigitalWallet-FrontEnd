import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import SecondaryButton from '../common/SecondaryButton';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import PrimaryButton from '../common/PrimaryButton';

const Profile = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [profile, setProfile] = useState(null);
  const { onLogout } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [nonce, setNonce] = useState('');
  const [paymentRequestId, setPaymentRequestId] = useState('');

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
      } catch (error) {
        console.error('Error fetching profile: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    fetchProfile();
  }, []);

  const logout = async () => {
    await onLogout!();
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setAmount('');
  };

  const handleSubmitAmount = async () => {
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0 && Number(amount) <= profile.balance) {
      console.log("Amount --->", amount);

      try {
        const response = await axios.post(`${API_URL}/api/v1/payment-requests`, { amount });
        const { nonce, paymentRequestId } = response.data;

        setNonce(nonce);
        setPaymentRequestId(paymentRequestId);
        console.log("Nonce: ", nonce);
        console.log("Payment Request ID: ", paymentRequestId);

      } catch (error) {
        console.error('Error creating payment request:', error);
        alert('Something went wrong while creating the payment request.');
      }

      handleCloseModal();
    } else if (Number(amount) > profile.balance) {
      alert("Value must be lower than balance!");
    } else {
      alert('Please enter a valid amount');
    }
  };

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
          <Text style={styles.balance}>Balance: ${profile.balance}</Text>
        )}

        <SecondaryButton
          onPress={logout}
          title="Log Out"
        />

      </View>


      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleOpenModal}
      >
        <Text style={styles.plusSign}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Amount</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <PrimaryButton
              onPress={handleSubmitAmount}
              title="Submit"
            />
            <SecondaryButton
              onPress={handleCloseModal}
              title="Cancel"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
    fontWeight: '500',
  },
  balance: {
    fontSize: 20,
    marginVertical: 30,
    fontWeight: '600',
    color: 'green',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#a4a4a4',
    width: 45,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  amountInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  plusSign: {
    color: 'white',
    fontSize: 28,
  }
});

export default Profile;
