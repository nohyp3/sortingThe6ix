import React, { useState, useEffect } from 'react';
import { StyleSheet ,Text, View, Image, Button, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator} from 'react-native';
import { Camera } from 'expo-camera';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppLoading } from 'expo';
import flipIcon from './assets/flip.png'; // flip icon 
import cameraIcon from './assets/camera.png'; //camera icon
import { useFonts } from 'expo-font';
import axios from 'axios'; // Import axios
import { useNavigation } from '@react-navigation/native';

const BACKEND_API_URL = "https://dba0-141-117-117-21.ngrok-free.app/data"

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
  loading:{
    flex: 1,
    justifyContent: 'center',
  },
});
//loading screen
function LoadingScreen(){
  return(
    <View style={styles.loading}>
      <ActivityIndicator size="large"/>
    </View>
  )
}
//homescreen
function HomeScreen({navigation}){
  //constants
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [responseData, setResponseData] = useState(null);
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
      const apiKey = 'AIzaSyC0EthR6b8SLdKqZdyzZvxK5LIcCpfA4_g';
      const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
      //console.log(data.base64);
      try {
        const response = await fetch(data.uri);
        const imageBlob = await response.blob();
        const reader = new FileReader();
  
        reader.onload = async () => {
          navigation.replace('LoadingScreen');
          const imageBase64 = reader.result.split(',')[1]; // Extract base64 data
          const visionResponse = await axios.post(visionApiUrl, {
            requests: [
              {
                image: {
                  content: imageBase64,
                },
                features: [
                  {
                    type: 'LABEL_DETECTION',
                  },
                ],
              },
            ],
          });
          
          
          const detectedObjects = visionResponse.data.responses[0].labelAnnotations;
          const myArr = detectedObjects.map(object => object.description);

          const response = await fetch(BACKEND_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "ngrok-skip-browser-warning"
            },
            body: JSON.stringify({ labels: myArr })
          });

          let responseJson = await response.json();
          // console.log(responseData);
          setResponseData(responseJson); // Set the response data here
          responseJson = null;
          // console.log(responseData);

          navigation.navigate('Image', {
            imageUri: data.uri,
            detectedObjects: detectedObjects,
            responseData: responseData // Pass the response data to the next screen
          });
        };
  
        reader.readAsDataURL(imageBlob);
      } catch (error) {
        console.error('Error sending image to Google Cloud Vision API:', error);
      }
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
  const navigation = useNavigation(); // Hook to get the navigation prop
  const screenWidth = Dimensions.get('window').width;
  const { imageUri,detectedObjects,responseData } = route.params ? route.params : {flipIcon};
  console.log("detected"+detectedObjects)
  console.log("res"+responseData)

  let instructionsBody;

  if (!responseData || responseData.res === "Error") {
    instructionsBody = (
      <Text style={{fontSize: 30, color: "#005698", textAlign: 'center'}}>
        Hm, it seems like something went wrong while processing your image. Sorry about that!
      </Text>
    );
  } else {
    instructionsBody = (
      <Text style={{fontSize: 30, color: "#005698", textAlign: 'center'}}>
        {responseData.res[0]} {responseData.res[1]} 
      </Text>
    );
  }

  return(
    <SafeAreaView>
      <ScrollView>
      <View>
        <Text style={{fontSize: 30,
        color: "#005698", textAlign: 'center', fontFamily: 'Anton-Regular'}}>Sort The 6ix</Text>
        <Image
          source = {{uri:imageUri}}
          ratio={'1:1'}
          style={{ width: screenWidth, height: screenWidth }} // Adjust width and height as needed
        />
        {instructionsBody}
        <Button
          title="Go Back!"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </ScrollView>
    </SafeAreaView>
  )
}
const Stack = createNativeStackNavigator();
export default function App() {
  return( 
  <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Image" component={CameraScreen} />
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      </Stack.Navigator>
  </NavigationContainer>
  )
}