import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Animated, Dimensions, Share, StatusBar, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// ── Replace with your Vercel URL after deploy ──
const WEBSITE_URL = 'https://your-project.vercel.app';

const { width, height } = Dimensions.get('window');

// ── Floating particle dot ──
function Particle({ delay }) {
  const anim = useRef(new Animated.Value(0)).current;
  const x = useRef(Math.random() * width).current;
  const size = useRef(Math.random() * 3 + 1).current;
  const isGold = useRef(Math.random() > 0.5).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 4000 + Math.random() * 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        bottom: 0,
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: isGold ? '#f5c518' : '#00ffd5',
        opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.8, 0] }),
        transform: [{
          translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -height] }),
        }],
      }}
    />
  );
}

// ── Firework spark ──
function Spark({ x, y, angle, onDone }) {
  const anim = useRef(new Animated.Value(0)).current;
  const hue = useRef(Math.floor(Math.random() * 360)).current;
  const speed = useRef(80 + Math.random() * 80).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start(onDone);
  }, []);

  const tx = Math.cos(angle) * speed;
  const ty = Math.sin(angle) * speed;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: `hsl(${hue},100%,65%)`,
        opacity: anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 0.6, 0] }),
        transform: [
          { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, tx] }) },
          { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, ty + 40] }) },
        ],
      }}
    />
  );
}

export default function App() {
  const [screen, setScreen] = useState('splash'); // splash | main
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [typedText, setTypedText] = useState('');
  const [sparks, setSparks] = useState([]);
  const [sparkKey, setSparkKey] = useState(0);

  const cardAnim = useRef(new Animated.Value(0)).current;
  const moonAnim = useRef(new Animated.Value(0)).current;
  const splashOpacity = useRef(new Animated.Value(1)).current;

  // Moon float loop
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moonAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(moonAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  function startExperience() {
    const n = name.trim() || 'Dost';
    setDisplayName(n);

    Animated.timing(splashOpacity, {
      toValue: 0, duration: 800, useNativeDriver: true,
    }).start(() => {
      setScreen('main');
      Animated.spring(cardAnim, {
        toValue: 1, tension: 60, friction: 8, useNativeDriver: true,
      }).start();
      startTyping(n);
      setTimeout(launchFireworks, 600);
    });
  }

  function startTyping(n) {
    const lines = [
      `✨ ${n}, Tech9et ki taraf se Eid Mubarak!`,
      `🌙 Yeh Eid khushiyon aur barkatoon se bhari ho.`,
      `💫 Kamyabi, sukoon aur mohabbat hamesha rahe.`,
      `🎉 Dil ki gehraiyoon se Eid Mubarak ho!`,
    ];
    const full = lines.join('\n');
    let i = 0;
    setTypedText('');
    const iv = setInterval(() => {
      i++;
      setTypedText(full.slice(0, i));
      if (i >= full.length) clearInterval(iv);
    }, 28);
  }

  function launchFireworks() {
    const newSparks = [];
    for (let b = 0; b < 5; b++) {
      const cx = width * (0.2 + Math.random() * 0.6);
      const cy = height * (0.1 + Math.random() * 0.4);
      for (let i = 0; i < 20; i++) {
        newSparks.push({
          id: `${sparkKey}-${b}-${i}`,
          x: cx, y: cy,
          angle: (Math.PI * 2 / 20) * i,
        });
      }
    }
    setSparkKey(k => k + 1);
    setSparks(newSparks);
    setTimeout(() => setSparks([]), 1200);
  }

  async function shareApp() {
    try {
      await Share.share({
        message: `🌙 Eid Mubarak! Tech9et ne mujhe ek khoobsurat surprise bheja — aap bhi dekho:\n${WEBSITE_URL}`,
        url: WEBSITE_URL,
      });
    } catch (e) {}
  }

  function reset() {
    setScreen('splash');
    setName('');
    setTypedText('');
    splashOpacity.setValue(1);
    cardAnim.setValue(0);
  }

  const particles = Array.from({ length: 40 }, (_, i) => i);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#050d1a" />

      {/* BG Gradient */}
      <LinearGradient
        colors={['#050d1a', '#0a1628', '#0d2035']}
        style={StyleSheet.absoluteFill}
      />

      {/* Particles */}
      {particles.map(i => <Particle key={i} delay={i * 120} />)}

      {/* Firework sparks */}
      {sparks.map(s => (
        <Spark key={s.id} x={s.x} y={s.y} angle={s.angle} onDone={() => {}} />
      ))}

      {/* ── SPLASH ── */}
      {screen === 'splash' && (
        <Animated.View style={[styles.splash, { opacity: splashOpacity }]}>
          <Text style={styles.logoText}>✦ TECH9ET ✦</Text>
          <Text style={styles.splashSub}>presents an Eid surprise for you</Text>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Apna naam likhein..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={name}
                onChangeText={setName}
                onSubmitEditing={startExperience}
                maxLength={30}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={startExperience} activeOpacity={0.85}>
                <LinearGradient
                  colors={['#00ffd5', '#00a896']}
                  style={styles.revealBtn}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.revealBtnText}>🌙 Reveal Magic</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}

      {/* ── MAIN SCENE ── */}
      {screen === 'main' && (
        <ScrollView
          contentContainerStyle={styles.scene}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Moon */}
          <Animated.View style={[styles.moonWrap, {
            transform: [{
              translateY: moonAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] }),
            }],
          }]}>
            <View style={styles.moon}>
              <View style={styles.moonShadow} />
            </View>
            <Text style={styles.moonStar}>⭐</Text>
          </Animated.View>

          {/* Card */}
          <Animated.View style={[styles.card, {
            opacity: cardAnim,
            transform: [{
              translateY: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }),
            }, {
              scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }),
            }],
          }]}>
            {/* Glowing border */}
            <LinearGradient
              colors={['#00ffd5', '#f5c518', '#00ffd5']}
              style={styles.cardBorder}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />

            <Text style={styles.eidTitle}>🌙 Eid Mubarak 🌙</Text>
            <Text style={styles.userName}>{displayName}</Text>

            <View style={styles.divider} />

            <Text style={styles.typeMsg}>{typedText}</Text>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity onPress={launchFireworks} activeOpacity={0.85} style={[styles.btn, styles.btnFire]}>
                <Text style={styles.btnText}>🎆 Celebrate!</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={shareApp} activeOpacity={0.85} style={[styles.btn, styles.btnShare]}>
                <Text style={[styles.btnText, { color: '#fff' }]}>📤 Share</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={reset} activeOpacity={0.85} style={[styles.btn, styles.btnReset]}>
                <Text style={[styles.btnText, { color: '#fff' }]}>🔄 Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Badge */}
            <Text style={styles.badge}>Crafted with ❤️ by <Text style={styles.badgeTeal}>Tech9et</Text></Text>
            <Text style={styles.badge}>Created by <Text style={styles.badgeGold}>Saqib Ali</Text></Text>
          </Animated.View>

          {/* Website link */}
          <TouchableOpacity onPress={shareApp} style={styles.webLink}>
            <Ionicons name="globe-outline" size={14} color="#00ffd5" />
            <Text style={styles.webLinkText}> {WEBSITE_URL}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050d1a' },

  // Splash
  splash: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    gap: 16, paddingHorizontal: 32,
  },
  logoText: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 22, color: '#00ffd5',
    letterSpacing: 5, textAlign: 'center',
    textShadowColor: '#00ffd5', textShadowRadius: 20,
  },
  splashSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textAlign: 'center' },
  inputWrap: { alignItems: 'center', gap: 14, marginTop: 8, width: '100%' },
  input: {
    borderWidth: 1.5, borderColor: '#00ffd5', borderRadius: 50,
    paddingVertical: 13, paddingHorizontal: 24,
    color: '#fff', fontSize: 15, textAlign: 'center',
    backgroundColor: 'rgba(0,255,213,0.07)', width: 280,
  },
  revealBtn: { borderRadius: 50, paddingVertical: 14, paddingHorizontal: 44 },
  revealBtnText: { color: '#000', fontWeight: '700', fontSize: 15, letterSpacing: 1 },

  // Scene
  scene: {
    alignItems: 'center', paddingTop: 60,
    paddingBottom: 40, paddingHorizontal: 16,
    minHeight: height,
  },

  // Moon
  moonWrap: { alignItems: 'center', marginBottom: -20, zIndex: 2 },
  moon: {
    width: 90, height: 90,
    borderRadius: 45,
    backgroundColor: '#f5c518',
    shadowColor: '#f5c518', shadowRadius: 30, shadowOpacity: 0.8,
    elevation: 20, overflow: 'hidden',
  },
  moonShadow: {
    position: 'absolute', top: '10%', left: '20%',
    width: '105%', height: '105%',
    backgroundColor: '#050d1a', borderRadius: 999,
  },
  moonStar: { fontSize: 22, marginTop: 6 },

  // Card
  card: {
    width: '100%', maxWidth: 480,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24, padding: 28,
    alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  cardBorder: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
    opacity: 0.8,
  },
  eidTitle: {
    fontSize: width < 360 ? 18 : 22,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: '#f5c518', textAlign: 'center', lineHeight: 32,
    textShadowColor: '#f5c518', textShadowRadius: 10,
  },
  userName: {
    fontSize: 18, color: '#00ffd5', marginTop: 6,
    textShadowColor: '#00ffd5', textShadowRadius: 12,
    fontWeight: '600',
  },
  divider: {
    width: '60%', height: 1,
    backgroundColor: '#f5c518',
    opacity: 0.4, marginVertical: 16,
  },
  typeMsg: {
    fontSize: width < 360 ? 13 : 14.5,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 26, textAlign: 'justify',
    width: '100%', minHeight: 80,
    letterSpacing: 0.3,
  },

  // Buttons
  btnRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20, justifyContent: 'center' },
  btn: { borderRadius: 50, paddingVertical: 10, paddingHorizontal: 20 },
  btnText: { fontWeight: '700', fontSize: 13, color: '#000' },
  btnFire: { backgroundColor: '#ff6b35' },
  btnShare: { backgroundColor: '#25d366' },
  btnReset: { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },

  // Badge
  badge: { marginTop: 6, fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5 },
  badgeTeal: { color: '#00ffd5', fontWeight: '700' },
  badgeGold: { color: '#f5c518', fontWeight: '700' },

  // Web link
  webLink: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 20, opacity: 0.5,
  },
  webLinkText: { color: '#00ffd5', fontSize: 11, letterSpacing: 1 },
});
