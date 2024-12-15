import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const result = await axios.get(`${API_URL}/api/v1/transactions/my-transactions`);
                console.log('Transactions: ', result.data);

                if (result.data) {
                    setTransactions(result.data);
                }
            }
            catch (error) {
                console.error('Error fetching transactions: ', error);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.transactionItem}>
            <Text style={styles.transactionText}>
                <Text>Transaction ID: </Text>
                <Text style={styles.boldText}>{item.id}</Text>
            </Text>
            <Text style={styles.transactionText}>
                <Text>Amount: </Text>
                <Text style={styles.boldText}>${item.amount}</Text>
            </Text>
            <Text style={styles.transactionText}>
                <Text>From: </Text>
                <Text style={styles.boldText}>{item.payer.name}</Text>
            </Text>
            <Text style={styles.transactionText}>
                <Text>To: </Text>
                <Text style={styles.boldText}>{item.earner.name}</Text>
            </Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="blue" />
                <Text>Loading transactions...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    transactionItem: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    transactionText: {
        fontSize: 16,
        marginBottom: 5,
    },
    boldText: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

export default Transactions;
