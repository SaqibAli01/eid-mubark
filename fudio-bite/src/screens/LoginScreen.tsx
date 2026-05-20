import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { AppTheme } from "../constants/theme";
import { useAuthStore } from "../store/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const isCompact = width < 420;

  async function handleLogin() {
    setLoading(true);
    try {
      await login(username.trim(), password);
      // navigate to home
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Login failed", err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={[styles.illustration, isCompact && styles.smallLogo]}>
            <Text style={styles.logoMark}>FB</Text>
          </View>
          <View style={[styles.card, isCompact && styles.cardCompact]}>
            <Text style={styles.kicker}>Restaurant POS</Text>
            <Text style={[styles.title, isCompact && styles.titleCompact]}>
              Fudio Bite
            </Text>
            <Text style={styles.subtitle}>Sign in to manage your counter</Text>
            <TextInput
              placeholder="Username"
              placeholderTextColor={AppTheme.muted}
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor={AppTheme.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
                loading && styles.disabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 22,
  },
  content: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  illustration: {
    alignSelf: "center",
    width: 116,
    height: 116,
    borderRadius: 36,
    backgroundColor: AppTheme.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -18,
    zIndex: 1,
    boxShadow: "0px 8px 18px rgba(0, 0, 0, 0.22)",
    elevation: 8,
  },
  logoMark: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
  },
  smallLogo: {
    width: 96,
    height: 96,
    borderRadius: 30,
  },
  card: {
    backgroundColor: AppTheme.card,
    borderRadius: 26,
    padding: 22,
    paddingTop: 34,
    boxShadow: "0px 10px 22px rgba(0, 0, 0, 0.18)",
    elevation: 10,
  },
  cardCompact: {
    padding: 18,
    paddingTop: 32,
  },
  kicker: {
    color: AppTheme.accent,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    textAlign: "center",
  },
  titleCompact: {
    fontSize: 28,
  },
  title: {
    color: AppTheme.text,
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: AppTheme.muted,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 18,
  },
  input: {
    backgroundColor: "#F8F8FC",
    color: AppTheme.text,
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  primaryButton: {
    backgroundColor: AppTheme.primary,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  disabled: { opacity: 0.65 },
  pressed: { opacity: 0.85 },
});
