import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, TextInput, Alert } from "react-native";
import { Link, router } from "expo-router";
import { Text, View } from "components/Themed";
import { useState, useRef, useEffect } from "react";
import Colors from "constants/Colors";
import { supabase } from "@/utils/supabase";
import Toast from "react-native-toast-message";
import { useAuthStore } from "components/authStore";
import * as Network from "expo-network";
import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";

const siteKey = "c2a47a96-0c8e-48b8-a6c6-e60a2e9e4228";
const baseUrl = "https://hcaptcha.com";

export default function Modal() {
  const isPresented = router.canGoBack();
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [errorMessage, setError] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const captchaRef = useRef(null);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const { login } = useAuthStore();

  const checkInternetConnection = async () => {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected && networkState.isInternetReachable;
  };

  const onMessage = async (event: any) => {
    if (event && event.nativeEvent.data) {
      const token = event.nativeEvent.data;

      if (["cancel", "error", "expired"].includes(token)) {
        setShowCaptcha(false);
        Alert.alert(
          "Fehler",
          "Captcha-Überprüfung fehlgeschlagen. Bitte versuche es erneut."
        );
      } else {
        setCaptchaToken(token);
        handleLogin(token);
      }
    }
  };

  const handleLogin = async (captchaToken: any) => {
    if (email === "" || password === "") {
      setError("Bitte Email und Passwort eingeben");
      return;
    }

    try {
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken },
      });



      if (error) {
        console.error("Supabase Error:", error);
        setError("Email oder Passwort sind falsch!");
        setShowCaptcha(false);
        return;
      }

      Toast.show({
        type: "success",
        text1: "Login erfolgreich!",
      });
      router.navigate("/");
      await login();
      setCaptchaToken(null); // Reset captcha token
    } catch (err) {
      setError(
        "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut."
      );
      setShowCaptcha(true); // Show captcha again for retry
    }
  };

  const adminLogin = async () => {
    const isConnected = await checkInternetConnection();
    if (isConnected) {
      setShowCaptcha(true); // Show hCaptcha challenge
    } else {
      Alert.alert(
        "Bitte stelle sicher, dass du mit dem Internet verbunden bist, bevor du eine Frage schickst"
      );
    }
  };

  useEffect(() => {
    if (showCaptcha && captchaRef.current) {
      captchaRef.current.show();
    }
  }, [showCaptcha]);

  return (
    <View style={styles.container}>
      {!isPresented && <Link href='../'>Dismiss</Link>}
      <View style={styles.loginContainer}>
        <TextInput
          style={styles.emailInput}
          onChangeText={onChangeEmail}
          value={email}
          placeholder='Email'
          keyboardType='email-address'
          accessibilityLabel='Email Input'
          autoCapitalize='none'
        />
        <TextInput
          style={styles.passwordInput}
          onChangeText={onChangePassword}
          value={password}
          placeholder='Passwort'
          secureTextEntry={true}
          accessibilityLabel='Password Input'
        />
        <Pressable style={styles.loginButton} onPress={adminLogin}>
          <Text style={styles.loginText}>Login</Text>
        </Pressable>
      </View>
      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
      <StatusBar style='light' />
      {showCaptcha && (
        <ConfirmHcaptcha
          ref={captchaRef}
          siteKey={siteKey}
          baseUrl={baseUrl}
          onMessage={onMessage}
          languageCode='de'
          size="invisible"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  loginContainer: {
    flexDirection: "column",
    gap: 20,
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: Colors.light.white,
  },
  emailInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  loginButton: {
    alignSelf: "center",
  },
  loginText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.link,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 20,
    color: Colors.light.error,
  },
});
