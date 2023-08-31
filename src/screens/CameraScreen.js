import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  StatusBar,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const SIZE = 100.0;

export default function CameraScreen() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [type, setType] = useState(CameraType.back);
  const [video, setVideo] = useState();

  // OPEN GALLARY BUTTON
  const onOpenGallaryHandler = async () => {
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  };

  // START RECORDING BUTTON
  const recordVideo = () => {
    setIsRecording(true);
    const options = {
      quality: "1080p",
      maxDuration: 60,
      mute: false,
    };

    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
    });
  };

  // STOP RECORDING BUTTON
  const stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };

  // FLIP CAMERA FRONT/BACK
  const onFlipCameraHandler = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  // DELETE RECORDED VIDEO
  const onDeleteButtonHandler = () => setVideo(undefined);

  // SAVE RECORDED VIDEO
  const onSaveVideoHandler = () => {
    MediaLibrary.saveToLibraryAsync(video.uri).then((res) => {
      setVideo(undefined);
      ToastAndroid.show(
        "Video Saved Sucessfully...",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    });
  };

  // SHARE RECORDED VIDEO
  const onShareVideoHandler = () => {
    shareAsync(video.uri).then(() => {
      setVideo(undefined);
    });
  };

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission =
        await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  // CHECK PERMISSIONS REQUIRED
  if (
    hasCameraPermission === undefined ||
    hasMicrophonePermission === undefined
  ) {
    return (
      <View style={styles.checkPermissionText}>
        <Text style={{}}>Requestion permissions...</Text>
      </View>
    );
  } else if (!hasCameraPermission) {
    return (
      <View style={styles.checkPermissionText}>
        <Text>Permission for camera not granted.</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Fi Ellements Assignment</Text>
      </View>

      {/* Camera Screen */}
      <Camera style={styles.container} ref={cameraRef} type={type}></Camera>

      {!video ? (
        <View style={styles.bottomBarContainer}>
          {/* OPEN MOBILE GALLARY BY PRESSING IMAGE ICON */}
          <MaterialCommunityIcons
            name="image"
            size={SIZE / 3}
            color="#007FFF"
            onPress={onOpenGallaryHandler}
          />

          {/* START/STOP SCREEN RECORDING BY TOUCHING START/STOP ICONS*/}
          <Pressable onPress={isRecording ? stopRecording : recordVideo}>
            {isRecording ? (
              <MaterialCommunityIcons
                name="stop-circle"
                size={SIZE / 1.5}
                color="red"
              />
            ) : (
              <MaterialCommunityIcons
                name="record-circle"
                size={SIZE / 1.5}
                color="black"
              />
            )}
          </Pressable>

          {/* FLIP CAMERA TYPE (FRONT/BACK) BY PRESSING ROTATE CAMERA ICON */}
          <MaterialCommunityIcons
            name="camera-flip"
            size={SIZE / 3}
            color="#007FFF"
            onPress={onFlipCameraHandler}
          />
        </View>
      ) : (
        <View style={styles.secondaryBottomBar}>
          {/* DELETE BUTTON - To delete the recorded video */}
          <MaterialCommunityIcons
            name="delete-circle"
            size={SIZE / 2.5}
            color="black"
            onPress={onDeleteButtonHandler}
          />

          {/* SAVE BUTTON - To save the recorded video into mobile gallary */}
          {hasMediaLibraryPermission ? (
            <MaterialCommunityIcons
              name="download-circle"
              size={SIZE / 1.5}
              color="#007FFF"
              onPress={onSaveVideoHandler}
            />
          ) : undefined}

          {/* SHARE BUTTON - To share the recorded video */}
          <MaterialCommunityIcons
            name="share-circle"
            size={SIZE / 2.5}
            color="black"
            onPress={onShareVideoHandler}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  bottomBarContainer: {
    alignItems: "center",
    height: SIZE,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  checkPermissionText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: "#007FFF",
    padding: SIZE / 10,
    alignItems: "center",
  },
  headerText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryBottomBar: {
    alignItems: "center",
    flexDirection: "row",
    height: SIZE,
    justifyContent: "space-evenly",
  },
  video: {
    alignSelf: "stretch",
    flex: 1,
  },
});
