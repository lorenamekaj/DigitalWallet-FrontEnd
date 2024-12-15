import { View, Text, StyleSheet, TextInput, Button, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { API_URL, useAuth } from '../context/AuthContext';
import axios from 'axios';
import PrimaryButton from '../ common/PrimaryButton';

const Register = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { onLogin, onRegister } = useAuth();
    const [error, setError] = useState('');

    const validateForm = () => {
        if (!name || !email || !password || !confirmPassword) {
          setError("All fields are required.");
          return false;
        }
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
          setError("Please enter a valid email address.");
          return false;
        }
    
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return false;
        }
    
        setError('');
        return true;
      };

    const login = async () => {
        const result = await onLogin!(email, password);
        if (result && result.error) {
            alert(result.msg);
        }
    };

    const register = async () => { 
        if (validateForm()) {
            const result = await onRegister!(name, email, password);
            if (result && result.error) {
                alert(result.msg);
            } 
            else {
                login();
            }
        }
    }

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/icon.png')} style={styles.image}></Image>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder='Full Name'
                    onChangeText={(text: string) => setName(text)}
                    value={name}
                    autoComplete='off'
                    autoCorrect={false}
                ></TextInput>
                <TextInput
                    style={styles.input}
                    placeholder='Email' 
                    onChangeText={(text: string) => setEmail(text)}
                    value={email}
                    autoCapitalize='none'
                    autoComplete='off'
                    autoCorrect={false}
                ></TextInput>
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry={true}
                    onChangeText={(text: string) => setPassword(text)}
                    value={password}
                    autoCapitalize='none'
                    autoComplete='off'
                    autoCorrect={false}
                ></TextInput>
                <TextInput
                    style={styles.input}
                    placeholder='Confirm Password'
                    secureTextEntry={true}
                    onChangeText={(text: string) => setConfirmPassword(text)}
                    value={confirmPassword}
                    autoCapitalize='none'
                    autoComplete='off'
                    autoCorrect={false}
                ></TextInput>
                <PrimaryButton onPress={register} title="Create Account"></PrimaryButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '50%',
        height: '50%',
        resizeMode: 'contain'
    },
    form: {
        gap: 10,
        width: '60%'
    },
    input: {
        height: 44,
        borderWidth: 0.5,
        borderRadius: 8,
        borderColor: '#878787',
        padding: 10,
        backgroundColor: '#fff'
    },
    container: {
        alignItems: 'center',
        width: '100%'
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    }
});

export default Register;