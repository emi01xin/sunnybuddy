import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import NotificationService from '../services/NotificationService';

const HomeScreen = () => {
    useEffect(() => {
        const prepareNotifications = async () => {
            if (!(await NotificationService.requestPermissions())) {
                setErrorMsg('Permission for notifications is required!');
                return;
            }
        };

        prepareNotifications();
    }, []);

    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
            <Text style={styles.text}>Press the button below to test a notification:</Text>
            <Button
                title="Test Notification"
                onPress={() => NotificationService.scheduleTestNotification()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    text: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
});

export default HomeScreen;
