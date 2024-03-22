import * as Notifications from 'expo-notifications';

const NotificationService = {
    
    // Request permission for notifications
    requestPermissions: async() => {
        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
    },

    // Schedule sunscreen reminder
    // edit this depending on the correlation between UV index, skin type and sunscreen application
    /*scheduleSunscreenReminder: async (uvIndex) =>{
        if (uvIndex < 3){
            return;
        }*/
        
    scheduleTestNotification: async() => {
        try {
            const content = {
                title: "Sunscreen Reminder",
                body: "The UV index is high. Don't forget to apply sunscreen!",
            };
            console.log('Scheduling test notification...');
            await Notifications.scheduleNotificationAsync({
                content,
                trigger: { seconds: 1 },
            });
            
        } catch (error) {
            console.error('Error scheduling test notification:', error);
            alert('Error scheduling test notification: ' + error.message);
        }
    },
};

export default NotificationService;