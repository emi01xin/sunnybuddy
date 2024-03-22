import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import WeatherService from '../services/api/WeatherService'
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

const UVIndexCircle = ({ uvIndex, maxUvIndex }) => {
    const radius = 92;  
    const textRadius = radius + 20;
    const cx = 125;
    const cy = 125;
    const startAngle = 150; 
    const endAngle = 390;   

    console.log(`Initial UV Index: ${uvIndex}`);

    const uvAngle = useSharedValue(startAngle + (uvIndex / maxUvIndex) * (endAngle - startAngle));

    useEffect(() => {
        // Animating directly based on the new uvIndex.
        const targetAngle = startAngle + (uvIndex / maxUvIndex) * (endAngle - startAngle);

        console.log(`Animating from ${uvAngle.value} to target angle: ${targetAngle} for UV Index: ${uvIndex}`);
        uvAngle.value = withTiming(targetAngle, {
            duration: 1000,
            easing: Easing.out(Easing.quad),
        });
    }, [uvIndex]);
    
    const animatedCircleProps = useAnimatedProps(() => {
        const radians = uvAngle.value * Math.PI / 180;
        console.log(`Animated Circle Position - Angle: ${uvAngle.value}, Radians: ${radians}`);
        return {
            cx: cx + radius * Math.cos(radians),
            cy: cy + radius * Math.sin(radians),
        };
    });

    const animatedTextProps = useAnimatedProps(() => {
        const radians = uvAngle.value * Math.PI / 180;
        console.log(`Animated Text Position - Angle: ${uvAngle.value}, Radians: ${radians}`);
        return {
            x: cx + textRadius * Math.cos(radians),
            y: cy + textRadius * Math.sin(radians),
        };
    });
    //const textRotation = uvAngle + (uvAngle < 180 ? -90 : 90);
    
    return (
        <View style={styles.uvIndexRing}>
            <Svg height="300" width="300" viewBox="0 0 250 250">
                <Circle cx={cx} cy={cy} r={radius} stroke="transparent" strokeWidth="2" fill="transparent" />
                <AnimatedCircle r="8" fill="#FD8670" animatedProps={animatedCircleProps} />
                <AnimatedSvgText
                    fontFamily="OpenSans_Condensed-SB"
                    fill="#FD8670"
                    fontSize="20"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    dy=".3em" // Adjust the dy for exact vertical alignment
                    //transform={`${uvIndex < 2 ? `rotate(0, ${x}, ${y})` : ''}`}
                    animatedProps={animatedTextProps}
                >
                    {uvIndex}
                </AnimatedSvgText>
            </Svg>
        </View>
    );
};

const UVIndexScreen = () => {
    const [locationDetails, setLocationDetails] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        // fetch weather data from OpenWeatherMap
        const fetchLocationAndWeather = async () => {
          try {
            // ask user for location service permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied.');
                return;
            }
            
            // fetch real time location of user
            let location = await Location.getCurrentPositionAsync({});
            const reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
            if (reverseGeocode && reverseGeocode.length > 0){
                const locationString = `${reverseGeocode[0].city}, ${reverseGeocode[0].region}`;
                setLocationDetails(locationString);
            }
        
            /* Test coordinates
            const latitude = 43.7;
            const longitude = -79.42;*/
    
            // location coordinates
            const latitude = location.coords.latitude;
            const longitude = location.coords.longitude;
            const data = await WeatherService.fetchWeatherData(latitude, longitude);
            setWeatherData(data);

          } catch (error) {
            console.error('Error fetching location or weather data:', error);
          }
        }; 
 
        fetchLocationAndWeather();
    }, []);

    if (errorMsg) {
        return (
          <View style={styles.container}>
            <Text style={styles.text}>{errorMsg}</Text>
          </View>
        );
      }
    
    if (!weatherData || !locationDetails) {
        return (
          <View style={styles.container}>
            <Text style={styles.text}>Loading...</Text>
          </View>
        );
    }

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Render forecast for future week
    const weeklyForecast = () => {
        return weatherData.daily.slice(0, 5).map((day, index) => (
            <View key={index} style={styles.forecastItem}>
                <Text style={styles.dayText}>
                    {new Date(day.dt * 1000).toLocaleString('en', { weekday: 'short' }).toUpperCase()}
                </Text>
                <Image 
                    source={{ uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png` }}
                    style={styles.weatherIcon}
                />
                <Text style={styles.weeklyTemperatureText}>{Math.round(day.temp.max)}°</Text>
                <Text style={styles.weeklyUviText}>{parseFloat(Math.round(day.uvi))}</Text>
            </View>
        ));
    };

    // Select icon based on weather conditions
    const getWeatherIcon = (condition) => {
        switch (condition) {
          case 'clear sky': return require('../../assets/images/clear.png');
          case 'few clouds': return require('../../assets/images/fewclouds.png');
          case 'scattered clouds':
          case 'broken clouds': return require('../../assets/images/cloud.png');
          case 'shower rain':
          case 'rain': return require('../../assets/images/fewclouds.png');
          case 'thunderstorm': return require('../../assets/images/fewclouds.png');
          case 'snow': return require('../../assets/images/fewclouds.png');
          case 'mist': return require('../../assets/images/fewclouds.png');
          default: return require('../../assets/images/fewclouds.png');
        }
    };
 
    const currentTemp = Math.round(weatherData.current.temp)
    const weatherDescriptionText = capitalizeFirstLetter(weatherData.current.weather[0].description);
    //const uvIndex = Math.round(weatherData.current.uvi)
    const uvIndex = 7;
    const maxUvIndex = 10; 

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.locationText}>{locationDetails}</Text>
                <Text style={styles.degreeText}>°C</Text>
            </View>
            <View style={styles.UVRingContainer}>
                <Image source={require('../../assets/images/uv ring 2.png')} style={styles.UVRingImage} />
                <UVIndexCircle uvIndex={uvIndex} maxUvIndex={maxUvIndex}/>
            </View>
            <Text style={styles.temperatureText}>{currentTemp}°</Text>
            <Text style={styles.weatherDescriptionText}>{weatherDescriptionText}</Text>
            <View style={styles.forecastContainer}>
                {weeklyForecast()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 90,
        alignItems: 'center',
        backgroundColor: '#FFF0E2', 
    },
    header: {
        position: 'relative',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 20,
        textTransform: 'uppercase',
        textAlign: 'center',
        alignSelf: 'center', 
        position: 'absolute',
        fontFamily: 'OpenSans_Condensed-R',
        color: '#000000', 
    },
    degreeText: {
        position: 'absolute',
        right: 20,
        top: '50%',
        fontSize: 20,
        transform: [{ translateY: -13.5 }],
        fontFamily: 'OpenSans_Condensed-R',
        color: '#000000', 
    },
    uvIndexRing: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    UVRingImage: {
        width: 220,
        height: 220,
    },
    UVRingContainer: {
        marginTop: 90,
        height: 250,
        width: 250,
        alignItems: 'center',
        justifyContent: 'center',
    },
    temperatureText: {
        marginTop: -50,
        fontSize: 90, 
        fontFamily: 'OpenSans_Condensed-R',
        color: '#000000', 
    },
    weatherDescriptionText: {
        marginTop: -8,
        fontSize: 19,
        fontFamily: 'OpenSans-R',
        color: '#000000',
        marginBottom: 30, 
    },
    forecastContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20, 

        borderRadius: 25, 
        marginHorizontal: 20, 
        marginBottom: 20, 
    },
    forecastItem: {
        alignItems: 'center',
        marginHorizontal: 2,
    },
    dayText: {
        fontSize: 16,
        fontFamily: 'OpenSans-SB',
        color: '#000000',
        marginBottom: 0, 
    },
    weeklyTemperatureText: {
        marginTop: 0,
        fontSize: 14,
        fontFamily: 'OpenSans-R',
        color: '#000000',
    },
    weeklyUviText: {
        marginTop: 0,
        fontSize: 14,
        fontFamily: 'OpenSans-R',
        color: '#727272',
    },
    weatherIcon:{
        width: 60,
        height: 60,
    },
  });
  

export default UVIndexScreen;