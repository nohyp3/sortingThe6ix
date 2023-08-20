import React, { useState, useEffect } from 'react';
import { StyleSheet ,Text, View, Button, Image, TouchableOpacity, ScrollView} from 'react-native';
import { Camera } from 'expo-camera';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppLoading } from 'expo';
import flipIcon from './assets/flip.png'; // flip icon 
import cameraIcon from './assets/camera.png'; //camera icon
import { useFonts } from 'expo-font';

//style constants
const styles = StyleSheet.create({
  ui: {
    fontSize: 30,
    color: "#005698"
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  buttonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: -100,
    alignSelf: 'center',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  icon: {
    width: 40,
    height: 40,
    zIndex: 1,
    margin: 40
  },
});
//homescreen
function HomeScreen({navigation}){
  //constants
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');})();
  }, []);
  const takePicture = async () => {
    if(camera){
      const data = await camera.takePictureAsync(null)
      //console.log(data.uri);
      setImage(data.uri);
      navigation.navigate('Image',{ imageUri: data.uri })
    }
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  //font
  const [loaded] = useFonts({
    'Anton-Regular': require('./assets/fonts/Anton-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
    <ScrollView>
   <View style={{ flex: 1}}>
      <SafeAreaView>
        <View style={styles.ui}>
          <Text style={{fontSize: 30,
      color: "#005698", textAlign: 'center', fontFamily: 'Anton-Regular'}}>Sort The 6ix</Text>
        </View>
      </SafeAreaView>
      <View style={styles.cameraContainer}>
            <Camera 
            ref={ref => setCamera(ref)}
            style={styles.fixedRatio} 
            type={type}
            ratio={'1:1'} />
      </View>
    <View style={styles.buttonContainer}>
      <TouchableOpacity // Wrap Image with TouchableOpacity
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Image
            source={flipIcon} // Use the imported icon as the source
            style={styles.icon}
            resizeMode="contain"
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity // Wrap Image with TouchableOpacity
          onPress={takePicture}
        >
          <Image
            source={cameraIcon} // Use the imported icon as the source
            style={styles.icon}
            resizeMode="contain"
            onPress={takePicture}
          />
        </TouchableOpacity>
       </View> 
        
   </View>
   </ScrollView>
  );
}
//picture screen
function CameraScreen({route}){
  const { imageUri } = route.params ? route.params : {flipIcon};
  console.log({uri:imageUri})
  return(
    <View>
      <Text style={{fontSize: 30,
      color: "#005698", textAlign: 'center', fontFamily: 'Anton-Regular'}}>Sort The 6ix</Text>
      <Image
        source = {{uri:imageUri}}
        ratio={'1:1'}
        style={{ width: 400, height: 400 }} // Adjust width and height as needed
      />
      <Text style={{fontSize: 30,
      color: "#005698", textAlign: 'center'}}>
        Your Object is: Can
      </Text>
      <Text style={{fontSize: 30,
      color: "#005698", textAlign: 'center'}}>
        Your Object goes: Recycling
      </Text>
    </View>
  )
}
const Stack = createNativeStackNavigator();
export default function App() {
  return(
  <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Image" component={CameraScreen} />
      </Stack.Navigator>
  </NavigationContainer>
  )
}