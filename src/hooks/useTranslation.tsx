
import { useState, useEffect, useContext, createContext } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    pricing: 'Pricing',
    myFiles: 'My Files',
    
    // Dashboard
    welcome: 'Welcome to Vaultigo',
    uploadFiles: 'Upload Files',
    recentFiles: 'Recent Files',
    storageUsage: 'Storage Usage',
    notifications: 'Notifications',
    search: 'Search files...',
    
    // Profile
    userProfile: 'User Profile',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    memberSince: 'Member Since',
    accountSecurity: 'Account Security',
    editProfile: 'Edit Profile',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    close: 'Close',
    
    // Settings
    settings: 'Settings',
    general: 'General',
    appearance: 'Appearance',
    security: 'Security',
    storageManagement: 'Storage Management',
    autoSync: 'Auto Sync',
    theme: 'Theme',
    language: 'Language',
    twoFactor: 'Two-Factor Authentication',
    publicSharing: 'Public Sharing',
    autoDownload: 'Auto Download',
    changePassword: 'Change Password',
    signOutAllDevices: 'Sign Out All Devices',
    clearCache: 'Clear Cache',
    optimizeStorage: 'Optimize Storage',
    emptyTrash: 'Empty Trash',
    
    // Themes
    dark: 'Dark',
    light: 'Light',
    system: 'System',
    
    // Messages
    settingsUpdated: 'Settings updated',
    profileUpdated: 'Profile updated',
    success: 'Success',
    error: 'Error',
    saving: 'Saving...',
    
    // Plans
    freePlan: 'Free Plan',
    proPlan: 'Pro Plan',
    elitePlan: 'Elite Plan',
    startFree: 'Start Free',
    choosePlan: 'Choose Plan',
    mostPopular: 'Most Popular',
    
    // Features
    storage: 'Storage',
    basicFileManagement: 'Basic file management',
    standardUploadSpeed: 'Standard upload speed',
    communitySupport: 'Community support',
    advancedAIFeatures: 'Advanced AI features',
    fastUploadDownload: 'Fast upload/download',
    prioritySupport: 'Priority support',
    fullAIAssistant: 'Full AI Assistant',
    enhancedSecurity: 'Enhanced security',
    vipSupport: 'VIP support 24/7',
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    pricing: 'मूल्य निर्धारण',
    myFiles: 'मेरी फाइलें',
    
    // Dashboard
    welcome: 'वॉल्टिगो में आपका स्वागत है',
    uploadFiles: 'फाइलें अपलोड करें',
    recentFiles: 'हाल की फाइलें',
    storageUsage: 'भंडारण उपयोग',
    notifications: 'सूचनाएं',
    search: 'फाइलें खोजें...',
    
    // Profile
    userProfile: 'उपयोगकर्ता प्रोफ़ाइल',
    fullName: 'पूरा नाम',
    emailAddress: 'ईमेल पता',
    memberSince: 'सदस्य बनने की तारीख',
    accountSecurity: 'खाता सुरक्षा',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    saveChanges: 'परिवर्तन सहेजें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    
    // Settings
    settings: 'सेटिंग्स',
    general: 'सामान्य',
    appearance: 'रूप',
    security: 'सुरक्षा',
    storageManagement: 'भंडारण प्रबंधन',
    autoSync: 'ऑटो सिंक',
    theme: 'थीम',
    language: 'भाषा',
    twoFactor: 'दो-कारक प्रमाणीकरण',
    publicSharing: 'सार्वजनिक साझाकरण',
    autoDownload: 'ऑटो डाउनलोड',
    changePassword: 'पासवर्ड बदलें',
    signOutAllDevices: 'सभी डिवाइस से साइन आउट',
    clearCache: 'कैश साफ़ करें',
    optimizeStorage: 'भंडारण अनुकूलित करें',
    emptyTrash: 'कचरा खाली करें',
    
    // Themes
    dark: 'गहरा',
    light: 'उजला',
    system: 'सिस्टम',
    
    // Messages
    settingsUpdated: 'सेटिंग्स अपडेट हो गईं',
    profileUpdated: 'प्रोफ़ाइल अपडेट हो गया',
    success: 'सफलता',
    error: 'त्रुटि',
    saving: 'सहेज रहे हैं...',
    
    // Plans
    freePlan: 'मुफ्त योजना',
    proPlan: 'प्रो योजना',
    elitePlan: 'एलीट योजना',
    startFree: 'मुफ्त शुरू करें',
    choosePlan: 'योजना चुनें',
    mostPopular: 'सबसे लोकप्रिय',
    
    // Features
    storage: 'भंडारण',
    basicFileManagement: 'बुनियादी फाइल प्रबंधन',
    standardUploadSpeed: 'मानक अपलोड गति',
    communitySupport: 'समुदायिक सहायता',
    advancedAIFeatures: 'उन्नत AI सुविधाएं',
    fastUploadDownload: 'तेज़ अपलोड/डाउनलोड',
    prioritySupport: 'प्राथमिकता सहायता',
    fullAIAssistant: 'पूर्ण AI सहायक',
    enhancedSecurity: 'बेहतर सुरक्षा',
    vipSupport: 'VIP सहायता 24/7',
  },
  es: {
    // Navigation
    dashboard: 'Panel de Control',
    pricing: 'Precios',
    myFiles: 'Mis Archivos',
    
    // Dashboard
    welcome: 'Bienvenido a Vaultigo',
    uploadFiles: 'Subir Archivos',
    recentFiles: 'Archivos Recientes',
    storageUsage: 'Uso de Almacenamiento',
    notifications: 'Notificaciones',
    search: 'Buscar archivos...',
    
    // Profile
    userProfile: 'Perfil de Usuario',
    fullName: 'Nombre Completo',
    emailAddress: 'Dirección de Email',
    memberSince: 'Miembro Desde',
    accountSecurity: 'Seguridad de la Cuenta',
    editProfile: 'Editar Perfil',
    saveChanges: 'Guardar Cambios',
    cancel: 'Cancelar',
    close: 'Cerrar',
    
    // Settings
    settings: 'Configuraciones',
    general: 'General',
    appearance: 'Apariencia',
    security: 'Seguridad',
    storageManagement: 'Gestión de Almacenamiento',
    autoSync: 'Sincronización Automática',
    theme: 'Tema',
    language: 'Idioma',
    twoFactor: 'Autenticación de Dos Factores',
    publicSharing: 'Compartir Público',
    autoDownload: 'Descarga Automática',
    changePassword: 'Cambiar Contraseña',
    signOutAllDevices: 'Cerrar Sesión en Todos los Dispositivos',
    clearCache: 'Limpiar Caché',
    optimizeStorage: 'Optimizar Almacenamiento',
    emptyTrash: 'Vaciar Papelera',
    
    // Themes
    dark: 'Oscuro',
    light: 'Claro',
    system: 'Sistema',
    
    // Messages
    settingsUpdated: 'Configuraciones actualizadas',
    profileUpdated: 'Perfil actualizado',
    success: 'Éxito',
    error: 'Error',
    saving: 'Guardando...',
    
    // Plans
    freePlan: 'Plan Gratuito',
    proPlan: 'Plan Pro',
    elitePlan: 'Plan Elite',
    startFree: 'Comenzar Gratis',
    choosePlan: 'Elegir Plan',
    mostPopular: 'Más Popular',
    
    // Features
    storage: 'Almacenamiento',
    basicFileManagement: 'Gestión básica de archivos',
    standardUploadSpeed: 'Velocidad de subida estándar',
    communitySupport: 'Soporte de la comunidad',
    advancedAIFeatures: 'Características avanzadas de IA',
    fastUploadDownload: 'Subida/descarga rápida',
    prioritySupport: 'Soporte prioritario',
    fullAIAssistant: 'Asistente de IA completo',
    enhancedSecurity: 'Seguridad mejorada',
    vipSupport: 'Soporte VIP 24/7',
  },
  fr: {
    // Navigation
    dashboard: 'Tableau de Bord',
    pricing: 'Tarification',
    myFiles: 'Mes Fichiers',
    
    // Dashboard
    welcome: 'Bienvenue dans Vaultigo',
    uploadFiles: 'Télécharger des Fichiers',
    recentFiles: 'Fichiers Récents',
    storageUsage: 'Utilisation du Stockage',
    notifications: 'Notifications',
    search: 'Rechercher des fichiers...',
    
    // Profile
    userProfile: 'Profil Utilisateur',
    fullName: 'Nom Complet',
    emailAddress: 'Adresse Email',
    memberSince: 'Membre Depuis',
    accountSecurity: 'Sécurité du Compte',
    editProfile: 'Modifier le Profil',
    saveChanges: 'Sauvegarder les Modifications',
    cancel: 'Annuler',
    close: 'Fermer',
    
    // Settings
    settings: 'Paramètres',
    general: 'Général',
    appearance: 'Apparence',
    security: 'Sécurité',
    storageManagement: 'Gestion du Stockage',
    autoSync: 'Synchronisation Automatique',
    theme: 'Thème',
    language: 'Langue',
    twoFactor: 'Authentification à Deux Facteurs',
    publicSharing: 'Partage Public',
    autoDownload: 'Téléchargement Automatique',
    changePassword: 'Changer le Mot de Passe',
    signOutAllDevices: 'Se Déconnecter de Tous les Appareils',
    clearCache: 'Vider le Cache',
    optimizeStorage: 'Optimiser le Stockage',
    emptyTrash: 'Vider la Corbeille',
    
    // Themes
    dark: 'Sombre',
    light: 'Clair',
    system: 'Système',
    
    // Messages
    settingsUpdated: 'Paramètres mis à jour',
    profileUpdated: 'Profil mis à jour',
    success: 'Succès',
    error: 'Erreur',
    saving: 'Sauvegarde...',
    
    // Plans
    freePlan: 'Plan Gratuit',
    proPlan: 'Plan Pro',
    elitePlan: 'Plan Elite',
    startFree: 'Commencer Gratuitement',
    choosePlan: 'Choisir le Plan',
    mostPopular: 'Le Plus Populaire',
    
    // Features
    storage: 'Stockage',
    basicFileManagement: 'Gestion de fichiers de base',
    standardUploadSpeed: 'Vitesse de téléchargement standard',
    communitySupport: 'Support communautaire',
    advancedAIFeatures: 'Fonctionnalités IA avancées',
    fastUploadDownload: 'Téléchargement rapide',
    prioritySupport: 'Support prioritaire',
    fullAIAssistant: 'Assistant IA complet',
    enhancedSecurity: 'Sécurité renforcée',
    vipSupport: 'Support VIP 24/7',
  },
};

interface TranslationContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('vaultigo-language', lang);
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('vaultigo-language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
