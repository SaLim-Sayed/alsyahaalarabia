import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { loginUser } from '@/services/api';
import { EnvelopeIcon, LockClosedIcon, ArrowLeftIcon, ArrowRightIcon } from 'react-native-heroicons/outline';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const router = useRouter();
  const { setUser } = useAppStore();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username || !password) {
      setError(t('auth.requiredFields'));
      return;
    }

    setIsLoading(true);
    setError(null);
    Keyboard.dismiss();

    try {
      const data = await loginUser(username, password);
      setUser({
        id: data.user_id || '1',
        name: data.user_display_name || data.user_nicename,
        email: data.user_email,
      }, data.token);
      
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(t('auth.invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000&auto=format&fit=crop' }}
        className="flex-1"
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(26,60,52,0.6)', 'rgba(26,60,52,0.9)']}
          className="flex-1"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 px-8 justify-center"
          >
            {/* Back Button */}
            <TouchableOpacity 
              onPress={() => router.back()}
              className="absolute top-14 left-6 w-10 h-10 rounded-full bg-white/10 items-center justify-center"
            >
              {isRTL ? <ArrowRightIcon size={20} color="white" /> : <ArrowLeftIcon size={20} color="white" />}
            </TouchableOpacity>

            <View className="mb-12">
              <Text className="text-white text-4xl font-[Cairo_700Bold] text-start mb-2">
                {t('auth.welcomeBack')}
              </Text>
              <Text className="text-accent text-lg font-[Cairo_400Regular] text-start">
                {t('auth.signInToContinue')}
              </Text>
            </View>

            <View className="space-y-6">
              {/* Username Input */}
              <View className="bg-white/10 rounded-2xl p-4 flex-row items-center border border-white/10">
                <EnvelopeIcon size={20} color="#fbbf24" style={{ marginHorizontal: 10 }} />
                <TextInput
                  placeholder={t('auth.usernameOrEmail')}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  className={`flex-1 text-white font-[Cairo_400Regular] text-start h-10`}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View className="bg-white/10 rounded-2xl p-4 flex-row items-center border border-white/10 mt-4">
                <LockClosedIcon size={20} color="#fbbf24" style={{ marginHorizontal: 10 }} />
                <TextInput
                  placeholder={t('auth.password')}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  className={`flex-1 text-white font-[Cairo_400Regular] text-start h-10`}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {error && (
                <Text className="text-red-400 font-[Cairo_400Regular] text-xs text-start mt-2 px-2">
                  {error}
                </Text>
              )}

              <TouchableOpacity 
                onPress={handleLogin}
                disabled={isLoading}
                className="bg-accent h-16 rounded-2xl items-center justify-center mt-10 shadow-lg"
              >
                {isLoading ? (
                  <ActivityIndicator color="#1a3c34" />
                ) : (
                  <Text className="text-primary text-lg font-[Cairo_700Bold]">
                    {t('auth.login')}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity className="mt-6">
                <Text className="text-white/60 text-center font-[Cairo_400Regular]">
                  {t('auth.forgotPassword')}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="absolute bottom-12 left-0 right-0 items-center">
              <TouchableOpacity onPress={() => {}}>
                <Text className="text-white/80 font-[Cairo_400Regular]">
                  {t('auth.noAccount')} <Text className="text-accent font-[Cairo_700Bold]">{t('auth.signUp')}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
