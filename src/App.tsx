/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search,
  MapPin,
  Calendar,
  Ticket,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Bot,
  Bell,
  Check,
  Github,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Plus,
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  Languages,
  Moon,
  Sun,
  LogOut,
  User as UserIcon,
  CreditCard,
  History,
  Filter,
  HeartHandshake,
  Bookmark,
  Sliders,
  UserCircle,
  Compass,
  ArrowLeftRight,
  AlertCircle,
  Instagram,
  Linkedin,
  Facebook,
  Shield,
  Globe,
  QrCode,
  Camera, Link2, Share2, Twitter,
  Edit2,
  BarChart3,
  PlusCircle,
  HelpCircle,
  Send,
  MessageSquare,
  Eye,
  Mic,
  AlertTriangle,
  Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Html5QrcodeScanner } from 'html5-qrcode';

// --- Types ---
interface Event {
  id: number;
  title: string;
  category: string;
  date: string;
  month: string;
  day: string;
  location: string;
  price: string;
  image: string;
  isTrending?: boolean;
  organizerId: number;
  ticketsSold?: number;
  revenue?: number;
  views?: number;
  checkins?: number;
  description?: string;
  type?: string;
  ticketType?: string;
  status?: 'active' | 'draft' | 'past';
}

type View = 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'create-event' | 'ticket-preview' | 'checkout-details' | 'checkout';
type Theme = 'light' | 'dark';
type Role = 'organizer' | 'audience';
type Language = 'en';

// --- Translations ---
const translations = {
  en: {
    findEvents: "Find Events",
    createEvent: "Create Event",
    helpCenter: "Help Center",
    logIn: "Log In",
    signUp: "Sign Up",
    searchPlaceholder: "Search events...",
    locationPlaceholder: "Jakarta, ID",
    searchButton: "Search",
    aiMatchmaker: "REvas'st",
    trending: "AI Trending: High Demand",
    getTickets: "Get Tickets",
    continue: "Continue",
    skip: "Skip",
    next: "Next",
    back: "Back",
    cancel: "Cancel",
    dashboard: "Dashboard",
    myEvents: "My Events",
    calendar: "Calendar",
    organizations: "Organizations",
    payments: "Payments",
    pastEvents: "Past Events",
    settings: "Settings",
    signOut: "Sign Out",
    welcome: "Welcome to REventS",
    authSubtitle: "Unlock personalized recommendations and manage your tickets.",
    emailAddress: "Email Address",
    fullName: "Full Name",
    password: "Password",
    confirmPassword: "Confirm Password",
    socialAuth: "Or continue with",
    googleAuth: "Google",
    support: "Support",
    contactCenter: "Contact Center",
    proOrganizer: "Pro Organizer",
    switchRole: "Switch Mode",
    organizerMode: "Organizer Mode",
    audienceMode: "Audience Mode",
    
    // Organizer Sidebar
    aiEventCoPilot: "Rev Co-pilot",
    myPublishedEvents: "Events",
    attendeesLogistics: "Logistics",
    communityImpact: "Impact",
    finance: "Finance",

    // Audience Sidebar
    exploreEvents: "Explore Events",
    myTickets: "Tickets",
    aiMatchmakerSidebar: "REvas'st",
    savedEvents: "Saved",
    interestPreferences: "Interests",
    accountPayment: "Account",

    // Dashboard Organizer Content
    overviewDesc: "Overview of your operations and AI insights.",
    totalSales: "Total Sales",
    liveAttendance: "Live Attendance",
    checkinsHr: "Check-ins/hr",
    aiSmartAlerts: "AI Smart Alerts",
    predictiveAlert: "Predictive analysis suggests a bottleneck at Entrance B between 18:00 - 18:30. Consider reallocating 2 staff members from Entrance A.",
    coPilotDesc: "Type your raw ideas and let AI generate the proposal, timeline, and checklist.",
    generateDraft: "Generate Draft",
    coPilotPlaceholder: "E.g., I want to organize a 2-day tech conference in CBD Jakarta focusing on web3...",
    myPubEventsDesc: "Manage your active, draft, and past events.",
    publishedActive: "Published (Active)",
    drafts: "Drafts",
    pastCompleted: "Past (Completed)",
    manage: "Manage",
    commImpactDesc: "Visualize local empowerment and your Community Impact Score.",
    impactScore: "Impact Score",
    localUmkm: "Local UMKM Supported",
    moduleActive: "Module Active",
    moduleReady: "module is functional and ready for configuration.",

    // Dashboard Audience Content
    myTixDesc: "Access your upcoming tickets and past history.",
    activeTickets: "Active Tickets",
    eventHistory: "Event History",
    readyToScan: "Ready to Scan",
    tomorrow: "Tomorrow",
    viewDetails: "View Details",
    savedEventsDesc: "Your wishlist for future events.",
    aiPredictionText: "AI Prediction: Tickets for \"Indie Fest\" are predicted to sell out in 3 hours. Secure yours now!",
    sectionReady: "Section Ready",
    sectionPersonalized: "section is personalized for your account.",
    aiMatchmakerDesc: "Curated experiences matched to your unique profile.",
    interestPrefDesc: "Update your preferences to help AI find the best events for you.",
    accountPaymentDesc: "Manage your profile, billing, and one-click payment options.",
    updatePreferences: "Update Preferences",
    managePayment: "Manage Payment Methods",
    categoriesLabel: "Categories",
    fullNameLabel: "Full Name",
    admitLabel: "Admit",
    onePerson: "1 Person",
    typeLabel: "Type",
    generalAccess: "General Access",

    dashboardDesc: "Manage and monitor your upcoming activities.",
    tixDashboardDesc: "See your upcoming and past events.",
    ticketsBought: "Tickets Bought",
    activeEvents: "Active Events",
    pointsEarned: "Points Earned",
    momGrowth: "+14% moM",
    recentActivity: "Recent Activity",
    filter: "Filter",
    confirmed: "Confirmed",
    createYourEvent: "Create Your",
    event: "Event",
    createEventDesc: "Start organizing your professional gathering or community meet-up today.",
    launchPortal: "Launch Creator Portal",
    seeResults: "See Results",
    aiRecProcessed: "AI Recommendation Processed",
    aiRecFound: "We've found events matching your profile.",
    engineReadyTitle: "Personalized Engine Ready",
    engineReadyDesc: "We've calculated the best events for you in Jakarta for 2024.",
    onboarding: {
      step1Title: "What are you interested in?",
      step1Desc: "Pick your favorite categories.",
      step1Options: ["Music", "Food", "Culture", "Tech"],
      step2Title: "What's your budget?",
      step2Desc: "Help us find tickets in your range.",
      step2Options: ["Under 50k", "100-300k", "500k+", "Free"],
      step3Title: "Preferred Event Frequency?",
      step3Desc: "How often do you want to explore?",
      step3Options: ["Single Day", "Weekend", "Monthly", "Annual Plan"],
      step4Title: "What's your age group?",
      step4Desc: "We'll suggest age-appropriate events.",
      step4Options: ["Teens", "Young Adult", "Professional", "All Ages"],
      step5Title: "All Set!",
      step5Desc: "Your profile is optimized by AI."
    },
    categories: ['All', 'Music', 'Tech', 'Food & Drink', 'Culture', 'Sports'],
    facebookAuth: "Facebook",
    linkedinAuth: "LinkedIn",
    checkout: "Checkout",
    completePurchase: "Complete Purchase",
    previewTicket: "Preview Ticket",
    ticketDetails: "Ticket Details",
    overview: "Overview",
    time: "Time & Location",
    yourOrder: "Your Order",
    paymentDetails: "Payment Details",
    paymentDesc: "All transactions are secure and encrypted.",
    total: "Total",
    checkoutSuccess: "Your RSVP is confirmed & tickets are ready!",
  }
};

// --- Mock Data ---
const EVENTS: Event[] = [
  { id: 1, title: "Summer Music Festival 2024", category: "Music", date: "Saturday, June 15", month: "JUN", day: "15", location: "Central Park, Jakarta", price: "IDR 250.000", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=450&q=70", isTrending: true, organizerId: 1 },
  { id: 2, title: "Future of AI Workshop", category: "Tech", date: "Wednesday, July 10", month: "JUL", day: "10", location: "Tech Hub, BSD City", price: "Free", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=450&q=70", organizerId: 1 },
  { id: 3, title: "Street Food Carnival", category: "Food & Drink", date: "Friday, June 21", month: "JUN", day: "21", location: "Kota Tua, Jakarta", price: "IDR 50.000", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=450&q=70", isTrending: true, organizerId: 1 },
  { id: 4, title: "Startup Networking Night", category: "Tech", date: "Thursday, June 27", month: "JUN", day: "27", location: "WeWork Co-working, Sudirman", price: "IDR 100.000", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=450&q=70", organizerId: 1 },
  { id: 5, title: "Jazz Under the Stars", category: "Music", date: "Saturday, July 20", month: "JUL", day: "20", location: "Senayan Golf Club", price: "IDR 450.000", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=450&q=70", organizerId: 1 },
  { id: 6, title: "Coffee Brewing Masterclass", category: "Food & Drink", date: "Sunday, June 30", month: "JUN", day: "30", location: "Roastery Lab, Tebet", price: "IDR 150.000", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=450&q=70", organizerId: 1 }
];

const CATEGORIES = ['All', 'Music', 'Tech', 'Food & Drink', 'Culture', 'Sports'];

const isDayOfEventOrPassed = (eventDateStr: string) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let parsedDate: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(eventDateStr)) {
      parsedDate = new Date(eventDateStr);
    } else {
      const monthMap: { [key: string]: number } = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
      };
      const cleanStr = eventDateStr.toLowerCase();
      let foundMonth = -1;
      let foundDay = -1;

      for (const [mName, mIdx] of Object.entries(monthMap)) {
        if (cleanStr.includes(mName)) {
          foundMonth = mIdx;
          break;
        }
      }

      const dayMatch = cleanStr.match(/\b\d{1,2}\b/);
      if (dayMatch) {
        foundDay = parseInt(dayMatch[0], 10);
      }

      if (foundMonth !== -1 && foundDay !== -1) {
        parsedDate = new Date(2026, foundMonth, foundDay);
      } else {
        parsedDate = new Date(eventDateStr);
      }
    }

    if (isNaN(parsedDate.getTime())) {
      return true;
    }

    parsedDate.setHours(0, 0, 0, 0);
    return today.getTime() >= parsedDate.getTime();
  } catch (e) {
    return true; 
  }
};

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
  });
  const [role, setRole] = useState<Role>('audience');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [organizerTab, setOrganizerTab] = useState('dashboard');
  const [publishedEventsTab, setPublishedEventsTab] = useState<'published' | 'drafts' | 'past'>('published');
  const [managingEvent, setManagingEvent] = useState<any>(null);
  const [eventEditReturnContext, setEventEditReturnContext] = useState<{
    organizerTab: string;
    publishedEventsTab: 'published' | 'drafts' | 'past';
    managingEvent: any;
  } | null>(null);
  const [managingSubView, setManagingSubView] = useState('overview');
  const [audienceTab, setAudienceTab] = useState('exploreEvents');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [myTicketsTab, setMyTicketsTab] = useState('active');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showSavedEventModal, setShowSavedEventModal] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [selectedTicketInfo, setSelectedTicketInfo] = useState<any>(null);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [email, setEmail] = useState('');
  const [showGoogleAccounts, setShowGoogleAccounts] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [checkoutFullName, setCheckoutFullName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutAudience, setCheckoutAudience] = useState('');
  const [checkoutReferral, setCheckoutReferral] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [previousView, setPreviousView] = useState<View>('landing');
  const [checkoutModal, setCheckoutModal] = useState<'preview' | 'details' | 'checkout' | null>(null);
  const [payoutBank, setPayoutBank] = useState('');
  const [payoutAccountNo, setPayoutAccountNo] = useState('');
  const [payoutAccountName, setPayoutAccountName] = useState('');
  const [newTeamMemberEmail, setNewTeamMemberEmail] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [isEditingOrganizerProfile, setIsEditingOrganizerProfile] = useState(false);
  const [isEditingOrganizerPayout, setIsEditingOrganizerPayout] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<any>(null);
  const [showMidtransSnap, setShowMidtransSnap] = useState(false);
  const [generatedVa, setGeneratedVa] = useState('');
  const [midtransTimer, setMidtransTimer] = useState('15:00');
  const [purchasedTicket, setPurchasedTicket] = useState<any>(null);
  const [purchasedTickets, setPurchasedTickets] = useState<any[]>([]);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentCarouselIdx, setCurrentCarouselIdx] = useState(0);

  const handleGoToCheckoutDetails = (customUser?: any) => {
    if (isAuthenticated) {
      const userObj = customUser || currentUser;
      if (userObj) {
        setCheckoutFullName(userObj.fullName || '');
        setCheckoutEmail(userObj.email || '');
      } else {
        setCheckoutFullName(profileName || '');
        setCheckoutEmail(profileEmail || '');
      }
    } else {
      setCheckoutFullName('');
      setCheckoutEmail('');
    }
    setCheckoutAudience('');
    setCheckoutReferral('');
    setTicketQuantity(1);
    setCheckoutModal('details');
  };

  const authCategories = [
    {
      name: "Music",
      title: "Summer Music Festival",
      location: "Senayan, Jakarta",
      image: "https://images.unsplash.com/photo-1514525253361-bee8d48700df?auto=format&fit=crop&w=350&q=60"
    },
    {
      name: "Tech",
      title: "Future of AI Summit",
      location: "Tech Hub, BSD City",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=350&q=60"
    },
    {
      name: "Food",
      title: "Street Food Carnival",
      location: "Kota Tua, Jakarta",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=350&q=60"
    },
    {
      name: "Art",
      title: "Indo Art Exhibition",
      location: "Museum Macan, Jakarta",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=350&q=60"
    }
  ];
  const [authCategoryIndex, setAuthCategoryIndex] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAuthCategoryIndex((prev) => (prev + 1) % authCategories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (!showMidtransSnap) return;
    let seconds = 900; // 15 mins
    const interval = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(interval);
        setShowMidtransSnap(false);
        setToast({ message: "Payment session has expired.", show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
      } else {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        setMidtransTimer(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [showMidtransSnap]);

  const [eventDate, setEventDate] = useState('2026-06-15');
  const [eventCity, setEventCity] = useState('Jakarta, ID');
  const [eventAddress, setEventAddress] = useState('');
  const [eventOnlineLink, setEventOnlineLink] = useState('');
  const [eventTicketName, setEventTicketName] = useState('Standard Ticket');
  const [eventPrice, setEventPrice] = useState('150000');
  const [eventCapacity, setEventCapacity] = useState('100');
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [provideCertificate, setProvideCertificate] = useState(false);
  const [distributingCertificates, setDistributingCertificates] = useState(false);

  const [events, setEvents] = useState<Event[]>([]);
  const [userTickets, setUserTickets] = useState<any[]>([]);
  const [selectedScrapbookTicket, setSelectedScrapbookTicket] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showInstagramSharePreview, setShowInstagramSharePreview] = useState(false);

  const isScrapbookCategory = (category?: string) => {
    if (!category) return false;
    const cat = category.toLowerCase();
    return cat.includes('music') || cat.includes('food') || cat.includes('culture') || cat.includes('art') || cat.includes('entertainment');
  };

  const [currentUser, setCurrentUser] = useState<any>(null);
  const teamMembers = currentUser?.preferences?.teamMembers || [];
  const [copilotResultObj, setCopilotResultObj] = useState<any>(null);
  const [savedEventIds, setSavedEventIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('savedEventIds');
      return saved ? JSON.parse(saved) : [3, 4];
    } catch (e) {
      return [3, 4];
    }
  });
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Sync saved events to localStorage
  React.useEffect(() => {
    localStorage.setItem('savedEventIds', JSON.stringify(savedEventIds));
  }, [savedEventIds]);
  const [organizerTickets, setOrganizerTickets] = useState<any[]>([]);
  const [prefCategories, setPrefCategories] = useState<string[]>([]);
  const [prefFormat, setPrefFormat] = useState('Any');
  const [prefAttendanceMode, setPrefAttendanceMode] = useState('Any');
  const [prefBudget, setPrefBudget] = useState('Any');
  const [aiRecommendedEventIds, setAiRecommendedEventIds] = useState<number[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState('');
  const [eventAttendeeSearchQuery, setEventAttendeeSearchQuery] = useState('');

  const [manualTicketCode, setManualTicketCode] = useState('');
  const [scannerIsScanning, setScannerIsScanning] = useState(false);
  const [scannedTicketDetails, setScannedTicketDetails] = useState<any>(null);

  const handleQrCheckIn = async (qrCodeStr: string) => {
    if (!managingEvent) return;
    try {
      const res = await apiFetch('/api/tickets/checkin-qr', {
        method: 'POST',
        body: JSON.stringify({
          qrCode: qrCodeStr,
          eventId: managingEvent.id
        })
      });
      
      setScannedTicketDetails({
        fullName: res.ticket.fullName,
        email: res.ticket.email,
        qrCode: res.ticket.qrCode,
        audienceCategory: res.ticket.audienceCategory,
        checkedIn: true
      });
      
      setToast({ message: `Check-in successful: ${res.ticket.fullName}!`, show: true });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
      
      setTimeout(() => setScannedTicketDetails(null), 3000);

      await loadOrganizerTickets();
      await loadEvents();
      await loadSearchResults(debouncedSearch, debouncedLocation, selectedCategory);
      setManualTicketCode('');
    } catch (err: any) {
      setToast({ message: err.message || "Failed to check in ticket", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    }
  };

  const simulateQrScan = (qrCodeStr: string) => {
    setScannerIsScanning(true);
    setScannedTicketDetails(null);
    setTimeout(async () => {
      setScannerIsScanning(false);
      await handleQrCheckIn(qrCodeStr);
    }, 1200);
  };

  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const currentToken = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(currentToken ? { 'Authorization': `Bearer ${currentToken}` } : {}),
      ...(options.headers || {}),
    };
    const res = await fetch(endpoint, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  };

  const loadEvents = async () => {
    try {
      const data = await apiFetch('/api/events');
      setEvents(data);
    } catch (err: any) {
      console.error("Failed to load events:", err);
    }
  };

  const loadSearchResults = async (search = '', location = '', category = 'All') => {
    try {
      let url = '/api/events';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (category && category !== 'All') params.append('category', category);
      const queryStr = params.toString();
      if (queryStr) url += `?${queryStr}`;
      const data = await apiFetch(url);
      setSearchResults(data);
    } catch (err: any) {
      console.error("Failed to load search results:", err);
    }
  };

  const loadUserTickets = async () => {
    try {
      const data = await apiFetch('/api/tickets/user');
      setUserTickets(data);
    } catch (err: any) {
      console.error("Failed to load user tickets:", err);
    }
  };

  const loadOrganizerTickets = async () => {
    try {
      const data = await apiFetch('/api/tickets/organizer');
      setOrganizerTickets(data);
    } catch (err: any) {
      console.error("Failed to load organizer tickets:", err);
    }
  };

  const handleCheckInTicket = async (ticketId: number) => {
    try {
      await apiFetch(`/api/tickets/${ticketId}/checkin`, {
        method: 'POST'
      });
      setToast({ message: "Guest checked in successfully!", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
      await loadOrganizerTickets();
      await loadEvents();
      await loadSearchResults(debouncedSearch, debouncedLocation, selectedCategory);
    } catch (err: any) {
      setToast({ message: err.message || "Failed to check in guest", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    }
  };

  const [activeVoiceField, setActiveVoiceField] = useState<string | null>(null);

  const handleVoiceInputForField = (field: 'copilot' | 'title' | 'shortDesc' | 'fullDesc') => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support Voice Input (Try using Chrome).");
      return;
    }

    if (activeVoiceField) {
      setActiveVoiceField(null);
      setIsRecordingCopilot(false);
      return;
    }
    
    setActiveVoiceField(field);
    setIsRecordingCopilot(true);
    setRecordingDuration(0);
    
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (field === 'copilot') {
        setCopilotInput((prev) => (prev ? prev + ' ' + transcript : transcript));
      } else if (field === 'title') {
        setEventTitle((prev) => (prev ? prev + ' ' + transcript : transcript));
      } else if (field === 'shortDesc') {
        setEventDescShort((prev) => (prev ? prev + ' ' + transcript : transcript));
      } else if (field === 'fullDesc') {
        setEventDescFull((prev) => (prev ? prev + ' ' + transcript : transcript));
      }
    };

    const stopRecording = () => {
      setActiveVoiceField(null);
      setIsRecordingCopilot(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      stopRecording();
    };

    recognition.onend = () => {
      stopRecording();
    };

    recognition.start();
  };

  const handleGenerateCopilot = async (promptText: string) => {
    setIsGeneratingCopilot(true);
    setCopilotResult(null);
    try {
      const data = await apiFetch('/api/copilot/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: promptText })
      });
      setCopilotResultObj(data);
      const formatted = `**Event Title:** ${data.title}\r\n**Category:** ${data.category}\r\n**Theme:** ${data.theme || 'Not specified'}\r\n**Time:** ${data.time || 'Not specified'}\r\n**Location:** ${data.location || 'Not specified'}\r\n**Description:** ${data.description}\r\n\r\n${data.fullDescription}`;
      setCopilotResult(formatted);
    } catch (err: any) {
      setToast({ message: err.message || "Failed to generate concept", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } finally {
      setIsGeneratingCopilot(false);
    }
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const newMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: newMessage }]);
    setIsChatLoading(true);

    try {
      const data = await apiFetch('/api/copilot/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: newMessage,
          history: chatMessages.map(m => ({ role: m.role, text: m.text }))
        })
      });
      setChatMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to send chat message.', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    try {
      await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: forgotEmail })
      });
      setForgotSent(true);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to send reset email.', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setProfileName('');
    setProfileEmail('');
    setProfilePicUrl(null);
    setRole('audience');
    setView('landing');
    setToast({ message: "Signed out successfully!", show: true });
    setTimeout(() => setToast({ message: '', show: false }), 3000);
    clearCopilotState();
  };

  // Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetNewPassword !== resetConfirmPassword) {
      setToast({ message: 'Passwords do not match.', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
      return;
    }
    try {
      await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token: resetToken, newPassword: resetNewPassword }),
      });
      setResetSuccess(true);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to reset password.', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    }
  };


  
  const handleEditEvent = (ev: any) => {
    setEventEditReturnContext({
      organizerTab: 'myPublishedEvents',
      publishedEventsTab: ev.status === 'draft' ? 'drafts' : 'published',
      managingEvent: managingEvent ? ev : null
    });

    setEditingEventId(ev.id);
    setEventTitle(ev.title || '');
    setEventCategory(ev.category || 'Tech');
    setEventDescShort(ev.description || '');
    setEventDescFull(ev.fullDescription || '');
    setEventDate(ev.date || '');
    
    // Parse location
    if (ev.type === 'online') {
      setEventType('online');
      setEventOnlineLink(ev.onlineLink || (ev.location ? ev.location.replace('Online (Tautan: ', '').replace(')', '') : ''));
    } else {
      setEventType('offline');
      if (ev.location) {
        const parts = ev.location.split(', ');
        if (parts.length > 1) {
          setEventCity(parts[0]);
          setEventAddress(parts.slice(1).join(', '));
        } else {
          setEventCity(ev.location);
          setEventAddress('');
        }
      }
    }

    if (ev.price === 'Free') {
      setTicketType('free');
      setEventPrice('0');
    } else {
      setTicketType('paid');
      const numericPrice = ev.price ? ev.price.toString().replace(/\D/g, '') : '150000';
      setEventPrice(numericPrice);
    }
    
    setEventCapacity(ev.capacity ? ev.capacity.toString() : '100');
    setEventPosterUrl(ev.image || null);
    setEventTicketName(ev.ticketName || 'Standard Ticket');
    setProvideCertificate(!!ev.provideCertificate);
    setEventIsExternal(!!ev.isExternal);
    setEventExternalUrl(ev.externalUrl || '');
    setEventExternalProvider(ev.externalProvider || '');

    setManagingEvent(null);
    setView('create-event');
    setShowCreateForm(true);
  };

  
  const updateEventSetting = async (updates: any) => {
    if (!managingEvent) return;
    try {
      await apiFetch(`/api/events/${managingEvent.id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      setManagingEvent({ ...managingEvent, ...updates });
      await loadEvents();
      setToast({ message: "Settings updated successfully!", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
    } catch (err: any) {
      setToast({ message: err.message || "Failed to update settings", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    }
  };

  const handleDeleteEvent = async () => {
    if (!managingEvent) return;
    if (!window.confirm("Are you sure you want to permanently delete this event?")) return;
    try {
      await apiFetch(`/api/events/${managingEvent.id}`, {
        method: 'DELETE'
      });
      setManagingEvent(null);
      setManagingSubView('overview');
      await loadEvents();
      setToast({ message: "Event deleted successfully!", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
    } catch (err: any) {
      setToast({ message: err.message || "Failed to delete event", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    }
  };

  const handleUploadTemplate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !managingEvent) return;

    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Harap unggah file gambar (PNG/JPG)', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      setIsGlobalLoading(true);
      try {
        const res = await apiFetch('/api/upload/upload', {
          method: 'POST',
          body: JSON.stringify({ image: base64Data })
        });
        await updateEventSetting({ certificateTemplateUrl: res.url });
        setToast({ message: 'Template sertifikat berhasil diunggah!', show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
      } catch (err: any) {
        setToast({ message: err.message || 'Gagal mengunggah template sertifikat', show: true });
        setTimeout(() => setToast({ message: '', show: false }), 4000);
      } finally {
        setIsGlobalLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDistributeCertificates = async () => {
    if (!managingEvent) return;
    setDistributingCertificates(true);
    try {
      const res = await apiFetch(`/api/events/${managingEvent.id}/distribute-certificates`, {
        method: 'POST'
      });
      setManagingEvent({ ...managingEvent, certificateReleased: true });
      await loadEvents();
      setToast({ message: `Sertifikat berhasil dibuat & dibagikan ke ${res.count || 0} peserta!`, show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } catch (err: any) {
      setToast({ message: err.message || "Gagal membagikan sertifikat", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } finally {
      setDistributingCertificates(false);
    }
  };

  const handleDownloadCertificate = (ticket: any, event: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    let certificateHtml = '';

    if (event.certificateTemplateUrl) {
      const templateBg = event.certificateTemplateUrl.startsWith('http')
        ? event.certificateTemplateUrl
        : `${window.location.protocol}//${window.location.host}${event.certificateTemplateUrl}`;

      certificateHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificate - ${ticket.fullName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;800&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f8fafc;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              font-family: 'Outfit', sans-serif;
            }
            .certificate-container {
              width: 842px;
              height: 595px;
              background-image: url('${templateBg}');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
              box-sizing: border-box;
            }
            .recipient-name {
              font-size: 38px;
              font-weight: 800;
              color: #1e1b4b;
              margin-top: 20px;
              max-width: 80%;
              word-wrap: break-word;
              text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
            }
            .print-button {
              position: fixed;
              bottom: 25px;
              right: 25px;
              background-color: #6366f1;
              color: white;
              border: none;
              padding: 12px 24px;
              font-size: 14px;
              font-weight: bold;
              border-radius: 8px;
              cursor: pointer;
              box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
              transition: all 0.2s;
              font-family: inherit;
            }
            .print-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 20px -3px rgba(99, 102, 241, 0.5);
            }
            @media print {
              .print-button { display: none; }
              body { background-color: white; margin: 0; }
              .certificate-container { box-shadow: none; width: 100vw; height: 100vh; }
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="recipient-name">${ticket.fullName || 'Attendee'}</div>
          </div>
          <button class="print-button" onclick="window.print()">Print / Save PDF</button>
        </body>
        </html>
      `;
    } else {
      certificateHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Certificate of Attendance - ${ticket.fullName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Montserrat', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f8fafc;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .certificate-container {
            width: 842px;
            height: 595px;
            padding: 50px;
            box-sizing: border-box;
            background-color: #ffffff;
            border: 24px solid #1e1b4b;
            outline: 3px solid #6366f1;
            outline-offset: -12px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          .background-decorations {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none;
            overflow: hidden;
          }
          .decor-top-left {
            position: absolute; top: -75px; left: -75px;
            width: 150px; height: 150px;
            border: 15px solid #6366f1;
            transform: rotate(45deg);
          }
          .decor-bottom-right {
            position: absolute; bottom: -75px; right: -75px;
            width: 150px; height: 150px;
            border: 15px solid #ec4899;
            transform: rotate(45deg);
          }
          .header {
            margin-top: 20px;
          }
          .header h1 {
            font-size: 36px;
            font-weight: 900;
            color: #1e1b4b;
            text-transform: uppercase;
            letter-spacing: 4px;
            margin: 0;
          }
          .header p {
            font-size: 13px;
            font-weight: 700;
            color: #6366f1;
            letter-spacing: 2px;
            margin: 8px 0 0 0;
            text-transform: uppercase;
          }
          .recipient-section {
            margin: 20px 0;
          }
          .presented-to {
            font-size: 14px;
            font-style: italic;
            color: #64748b;
            margin-bottom: 10px;
          }
          .recipient-name {
            font-size: 34px;
            font-weight: 700;
            color: #111827;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
            display: inline-block;
            min-width: 450px;
          }
          .details-section {
            max-width: 650px;
            margin-bottom: 20px;
          }
          .event-text {
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
          }
          .event-title {
            font-weight: 700;
            color: #6366f1;
          }
          .footer {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 40px;
            box-sizing: border-box;
            margin-bottom: 10px;
          }
          .signature-block {
            text-align: center;
            width: 220px;
          }
          .signature-line {
            border-top: 1px solid #cbd5e1;
            margin-top: 40px;
            padding-top: 8px;
            font-size: 10px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
          }
          .signature-name {
            font-size: 12px;
            font-weight: 700;
            color: #1e1b4b;
          }
          .badge {
            width: 90px; height: 90px;
            background: linear-gradient(135deg, #6366f1, #ec4899);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 900;
            font-size: 10px;
            box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
            letter-spacing: 1px;
            transform: rotate(-10deg);
            line-height: 1.4;
          }
          .print-button {
            position: fixed;
            bottom: 25px;
            right: 25px;
            background-color: #6366f1;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
            transition: all 0.2s;
            font-family: inherit;
          }
          .print-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 20px -3px rgba(99, 102, 241, 0.5);
          }
          @media print {
            .print-button { display: none; }
            body { background-color: white; }
            .certificate-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="background-decorations">
            <div class="decor-top-left"></div>
            <div class="decor-bottom-right"></div>
          </div>
          
          <div class="header">
            <h1>Certificate of Attendance</h1>
            <p>This is proudly presented to</p>
          </div>
          
          <div class="recipient-section">
            <div class="recipient-name">${ticket.fullName || 'Attendee'}</div>
          </div>
          
          <div class="details-section">
            <p class="event-text">
              for actively participating and successfully attending the event<br/>
              <span class="event-title">"${event.title}"</span><br/>
              held on <strong style="color: #1e1b4b">${event.date}</strong> at <strong style="color: #1e1b4b">${event.location}</strong>.
            </p>
          </div>
          
          <div class="footer">
            <div class="signature-block">
              <div class="signature-name">REventS Organizer Team</div>
              <div class="signature-line">Authorized Signature</div>
            </div>
            
            <div class="badge">REventS<br/>VERIFIED</div>
            
            <div class="signature-block">
              <div class="signature-name">${event.category} Event</div>
              <div class="signature-line">Category</div>
            </div>
          </div>
        </div>
        
        <button class="print-button" onclick="window.print()">Print / Save PDF</button>
      </body>
      </html>
    `;
    }
    printWindow.document.write(certificateHtml);
    printWindow.document.close();
  };

  const handleCreateEventSubmit = async (status: string = 'active') => {
    setIsGlobalLoading(true);
    try {
      if (!eventTitle.trim()) {
        throw new Error("Event title is required");
      }
      if (!eventDate) {
        throw new Error("Event date is required");
      }

      const formattedPrice = ticketType === 'free' ? 'Free' : `IDR ${Number(eventPrice || 0).toLocaleString('id-ID')}`;

      const finalLocation = eventType === 'offline' 
        ? (eventAddress ? `${eventCity}, ${eventAddress}` : eventCity)
        : 'Online';

      const requestBody = {
        title: eventTitle,
        category: eventCategory,
        date: eventDate,
        location: finalLocation,
        price: formattedPrice,
        image: eventPosterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        isTrending: false,
        description: eventDescShort,
        fullDescription: eventDescFull,
        capacity: parseInt(eventCapacity || '100', 10),
        type: eventType,
        ticketType: ticketType,
        ticketName: eventTicketName,
        onlineLink: eventOnlineLink,
        status: status,
        provideCertificate: ['Tech', 'Sports', 'Culture'].includes(eventCategory) ? provideCertificate : false,
        isExternal: eventIsExternal,
        externalUrl: eventIsExternal ? eventExternalUrl : undefined,
        externalProvider: eventIsExternal ? eventExternalProvider : undefined
      };

      let savedEvent: any = null;
      if (editingEventId) {
        savedEvent = await apiFetch(`/api/events/${editingEventId}`, {
          method: 'PUT',
          body: JSON.stringify(requestBody)
        });
        setToast({ message: "Event updated successfully!", show: true });
      } else {
        savedEvent = await apiFetch('/api/events', {
          method: 'POST',
          body: JSON.stringify(requestBody)
        });
        setToast({ message: "Event created successfully!", show: true });
      }

      setTimeout(() => setToast({ message: '', show: false }), 4000);
      
      await loadEvents();
      await loadSearchResults(debouncedSearch, debouncedLocation, selectedCategory);

      setEventTitle('');
      setEventDescShort('');
      setEventDescFull('');
      setEventPosterUrl(null);
      setEventAddress('');
      setEventOnlineLink('');
      setEventPrice('150000');
      setEventCapacity('100');
      setEditingEventId(null);
      setProvideCertificate(false);
      setEventIsExternal(false);
      setEventExternalUrl('');
      setEventExternalProvider('');

      // Reset Copilot state
      setCopilotInput('');
      setCopilotResult(null);
      setCopilotResultObj(null);

      setShowCreateForm(false);
      setView('dashboard');
      switchOrganizerTab('myPublishedEvents');
      if (savedEvent) {
        if (savedEvent.status === 'draft') {
          setManagingEvent(null);
          setPublishedEventsTab('drafts');
        } else {
          setManagingEvent(savedEvent);
          setManagingSubView('overview');
          setPublishedEventsTab('published');
        }
      } else {
        setManagingEvent(null);
      }
      setEventEditReturnContext(null);
    } catch (err: any) {
      setToast({ message: err.message || "Failed to create event", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsGlobalLoading(true);
    try {
      const updatedUser = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          fullName: profileName,
          profilePicUrl: profilePicUrl,
          preferences: {
            ...currentUser?.preferences,
            socials: {
              instagram: instagramUrl,
              twitter: twitterUrl
            }
          }
        })
      });
      setCurrentUser(updatedUser);
      setIsEditingOrganizerProfile(false);
      setToast({ message: 'Profile saved successfully.', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } catch (err: any) {
      setToast({ message: err.message || "Failed to save profile", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const handleSavePayout = async () => {
    if (!payoutBank || !payoutAccountNo || !payoutAccountName) {
      setToast({ message: 'Please fill all payout details.', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
      return;
    }
    setIsGlobalLoading(true);
    try {
      const updatedUser = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          preferences: {
            ...currentUser?.preferences,
            payout: {
              bankName: payoutBank,
              accountNo: payoutAccountNo,
              accountName: payoutAccountName
            }
          }
        })
      });
      setCurrentUser(updatedUser);
      setIsEditingOrganizerPayout(false);
      setToast({ message: 'Payout method saved permanently.', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } catch (err: any) {
      setToast({ message: err.message || "Failed to save payout method", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      setIsGlobalLoading(true);
      try {
        const res = await apiFetch('/api/upload/upload', {
          method: 'POST',
          body: JSON.stringify({ image: base64Data })
        });
        setProfilePicUrl(res.url);
        setToast({ message: 'Logo uploaded! Click Save Profile to persist changes.', show: true });
        setTimeout(() => setToast({ message: '', show: false }), 4000);
      } catch (err: any) {
        setToast({ message: err.message || 'Failed to upload image', show: true });
        setTimeout(() => setToast({ message: '', show: false }), 4000);
      } finally {
        setIsGlobalLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInviteTeamMember = async () => {
    if (!newTeamMemberEmail.trim() || !newTeamMemberEmail.includes('@')) {
      setToast({ message: 'Please enter a valid email address.', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
      return;
    }
    setIsGlobalLoading(true);
    try {
      await apiFetch('/api/team/invite', {
        method: 'POST',
        body: JSON.stringify({ email: newTeamMemberEmail })
      });
      
      setToast({ message: `Invitation email sent to ${newTeamMemberEmail}!`, show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
      setNewTeamMemberEmail('');
      
      // Update local state temporarily to show pending
      const currentTeam = currentUser?.preferences?.teamMembers || [];
      if (!currentTeam.some((m: any) => m.email.toLowerCase() === newTeamMemberEmail.toLowerCase())) {
        const updatedTeam = [
          ...currentTeam,
          { id: Date.now(), name: newTeamMemberEmail.split('@')[0], role: 'Pending Invitation', email: newTeamMemberEmail }
        ];
        setCurrentUser({
          ...currentUser,
          preferences: {
            ...currentUser.preferences,
            teamMembers: updatedTeam
          }
        });
      }
    } catch (err: any) {
      setToast({ message: err.message || "Failed to invite team member", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const handleRemoveTeamMember = async (emailToRemove: string) => {
    setIsGlobalLoading(true);
    try {
      const currentTeam = currentUser?.preferences?.teamMembers || [];
      const updatedTeam = currentTeam.filter((m: any) => m.email.toLowerCase() !== emailToRemove.toLowerCase());
      
      const updatedUser = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          preferences: {
            ...currentUser?.preferences,
            teamMembers: updatedTeam
          }
        })
      });
      setCurrentUser(updatedUser);
      setToast({ message: 'Team member removed successfully.', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } catch (err: any) {
      setToast({ message: err.message || "Failed to remove team member", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } finally {
      setIsGlobalLoading(false);
    }
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    const authErrorFromUrl = params.get('auth_error');
    const eventIdFromUrl = params.get('eventId');

    const teamAccepted = params.get('team_accepted');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authErrorFromUrl) {
      setToast({ message: `Google login failed: ${authErrorFromUrl}`, show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (teamAccepted === 'true') {
      setToast({ message: 'Welcome to the team! Invitation accepted successfully.', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 5000);
      window.history.replaceState({}, document.title, window.location.pathname);
      
      const tok = localStorage.getItem('token');
      if (tok) {
        apiFetch('/api/auth/profile')
          .then(profile => {
            setIsAuthenticated(true);
            setProfileName(profile.fullName);
            setProfileEmail(profile.email);
            if (profile.profilePicUrl) setProfilePicUrl(profile.profilePicUrl);
            if (profile.role) setRole(profile.role);
            setCurrentUser(profile);
            loadUserTickets();
            
            setView('dashboard');
            setRole('organizer');
            switchOrganizerTab('dashboard');
          })
          .catch(err => {
            console.error("Failed to reload profile after team accept:", err);
          });
      }
    }

    loadEvents();

    const existingToken = tokenFromUrl || localStorage.getItem('token');
    if (existingToken) {
        apiFetch('/api/auth/profile')
        .then(profile => {
          setIsAuthenticated(true);
          setProfileName(profile.fullName);
          setProfileEmail(profile.email);
          if (profile.profilePicUrl) setProfilePicUrl(profile.profilePicUrl);
          if (profile.role) setRole(profile.role);
          setCurrentUser(profile);
          loadUserTickets();
        })
        .catch(err => {
          console.error("Session expired:", err);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        });
    }

    if (eventIdFromUrl) {
      apiFetch(`/api/events/${eventIdFromUrl}`)
        .then(event => {
          setSelectedEvent(event);
          setPreviousView('landing');
          setCheckoutModal('preview');
        })
        .catch(err => {
          console.error("Failed to load direct event link:", err);
          setToast({ message: "Event not found or direct link invalid.", show: true });
          setTimeout(() => setToast({ message: '', show: false }), 4000);
        });
    }
  }, []);

  // Load mock notifications based on authentication and active role
  React.useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    if (role === 'organizer') {
      setNotifications([
        {
          id: 1,
          title: "Tiket Terjual! 🎟️",
          desc: "1 tiket General Access baru saja terjual untuk Summer Music Festival 2024.",
          time: "Baru saja",
          read: false,
          type: "sales"
        },
        {
          id: 2,
          title: "Rev Co-pilot Selesai 🤖",
          desc: "Bantuan draf proposal acara Anda 'Future of AI Workshop' siap digunakan.",
          time: "5m yang lalu",
          read: false,
          type: "ai"
        },
        {
          id: 3,
          title: "Peringatan Sistem ⚠️",
          desc: "Draf acara 'Street Food Carnival' belum dipublikasikan selama 3 hari.",
          time: "2j yang lalu",
          read: true,
          type: "warning"
        },
        {
          id: 4,
          title: "Kuota Tiket Menipis 🚨",
          desc: "Kuota tiket untuk Summer Music Festival 2024 tersisa 10%!",
          time: "1h yang lalu",
          read: true,
          type: "warning"
        }
      ]);
    } else {
      setNotifications([
        {
          id: 5,
          title: "Reminder Acara 📅",
          desc: "Summer Music Festival 2024 dimulai besok pukul 10:00 WIB. Siapkan QR code tiket Anda.",
          time: "H-1 Acara",
          read: false,
          type: "reminder"
        },
        {
          id: 6,
          title: "Sertifikat Tersedia 🏆",
          desc: "Sertifikat kehadiran untuk Future of AI Workshop sudah terbit. Unduh sekarang!",
          time: "3j yang lalu",
          read: false,
          type: "certificate"
        },
        {
          id: 7,
          title: "Rekomendasi AI Baru ✨",
          desc: "REvas'st menyarankan 'Startup Networking Night' sesuai minat teknologi Anda.",
          time: "1h yang lalu",
          read: true,
          type: "recommendation"
        }
      ]);
    }
  }, [role, isAuthenticated]);

  // Handle outside clicks to close the notification dropdown
  React.useEffect(() => {
    if (!showNotificationDropdown) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notification-bell-container')) {
        setShowNotificationDropdown(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showNotificationDropdown]);

  // Reset active editing states on navigation/tab switches
  React.useEffect(() => {
    if (view !== 'create-event') {
      setEditingEventId(null);
    }
    setIsEditingProfile(false);
    setShowRecommendations(false);
  }, [view, audienceTab, organizerTab, managingEvent, managingSubView]);

  React.useEffect(() => {
    if (isAuthenticated && role === 'organizer') {
      loadOrganizerTickets();
    }
  }, [isAuthenticated, role, organizerTab]);

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.preferences?.categories) {
        setPrefCategories(currentUser.preferences.categories);
      } else {
        setPrefCategories([]);
      }
      setPrefFormat(currentUser.preferences?.format || 'Any');
      setPrefAttendanceMode(currentUser.preferences?.attendanceMode || 'Any');
      setPrefBudget(currentUser.preferences?.budget || 'Any');
      setInstagramUrl(currentUser.preferences?.socials?.instagram || '');
      setTwitterUrl(currentUser.preferences?.socials?.twitter || '');
      setPayoutBank(currentUser.preferences?.payout?.bankName || '');
      setPayoutAccountNo(currentUser.preferences?.payout?.accountNo || '');
      setPayoutAccountName(currentUser.preferences?.payout?.accountName || '');
      
      // Update general profile states
      if (currentUser.fullName) setProfileName(currentUser.fullName);
      if (currentUser.profilePicUrl) setProfilePicUrl(currentUser.profilePicUrl);
    }
  }, [currentUser]);

  React.useEffect(() => {
    if (managingSubView !== 'scan' || scannedTicketDetails) return;

    let scanner: any = null;
    const timer = setTimeout(() => {
      const element = document.getElementById('qr-reader');
      if (!element) return;

      try {
        scanner = new Html5QrcodeScanner(
          'qr-reader',
          { 
            fps: 10, 
            qrbox: { width: 220, height: 220 },
            aspectRatio: 1.0
          },
          /* verbose= */ false
        );

        scanner.render(
          (decodedText: string) => {
            handleQrCheckIn(decodedText);
          },
          (error: any) => {
            // Silence scan noises
          }
        );
      } catch (e) {
        console.error("Scanner initialization error:", e);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      if (scanner) {
        scanner.clear().catch((err: any) => console.error("Failed to clear scanner", err));
      }
    };
  }, [managingSubView, scannedTicketDetails]);

  const toggleRole = () => {
    const newRole = role === 'organizer' ? 'audience' : 'organizer';
    setRole(newRole);
    if (newRole === 'audience' && view === 'create-event') {
      setView('dashboard');
      setAudienceTab('exploreEvents');
    }
  };

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedLocation, setDebouncedLocation] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);

  const loadAiRecommendations = async () => {
    setIsRecommendationsLoading(true);
    try {
      const res = await apiFetch('/api/copilot/recommend', { method: 'POST' });
      if (res && Array.isArray(res.recommendedEventIds)) {
        setAiRecommendedEventIds(res.recommendedEventIds);
      }
    } catch (err) {
      console.error("Failed to load AI recommendations", err);
    } finally {
      setIsRecommendationsLoading(false);
    }
  };

  const featuredEvents = useMemo(() => events.filter(e => e.isTrending && e.isPublic !== false && e.status === 'active').slice(0, 3), [events]);
  
  const recommendedEvents = useMemo(() => {
    if (aiRecommendedEventIds.length > 0) {
      return events.filter(e => aiRecommendedEventIds.includes(e.id) && e.status === 'active' && e.isPublic !== false);
    }
    const userCategories = currentUser?.preferences?.categories;
    if (!userCategories || userCategories.length === 0) {
      // Fallback to active trending events if no categories preferred
      return events.filter(e => e.isTrending && e.isPublic !== false && e.status === 'active');
    }
    return events.filter(e => 
      e.status === 'active' && 
      e.isPublic !== false &&
      userCategories.includes(e.category)
    );
  }, [events, currentUser]);
  
  useEffect(() => {
    if (featuredEvents.length > 0) {
      const timer = setInterval(() => {
        setCurrentCarouselIdx(prev => (prev + 1) % featuredEvents.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredEvents.length]);
  
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => setIsSearching(false), 600);
    return () => clearTimeout(timer);
    }, [searchQuery, locationQuery, selectedCategory]);

  // Debounce search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Debounce location query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocation(locationQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [locationQuery]);

  const prevViewRef = React.useRef(view);
  const prevRoleRef = React.useRef(role);
  const prevOrganizerTabRef = React.useRef(organizerTab);
  const prevAudienceTabRef = React.useRef(audienceTab);

  React.useEffect(() => {
    // 1. If we left 'create-event' view
    if (prevViewRef.current === 'create-event' && view !== 'create-event') {
      setEventType('offline');
      setTicketType('paid');
      setEventTitle('');
      setEventCategory('Tech');
      setEventDescShort('');
      setEventDescFull('');
      setEventPosterUrl(null);
      setEventDate('2026-06-15');
      setEventCity('Jakarta, ID');
      setEventAddress('');
      setEventOnlineLink('');
      setEventTicketName('Standard Ticket');
      setEventPrice('150000');
      setEventCapacity('100');
      setEditingEventId(null);
      setShowCreateForm(false);
      setEventEditReturnContext(null);
      setProvideCertificate(false);
      setEventIsExternal(false);
      setEventExternalUrl('');
      setEventExternalProvider('');
    }

    // 2. If we left 'landing' view (Explore Events)
    if (prevViewRef.current === 'landing' && view !== 'landing') {
      setSearchQuery('');
      setLocationQuery('');
      setSelectedCategory('All');
    }

    // 3. If we left the organizer view/tab
    const leftOrganizer = (prevViewRef.current === 'dashboard' && prevRoleRef.current === 'organizer' && (view !== 'dashboard' && view !== 'create-event' || role !== 'organizer'))
      || (prevViewRef.current === 'dashboard' && prevRoleRef.current === 'organizer' && view === 'dashboard' && role === 'organizer' && prevOrganizerTabRef.current !== organizerTab);

    if (leftOrganizer) {
      setManagingEvent(null);
      setManagingSubView('overview');
      setAttendeeSearchQuery('');
      setPublishedEventsTab('published');
      setCopilotInput('');
      setCopilotResult(null);
      setCopilotResultObj(null);
    }

    // 4. If we left the audience view/tab
    const leftAudience = (prevViewRef.current === 'dashboard' && prevRoleRef.current === 'audience' && (view !== 'dashboard' || role !== 'audience'))
      || (prevViewRef.current === 'dashboard' && prevRoleRef.current === 'audience' && view === 'dashboard' && role === 'audience' && prevAudienceTabRef.current !== audienceTab);

    if (leftAudience) {
      setMyTicketsTab('active');
      setShowTicketModal(false);
      setShowSavedEventModal(false);
      setSelectedTicketInfo(null);
    }

    // Update refs for next render
    prevViewRef.current = view;
    prevRoleRef.current = role;
    prevOrganizerTabRef.current = organizerTab;
    prevAudienceTabRef.current = audienceTab;
  }, [view, role, organizerTab, audienceTab]);


  // Trigger search results loading when selectedCategory, debouncedSearch, or debouncedLocation changes
  React.useEffect(() => {
    loadSearchResults(debouncedSearch, debouncedLocation, selectedCategory);
  }, [debouncedSearch, debouncedLocation, selectedCategory]);

  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  const [showDuplicateEmailModal, setShowDuplicateEmailModal] = useState(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    {role: 'ai', text: "Hello! 👋 I'm REvas'st. Looking for exciting events this weekend? Tell me what you're interested in (e.g. music, technology, or culinary)!"}
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatMessagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsChatOpen(false);
  }, [view, audienceTab, organizerTab, managingSubView]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pendingRSVP, setPendingRSVP] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('John Smith');
  const [profileEmail, setProfileEmail] = useState('john@example.com');
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  
  const [copilotInput, setCopilotInput] = useState('');
  const [isGeneratingCopilot, setIsGeneratingCopilot] = useState(false);
  const [isRecordingCopilot, setIsRecordingCopilot] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingIntervalRef = React.useRef<any>(null);
  const [eventRequestText, setEventRequestText] = useState('');
  const [copilotResult, setCopilotResult] = useState<string | null>(null);
  const [settingsTab, setSettingsTab] = useState('general');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Create Event Form States
  const [eventType, setEventType] = useState('offline'); // 'offline' | 'online'
  const [ticketType, setTicketType] = useState('paid'); // 'free' | 'paid'
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('Tech');
  const [eventDescShort, setEventDescShort] = useState('');
  const [eventDescFull, setEventDescFull] = useState('');
  const [eventPosterUrl, setEventPosterUrl] = useState<string | null>(null);

  // External Event and Redirection States
  const [redirectingEvent, setRedirectingEvent] = useState<any>(null);
  const [redirectProgress, setRedirectProgress] = useState(0);
  const redirectIntervalRef = React.useRef<any>(null);
  const [eventIsExternal, setEventIsExternal] = useState(false);
  const [eventExternalUrl, setEventExternalUrl] = useState('');
  const [eventExternalProvider, setEventExternalProvider] = useState('');

  const clearCopilotState = () => {
    setCopilotInput('');
    setCopilotResult(null);
    setCopilotResultObj(null);
  };

  const switchOrganizerTab = (newTab: string) => {
    setOrganizerTab(newTab);
    if (newTab !== 'aiEventCoPilot') {
      clearCopilotState();
    }
  };

  const organizerEvents = useMemo(() => {
    const ownerId = currentUser?.preferences?.joinedTeamOf || currentUser?.id;
    return events.filter(e => e.organizerId === ownerId);
  }, [events, currentUser]);

  const totalSalesVal = useMemo(() => {
    const total = organizerEvents.reduce((sum, e) => sum + (e.revenue || 0), 0);
    return `Rp ${total.toLocaleString('id-ID')}`;
  }, [organizerEvents]);

  const attendanceRateVal = useMemo(() => {
    const totalSold = organizerEvents.reduce((sum, e) => sum + (e.ticketsSold || 0), 0);
    const totalCheckins = organizerEvents.reduce((sum, e) => sum + (e.checkins || 0), 0);
    return totalSold > 0 ? `${Math.round((totalCheckins / totalSold) * 100)}%` : '0%';
  }, [organizerEvents]);

  const checkinsVal = useMemo(() => {
    const totalCheckins = organizerEvents.reduce((sum, e) => sum + (e.checkins || 0), 0);
    return totalCheckins.toLocaleString('id-ID');
  }, [organizerEvents]);

  const chartData = useMemo(() => {
    return organizerEvents.map(e => ({
      name: e.title.length > 10 ? e.title.substring(0, 10) + '...' : e.title,
      revenue: (e.revenue || 0) / 1000,
      checkins: e.checkins || 0
    }));
  }, [organizerEvents]);

  const t = translations.en;

  // --- Logic ---
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLocation = event.location.toLowerCase().includes(locationQuery.toLowerCase());
      return matchesCategory && matchesSearch && matchesLocation;
    });
  }, [events, selectedCategory, searchQuery, locationQuery]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  };
  const toggleLang = () => setLang(prev => prev === 'en' ? 'id' : 'en');

  const handleToggleSave = (eventId: number) => {
    if (!isAuthenticated) {
      setToast({ message: "To save events and checkout later, please sign in first!", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
      setView('auth');
      setAuthMode('login');
      return;
    }
    
    const event = events.find(e => e.id === eventId);
    const ownerId = currentUser?.preferences?.joinedTeamOf || currentUser?.id;
    if (event && event.organizerId === ownerId) {
      setToast({ message: "Organizers cannot save their own events.", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
      return;
    }
    
    if (savedEventIds.includes(eventId)) {
      setSavedEventIds(prev => prev.filter(id => id !== eventId));
      setToast({ message: "Event removed from saved list.", show: true });
    } else {
      setSavedEventIds(prev => [...prev, eventId]);
      setToast({ message: "Event saved to your wishlist!", show: true });
    }
    setTimeout(() => setToast({ message: '', show: false }), 3000);
  };

  const handleGetTickets = (event: any) => {
    if (event.isExternal) {
      setSelectedEvent(event);
      setRedirectingEvent(event);
      setRedirectProgress(0);
      if (redirectIntervalRef.current) {
        clearInterval(redirectIntervalRef.current);
      }
      
      let progress = 0;
      redirectIntervalRef.current = setInterval(() => {
        progress += 5;
        setRedirectProgress(progress);
        if (progress >= 100) {
          clearInterval(redirectIntervalRef.current);
          window.open(event.externalUrl || '#', '_blank');
          setRedirectingEvent(null);
        }
      }, 80); // 80ms * 20 = 1.6 seconds total
      return;
    }

    setSelectedEvent(event);
    setPreviousView(view);
    setCheckoutModal('preview');
  };

  const handleCancelRedirect = () => {
    if (redirectIntervalRef.current) {
      clearInterval(redirectIntervalRef.current);
    }
    setRedirectingEvent(null);
    setRedirectProgress(0);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGlobalLoading(true);
    try {
      let data;
      if (authMode === 'login') {
        data = await apiFetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        setToast({ message: "Login successful!", show: true });
      } else {
        data = await apiFetch('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, password, fullName, role }),
        });
        setToast({ message: "Registration successful!", show: true });
      }

      localStorage.setItem('token', data.token);
      setProfileEmail(data.user.email);
      setProfileName(data.user.fullName);
      if (data.user.profilePicUrl) setProfilePicUrl(data.user.profilePicUrl);
      if (data.user.role) setRole(data.user.role);
      setCurrentUser(data.user);

      setTimeout(() => setToast({ message: '', show: false }), 3000);
      
      await loadUserTickets();
      setIsAuthenticated(true);
      setRole('organizer');

      if (pendingRSVP) {
        if (data.user && pendingRSVP.organizerId === data.user.id) {
          setToast({ message: "Organizers cannot purchase tickets for their own events.", show: true });
          setTimeout(() => setToast({ message: '', show: false }), 4000);
          setCheckoutModal(null);
          setPendingRSVP(null);
        } else {
          handleGoToCheckoutDetails(data.user);
        }
      } else {
        setView('dashboard');
        switchOrganizerTab('dashboard');
      }
    } catch (err: any) {
      setToast({ message: err.message || "Authentication failed", show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const nextStep = () => {
    if (onboardingStep < 5) setOnboardingStep(prev => prev + 1);
    else {
      setIsAuthenticated(true);
      setRole('organizer');
      if (fullName) setProfileName(fullName);
      if (pendingRSVP) {
        if (currentUser && pendingRSVP.organizerId === currentUser.id) {
          setToast({ message: "Organizers cannot purchase tickets for their own events.", show: true });
          setTimeout(() => setToast({ message: '', show: false }), 4000);
          setCheckoutModal(null);
          setPendingRSVP(null);
        } else {
          handleGoToCheckoutDetails(currentUser);
        }
      } else {
        setView('dashboard');
      }
    }
  };

  const skipOnboarding = () => {
    setIsAuthenticated(true);
    if (fullName) setProfileName(fullName);
    setView('dashboard');
  };

  // --- Render Helpers ---

  const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <button onClick={() => setView('landing')} className="flex items-center text-2xl font-black text-indigo-600 tracking-tighter hover:opacity-90 transition-opacity">
              <span>REventS</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">

            
            <nav className="hidden lg:flex space-x-6 mr-4 items-center border-r border-slate-200 dark:border-slate-800 pr-6">
              <button 
                onClick={() => {
                  if (role !== 'organizer') setRole('organizer');
                  if (!isAuthenticated) {
                    setToast({ message: "To start creating events and using AI Drafter, please sign in first!", show: true });
                    setTimeout(() => setToast({ message: '', show: false }), 4000);
                    setView('auth');
                    setAuthMode('login');
                  } else {
                    setShowCreateForm(false);
                    setView('create-event');
                  }
                }} 
                className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {t.createEvent}
              </button>
              <button onClick={() => {
                setTimeout(() => {
                  document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }} className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">{t.helpCenter}</button>
            </nav>

            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-indigo-600 transition-colors">{theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}</button>

            {isAuthenticated && (
              <div className="relative notification-bell-container">
                <button 
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className="p-2 text-slate-500 hover:text-indigo-600 transition-colors relative focus:outline-none cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                  )}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showNotificationDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                        <h4 className="font-black text-sm text-slate-950 dark:text-white">Pemberitahuan</h4>
                        {notifications.some(n => !n.read) && (
                          <button 
                            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                          >
                            Tandai semua dibaca
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/50 no-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                            Tidak ada pemberitahuan baru.
                          </div>
                        ) : (
                          notifications.map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                                if (role === 'organizer') {
                                  if (n.type === 'ai') switchOrganizerTab('aiEventCoPilot');
                                  else if (n.type === 'sales') switchOrganizerTab('finance');
                                  else switchOrganizerTab('myPublishedEvents');
                                } else {
                                  if (n.type === 'certificate') setAudienceTab('myTickets');
                                  else if (n.type === 'recommendation') setAudienceTab('revasst');
                                  else setAudienceTab('myTickets');
                                }
                                setShowNotificationDropdown(false);
                              }}
                              className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 text-left ${!n.read ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''}`}
                            >
                              <div className="flex-grow">
                                <div className="flex justify-between items-start gap-2">
                                  <h5 className={`text-xs font-bold leading-snug ${!n.read ? 'text-slate-950 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {n.title}
                                  </h5>
                                  <span className="text-[9px] text-slate-400 shrink-0 font-medium">{n.time}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">{n.desc}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3 ml-2 border-l border-slate-200 dark:border-slate-800 pl-6">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 leading-tight">Tickets: {userTickets.filter(t => t.status === 'active').length}</p>
                </div>
                <button onClick={() => {
                  setView('dashboard');
                  if (role === 'organizer') switchOrganizerTab('settings');
                  else setAudienceTab('accountPayment');
                }} className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black hover:scale-105 transition-transform overflow-hidden">
                   {profilePicUrl ? <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" /> : profileName ? profileName.substring(0, 2).toUpperCase() : 'U'}
                </button>
              </div>
            ) : (
              view !== 'auth' && (
                <button onClick={() => { setView('auth'); setAuthMode('login'); }} className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95">{t.logIn}</button>
              )
            )}
            <button className="lg:hidden p-2 text-slate-600 dark:text-slate-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-8 py-6 flex flex-col gap-4 overflow-hidden">
            {isAuthenticated ? (
              <>
                {/* Clickable User Profile Header */}
                <button 
                  onClick={() => {
                    setView('dashboard');
                    if (role === 'organizer') {
                      switchOrganizerTab('settings');
                    } else {
                      setAudienceTab('accountPayment');
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 w-full text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black overflow-hidden shadow-sm">
                    {profilePicUrl ? <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" /> : profileName ? profileName.substring(0, 2).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white leading-tight">{profileName || 'User'}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">{role === 'organizer' ? t.organizerMode : t.audienceMode}</p>
                  </div>
                </button>

                {/* Mode Switcher */}
                <button 
                  onClick={() => { toggleRole(); setIsMobileMenuOpen(false); }}
                  className="w-full flex justify-center items-center gap-2 px-3 py-2.5 border border-indigo-100 dark:border-slate-800 bg-indigo-50/50 dark:bg-slate-800 rounded-xl text-xs font-black text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 transition-colors"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  {role === 'organizer' ? 'Switch to Audience Mode' : 'Switch to Organizer Mode'}
                </button>

                <hr className="border-slate-50 dark:border-slate-800" />

                {/* Sign Out */}
                <button 
                  onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} 
                  className="text-left font-bold text-sm text-red-500 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> 
                  {t.signOut}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { 
                   if (role !== 'organizer') setRole('organizer');
                   setToast({ message: "To start creating events and using AI Drafter, please sign in first!", show: true });
                   setTimeout(() => setToast({ message: '', show: false }), 4000);
                   setView('auth');
                   setAuthMode('login');
                   setIsMobileMenuOpen(false);
                }} className="text-left font-bold text-sm text-slate-600 dark:text-slate-400">{t.createEvent}</button>

                <hr className="border-slate-50 dark:border-slate-800" />

                <button onClick={() => {
                  setTimeout(() => {
                    setView('landing');
                    setTimeout(() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }, 100);
                  setIsMobileMenuOpen(false);
                }} className="text-left font-bold text-sm text-slate-600 dark:text-slate-400">
                  {t.helpCenter}
                </button>
                
                <button onClick={() => { setView('auth'); setAuthMode('login'); setIsMobileMenuOpen(false); }} className="bg-indigo-600 text-white p-3 rounded-xl font-bold text-center">{t.logIn}</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );

  const LandingView = () => (
    <div className="bg-white dark:bg-slate-950 transition-colors min-h-screen">
      <section className="px-8 py-8 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400"><Search className="w-5 h-5" /></span>
              <input type="text" placeholder={t.searchPlaceholder} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium dark:text-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="relative lg:w-96">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400"><MapPin className="w-5 h-5" /></span>
              <input type="text" placeholder={t.locationPlaceholder} className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium dark:text-white" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
              {t.categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${selectedCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-105'}`}>{cat}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {featuredEvents.length > 0 && !searchQuery && !locationQuery && selectedCategory === 'All' && (
            <div className="mb-12">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Featured & Trending Events</h2>
              <div className="relative h-64 md:h-80 lg:h-[28rem] rounded-3xl overflow-hidden shadow-2xl group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentCarouselIdx}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <img src={featuredEvents[currentCarouselIdx].image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1.5" /> {t.trending}
                        </span>
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                          {featuredEvents[currentCarouselIdx].month} {featuredEvents[currentCarouselIdx].day}
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-5xl font-black mb-2 leading-tight max-w-3xl">{featuredEvents[currentCarouselIdx].title}</h3>
                      <p className="text-slate-200 text-sm md:text-base font-medium flex items-center gap-2 mb-6">
                        <MapPin className="w-4 h-4" /> {featuredEvents[currentCarouselIdx].type === 'online' ? 'Online' : featuredEvents[currentCarouselIdx].location}
                      </p>
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleGetTickets(featuredEvents[currentCarouselIdx])} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black shadow-xl hover:bg-indigo-500 hover:scale-105 transition-all">
                          {t.getTickets}
                        </button>
                        {!(isAuthenticated && featuredEvents[currentCarouselIdx].organizerId === (currentUser?.preferences?.joinedTeamOf || currentUser?.id)) && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleSave(featuredEvents[currentCarouselIdx].id);
                            }}
                            className="bg-white/20 hover:bg-white/30 text-white p-3.5 rounded-xl shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center border border-white/20 cursor-pointer"
                            title={savedEventIds.includes(featuredEvents[currentCarouselIdx].id) ? "Saved to wishlist" : "Save for later"}
                          >
                            <Bookmark className={`w-5 h-5 ${savedEventIds.includes(featuredEvents[currentCarouselIdx].id) ? "fill-white text-white" : "text-slate-200"}`} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                <div className="absolute bottom-6 right-8 flex gap-2">
                  {featuredEvents.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentCarouselIdx(idx)} className={`h-2.5 rounded-full transition-all ${idx === currentCarouselIdx ? 'bg-white w-8' : 'bg-white/40 w-2.5 hover:bg-white/60'}`} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <AnimatePresence>
          </AnimatePresence>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Nearby Events By Location</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {isSearching ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={`shimmer-${idx}`} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col shimmer-wrapper">
                  <div className="h-44 bg-slate-200 dark:bg-slate-800 shimmer-effect w-full"></div>
                  <div className="p-5 flex-grow space-y-4">
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 shimmer-effect"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2 shimmer-effect"></div>
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4 mt-4 shimmer-effect"></div>
                  </div>
                </div>
              ))
            ) : (
              searchResults.filter(event => event.isPublic !== false && event.status === 'active').map((event, idx) => (
                <motion.div layout key={event.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group relative overflow-hidden">
                  <div className="h-44 relative overflow-hidden bg-slate-200">
                    <img src={event.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className={`absolute inset-0 opacity-30 bg-gradient-to-br ${idx % 3 === 0 ? 'from-indigo-400 to-purple-500' : idx % 3 === 1 ? 'from-orange-400 to-red-500' : 'from-green-400 to-teal-500'}`}></div>
                    
                    {/* Wishlist Save Button */}
                    {!(isAuthenticated && event.organizerId === (currentUser?.preferences?.joinedTeamOf || currentUser?.id)) && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSave(event.id);
                        }}
                        className="absolute top-3 right-3 z-20 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 p-2.5 rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-110 active:scale-95 flex items-center justify-center border border-slate-100/50 dark:border-slate-800/50"
                        title={savedEventIds.includes(event.id) ? "Saved to wishlist" : "Save for later"}
                      >
                        <Bookmark className={`w-4 h-4 ${savedEventIds.includes(event.id) ? "fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`} />
                      </button>
                    )}

                    <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-md shadow-sm">
                      <div className="text-[10px] font-black text-indigo-600 uppercase text-center leading-tight">{event.month}</div>
                      <div className="text-lg font-black text-slate-900 text-center leading-tight">{event.day}</div>
                    </div>
                    {event.isTrending && (
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" /> {t.trending}
                        </span>
                      </div>
                    )}
                    {event.isExternal && (
                      <div className="absolute top-3 left-14">
                        <span className="bg-indigo-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md border border-white/20">
                          {event.externalProvider || 'Eksternal'}
                        </span>
                      </div>
                    )}
                    {event.isSalesClosed && (
                      <div className="absolute top-3 right-14">
                        <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                          Closed
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{event.type === 'online' ? 'Online' : event.location}</p>
                      <p className="text-sm font-bold text-indigo-600 mb-4">{event.price}</p>
                    </div>
                    {event.isSalesClosed ? (
                      <button onClick={() => handleGetTickets(event)} className="w-full py-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">View Details (Closed)</button>
                    ) : (
                      <button onClick={() => handleGetTickets(event)} className="w-full py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 font-bold rounded-lg hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">{t.getTickets}</button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
          {searchResults.filter(event => event.isPublic !== false && event.status === 'active').length === 0 && !isSearching && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-3xl border border-white/50 dark:border-slate-800/50 shadow-xl overflow-hidden relative group p-8 md:p-12 text-center flex flex-col items-center">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white/20 to-purple-50/50 dark:from-indigo-900/20 dark:via-slate-900/20 dark:to-purple-900/20 z-0"></div>
              <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              
              <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500">
                <Bot className="w-12 h-12 text-white" />
                <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3 relative z-10">Oops! No Events Found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg mb-8 relative z-10">Looks like there are no events matching your search right now. Want me to help find similar recommendations?</p>
              
              <button onClick={() => { setIsChatOpen(true); setChatMessages(prev => [...prev, { role: 'ai', text: "Tell me what type of event you're actually looking for!" }]); }} className="relative z-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Chat with REvas'st
              </button>
            </motion.div>
          )}

          {/* HOW IT WORKS SECTION */}
          <div className="mb-20">
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center">How REventS Works</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-3"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] text-center group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(99,102,241,0.1)] dark:hover:shadow-[0_20px_40px_rgba(99,102,241,0.2)] hover:border-indigo-500/20 dark:hover:border-indigo-400/20 transition-all duration-300">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-sm border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 relative">
                  <img src="/how_it_works_find.png" alt="Find Events" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none"></div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">1. Find Events</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Explore thousands of exciting events or ask the smart REvas'st assistant for personalized recommendations.</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] text-center group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(99,102,241,0.1)] dark:hover:shadow-[0_20px_40px_rgba(99,102,241,0.2)] hover:border-indigo-500/20 dark:hover:border-indigo-400/20 transition-all duration-300">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-sm border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 relative">
                  <img src="/how_it_works_ticket.png" alt="Secure Your Ticket" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none"></div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">2. Secure Your Ticket</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Book tickets quickly and securely using your preferred payment methods (QRIS, VA, e-Wallet).</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] text-center group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(99,102,241,0.1)] dark:hover:shadow-[0_20px_40px_rgba(99,102,241,0.2)] hover:border-indigo-500/20 dark:hover:border-indigo-400/20 transition-all duration-300">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-sm border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 relative">
                  <img src="/how_it_works_checkin.png" alt="Instant Check-In" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none"></div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">3. Instant Check-In</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Show your e-ticket QR Code at the entrance from your phone. No long queues, just enjoy the event!</p>
              </div>
            </div>
          </div>

          {/* EVENT REQUEST HUB */}
          <div className="mb-16 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/90 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/95 text-white rounded-3xl p-8 md:p-12 border border-indigo-500/20 dark:border-indigo-500/10 shadow-[0_25px_50px_-12px_rgba(99,102,241,0.25)] dark:shadow-none text-center relative overflow-hidden">
            {/* Background ambient lighting glows */}
            <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[-80px] right-[-80px] w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-purple-200">
              Haven't Found Your Dream Event Yet?
            </h2>
            <p className="text-slate-300 dark:text-slate-400 max-w-2xl mx-auto mb-8 text-sm md:text-base font-medium leading-relaxed">
              Submit the event idea you've been waiting for! We'll forward it to relevant organizers so it can be realized.
            </p>
            <div className="max-w-xl mx-auto relative group">
              <input 
                type="text" 
                placeholder="e.g. K-Pop concert in Jakarta next month..." 
                value={eventRequestText}
                onChange={(e) => setEventRequestText(e.target.value)}
                className="w-full pl-6 pr-36 py-4.5 bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-400/60 rounded-full shadow-inner focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-white placeholder:text-slate-500 text-sm font-medium backdrop-blur-md"
              />
              <button 
                onClick={() => {
                  if (eventRequestText.trim()) {
                    setToast({ message: "Event idea submitted! REvas'st will keep track of your request.", show: true });
                    setEventRequestText('');
                    setTimeout(() => setToast({ message: '', show: false }), 4000);
                  }
                }}
                className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-7 rounded-full font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center text-xs cursor-pointer"
              >
                Submit Idea
              </button>
            </div>
          </div>

          {/* MINI CTA BANNER FOR ORGANIZERS */}
          <div className="mb-8 rounded-3xl overflow-hidden relative shadow-[0_20px_50px_rgba(99,102,241,0.15)] dark:shadow-none border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800"></div>
            <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none z-0"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none z-0"></div>
            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Have Your Own Event? Create It on REventS Now!</h2>
                <p className="text-indigo-100 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
                  Want to create your own seminar, concert, or workshop? Use REventS AI Co-Pilot technology for instant ticket management and check-in.
                </p>
              </div>
              <button onClick={() => {
                setRole('organizer');
                if (!isAuthenticated) {
                  setToast({ message: "Sign in to start creating!", show: true });
                  setTimeout(() => setToast({ message: '', show: false }), 4000);
                  setView('auth');
                } else {
                  setShowCreateForm(false);
                  setView('create-event');
                }
              }} className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-black shadow-lg hover:bg-slate-50 hover:scale-105 hover:shadow-xl transition-all whitespace-nowrap cursor-pointer">
                Start Creating <ChevronRight className="w-5 h-5 inline-block ml-1" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  const AuthView = () => (
    <div className="min-h-[calc(100vh-8rem)] py-20 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors relative overflow-hidden bg-gradient-to-tr from-indigo-500/5 via-slate-50 to-purple-500/5 dark:from-indigo-500/5 dark:via-slate-950 dark:to-purple-500/5">
      {/* Subtle branding background glows with low opacity */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex min-h-[500px] md:min-h-[520px] flex-col md:flex-row"
      >
        {/* LOG IN COLUMN */}
        <motion.div 
          animate={{ 
            opacity: authMode === 'login' ? 1 : 0,
            x: authMode === 'login' ? 0 : -20,
            scale: authMode === 'login' ? 1 : 0.98
          }}
          transition={{ duration: 0.4 }}
          className={`w-full md:w-1/2 pt-8 pb-6 px-8 md:px-12 flex flex-col justify-start md:pt-10 ${authMode === 'login' ? 'relative z-10' : 'absolute pointer-events-none opacity-0 md:relative md:z-0 md:pointer-events-none'}`}
        >
          <div className="mb-3 text-center flex flex-col items-center">
            <button 
              type="button"
              onClick={() => setView('landing')} 
              className="flex items-center text-3xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity mb-0.5"
            >
              <span>REventS</span>
            </button>
            <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase text-xs">Sign In</h2>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 mb-4">
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">{t.emailAddress}</label>
              <div className="group relative rounded-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 focus-within:bg-white dark:focus-within:bg-slate-950/60 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.12)]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent dark:text-white placeholder:text-slate-400/60 outline-none text-sm font-medium transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-focus-within:w-full transition-all duration-300 rounded-full" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">{t.password}</label>
              <div className="group relative rounded-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 focus-within:bg-white dark:focus-within:bg-slate-950/60 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.12)]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent dark:text-white placeholder:text-slate-400/60 outline-none text-sm font-medium transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-focus-within:w-full transition-all duration-300 rounded-full" />
              </div>
            </div>
            {/* Forgot Password */}
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                onClick={() => { setForgotEmail(email); setForgotSent(false); setShowForgotPassword(true); }}
                className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 mt-2 rounded-xl font-bold shadow-lg shadow-indigo-500/25 dark:shadow-none transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2 cursor-pointer">
              {t.continue} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Google OAuth Button - Sign In */}
          <button
            type="button"
            id="btn-google-signin"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-sm font-bold transition-all active:scale-[0.98] shadow-sm mb-3"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Mobile-only toggle */}
          <div className="block md:hidden text-center text-xs text-slate-500 mb-4">
            Don't have an account?
            <button type="button" onClick={() => setAuthMode('signup')} className="ml-1 font-bold text-indigo-600 hover:text-indigo-700">
              {t.signUp}
            </button>
          </div>


        </motion.div>

        {/* SIGN UP COLUMN */}
        <motion.div 
          animate={{ 
            opacity: authMode === 'signup' ? 1 : 0,
            x: authMode === 'signup' ? 0 : 20,
            scale: authMode === 'signup' ? 1 : 0.98
          }}
          transition={{ duration: 0.4 }}
          className={`w-full md:w-1/2 pt-6 pb-6 px-8 md:px-12 flex flex-col justify-start md:pt-8 ${authMode === 'signup' ? 'relative z-10' : 'absolute pointer-events-none opacity-0 md:relative md:z-0 md:pointer-events-none'}`}
        >
          <div className="mb-3 text-center flex flex-col items-center">
            <button 
              type="button"
              onClick={() => setView('landing')} 
              className="flex items-center text-3xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-opacity mb-0.5"
            >
              <span>REventS</span>
            </button>
            <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase text-xs">Sign Up</h2>
          </div>

          <form onSubmit={handleAuth} className="space-y-3 mb-4">
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block">{t.fullName}</label>
              <div className="group relative rounded-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 focus-within:bg-white dark:focus-within:bg-slate-950/60 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.12)]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                </div>
                <input 
                  type="text" 
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-transparent dark:text-white placeholder:text-slate-400/60 outline-none text-sm font-medium transition-all"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-focus-within:w-full transition-all duration-300 rounded-full" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block">{t.emailAddress}</label>
              <div className="group relative rounded-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 focus-within:bg-white dark:focus-within:bg-slate-950/60 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.12)]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-transparent dark:text-white placeholder:text-slate-400/60 outline-none text-sm font-medium transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-focus-within:w-full transition-all duration-300 rounded-full" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block">{t.password}</label>
              <div className="group relative rounded-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 focus-within:bg-white dark:focus-within:bg-slate-950/60 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.12)]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-transparent dark:text-white placeholder:text-slate-400/60 outline-none text-sm font-medium transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-focus-within:w-full transition-all duration-300 rounded-full" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block">{t.confirmPassword}</label>
              <div className="group relative rounded-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 focus-within:bg-white dark:focus-within:bg-slate-950/60 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.12)]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors duration-200" />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-transparent dark:text-white placeholder:text-slate-400/60 outline-none text-sm font-medium transition-all"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-focus-within:w-full transition-all duration-300 rounded-full" />
              </div>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 mt-4 rounded-xl font-bold shadow-lg shadow-indigo-500/25 dark:shadow-none transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2 cursor-pointer">
              {t.continue} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Google OAuth Button - Sign Up */}
          <button
            type="button"
            id="btn-google-signup"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-sm font-bold transition-all active:scale-[0.98] shadow-sm mb-3"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign up with Google
          </button>

          {/* Mobile-only toggle */}
          <div className="block md:hidden text-center text-xs text-slate-500 mb-4">
            Already have an account?
            <button type="button" onClick={() => setAuthMode('login')} className="ml-1 font-bold text-indigo-600 hover:text-indigo-700">
              {t.logIn}
            </button>
          </div>


        </motion.div>

        {/* SLIDING DECORATIVE PANEL */}
        <motion.div 
          animate={{ x: authMode === 'login' ? '100%' : '0%' }}
          transition={{ type: "spring", stiffness: 100, damping: 16 }}
          className="hidden md:flex absolute top-0 bottom-0 left-0 w-1/2 z-20 text-white flex-col justify-center items-center p-10 text-center overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800"
        >
          {/* Visual Elements inside decorative panel */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none z-0" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none z-0" />

          {/* Floating glass card with Category images slider */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-[350px] p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl text-left mb-8 hidden lg:block z-10 overflow-hidden"
          >
            <div className="h-60 rounded-xl bg-slate-900/30 overflow-hidden mb-3 relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={authCategoryIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={authCategories[authCategoryIndex].image} 
                    alt={authCategories[authCategoryIndex].name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white z-10 font-sans">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={authCategoryIndex}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs font-black uppercase tracking-wider bg-indigo-500/80 px-2.5 py-0.5 rounded"
                  >
                    {authCategories[authCategoryIndex].name}
                  </motion.span>
                </AnimatePresence>
                
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={authCategoryIndex}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs font-bold opacity-90"
                  >
                    {authCategories[authCategoryIndex].location}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            
            <div className="h-12 flex flex-col justify-center px-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={authCategoryIndex}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-white text-base font-extrabold truncate">{authCategories[authCategoryIndex].title}</p>
                  <p className="text-indigo-200/90 text-xs font-semibold mt-0.5">Explore events near you</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="relative w-full z-10">
            <AnimatePresence mode="wait">
              {authMode === 'login' ? (
                <motion.div
                  key="login-info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <h3 className="text-2xl font-black mb-3 tracking-tight">New to REventS?</h3>
                  <p className="text-xs text-indigo-100/90 mb-8 max-w-xs font-medium leading-relaxed">
                    Create an account and unlock personalized event feeds, live search, and AI-assisted matchmaking.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="px-8 py-2.5 border-2 border-white text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-indigo-950 transition-all active:scale-95 shadow-md shadow-black/10 cursor-pointer"
                  >
                    Create Account
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="signup-info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <h3 className="text-2xl font-black mb-3 tracking-tight">Welcome Back!</h3>
                  <p className="text-xs text-indigo-100/90 mb-8 max-w-xs font-medium leading-relaxed">
                    Log in with your email to access your registered tickets, manage event logistics, or start drawing proposals.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="px-8 py-2.5 border-2 border-white text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-indigo-950 transition-all active:scale-95 shadow-md shadow-black/10 cursor-pointer"
                  >
                    Sign In
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>


      {/* Google OAuth Redirect Modal */}
      <AnimatePresence>
        {showGoogleAccounts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowGoogleAccounts(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6"
            >
              <div className="text-center mb-4">
                <svg className="w-9 h-9 mx-auto mb-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Sign in with Google</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">You will be redirected to the Google sign-in page</p>
              </div>
              <div className="flex flex-col gap-3">
                <button type="button" onClick={handleGoogleLogin} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all active:scale-95">
                  Continue with Google
                </button>
                <button type="button" onClick={() => setShowGoogleAccounts(false)} className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => { setShowForgotPassword(false); setForgotSent(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Forgot Password</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">We'll send a reset link to your email</p>
                </div>
                <button onClick={() => setCheckoutModal(null)} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {!forgotSent ? (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 block">Email Address</label>
                      <div className="group relative rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input type="email" required className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent dark:text-white placeholder:text-slate-400/60 outline-none text-sm font-medium" placeholder="name@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" /> Send Reset Link
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">Email Sent!</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Check your inbox at <strong>{forgotEmail}</strong></p>
                    <p className="text-xs text-slate-400">If SMTP is not configured, check file <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">server/mock-emails.log</code></p>
                    <button type="button" onClick={() => { setShowForgotPassword(false); setForgotSent(false); }} className="mt-5 px-6 py-2 rounded-full bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all">
                      Close
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {showResetPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Create New Password</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Enter a new password for your account</p>
              </div>
              <div className="p-6">
                {!resetSuccess ? (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 block">New Password</label>
                      <div className="group relative rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input type="password" required minLength={6} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent dark:text-white placeholder:text-slate-400/60 outline-none text-sm font-medium" placeholder="Min. 6 characters" value={resetNewPassword} onChange={(e) => setResetNewPassword(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 block">Confirm Password</label>
                      <div className="group relative rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/40 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input type="password" required className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-transparent dark:text-white placeholder:text-slate-400/60 outline-none text-sm font-medium" placeholder="Re-enter new password" value={resetConfirmPassword} onChange={(e) => setResetConfirmPassword(e.target.value)} />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" /> Reset Password
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">Password Reset Successful!</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">You can now log in with your new password.</p>
                    <button type="button" onClick={() => { setShowResetPassword(false); setResetSuccess(false); setResetNewPassword(''); setResetConfirmPassword(''); setAuthMode('login'); }} className="px-6 py-2 rounded-full bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all">
                      Log In Now
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );


  const OnboardingView = () => {
    const steps = [
      {
        title: t.onboarding.step1Title,
        desc: t.onboarding.step1Desc,
        options: [
          { name: t.onboarding.step1Options[0], img: "https://images.unsplash.com/photo-1514525253361-bee8d48700df?auto=format&fit=crop&w=400&q=80" },
          { name: t.onboarding.step1Options[1], img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
          { name: t.onboarding.step1Options[2], img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400&q=80" },
          { name: t.onboarding.step1Options[3], img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80" }
        ]
      },
      {
        title: t.onboarding.step2Title,
        desc: t.onboarding.step2Desc,
        options: [
          { name: t.onboarding.step2Options[0], img: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=400&q=80" },
          { name: t.onboarding.step2Options[1], img: "https://images.unsplash.com/photo-1579621909532-4d5dc3f0f6ca?auto=format&fit=crop&w=400&q=80" },
          { name: t.onboarding.step2Options[2], img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80" },
          { name: t.onboarding.step2Options[3], img: "https://images.unsplash.com/photo-1526304640581-d334cdbdfbb5?auto=format&fit=crop&w=400&q=80" }
        ]
      },
      {
        title: t.onboarding.step3Title,
        desc: t.onboarding.step3Desc,
        options: [
          { name: t.onboarding.step3Options[0], img: "https://images.unsplash.com/photo-1506784919141-93504fb0749a?auto=format&fit=crop&w=400&q=80" },
          { name: t.onboarding.step3Options[1], img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80" },
          { name: t.onboarding.step3Options[2], img: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&w=400&q=80" },
          { name: t.onboarding.step3Options[3], img: "https://images.unsplash.com/photo-1435527173128-983b87201f4d?auto=format&fit=crop&w=400&q=80" }
        ]
      },
      {
        title: t.onboarding.step4Title,
        desc: t.onboarding.step4Desc,
        options: [
          { name: t.onboarding.step4Options[0], img: "https://images.unsplash.com/photo-1511632765486-a01b9049b012?auto=format&fit=crop&w=400&q=80" },
          { name: t.onboarding.step4Options[1], img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80" },
          { name: t.onboarding.step4Options[2], img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80" },
          { name: t.onboarding.step3Options[3], img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80" }
        ]
      },
      {
        title: t.onboarding.step5Title,
        desc: t.onboarding.step5Desc,
        options: []
      }
    ];

    const currentStep = steps[onboardingStep - 1];

    return (
      <div className="min-h-[calc(100vh-4rem)] p-8 bg-white dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="max-w-4xl w-full">
          <div className="flex justify-between items-center mb-12">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className={`h-2 rounded-full transition-all ${s <= onboardingStep ? 'bg-indigo-600 w-12' : 'bg-slate-100 dark:bg-slate-800 w-6'}`} />
              ))}
            </div>
            <button onClick={skipOnboarding} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">{t.skip}</button>
          </div>

          <motion.div key={onboardingStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{currentStep.title}</h2>
            <p className="text-indigo-600 font-bold mb-8 text-sm">{currentStep.desc}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {currentStep.options.map(opt => (
                <button key={opt.name} onClick={nextStep} className="group relative aspect-[4/5] rounded-3xl overflow-hidden border-4 border-transparent hover:border-indigo-600 transition-all shadow-lg">
                  <img src={opt.img} alt={opt.name} className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                  <span className="absolute bottom-4 left-4 text-white font-bold text-sm tracking-wide">{opt.name}</span>
                </button>
              ))}
              {onboardingStep === 5 && (
                <div className="col-span-full py-16 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                  <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t.engineReadyTitle}</h3>
                  <p className="text-slate-500 max-w-sm mx-auto font-medium text-sm">{t.engineReadyDesc}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-8 border-t border-slate-50 dark:border-slate-800">
              <button disabled={onboardingStep === 1} onClick={() => setOnboardingStep(prev => prev - 1)} className="flex items-center gap-2 font-bold text-sm text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-0"><ArrowLeft className="w-4 h-4" /> {t.back}</button>
              <button onClick={nextStep} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none">{onboardingStep === 5 ? t.continue : t.next} <ArrowRight className="w-4 h-4" /></button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const TicketPreviewView = () => {
    if (!selectedEvent) return null;
    return (
      <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center max-w-4xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-6 w-full">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:w-3/5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="relative">
                <img src={selectedEvent.image} alt="" className="w-full h-48 object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/90 text-indigo-600 font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider backdrop-blur-sm">{selectedEvent.category}</span>
                </div>
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{selectedEvent.title}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{selectedEvent.date}</p>
                      <p className="text-xs text-slate-500">18:00 - 22:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {selectedEvent.type === 'online' || selectedEvent.location.toLowerCase().includes('online') ? 'Online' : selectedEvent.location}
                      </p>
                      <p className="text-xs text-slate-500 truncate">Indonesia</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{t.overview}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedEvent.fullDescription || selectedEvent.description || `Join us for an unforgettable experience at ${selectedEvent.title}. This event will feature industry leaders, engaging activities, and ample networking opportunities to propel you forward.`}
                </p>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:w-2/5 flex">
            <div className="bg-slate-900 dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 w-full flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-5"><Ticket className="w-48 h-48" /></div>
              <div className="relative z-10 text-white">
                <h3 className="text-xl font-black mb-6">{t.ticketDetails}</h3>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-6">
                  <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-3">
                    <span className="text-sm text-slate-400 font-medium">{selectedEvent.ticketName || 'Standard Ticket'}</span>
                    <span className="text-xs text-slate-500">x 1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-300">Total</span>
                    <span className="text-2xl font-black text-white">{selectedEvent.price}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 mb-3">
                  {selectedEvent.isSalesClosed ? (
                    <button 
                      disabled
                      className="flex-grow bg-slate-800 text-slate-500 py-3.5 rounded-xl font-bold cursor-not-allowed text-sm"
                    >
                      Ticket Sales Closed
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        if (currentUser && selectedEvent.organizerId === currentUser.id) {
                          setToast({ message: "Organizers are not allowed to purchase tickets for their own events.", show: true });
                          setTimeout(() => setToast({ message: '', show: false }), 4000);
                          return;
                        }
                        handleGoToCheckoutDetails();
                      }}
                      className="flex-grow bg-indigo-500 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-indigo-400 active:scale-95 transition-all text-sm"
                    >
                      {t.getTickets}
                    </button>
                  )}
                  {!(isAuthenticated && selectedEvent.organizerId === (currentUser?.preferences?.joinedTeamOf || currentUser?.id)) && (
                    <button 
                      onClick={() => handleToggleSave(selectedEvent.id)}
                      className="bg-slate-800 border border-slate-700 text-slate-300 p-3.5 rounded-xl font-bold hover:bg-slate-700 transition-colors flex items-center justify-center cursor-pointer"
                      title={savedEventIds.includes(selectedEvent.id) ? "Saved to wishlist" : "Save for later"}
                    >
                      <Bookmark className={`w-5 h-5 ${savedEventIds.includes(selectedEvent.id) ? "fill-indigo-400 text-indigo-400" : "text-slate-400"}`} />
                    </button>
                  )}
                </div>
                <button onClick={() => setCheckoutModal(null)} className="w-full bg-slate-800 border border-slate-700 text-slate-300 px-6 py-4 rounded-xl font-bold hover:bg-slate-700 transition-colors">
                    Back to previous page
                </button>
                <p className="text-center text-[10px] text-slate-500">Secure checkout</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const generatePDFTicket = (ticket: any, event: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.qrCode}`;

    printWindow.document.write(`
      <html>
        <head>
          <title>REventS Ticket - ${event.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
            body {
              font-family: 'Outfit', sans-serif;
              margin: 0;
              padding: 40px;
              color: #0f172a;
              background-color: #f8fafc;
            }
            .ticket-card {
              max-width: 600px;
              margin: 0 auto;
              background: #fff;
              border-radius: 24px;
              border: 1px solid #e2e8f0;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
              overflow: hidden;
              position: relative;
            }
            .header-strip {
              background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
              height: 12px;
            }
            .branding {
              padding: 30px 40px 15px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px dashed #f1f5f9;
            }
            .branding .logo {
              font-size: 24px;
              font-weight: 800;
              color: #4f46e5;
              letter-spacing: -0.05em;
            }
            .branding .status {
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #10b981;
              background: #ecfdf5;
              padding: 6px 14px;
              border-radius: 9999px;
            }
            .details-section {
              padding: 30px 40px;
            }
            .event-title {
              font-size: 24px;
              font-weight: 800;
              margin: 0 0 10px;
              line-height: 1.2;
              color: #0f172a;
            }
            .event-meta {
              font-size: 13px;
              color: #64748b;
              margin-bottom: 30px;
              font-weight: 500;
            }
            .grid-details {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .detail-block h4 {
              margin: 0 0 4px;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #94a3b8;
            }
            .detail-block p {
              margin: 0;
              font-size: 14px;
              font-weight: 600;
              color: #1e293b;
            }
            .qr-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: #f8fafc;
              padding: 24px;
              border-radius: 18px;
              border: 1px solid #e2e8f0;
              text-align: center;
            }
            .qr-code {
              width: 160px;
              height: 160px;
              margin-bottom: 12px;
            }
            .qr-code img {
              width: 100%;
              height: 100%;
            }
            .ticket-code {
              font-family: monospace;
              font-size: 12px;
              font-weight: 600;
              color: #64748b;
            }
            .footer-note {
              padding: 20px 40px 30px;
              text-align: center;
              font-size: 11px;
              color: #94a3b8;
              font-weight: 500;
            }
            @media print {
              body {
                background: none;
                padding: 0;
              }
              .ticket-card {
                box-shadow: none;
                border: 1px solid #cbd5e1;
              }
            }
          </style>
        </head>
        <body>
          <div class="ticket-card">
            <div class="header-strip"></div>
            <div class="branding">
              <div class="logo">REventS</div>
              <div class="status">Confirmed & Paid</div>
            </div>
            
            <div class="details-section">
              <h2 class="event-title">${event.title}</h2>
              <div class="event-meta">📍 ${event.location} &nbsp;|&nbsp; 📅 ${event.date}</div>
              
              <div class="grid-details">
                <div class="detail-block">
                  <h4>Full Name</h4>
                  <p>${ticket.fullName || 'Guest'}</p>
                </div>
                <div class="detail-block">
                  <h4>Email</h4>
                  <p>${ticket.email || '-'}</p>
                </div>
                <div class="detail-block">
                  <h4>Audience Category</h4>
                  <p>${ticket.audienceCategory || 'General Public'}</p>
                </div>
                <div class="detail-block">
                  <h4>Referral Source</h4>
                  <p>${ticket.referralSource || '-'}</p>
                </div>
                <div class="detail-block">
                  <h4>Payment Method</h4>
                  <p>${ticket.paymentMethod.toUpperCase()}</p>
                </div>
                <div class="detail-block">
                  <h4>Transaction Date</h4>
                  <p>${new Date(ticket.purchaseDate).toLocaleDateString('en-US', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                </div>
              </div>
              
              <div class="qr-container">
                <div class="qr-code">
                  <img src="${qrUrl}" alt="Ticket QR Code" />
                </div>
                <div class="ticket-code">${ticket.qrCode}</div>
              </div>
            </div>
            
            <div class="footer-note">
              Please present this digital or printed ticket at the entrance for verification by the event staff.
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const CheckoutDetailsView = () => {
    if (!selectedEvent) return null;

    const isFreeEvent = !selectedEvent.price || selectedEvent.price.toLowerCase() === 'free' || selectedEvent.price.replace(/[^0-9]/g, '') === '0';

    const categories = [
      { id: 'Mahasiswa', label: 'Student (College)', icon: '🎓' },
      { id: 'Pelajar', label: 'Student (High School)', icon: '🎒' },
      { id: 'Umum', label: 'General Public', icon: '🌍' },
      { id: 'Karyawan', label: 'Professional / Employee', icon: '💼' }
    ];

    const sources = [
      { id: 'Media Sosial', label: 'Social Media', icon: '📱' },
      { id: 'Komunitas', label: 'Community / Network', icon: '🤝' },
      { id: 'Website', label: 'Website / Search', icon: '🌐' },
      { id: 'Teman', label: 'Friend / Referral', icon: '👥' },
      { id: 'Lainnya', label: 'Other Sources', icon: '✨' }
    ];

    const handleNext = async () => {
      if (!checkoutFullName.trim()) {
        setToast({ message: "Full name is required.", show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!checkoutEmail.trim() || !emailRegex.test(checkoutEmail.trim())) {
        setToast({ message: "Please use a valid email address format (example: name@domain.com).", show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
        return;
      }
      if (!checkoutAudience) {
        setToast({ message: "Please select your audience category.", show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
        return;
      }
      if (!checkoutReferral) {
        setToast({ message: "Please select how you heard about this event.", show: true });
        setTimeout(() => setToast({ message: '', show: false }), 3000);
        return;
      }

      if (isFreeEvent) {
        setIsProcessingPayment(true);
        try {
          const res = await apiFetch('/api/tickets/purchase', {
            method: 'POST',
            body: JSON.stringify({
              eventId: selectedEvent.id,
              paymentMethod: 'free',
              fullName: checkoutFullName,
              email: checkoutEmail,
              audienceCategory: checkoutAudience,
              referralSource: checkoutReferral,
              quantity: ticketQuantity
            })
          });
          
          setIsProcessingPayment(false);
          setPurchasedTicket(res.ticket);
          setPurchasedTickets(res.tickets || [res.ticket]);
          setSavedEventIds(prev => prev.filter(id => id !== selectedEvent.id));
          
          if (isAuthenticated) {
            await loadUserTickets();
          }
          
          setIsRegistrationComplete(true);
        } catch (err: any) {
          setIsProcessingPayment(false);
          setToast({ message: err.message || "Failed to process free ticket", show: true });
          setTimeout(() => setToast({ message: '', show: false }), 4000);
        }
      } else {
        setCheckoutModal('checkout');
      }
    };

    if (isRegistrationComplete) {
      return (
        <div className="min-h-screen p-6 md:p-8 flex flex-col justify-center max-w-lg mx-auto w-full transition-colors relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Registration Successful!</h2>
            {purchasedTickets.length > 1 && (
              <p className="text-indigo-600 font-extrabold text-lg mb-3">{purchasedTickets.length} Tickets Issued</p>
            )}
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
              Your ticket(s) for <strong>{selectedEvent.title}</strong> have been processed successfully. We've sent your e-ticket(s) with QR codes to <strong>{checkoutEmail}</strong>.
            </p>
            {purchasedTickets.length > 1 && (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mb-6 text-left space-y-2 max-h-48 overflow-y-auto">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Ticket Codes</p>
                {purchasedTickets.map((t: any, i: number) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 w-6">#{i+1}</span>
                    <span className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600">{t.qrCode}</span>
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={() => {
                setIsRegistrationComplete(false);
                setPurchasedTickets([]);
                setCheckoutModal(null);
                if (isAuthenticated) {
                  setView('dashboard');
                  setRole('audience');
                  setAudienceTab('myTickets');
                } else {
                  setView('landing');
                }
              }} 
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-xl"
            >
              Done
            </button>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen p-6 md:p-8 flex flex-col justify-center max-w-2xl mx-auto w-full transition-colors relative z-10">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 text-center tracking-tight">Ticket Registration Details</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm">Please complete your information to secure your entry pass.</p>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white dark:bg-slate-900/80 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800/80 backdrop-blur-md space-y-6"
        >
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Full Name</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400"><UserIcon className="w-5 h-5" /></span>
              <input 
                type="text" 
                placeholder="Enter your full name" 
                value={checkoutFullName} 
                onChange={e => setCheckoutFullName(e.target.value)} 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400"><Mail className="w-5 h-5" /></span>
              <input 
                type="email" 
                placeholder="Enter your active email address" 
                value={checkoutEmail} 
                onChange={e => setCheckoutEmail(e.target.value)} 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Audience Category */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Audience Category</label>
            <div className="relative">
              <select
                value={checkoutAudience}
                onChange={(e) => setCheckoutAudience(e.target.value)}
                className="w-full pl-4 pr-10 py-3.5 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
              >
                <option value="" disabled>Select your category...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>

          {/* Referral Source */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">How did you hear about this event?</label>
            <div className="relative">
              <select
                value={checkoutReferral}
                onChange={(e) => setCheckoutReferral(e.target.value)}
                className="w-full pl-4 pr-10 py-3.5 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
              >
                <option value="" disabled>Select referral source...</option>
                {sources.map(src => (
                  <option key={src.id} value={src.id}>{src.icon} {src.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>

          {/* Ticket Quantity */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Ticket Quantity</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl p-1">
                <button 
                  type="button"
                  onClick={() => setTicketQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200/60 dark:border-slate-700 font-extrabold text-lg select-none"
                >
                  -
                </button>
                <span className="w-14 text-center font-mono font-bold text-base text-slate-900 dark:text-white select-none">
                  {ticketQuantity}
                </span>
                <button 
                  type="button"
                  onClick={() => setTicketQuantity(prev => Math.min(10, prev + 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200/60 dark:border-slate-700 font-extrabold text-lg select-none"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Maximum 10 tickets per transaction
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setCheckoutModal('preview')} 
              className="sm:w-1/3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-3.5 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm"
            >
              Back
            </button>
            <button 
              onClick={handleNext} 
              disabled={isProcessingPayment}
              className="flex-grow bg-indigo-600 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isProcessingPayment ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : null}
              {isProcessingPayment ? 'Processing...' : isFreeEvent ? 'Register' : 'Proceed to Payment'} 
              {!isProcessingPayment && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const CheckoutView = () => {
    if (!selectedEvent) return null;
    return (
      <div className="min-h-screen p-6 md:p-8 flex flex-col justify-center max-w-4xl mx-auto w-full relative">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">{t.checkout}</h2>
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="md:w-3/5 bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Select Payment Method</h3>
            <div className="space-y-4 mb-6">
              {[
                { id: 'qris', name: 'QRIS', icon: <QrCode className="w-5 h-5"/> },
                { id: 'bca', name: 'BCA Virtual Account', icon: <CreditCard className="w-5 h-5"/> },
                { id: 'mandiri', name: 'Mandiri Virtual Account', icon: <CreditCard className="w-5 h-5"/> },
                { id: 'bni', name: 'BNI Virtual Account', icon: <CreditCard className="w-5 h-5"/> }
              ].map((method) => (
                <button 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all ${paymentMethod === method.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === method.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {method.icon}
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white tracking-wide text-sm">
                      {method.name}
                    </span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-indigo-600' : 'border-slate-300 dark:border-slate-600'}`}>
                    {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 font-medium">
              <Shield className="w-4 h-4 text-green-500" /> Secure payment powered by REventS
            </p>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setCheckoutModal('details')} 
                className="sm:w-1/3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold transition-all text-xs text-center border border-slate-200 dark:border-slate-700"
              >
                Back
              </button>
              <button 
                onClick={() => setCheckoutModal(null)} 
                className="flex-grow bg-slate-50 hover:bg-red-50 dark:bg-slate-900 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-600 py-3 rounded-xl font-bold transition-all text-xs text-center border border-slate-200 dark:border-slate-800"
              >
                Cancel Purchase
              </button>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="md:w-2/5">
             <div className="bg-slate-900 text-white rounded-xl p-8 shadow-2xl relative overflow-hidden h-full flex flex-col">
               <div className="absolute top-0 right-0 p-8 opacity-10"><Ticket className="w-32 h-32" /></div>
               <div className="relative z-10 flex-grow flex flex-col justify-between">
                 <div>
                   <h3 className="text-xl font-bold mb-6">{t.yourOrder}</h3>
                   <div className="mb-6 pb-6 border-b border-slate-700">
                     <p className="font-bold text-base mb-2">{selectedEvent.title}</p>
                     <p className="text-sm text-slate-400">1 x {selectedEvent.ticketName || 'Standard Ticket'}</p>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between items-center mb-8">
                     <span className="font-medium text-sm text-slate-400">{t.total}</span>
                     <span className="text-xl font-black">{selectedEvent.price}</span>
                   </div>
                   <button 
                     onClick={() => {
                       if (!paymentMethod) {
                         setToast({ message: "Please select a payment method.", show: true });
                         setTimeout(() => setToast({ message: '', show: false }), 3000);
                         return;
                       }
                       setPurchasedTicket(null);
                       setGeneratedVa(Math.floor(1000 + Math.random() * 9000).toString());
                       setShowMidtransSnap(true);
                     }}
                    className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 py-3.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors text-sm"
                   >
                     {t.completePurchase}
                   </button>
                 </div>
               </div>
             </div>
          </motion.div>
        </div>

        {/* Simulated Midtrans Snap Modal Overlay */}
        <AnimatePresence>
          {showMidtransSnap && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 15 }} 
                className="bg-[#f4f6fa] text-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
              >
                {/* Header Snap */}
                <div className="bg-white px-5 py-3.5 flex items-center justify-between border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setShowMidtransSnap(false);
                      }}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    {/* REventS Payment Logo */}
                     <div className="flex items-center gap-1.5">
                       <div className="flex items-center gap-1">
                         <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                         <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                       </div>
                       <span className="font-sans font-extrabold text-base tracking-tight text-indigo-700 flex items-center">
                         REventS<span className="text-purple-500 font-semibold ml-1 text-xs uppercase tracking-widest">Pay</span>
                       </span>
                     </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
                    <Shield className="w-3 h-3 text-emerald-500 fill-emerald-500/20" /> SECURE PAYMENT
                  </span>
                </div>

                {/* Merchant & Order Details Panel */}
                <div className="bg-white px-5 py-4 border-b border-slate-200 flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Merchant</h4>
                    <p className="text-sm font-extrabold text-indigo-700 truncate">REventS</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{selectedEvent.title}</p>
                    <p className="text-[9px] font-mono text-slate-400 mt-1">Order ID: REV-ORD-{selectedEvent.id}-{generatedVa}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total{ticketQuantity > 1 ? ` (${ticketQuantity}x)` : ''}</h4>
                    <p className="text-base font-black text-indigo-800">
                      {(() => {
                        if (!selectedEvent.price || selectedEvent.price.toLowerCase() === 'free') return 'Free';
                        const numStr = selectedEvent.price.replace(/[^0-9]/g, '');
                        const unitPrice = parseInt(numStr, 10);
                        if (isNaN(unitPrice)) return selectedEvent.price;
                        const total = unitPrice * ticketQuantity;
                        return `IDR ${total.toLocaleString('id-ID')}`;
                      })()}
                    </p>
                    <div className="mt-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                      Session: {midtransTimer}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-5 flex-grow overflow-y-auto space-y-5">
                  {purchasedTicket ? (
                    // Success View
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center space-y-5 shadow-sm">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400 animate-bounce">
                        <Check className="w-9 h-9 stroke-[3.5]" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-black text-[#0d2c56]">Payment Successful!</h3>
                        <p className="text-xs text-slate-500">Payment Successful</p>
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-100 space-y-2.5">
                        <p className="text-xs text-slate-600 leading-relaxed">
                          <strong className="text-slate-900">{purchasedTickets.length || 1} ticket(s)</strong> for <strong className="text-slate-900">{selectedEvent.title}</strong> issued successfully. We have sent a PDF ticket with QR Code to your registered email:
                        </p>
                        <div className="bg-indigo-50 border border-indigo-200 px-3.5 py-2 rounded-lg font-mono text-xs font-bold text-indigo-700 break-all text-center">
                          {checkoutEmail}
                        </div>
                        {purchasedTickets.length > 1 && (
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket Codes:</p>
                            {purchasedTickets.map((t: any, i: number) => (
                              <div key={t.id} className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-indigo-500 w-5">#{i+1}</span>
                                <span className="font-mono text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">{t.qrCode}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 text-center font-medium italic">
                          (Please check your inbox or spam folder)
                        </p>
                      </div>
                      
                      <div className="pt-2">
                        <button 
                          onClick={() => {
                            setShowMidtransSnap(false);
                            setCheckoutModal(null);
                            setPaymentMethod('');
                            setPendingRSVP(null);
                            setPurchasedTickets([]);
                            if (isAuthenticated) {
                              setView('dashboard');
                              setRole('audience');
                              setAudienceTab('myTickets');
                            } else {
                              setView('landing');
                            }
                          }}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-all text-sm shadow-md shadow-indigo-200"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Payment Instructions View
                    <>
                      {/* Payment Method Details Card */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                        {paymentMethod === 'qris' ? (
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="flex justify-between items-center w-full pb-3 border-b border-slate-100">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Method</span>
                              <span className="text-xs font-extrabold text-[#0d2c56] bg-slate-100 px-2.5 py-1 rounded-lg">QRIS / e-Wallet</span>
                            </div>
                            <div className="w-44 h-44 bg-white p-3 rounded-xl shadow-md border border-slate-200/80 relative">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=REVENTSPAY-MOCK-QRIS-REvents-${selectedEvent.id}`} 
                                alt="QRIS QR" 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <p className="text-xs font-bold text-slate-800">Scan QRIS to Pay</p>
                              <p className="text-[10px] text-slate-500 leading-relaxed px-4">
                                Use GoPay, OVO, DANA, LinkAja, ShopeePay, or your preferred mobile banking app to scan the QR code above.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Receiving Bank</span>
                              <span className="text-xs font-extrabold text-[#0d2c56] uppercase bg-slate-100 px-2.5 py-1 rounded-lg">{paymentMethod} Virtual Account</span>
                            </div>
                            
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Virtual Account Number</span>
                              <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 font-mono text-base font-bold text-slate-900">
                                <span>98765{selectedEvent.id}{generatedVa}</span>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(`98765${selectedEvent.id}${generatedVa}`);
                                    setToast({ message: "Virtual Account number copied to clipboard.", show: true });
                                    setTimeout(() => setToast({ message: '', show: false }), 2000);
                                  }}
                                  className="text-xs font-bold text-[#00adef] hover:text-[#0092ca] bg-[#e0f4ff] px-2.5 py-1.5 rounded-lg transition-colors"
                                >
                                  Copy
                                </button>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-[10px] text-slate-500 space-y-2">
                              <p className="font-bold text-slate-700">ATM / Mobile Banking Payment Guide:</p>
                              <p>1. Open your Mobile Banking app or go to an ATM.</p>
                              <p>2. Select <strong className="text-slate-700">Transfer &gt; Virtual Account</strong> (or Transfer to Another Bank Account).</p>
                              <p>3. Enter the VA number above as the destination account number.</p>
                              <p>4. Enter the exact amount shown as the total.</p>
                              <p>5. Click send and enter your PIN to complete the transaction.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Simulator buttons */}
                      <div className="space-y-3">
                        <button
                          disabled={isProcessingPayment}
                          onClick={async () => {
                            setIsProcessingPayment(true);
                            setTimeout(async () => {
                              try {
                                const res = await apiFetch('/api/tickets/purchase', {
                                  method: 'POST',
                                  body: JSON.stringify({
                                    eventId: selectedEvent.id,
                                    paymentMethod: paymentMethod,
                                    fullName: checkoutFullName,
                                    email: checkoutEmail,
                                    audienceCategory: checkoutAudience,
                                    referralSource: checkoutReferral,
                                    quantity: ticketQuantity
                                  })
                                });
                                
                                setPurchasedTicket(res.ticket);
                                setPurchasedTickets(res.tickets || [res.ticket]);
                                setSavedEventIds(prev => prev.filter(id => id !== selectedEvent.id));
                                loadUserTickets();
                                setToast({ message: `Payment successful! ${res.ticketCount || ticketQuantity} ticket(s) sent to email.`, show: true });
                                setTimeout(() => setToast({ message: '', show: false }), 5000);
                              } catch (err: any) {
                                setToast({ message: err.message || "Failed to process payment", show: true });
                                setTimeout(() => setToast({ message: '', show: false }), 4000);
                              } finally {
                                setIsProcessingPayment(false);
                              }
                            }, 1500);
                          }}
                          className={`w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 ${isProcessingPayment ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {isProcessingPayment && (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          )}
                          {isProcessingPayment ? 'Processing Payment...' : 'Pay Now'}
                        </button>
                        <button
                          onClick={() => {
                            setShowMidtransSnap(false);
                            setCheckoutModal(null);
                            setPaymentMethod('');
                          }}
                          className="w-full py-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold transition-all text-center"
                        >
                          Cancel Payment
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer brand info */}
                <div className="bg-white px-5 py-3 text-center border-t border-slate-200 text-[9px] text-slate-400 font-semibold flex items-center justify-center gap-1.5">
                  Secure transaction processed by <span className="font-extrabold text-indigo-700">REventS Pay</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const DashboardView = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-6 hidden lg:flex flex-col gap-6 transition-colors h-screen sticky top-0 overflow-y-auto no-scrollbar">
        <button onClick={() => setView('landing')} className="flex items-center text-2xl font-black text-indigo-600 tracking-tighter text-left ml-2 hover:opacity-90 transition-opacity">
          <span>REventS</span>
        </button>
        <div className="flex flex-col gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <button 
            onClick={() => {
              if (role === 'organizer') {
                switchOrganizerTab('settings');
              } else {
                setAudienceTab('accountPayment');
              }
            }}
            className="flex items-center gap-3 w-full text-left hover:opacity-80 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black flex-shrink-0 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
              {profilePicUrl ? <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" /> : profileName ? profileName.substring(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{profileName}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase truncate tracking-tighter">
                {role === 'organizer' ? t.proOrganizer : t.audienceMode}
              </p>
            </div>
          </button>
          <button 
            onClick={toggleRole} 
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-white hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
          >
            <ArrowLeftRight className="w-4 h-4" />
            {t.switchRole}
          </button>
        </div>
        
        <nav className="space-y-1">
          {role === 'organizer' ? (
            <>
              <button onClick={() => switchOrganizerTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${organizerTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><LayoutDashboard className="w-5 h-5" /> {t.dashboard}</button>
              <button onClick={() => switchOrganizerTab('aiEventCoPilot')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${organizerTab === 'aiEventCoPilot' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><BrainCircuit className="w-5 h-5" /> {t.aiEventCoPilot}</button>
              <button onClick={() => switchOrganizerTab('myPublishedEvents')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${organizerTab === 'myPublishedEvents' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><CalendarDays className="w-5 h-5" /> {t.myPublishedEvents}</button>
              <button onClick={() => switchOrganizerTab('attendeesLogistics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${organizerTab === 'attendeesLogistics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><Users className="w-5 h-5" /> {t.attendeesLogistics}</button>
              <button onClick={() => switchOrganizerTab('communityImpact')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${organizerTab === 'communityImpact' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><HeartHandshake className="w-5 h-5" /> {t.communityImpact}</button>
              <button onClick={() => switchOrganizerTab('finance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${organizerTab === 'finance' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><CreditCard className="w-5 h-5" /> {t.finance}</button>
              <button onClick={() => switchOrganizerTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${organizerTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><Settings className="w-5 h-5" /> {t.settings}</button>
              <button onClick={() => { setShowCreateForm(false); setView('create-event'); clearCopilotState(); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50`}><PlusCircle className="w-5 h-5" /> {t.createEvent}</button>
            </>
          ) : (
            <>
              <button 
                onClick={() => {
                  setView('dashboard');
                  setAudienceTab('revasst');
                }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'dashboard' && audienceTab === 'revasst' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Bot className="w-5 h-5" /> REvas'st
              </button>
              <button 
                onClick={() => { 
                  setView('landing'); 
                  clearCopilotState(); 
                }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'landing' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Globe className="w-5 h-5" /> Explore
              </button>
              <button onClick={() => setAudienceTab('myTickets')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${audienceTab === 'myTickets' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><Ticket className="w-5 h-5" /> {t.myTickets}</button>
              <button onClick={() => setAudienceTab('savedEvents')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${audienceTab === 'savedEvents' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><Bookmark className="w-5 h-5" /> {t.savedEvents}</button>
              <button onClick={() => setAudienceTab('interestPreferences')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${audienceTab === 'interestPreferences' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]'}`}><Sliders className="w-5 h-5" /> {t.interestPreferences}</button>
              <button onClick={() => setAudienceTab('accountPayment')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${audienceTab === 'accountPayment' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><UserCircle className="w-5 h-5" /> {t.accountPayment}</button>
            </>
          )}
        </nav>

        <div className="mt-auto space-y-2">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut className="w-5 h-5" /> {t.signOut}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto no-scrollbar relative lg:pl-12 bg-slate-50/50 dark:bg-slate-950/50 relative overflow-hidden">
        {/* Subtle dashboard background animation */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-400/20 dark:bg-indigo-600/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-400/20 dark:bg-purple-600/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }}></div>
        </div>
        
        <div className="max-w-6xl relative z-10">

          {role === 'organizer' ? (
            <>
              {organizerTab === 'dashboard' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="mb-10">
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.dashboard}</h2>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">{t.overviewDesc}</p>
                    </div>
                  </div>

                  {/* Mobile Shortcut Grid */}
                  <div className="lg:hidden grid grid-cols-3 gap-4 mb-8">
                    <button
                      onClick={() => switchOrganizerTab('attendeesLogistics')}
                      className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center hover:scale-105 active:scale-95 transition-all gap-2"
                    >
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-indigo-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-355 tracking-wider">Logistics</span>
                    </button>
                    <button
                      onClick={() => switchOrganizerTab('communityImpact')}
                      className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center hover:scale-105 active:scale-95 transition-all gap-2"
                    >
                      <div className="w-10 h-10 bg-pink-50 dark:bg-pink-950/40 rounded-xl flex items-center justify-center text-pink-600">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-355 tracking-wider">Impact</span>
                    </button>
                    <button
                      onClick={() => switchOrganizerTab('finance')}
                      className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center hover:scale-105 active:scale-95 transition-all gap-2"
                    >
                      <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-600">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-355 tracking-wider">Finance</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      { label: t.totalSales, val: totalSalesVal, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
                      { label: t.liveAttendance, val: attendanceRateVal, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
                      { label: t.checkinsHr, val: checkinsVal, color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" }
                    ].map(stat => (
                      <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{stat.label}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.val}</span>
                          <div className={`p-2 rounded-xl text-[10px] font-bold ${stat.color}`}>{t.momGrowth}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-8">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-6">Revenue & Check-ins</h3>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData.length > 0 ? chartData : [
                          { name: 'Mon', revenue: 0, checkins: 0 },
                          { name: 'Tue', revenue: 0, checkins: 0 },
                        ]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorCheckins" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}k`} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                          <Area type="monotone" dataKey="checkins" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorCheckins)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </motion.div>
              )}

              {organizerTab === 'aiEventCoPilot' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.aiEventCoPilot}</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t.coPilotDesc}</p>
                  </div>
                  <div className={`p-8 rounded-3xl border shadow-sm mb-6 transition-all duration-500 ${isGeneratingCopilot ? 'fluid-dynamic-ai border-transparent' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                    <h3 className={`font-bold mb-4 ${isGeneratingCopilot ? 'text-white' : 'text-slate-900 dark:text-white'}`}>What would you like to create?</h3>
                    <div className="relative">
                      <textarea 
                        value={copilotInput}
                        onChange={(e) => setCopilotInput(e.target.value)}
                        rows={4} 
                        placeholder={t.coPilotPlaceholder} 
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none resize-none mb-4 dark:text-white transition-all" 
                      />
                    </div>
                    <button 
                      onClick={() => {
                        if (!copilotInput.trim()) return;
                        handleGenerateCopilot(copilotInput);
                      }}
                      disabled={isGeneratingCopilot || !copilotInput.trim()}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingCopilot ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <BrainCircuit className="w-5 h-5"/>} 
                      {isGeneratingCopilot ? 'Generating...' : 'Generate Concept'}
                    </button>
                  </div>
                  
                  {copilotResult && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl p-8 border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-800 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <h4 className="font-black text-indigo-900 dark:text-indigo-100 text-xl">Generated Concept</h4>
                      </div>
                      <div className="prose prose-indigo dark:prose-invert max-w-none mb-8 whitespace-pre-wrap text-sm font-medium text-slate-700 dark:text-slate-300">
                        {copilotResult}
                      </div>
                      <div className="flex flex-wrap gap-4">
                        <button onClick={() => { 
                          if (copilotResultObj) {
                            setEventTitle(copilotResultObj.title || '');
                            setEventCategory(copilotResultObj.category || 'Tech');
                            setEventDescShort(copilotResultObj.description || '');
                            setEventDescFull(copilotResultObj.fullDescription || '');
                            if (copilotResultObj.date) setEventDate(copilotResultObj.date);
                            if (copilotResultObj.location) { setEventAddress(copilotResultObj.location); setEventCity(copilotResultObj.location); }
                            setEventPosterUrl(copilotResultObj.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000");
                            if (copilotResultObj.price) {
                                if (copilotResultObj.price.toString().toLowerCase() === 'free') {
                                    setTicketType('free');
                                } else {
                                    setTicketType('paid');
                                    const digits = copilotResultObj.price.toString().replace(/\D/g, '');
                                    if (digits) setEventPrice(digits);
                                }
                            }
                            if (copilotResultObj.capacity) {
                                setEventCapacity(copilotResultObj.capacity.toString());
                            }
                          } else {
                            setEventTitle("Next-Gen Tech Meetup 2026");
                            setEventCategory("Tech");
                            setEventDescShort("Join us for an evening of insightful talks and networking with industry leaders exploring the future of AI and Web3.");
                            setEventDescFull("**Time:** 09:00 AM - 05:00 PM\r\n**Location:** SCBD, Jakarta\r\n\r\n**Agenda:**\r\n- 6:00 PM: Doors Open & Networking\r\n- 7:00 PM: Keynote Panel\r\n- 8:30 PM: Afterparty\r\n\r\nEnjoy an insightful evening.");
                            setEventPosterUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000");
                          }
                          
                          setEventEditReturnContext({
                            organizerTab: 'aiEventCoPilot',
                            publishedEventsTab: 'published',
                            managingEvent: null
                          });
                          setShowCreateForm(true);
                          setView('create-event');
                        }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all text-sm">Use the concept</button>
                        <button 
                          onClick={() => {
                            const refinedPrompt = copilotInput + ' refine it more...';
                            setCopilotInput(refinedPrompt);
                            handleGenerateCopilot(refinedPrompt);
                          }}
                          className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
                        >
                          Refine Prompts
                        </button>
                      </div>
                    </motion.div>

                  )}
                </motion.div>
              )}

              {organizerTab === 'myPublishedEvents' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {!managingEvent ? (
                    <>
                      <div className="mb-10">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.myPublishedEvents}</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{t.myPubEventsDesc}</p>
                      </div>
                      <div className="flex gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <button onClick={() => setPublishedEventsTab('published')} className={`font-bold pb-4 -mb-[18px] transition-colors ${publishedEventsTab === 'published' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>{t.publishedActive}</button>
                        <button onClick={() => setPublishedEventsTab('drafts')} className={`font-bold pb-4 -mb-[18px] transition-colors ${publishedEventsTab === 'drafts' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>{t.drafts}</button>
                        <button onClick={() => setPublishedEventsTab('past')} className={`font-bold pb-4 -mb-[18px] transition-colors ${publishedEventsTab === 'past' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>{t.pastCompleted}</button>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                          {publishedEventsTab === 'published' && (
                            events.filter(ev => ev.organizerId === currentUser?.id && ev.status === 'active').length === 0 ? (
                              <p className="p-6 text-slate-500 text-sm text-center">No active events found.</p>
                            ) : (
                              events.filter(ev => ev.organizerId === currentUser?.id && ev.status === 'active').map(ev => (
                                <div key={ev.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer" onClick={() => setManagingEvent(ev)}>
                                  <div className="w-16 h-16 rounded-2xl overflow-hidden"><img src={ev.image} className="w-full h-full object-cover" /></div>
                                  <div className="flex-grow"><h4 className="font-bold text-slate-900 dark:text-white">{ev.title}</h4><p className="text-xs text-slate-400">{ev.date}</p></div>
                                  <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">Active</span>
                                    <button className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg hover:text-indigo-600 transition-colors">{t.manage}</button>
                                  </div>
                                </div>
                              ))
                            )
                          )}
                          {publishedEventsTab === 'drafts' && (
                            events.filter(ev => ev.organizerId === currentUser?.id && ev.status === 'draft').length === 0 ? (
                              <p className="p-6 text-slate-500 text-sm text-center">No draft events found.</p>
                            ) : (
                              events.filter(ev => ev.organizerId === currentUser?.id && ev.status === 'draft').map(ev => (
                                <div key={ev.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer" onClick={() => handleEditEvent(ev)}>
                                  <div className="w-16 h-16 rounded-2xl overflow-hidden"><img src={ev.image} className="w-full h-full object-cover opacity-50 grayscale" /></div>
                                  <div className="flex-grow"><h4 className="font-bold text-slate-900 dark:text-white">{ev.title}</h4><p className="text-xs text-slate-400">Not scheduled yet</p></div>
                                  <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider select-none">Draft</span>
                                    <button className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg hover:text-indigo-600 transition-colors">{t.manage}</button>
                                  </div>
                                </div>
                              ))
                            )
                          )}
                          {publishedEventsTab === 'past' && (
                            events.filter(ev => ev.organizerId === currentUser?.id && ev.status === 'past').length === 0 ? (
                              <p className="p-6 text-slate-500 text-sm text-center">No completed events found.</p>
                            ) : (
                              events.filter(ev => ev.organizerId === currentUser?.id && ev.status === 'past').map(ev => (
                                <div key={ev.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer" onClick={() => setManagingEvent(ev)}>
                                  <div className="w-16 h-16 rounded-2xl overflow-hidden"><img src={ev.image} className="w-full h-full object-cover grayscale" /></div>
                                  <div className="flex-grow"><h4 className="font-bold text-slate-900 dark:text-white text-slate-500 line-through">{ev.title}</h4><p className="text-xs text-slate-400">{ev.date}</p></div>
                                  <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider">Completed</span>
                                    <button className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg hover:text-indigo-600 transition-colors">{t.manage}</button>
                                  </div>
                                </div>
                              ))
                            )
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                      <button onClick={() => { setManagingEvent(null); setManagingSubView('overview'); }} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" /> Back to List
                      </button>
                      
                      {managingSubView === 'overview' && (
                        <>
                          <div className="flex flex-col md:flex-row gap-8 mb-8">
                            <div className="w-full md:w-1/3 aspect-video md:aspect-[4/5] rounded-2xl overflow-hidden shadow-md">
                              <img src={managingEvent.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">{managingEvent.category}</span>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      const url = `${window.location.origin}/?eventId=${managingEvent.id}`;
                                      navigator.clipboard.writeText(url);
                                      setToast({ message: "Event link copied to clipboard!", show: true });
                                      setTimeout(() => setToast({ message: '', show: false }), 3000);
                                    }}
                                    className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-bold flex items-center gap-1.5"
                                    title="Copy Direct Link"
                                  >
                                    <Link2 className="w-4 h-4" /> Copy Link
                                  </button>
                                  <button onClick={() => handleEditEvent(managingEvent)} className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                  <button onClick={() => setManagingSubView('settings')} className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><Settings className="w-4 h-4" /></button>
                                </div>
                              </div>
                              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{managingEvent.title}</h2>
                              <div className="flex flex-col gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">
                                <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {managingEvent.date} {managingEvent.time && `• ${managingEvent.time}`}</span>
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {managingEvent.location}</span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">Manage all logistics, check-ins, and ticket sales directly from this command center. Use the options below to track performance or update event details.</p>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tickets Sold</p>
                                  <p className="text-2xl font-black text-indigo-600">{managingEvent.ticketsSold || 0}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
                                  <p className="text-2xl font-black text-green-600">Rp {(managingEvent.revenue || 0).toLocaleString('id-ID')}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Page Views</p>
                                  <p className="text-2xl font-black text-slate-900 dark:text-white">{managingEvent.views || 0}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Check-ins</p>
                                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                                    {managingEvent.ticketsSold > 0 
                                      ? `${Math.round(((managingEvent.checkins || 0) / managingEvent.ticketsSold) * 100)}%` 
                                      : '0%'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <button onClick={() => setManagingSubView('scan')} className="flex-1 min-w-[120px] bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all text-sm flex justify-center items-center gap-2"><QrCode className="w-4 h-4"/> Scan Tickets</button>
                            <button onClick={() => setManagingSubView('guests')} className="flex-1 min-w-[120px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm flex justify-center items-center gap-2"><Users className="w-4 h-4"/> Guest List</button>
                            <button onClick={() => setManagingSubView('analytics')} className="flex-1 min-w-[120px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm flex justify-center items-center gap-2"><BarChart3 className="w-4 h-4"/> Analytics</button>
                            {managingEvent.provideCertificate && (
                              <button onClick={() => setManagingSubView('certificates')} className="flex-1 min-w-[120px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm flex justify-center items-center gap-2"><Award className="w-4 h-4 text-indigo-650"/> Sertifikat</button>
                            )}
                          </div>
                        </>
                      )}

                      {managingSubView === 'scan' && (
                        <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-3xl mt-4 border border-slate-800">
                           {scannedTicketDetails && (
                             <div className="w-full max-w-md bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 p-6 rounded-2xl mb-6 text-center text-white shadow-[0_20px_50px_rgba(16,185,129,0.25)] animate-scale-in">
                                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h4 className="font-black text-xs uppercase tracking-wider text-emerald-400">Check-in Successful</h4>
                                <p className="font-black text-2xl tracking-tight mt-2 text-white">{scannedTicketDetails.fullName || 'Guest'}</p>
                                <p className="text-sm text-slate-300 mt-1">{scannedTicketDetails.email} • {scannedTicketDetails.audienceCategory}</p>
                                <div className="mt-4">
                                  <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-900/60 px-4 py-2 rounded-xl inline-block border border-emerald-500/30 shadow-inner">
                                    {scannedTicketDetails.qrCode}
                                  </span>
                                </div>
                             </div>
                           )}

                           <div className={`w-64 h-64 border border-slate-800 rounded-3xl overflow-hidden bg-black mb-6 relative ${scannedTicketDetails ? 'hidden' : ''}`}>
                             <div id="qr-reader" className="w-full h-full qr-scanner-compact"></div>
                           </div>

                           <h3 className="text-2xl font-bold text-white mb-2">Ticket Scanner Active</h3>
                           <p className="text-slate-400 text-sm mb-6 text-center max-w-sm">Scan a ticket using the simulator or enter the ticket code below to verify check-in.</p>
                           
                           {/* Manual checkin */}
                           <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl border border-slate-700 text-left mb-6">
                             <h4 className="text-xs font-black text-slate-300 mb-2 uppercase tracking-wider">Manual Ticket Code Verification</h4>
                             <div className="flex gap-2">
                               <input 
                                 type="text" 
                                 placeholder="Enter Ticket Code (e.g. TKT-1-2-123456)" 
                                 className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                 value={manualTicketCode}
                                 onChange={e => setManualTicketCode(e.target.value)}
                               />
                               <button 
                                 onClick={() => {
                                   if (!manualTicketCode.trim()) return;
                                   handleQrCheckIn(manualTicketCode.trim());
                                 }}
                                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95"
                               >
                                 Verify
                               </button>
                             </div>
                           </div>

                           {/* QR Simulation List */}
                           <div className="w-full max-w-md bg-slate-800 p-6 rounded-2xl border border-slate-700 text-left mb-6">
                             <h4 className="text-xs font-black text-purple-300 mb-4 uppercase tracking-wider flex items-center gap-2">
                               <Sparkles className="w-4 h-4 text-purple-400" /> QR Ticket Scan Simulator
                             </h4>
                             <p className="text-xs text-slate-400 mb-4">Listed below are registered tickets that have not been checked in. Click the button to simulate a QR scan.</p>
                             <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                               {organizerTickets.filter(t => t.eventId === managingEvent.id && !t.checkedIn).length === 0 ? (
                                 <p className="text-slate-500 text-xs text-center py-4">All attendees have been checked in.</p>
                               ) : (
                                 organizerTickets.filter(t => t.eventId === managingEvent.id && !t.checkedIn).map(t => (
                                   <div key={t.id} className="bg-slate-900 p-3 rounded-xl border border-slate-700/50 flex items-center justify-between gap-3">
                                     <div className="min-w-0">
                                       <p className="font-bold text-xs text-white truncate">{t.fullName || 'Guest'}</p>
                                       <p className="text-[10px] text-slate-500 font-mono truncate">{t.qrCode}</p>
                                     </div>
                                     <button 
                                       onClick={() => simulateQrScan(t.qrCode)}
                                       disabled={scannerIsScanning}
                                       className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1 shrink-0 active:scale-95 disabled:opacity-50"
                                     >
                                       Simulate
                                     </button>
                                   </div>
                                 ))
                               )}
                             </div>
                           </div>

                           <button onClick={() => setManagingSubView('overview')} className="px-8 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors text-sm">Close Scanner</button>
                        </div>
                      )}

                      {managingSubView === 'guests' && (() => {
                        const eventTickets = organizerTickets.filter(t => t.eventId === managingEvent?.id);
                        const filteredEventTickets = eventTickets.filter(t => {
                          const search = eventAttendeeSearchQuery.toLowerCase();
                          return (
                            (t.fullName || t.user?.fullName || '').toLowerCase().includes(search) ||
                            (t.email || t.user?.email || '').toLowerCase().includes(search) ||
                            t.qrCode?.toLowerCase().includes(search)
                          );
                        });

                        return (
                          <div className="mt-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                              <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Guest List</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage check-ins and search registered participants for this event.</p>
                              </div>
                              <div className="flex gap-4">
                                <input 
                                  type="text" 
                                  placeholder="Search guests by name or code..." 
                                  value={eventAttendeeSearchQuery}
                                  onChange={(e) => setEventAttendeeSearchQuery(e.target.value)}
                                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white"
                                />
                                <button onClick={() => setManagingSubView('overview')} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 shrink-0">Back to Overview</button>
                              </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                              {eventTickets.length === 0 ? (
                                <div className="text-center text-slate-500 py-12">
                                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                  <p className="font-bold text-lg mb-2">No attendees registered yet</p>
                                  <p className="text-sm">When participants register or buy tickets, they will appear here.</p>
                                </div>
                              ) : filteredEventTickets.length === 0 ? (
                                <div className="text-center text-slate-500 py-12">
                                  <p className="font-bold text-lg">No matching attendees found</p>
                                  <p className="text-sm">Try adjusting your search query.</p>
                                </div>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                        <th className="pb-3 pr-4">Guest</th>
                                        <th className="pb-3 px-4">Ticket Code</th>
                                        <th className="pb-3 px-4">Category</th>
                                        <th className="pb-3 px-4">Status</th>
                                        <th className="pb-3 pl-4 text-right">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                      {filteredEventTickets.map(t => (
                                        <tr key={t.id} className="text-slate-700 dark:text-slate-300 font-medium">
                                          <td className="py-4 pr-4">
                                            <div className="font-bold text-slate-900 dark:text-white">{t.fullName || t.user?.fullName || 'Guest'}</div>
                                            <div className="text-xs text-slate-400">{t.email || t.user?.email || '-'}</div>
                                          </td>
                                          <td className="py-4 px-4 font-mono text-xs">{t.qrCode}</td>
                                          <td className="py-4 px-4 text-xs font-semibold">{t.audienceCategory || 'General Admission'}</td>
                                          <td className="py-4 px-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                              t.checkedIn 
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                              {t.checkedIn ? 'Checked In' : 'Pending'}
                                            </span>
                                          </td>
                                          <td className="py-4 pl-4 text-right">
                                            {!t.checkedIn ? (
                                              <button 
                                                onClick={async () => {
                                                  await handleCheckInTicket(t.id);
                                                  // Force reload current event stats
                                                  if (managingEvent) {
                                                    const updatedEv = await apiFetch(`/api/events/${managingEvent.id}`);
                                                    setManagingEvent(updatedEv);
                                                  }
                                                }}
                                                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                                              >
                                                Check In
                                              </button>
                                            ) : (
                                              <span className="text-slate-400 dark:text-slate-600 text-xs font-medium">Checked In</span>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {managingSubView === 'analytics' && (() => {
                        const eventTickets = organizerTickets.filter(t => t.eventId === managingEvent?.id);
                        
                        const totalSold = eventTickets.length;
                        const capacity = parseInt(managingEvent?.capacity || '100', 10) || 100;
                        const soldPercentage = Math.min(100, Math.round((totalSold / capacity) * 100));
                        const checkedInCount = eventTickets.filter(t => t.checkedIn).length;
                        const checkinRate = totalSold > 0 ? Math.round((checkedInCount / totalSold) * 100) : 0;
                        
                        const totalRevenue = eventTickets.reduce((sum, t) => {
                          const cleanPrice = t.price.toLowerCase() === 'free' ? '0' : t.price.replace(/\D/g, '');
                          return sum + (parseInt(cleanPrice, 10) || 0);
                        }, 0);

                        const referralsMap: { [key: string]: number } = {};
                        const categoriesMap: { [key: string]: number } = {};
                        const paymentsMap: { [key: string]: number } = {};

                        eventTickets.forEach(t => {
                          const ref = t.referralSource || 'Langsung / Direct';
                          referralsMap[ref] = (referralsMap[ref] || 0) + 1;

                          const cat = t.audienceCategory || 'General Public';
                          categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;

                          const pay = t.paymentMethod || 'Unknown';
                          paymentsMap[pay] = (paymentsMap[pay] || 0) + 1;
                        });

                        const referrals = Object.entries(referralsMap).map(([name, count]) => ({ name, count }));
                        const categories = Object.entries(categoriesMap).map(([name, count]) => ({ name, count }));
                        const payments = Object.entries(paymentsMap).map(([name, count]) => ({ name, count }));

                        return (
                          <div className="mt-4 space-y-6">
                            <div className="flex justify-between items-center mb-6">
                              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Detail - {managingEvent?.title}</h3>
                              <button onClick={() => setManagingSubView('overview')} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Back to Overview</button>
                            </div>

                            {/* KPI Metrics */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Tickets Sold</p>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white">{totalSold} / {capacity}</h4>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${soldPercentage}%` }} />
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">{soldPercentage}% of capacity</p>
                              </div>

                              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                                <h4 className="text-2xl font-black text-green-600">Rp {totalRevenue.toLocaleString('id-ID')}</h4>
                                <p className="text-[10px] text-slate-500 mt-2">Based on ticket price</p>
                              </div>

                              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Attendance (Check-In)</p>
                                <h4 className="text-2xl font-black text-indigo-600">{checkedInCount} / {totalSold}</h4>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                                  <div className="bg-purple-600 h-full rounded-full" style={{ width: `${checkinRate}%` }} />
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">{checkinRate}% checked in</p>
                              </div>

                              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Page Views</p>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white">{managingEvent?.views || 1}</h4>
                                <p className="text-[10px] text-slate-500 mt-2">Total event detail page views</p>
                              </div>
                            </div>

                            {/* Charts & breakdowns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Referral breakdown */}
                              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-4">Marketing Channels (Referral)</h4>
                                {referrals.length === 0 ? (
                                  <p className="text-slate-500 text-xs py-8 text-center">No marketing data yet.</p>
                                ) : (
                                  <div className="space-y-3">
                                    {referrals.map((item, idx) => {
                                      const pct = totalSold > 0 ? Math.round((item.count / totalSold) * 100) : 0;
                                      return (
                                        <div key={idx} className="space-y-1">
                                          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                            <span>{item.name}</span>
                                            <span>{item.count} ticket(s) ({pct}%)</span>
                                          </div>
                                          <div className="w-full bg-slate-50 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              {/* Audience category breakdown */}
                              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-4">Audience Categories</h4>
                                {categories.length === 0 ? (
                                  <p className="text-slate-500 text-xs py-8 text-center">No audience category data yet.</p>
                                ) : (
                                  <div className="space-y-3">
                                    {categories.map((item, idx) => {
                                      const pct = totalSold > 0 ? Math.round((item.count / totalSold) * 100) : 0;
                                      return (
                                        <div key={idx} className="space-y-1">
                                          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                            <span>{item.name}</span>
                                            <span>{item.count} ticket(s) ({pct}%)</span>
                                          </div>
                                          <div className="w-full bg-slate-50 dark:bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                                            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              {/* Payment methods breakdown */}
                              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm md:col-span-2">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-4">Payment Method</h4>
                                {payments.length === 0 ? (
                                  <p className="text-slate-500 text-xs py-8 text-center">No ticket transactions yet.</p>
                                ) : (
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {payments.map((item, idx) => (
                                      <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{item.name}</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white">{item.count}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">Paid Ticket</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {managingSubView === 'edit' && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Event Details</h3>
                            <button onClick={() => setManagingSubView('overview')} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Cancel Editing</button>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 p-12 text-center text-slate-500">
                            <Edit2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="font-bold text-lg mb-2">Edit Form Workspace</p>
                            <p className="text-sm mb-6">Modify titles, descriptions, and schedules.</p>
                            <button onClick={() => setManagingSubView('overview')} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">Save Changes</button>
                          </div>
                        </div>
                      )}

                      {managingSubView === 'settings' && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Event Settings</h3>
                            <button onClick={() => setManagingSubView('overview')} className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Done</button>
                          </div>
                          
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2"><Eye className="w-5 h-5 text-indigo-600"/> Visibility</h4>
                                    <button 
                                      onClick={() => updateEventSetting({ isPublic: !managingEvent.isPublic })} 
                                      className={`w-12 h-6 rounded-full transition-colors relative ${managingEvent.isPublic !== false ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${managingEvent.isPublic !== false ? 'left-7' : 'left-1'}`}/>
                                    </button>
                                  </div>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    {managingEvent.isPublic !== false 
                                      ? "Public: This event will appear on the REventS homepage and search results." 
                                      : "Private: This event can only be accessed via a direct link."}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2"><Lock className="w-5 h-5 text-amber-600"/> Kontrol Penjualan</h4>
                                    <button 
                                      onClick={() => updateEventSetting({ isSalesClosed: !managingEvent.isSalesClosed })} 
                                      className={`w-12 h-6 rounded-full transition-colors relative ${managingEvent.isSalesClosed ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${managingEvent.isSalesClosed ? 'left-7' : 'left-1'}`}/>
                                    </button>
                                  </div>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                    {managingEvent.isSalesClosed 
                                      ? "Closed: Ticket sales are manually stopped." 
                                      : "Open: Users can continue purchasing tickets for this event."}
                                  </p>
                                </div>
                              </div>

                              <div className="md:col-span-2 bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/30">
                                <h4 className="font-bold text-lg text-red-600 dark:text-red-400 flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5"/> Danger Zone</h4>
                                <p className="text-sm text-red-500 dark:text-red-300 mb-6">Actions in this area are irreversible and may greatly impact your event attendees.</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                  <button onClick={() => updateEventSetting({ status: 'cancelled' })} className="px-6 py-3 bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm flex-1">
                                    Cancel Event
                                  </button>
                                  <button onClick={handleDeleteEvent} className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all text-sm shadow-md shadow-red-200 dark:shadow-none flex-1">
                                    Delete Event Permanently
                                  </button>
                                </div>
                              </div>
                            </div>

                        </div>
                      )}

                      {managingSubView === 'certificates' && (() => {
                        const eventTickets = organizerTickets.filter(t => t.eventId === managingEvent?.id);
                        const checkedInTickets = eventTickets.filter(t => t.checkedIn);
                        const templateBg = managingEvent.certificateTemplateUrl
                          ? (managingEvent.certificateTemplateUrl.startsWith('http')
                            ? managingEvent.certificateTemplateUrl
                            : `${window.location.protocol}//${window.location.host}${managingEvent.certificateTemplateUrl}`)
                          : '';

                        return (
                          <div className="mt-4 animate-in fade-in duration-200">
                            <div className="flex justify-between items-center mb-8">
                              <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  <Award className="w-6 h-6 text-indigo-650" /> Sertifikat Elektronik (E-Certificate)
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                  Kelola rilis sertifikat digital untuk peserta yang telah menghadiri acara.
                                </p>
                              </div>
                              <button onClick={() => setManagingSubView('overview')} className="text-sm font-bold text-indigo-606 hover:text-indigo-750">Kembali</button>
                            </div>

                            {/* Template Upload & Preview */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                              {/* Left: Template Upload */}
                              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm flex flex-col justify-between">
                                <div>
                                  <h4 className="font-black text-lg text-slate-900 dark:text-white mb-2">Template Sertifikat</h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    Unggah 1 desain template sertifikat kosong (tanpa nama) dalam format PNG atau JPG.
                                  </p>

                                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors relative group">
                                    <input
                                      type="file"
                                      accept="image/png, image/jpeg, image/jpg"
                                      onChange={handleUploadTemplate}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="text-center">
                                      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mx-auto mb-3 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                        <Plus className="w-6 h-6" />
                                      </div>
                                      <p className="font-bold text-sm text-slate-700 dark:text-slate-300">Pilih File Template</p>
                                      <p className="text-xs text-slate-400 mt-1">PNG atau JPG (Maks. 5MB)</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status Rilis</span>
                                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                                        {managingEvent.certificateReleased ? 'Sudah Dibagikan' : 'Belum Dibagikan'}
                                      </p>
                                    </div>
                                    {managingEvent.certificateReleased && (
                                      <span className="text-xs font-black text-green-600 bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full">Released</span>
                                    )}
                                  </div>

                                  <button
                                    onClick={handleDistributeCertificates}
                                    disabled={!managingEvent.certificateTemplateUrl || checkedInTickets.length === 0 || distributingCertificates}
                                    className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg text-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${
                                      managingEvent.certificateReleased
                                        ? 'bg-emerald-600 text-white shadow-emerald-100 dark:shadow-none hover:bg-emerald-700'
                                        : 'bg-indigo-600 text-white shadow-indigo-100 dark:shadow-none hover:bg-indigo-700'
                                    }`}
                                  >
                                    {distributingCertificates ? (
                                      <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Memproses...
                                      </>
                                    ) : (
                                      <>
                                        <Award className="w-5 h-5" />
                                        Generate & Bagikan Sertifikat
                                      </>
                                    )}
                                  </button>
                                  {(!managingEvent.certificateTemplateUrl) && (
                                    <p className="text-xs text-amber-605 dark:text-amber-400 font-medium text-center">
                                      *Harap unggah template sertifikat terlebih dahulu.
                                    </p>
                                  )}
                                  {(managingEvent.certificateTemplateUrl && checkedInTickets.length === 0) && (
                                    <p className="text-xs text-amber-605 dark:text-amber-400 font-medium text-center">
                                      *Belum ada peserta yang hadir (check-in) untuk dibagikan sertifikat.
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Right: Mock Preview */}
                              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm flex flex-col justify-between">
                                <div>
                                  <h4 className="font-black text-lg text-slate-900 dark:text-white mb-2">Pratinjau Sertifikat</h4>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    Melihat simulasi tampilan nama peserta pada template sertifikat yang diunggah.
                                  </p>

                                  {templateBg ? (
                                    <div className="relative w-full aspect-[1.414] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md bg-slate-100 flex items-center justify-center">
                                      <img
                                        src={templateBg}
                                        alt="Template Certificate"
                                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                      />
                                      <div className="relative z-10 text-center font-extrabold text-slate-900 dark:text-slate-900 text-xl sm:text-2xl md:text-3xl px-4 py-1 bg-white/70 backdrop-blur-sm rounded-lg max-w-[80%] truncate shadow-sm font-sans">
                                        Muhammad Rizky
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-full aspect-[1.414] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                                      <Award className="w-12 h-12 mb-3 opacity-30" />
                                      <p className="font-bold text-sm text-slate-500">Belum Ada Template</p>
                                      <p className="text-xs text-slate-400 mt-1">Pratinjau akan muncul setelah template berhasil diunggah.</p>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-8 text-center">
                                  <p className="text-[11px] text-slate-400">
                                    *Posisi nama di atas adalah simulasi penempatan teks nama lengkap secara horizontal & vertikal di tengah sertifikat.
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Guest List Details */}
                            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
                              <h4 className="font-black text-lg text-slate-900 dark:text-white mb-6 text-left">
                                Peserta yang Hadir ({checkedInTickets.length})
                              </h4>
                              
                              {checkedInTickets.length === 0 ? (
                                <div className="text-center text-slate-500 py-12">
                                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                  <p className="font-bold text-lg mb-2">Belum ada peserta yang hadir</p>
                                  <p className="text-sm">Hanya peserta yang sudah melakukan check-in yang berhak mendapatkan sertifikat.</p>
                                </div>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                                        <th className="pb-4 font-bold">Nama Lengkap</th>
                                        <th className="pb-4 font-bold">Email</th>
                                        <th className="pb-4 font-bold">Kategori</th>
                                        <th className="pb-4 font-bold text-right">Status Sertifikat</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                      {checkedInTickets.map(ticket => (
                                        <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                          <td className="py-4 font-bold text-slate-900 dark:text-white">{ticket.fullName || 'Guest'}</td>
                                          <td className="py-4 text-slate-500">{ticket.email || '-'}</td>
                                          <td className="py-4 text-slate-500"><span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-xs">{ticket.audienceCategory || 'Umum'}</span></td>
                                          <td className="py-4 text-right">
                                            {managingEvent.certificateReleased ? (
                                              <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 px-2.5 py-1 rounded-lg font-bold">Terkirim via Email</span>
                                            ) : (
                                              <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">Menunggu Pengiriman</span>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </motion.div>
              )}

              {organizerTab === 'attendeesLogistics' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <button 
                    onClick={() => switchOrganizerTab('dashboard')} 
                    className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-600/30 shadow-sm transition-all hover:scale-102 active:scale-98"
                  >
                    <ArrowLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Back to Dashboard</span>
                  </button>
                  <div className="mb-10 flex justify-between items-end flex-wrap gap-4">
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.attendeesLogistics}</h2>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your attendee list, check-ins, and event operations.</p>
                    </div>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="Search guests or tickets..." 
                        value={attendeeSearchQuery}
                        onChange={(e) => setAttendeeSearchQuery(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">Logistics Center</h3>
                       <button 
                        onClick={() => {
                          const headers = "No,Attendee Name,Email,Event Title,Category,Ticket Code,Purchase Date,Payment Method,Price,Check-In Status\r\n";
                          const rows = organizerTickets.map((t, idx) => {
                            const no = idx + 1;
                            const name = t.fullName || t.user?.fullName || 'Guest';
                            const email = t.email || t.user?.email || '-';
                            const eventTitle = t.event?.title || 'Event';
                            const category = t.audienceCategory || 'General Admission';
                            const ticketCode = t.qrCode || '-';
                            const purchaseDate = t.purchaseDate ? new Date(t.purchaseDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
                            const paymentMethod = t.paymentMethod || 'Free';
                            const price = t.price || 'Free';
                            const status = t.checkedIn ? 'Checked In' : 'Pending';

                            return [
                              no,
                              name,
                              email,
                              eventTitle,
                              category,
                              ticketCode,
                              purchaseDate,
                              paymentMethod,
                              price,
                              status
                            ].map(val => {
                              const str = String(val);
                              return `"${str.replace(/"/g, '""')}"`;
                            }).join(",");
                          }).join("\r\n");
                          
                          const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.setAttribute('href', url);
                          a.setAttribute('download', `REventS_Attendees_${managingEvent ? managingEvent.title.replace(/[^a-z0-9]/gi, '_') : 'list'}.csv`);
                          a.click();
                          
                          setToast({ message: 'Logistics CSV downloaded successfully!', show: true });
                          setTimeout(() => setToast({ message: '', show: false }), 3000);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-all text-sm flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download Attendee List (CSV)
                      </button>
                    </div>

                    {organizerTickets.length === 0 ? (
                      <p className="text-slate-500 text-sm text-center py-20">No attendees have purchased tickets for your events yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-wider">
                              <th className="pb-3 pr-4">Guest</th>
                              <th className="pb-3 px-4">Event</th>
                              <th className="pb-3 px-4">Ticket Code</th>
                              <th className="pb-3 px-4">Purchased</th>
                              <th className="pb-3 px-4">Status</th>
                              <th className="pb-3 pl-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {organizerTickets
                              .filter(t => {
                                const search = attendeeSearchQuery.toLowerCase();
                                return (
                                  (t.fullName || t.user?.fullName || '').toLowerCase().includes(search) ||
                                  (t.email || t.user?.email || '').toLowerCase().includes(search) ||
                                  t.event?.title?.toLowerCase().includes(search) ||
                                  t.qrCode?.toLowerCase().includes(search)
                                );
                              })
                              .map(t => (
                                <tr key={t.id} className="text-slate-700 dark:text-slate-300 font-medium">
                                  <td className="py-4 pr-4">
                                    <div className="font-bold text-slate-900 dark:text-white">{t.fullName || t.user?.fullName || 'Guest'}</div>
                                    <div className="text-xs text-slate-400">{t.email || t.user?.email || '-'}</div>
                                  </td>
                                  <td className="py-4 px-4 font-bold">{t.event?.title}</td>
                                  <td className="py-4 px-4 font-mono text-xs">{t.qrCode}</td>
                                  <td className="py-4 px-4 text-xs">
                                    {new Date(t.purchaseDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </td>
                                  <td className="py-4 px-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                      t.checkedIn 
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    }`}>
                                      {t.checkedIn ? 'Checked In' : 'Pending'}
                                    </span>
                                  </td>
                                  <td className="py-4 pl-4 text-right">
                                    {!t.checkedIn ? (
                                      <button 
                                        onClick={() => handleCheckInTicket(t.id)}
                                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                                      >
                                        Check In
                                      </button>
                                    ) : (
                                      <span className="text-slate-400 dark:text-slate-600 text-xs font-medium">Checked In</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {organizerTab === 'communityImpact' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <button 
                    onClick={() => switchOrganizerTab('dashboard')} 
                    className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-600/30 shadow-sm transition-all hover:scale-102 active:scale-98"
                  >
                    <ArrowLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Back to Dashboard</span>
                  </button>
                  <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.communityImpact}</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t.commImpactDesc}</p>
                  </div>
                  
                  {/* Premium Dashboard Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Radial Score Card */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden md:col-span-1">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-indigo-500"></div>
                      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                        {/* Circular progress background */}
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="50" stroke="#f1f5f9" strokeWidth="10" fill="transparent" className="dark:stroke-slate-800" />
                          <circle cx="64" cy="64" r="50" stroke="url(#gradientScore)" strokeWidth="10" fill="transparent" strokeDasharray="314" strokeDashoffset="44" strokeLinecap="round" />
                          <defs>
                            <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ec4899" />
                              <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-black text-slate-900 dark:text-white">86</span>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Score</span>
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">{t.impactScore}</h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal font-medium">Ranked Excellent in local business empowerment and carbon offset initiatives.</p>
                    </div>

                    {/* Stats KPI Cards */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/30 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">12</h3>
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">{t.localUmkm}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">Culinary, crafts, and merchant slots reserved for local businesses.</p>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                          <Globe className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">4.2 <span className="text-xs text-slate-400">Tons</span></h3>
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Carbon Offset</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">Offset by tree planting partnerships and paperless ticketing.</p>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                          <HeartHandshake className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">92%</h3>
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Community Inclusivity</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">Events offering student discounts or subsidized admission rates.</p>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-pink-50 dark:bg-pink-950/30 text-pink-500 rounded-2xl flex items-center justify-center shrink-0">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">280 <span className="text-xs text-slate-400">kg</span></h3>
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Eco-Waste Saved</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">Plastic water bottle and paper leaflet waste prevented.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chart section */}
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-6">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Local Vendor Impact Trend</h3>
                    <p className="text-slate-400 text-xs font-medium mb-6">Visualizing total transaction sales growth generated for local merchants (UMKMs).</p>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { name: 'Jan', sales: 4200000, vendors: 4 },
                          { name: 'Feb', sales: 6800000, vendors: 6 },
                          { name: 'Mar', sales: 9500000, vendors: 8 },
                          { name: 'Apr', sales: 13200000, vendors: 10 },
                          { name: 'May', sales: 18500000, vendors: 12 }
                        ]}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                          <YAxis 
                            stroke="#94a3b8" 
                            fontSize={11} 
                            tickLine={false} 
                            tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(1)}M`} 
                          />
                          <Tooltip formatter={(value: any) => [`IDR ${Number(value).toLocaleString('id-ID')}`, 'UMKM Revenue']} />
                          <Area type="monotone" dataKey="sales" name="Local Sales" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {organizerTab === 'finance' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <button 
                    onClick={() => switchOrganizerTab('dashboard')} 
                    className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-600/30 shadow-sm transition-all hover:scale-102 active:scale-98"
                  >
                    <ArrowLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Back to Dashboard</span>
                  </button>
                  <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.finance}</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">View revenue, manage payouts, and track transactions.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-500 mb-6">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Available Balance</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">Proceeds from your ticket sales ready for payout withdrawal.</p>
                        <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-8">
                          {totalSalesVal}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        {currentUser?.preferences?.payoutStatus === 'processing' ? (
                          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60 p-4 rounded-xl text-xs text-amber-700 dark:text-amber-300 font-medium mb-2 leading-relaxed">
                            <span className="font-bold flex items-center gap-1.5 mb-1 text-amber-800 dark:text-amber-200">
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Payout Processing
                            </span>
                            Request of <strong>{currentUser.preferences.payoutRequest?.amount}</strong> submitted on <strong>{new Date(currentUser.preferences.payoutRequest?.date).toLocaleDateString('id-ID')}</strong> is being processed.
                          </div>
                        ) : (
                          <button 
                            onClick={async () => {
                              if (!currentUser?.preferences?.payout?.bankName) {
                                setToast({ message: 'Please configure your Payout Settings first under Settings.', show: true });
                                setTimeout(() => setToast({ message: '', show: false }), 4000);
                                return;
                              }
                              
                              setIsGlobalLoading(true);
                              try {
                                const updatedUser = await apiFetch('/api/auth/profile', {
                                  method: 'PUT',
                                  body: JSON.stringify({
                                    preferences: {
                                      ...currentUser?.preferences,
                                      payoutStatus: 'processing',
                                      payoutRequest: {
                                        amount: totalSalesVal,
                                        date: new Date().toISOString()
                                      }
                                    }
                                  })
                                });
                                setCurrentUser(updatedUser);
                                setToast({ message: `Payout request for ${totalSalesVal} submitted successfully!`, show: true });
                                setTimeout(() => setToast({ message: '', show: false }), 4000);
                              } catch (err: any) {
                                setToast({ message: err.message || "Failed to request payout", show: true });
                                setTimeout(() => setToast({ message: '', show: false }), 4000);
                              } finally {
                                setIsGlobalLoading(false);
                              }
                            }}
                            className="bg-indigo-600 text-white w-full py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all text-sm active:scale-95"
                          >
                            Request Payout
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            switchOrganizerTab('settings');
                            setSettingsTab('payout');
                          }}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white w-full py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm active:scale-95"
                        >
                          Payout Settings
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Event Earnings Breakdown</h3>
                      {organizerEvents.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-10">No events found to track earnings.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm border-collapse">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                <th className="pb-3 pr-4">Event</th>
                                <th className="pb-3 px-4">Tickets Sold</th>
                                <th className="pb-3 px-4">Revenue</th>
                                <th className="pb-3 pl-4">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                              {organizerEvents.map(ev => (
                                <tr key={ev.id} className="text-slate-700 dark:text-slate-300 font-medium">
                                  <td className="py-4 pr-4">
                                    <div className="font-bold text-slate-900 dark:text-white">{ev.title}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{ev.date}</div>
                                  </td>
                                  <td className="py-4 px-4 font-bold">{ev.ticketsSold || 0}</td>
                                  <td className="py-4 px-4 font-bold">
                                    Rp {(ev.revenue || 0).toLocaleString('id-ID')}
                                  </td>
                                  <td className="py-4 pl-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                      ev.status === 'active' 
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                        : ev.status === 'draft' 
                                          ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                      {ev.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {organizerTab === 'settings' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                   <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
                      <Settings className="w-8 h-8 text-indigo-600" /> Settings
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your organizer profile and preferences.</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <button onClick={() => setSettingsTab('general')} className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${settingsTab === 'general' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>General Profile</button>
                    <button onClick={() => setSettingsTab('payout')} className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${settingsTab === 'payout' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>Payout Method</button>
                    <button onClick={() => setSettingsTab('team')} className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${settingsTab === 'team' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>Team Members</button>
                    <button 
                      onClick={handleSignOut} 
                      className="lg:hidden px-6 py-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5"
                    >
                      <LogOut className="w-4 h-4" /> {t.signOut}
                    </button>
                  </div>

                  {settingsTab === 'general' && (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">General Profile</h3>
                        <button 
                          onClick={() => setIsEditingOrganizerProfile(!isEditingOrganizerProfile)} 
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                          {isEditingOrganizerProfile ? <Lock className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                          <span className="text-xs font-bold">{isEditingOrganizerProfile ? 'Cancel' : 'Edit'}</span>
                        </button>
                      </div>
                      <div className="space-y-6 max-w-2xl">
                        <div className="flex items-center gap-6">
                          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden">
                            {profilePicUrl ? <img src={profilePicUrl} alt="Logo" className="w-full h-full object-cover" /> : <Camera className="w-6 h-6" />}
                          </div>
                          <input type="file" id="logo-file-input" className="hidden" onChange={handleLogoFileChange} accept="image/*" />
                          {isEditingOrganizerProfile && (
                            <button 
                              onClick={() => document.getElementById('logo-file-input')?.click()}
                              className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                            >
                              Upload Logo
                            </button>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Organization/Profile Name</label>
                          <input 
                            type="text" 
                            value={profileName} 
                            disabled={!isEditingOrganizerProfile}
                            onChange={e => setProfileName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-75 disabled:cursor-not-allowed" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Social Media Links</label>
                          <div className="space-y-3">
                            <input 
                              type="url" 
                              placeholder="Instagram URL" 
                              value={instagramUrl} 
                              disabled={!isEditingOrganizerProfile}
                              onChange={e => setInstagramUrl(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-75 disabled:cursor-not-allowed" 
                            />
                            <input 
                              type="url" 
                              placeholder="X (Twitter) URL" 
                              value={twitterUrl} 
                              disabled={!isEditingOrganizerProfile}
                              onChange={e => setTwitterUrl(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-75 disabled:cursor-not-allowed" 
                            />
                          </div>
                        </div>
                        {isEditingOrganizerProfile && (
                          <button 
                            onClick={handleSaveProfile} 
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all text-sm shadow-xl"
                          >
                            Save Profile
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {settingsTab === 'payout' && (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Payout Method</h3>
                        <button 
                          onClick={() => setIsEditingOrganizerPayout(!isEditingOrganizerPayout)} 
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                          {isEditingOrganizerPayout ? <Lock className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                          <span className="text-xs font-bold">{isEditingOrganizerPayout ? 'Cancel' : 'Edit'}</span>
                        </button>
                      </div>
                      <div className="space-y-6 max-w-2xl">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Bank Name</label>
                          <select 
                            value={payoutBank} 
                            disabled={!isEditingOrganizerPayout}
                            onChange={e => setPayoutBank(e.target.value)} 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none disabled:opacity-75 disabled:cursor-not-allowed"
                          >
                            <option value="">Select Bank</option>
                            <option value="BCA">BCA</option>
                            <option value="Mandiri">Mandiri</option>
                            <option value="BNI">BNI</option>
                            <option value="BRI">BRI</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Account Number (Rekening)</label>
                          <input 
                            type="text" 
                            value={payoutAccountNo} 
                            disabled={!isEditingOrganizerPayout}
                            onChange={e => setPayoutAccountNo(e.target.value)} 
                            placeholder="e.g. 1234567890" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-75 disabled:cursor-not-allowed" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Account Holder Name</label>
                          <input 
                            type="text" 
                            value={payoutAccountName} 
                            disabled={!isEditingOrganizerPayout}
                            onChange={e => setPayoutAccountName(e.target.value)} 
                            placeholder="e.g. John Doe" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-75 disabled:cursor-not-allowed" 
                          />
                        </div>
                        {isEditingOrganizerPayout && (
                          <button 
                            onClick={handleSavePayout} 
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all text-sm shadow-xl"
                          >
                            Save Payout Details
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {settingsTab === 'team' && (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Team Members</h3>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                          <input 
                            type="email" 
                            placeholder="Invite email address..." 
                            value={newTeamMemberEmail}
                            onChange={e => setNewTeamMemberEmail(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 transition-all"
                          />
                          <button 
                            onClick={handleInviteTeamMember} 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 dark:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0"
                          >
                            <Plus className="w-4 h-4 stroke-[3]"/> Invite
                          </button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 overflow-hidden shrink-0">
                                {profilePicUrl ? <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" /> : profileName ? profileName.substring(0, 2).toUpperCase() : 'U'}
                             </div>
                             <div>
                               <p className="font-bold text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">{profileName} (You)</p>
                               <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[150px] sm:max-w-xs">{profileEmail}</p>
                             </div>
                          </div>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">Owner</span>
                        </div>
                        {teamMembers.map(member => (
                          <div key={member.id} className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 shrink-0">
                                  {member.name.substring(0, 2).toUpperCase()}
                                </div>
                               <div>
                                 <p className="font-bold text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">{member.name}</p>
                                 <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[150px] sm:max-w-xs">{member.email}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider hidden sm:block">{member.role}</span>
                              <button onClick={() => handleRemoveTeamMember(member.email)} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}


            </>
          ) : (
            <>
              {audienceTab === 'myTickets' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                  <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.myTickets}</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t.myTixDesc}</p>
                  </div>
                  <div className="flex gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <button onClick={() => setMyTicketsTab('active')} className={`font-bold pb-4 -mb-[18px] transition-colors ${myTicketsTab === 'active' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>{t.activeTickets}</button>
                    <button onClick={() => setMyTicketsTab('history')} className={`font-bold pb-4 -mb-[18px] transition-colors ${myTicketsTab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>{t.eventHistory}</button>
                  </div>
                  
                  {myTicketsTab === 'active' && (
                    <div className="space-y-6">
                      {userTickets.filter(t => t.status === 'active').length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center text-slate-500 py-12">
                          You have no active tickets. Explore events and get some tickets!
                        </div>
                      ) : (
                        userTickets.filter(t => t.status === 'active').map(ticket => {
                          const ev = events.find(e => e.id === ticket.eventId) || {
                            title: 'Summer Music Festival 2024',
                            date: 'Saturday, June 15',
                            location: 'Central Park, Jakarta',
                            image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80'
                          };
                          return (
                            <div key={ticket.id} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-8 items-center shadow-sm">
                              <div className="w-48 h-48 bg-white p-4 rounded-xl shadow-md border border-slate-100 flex-shrink-0">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.qrCode}`} alt="QR Code" className="w-full h-full object-cover mix-blend-multiply" />
                              </div>
                              <div className="flex-grow w-full text-center sm:text-left">
                                <span className="text-[10px] font-black tracking-widest uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full mb-3 inline-block">{t.readyToScan}</span>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{ev.title}</h3>
                                <p className="text-slate-500 font-medium mb-4">{ev.date} @ {ev.type === 'online' ? 'Online' : ev.location}</p>
                                <div className="flex flex-wrap items-center gap-3 mt-4 justify-center sm:justify-start">
                                  <button 
                                    onClick={() => {
                                      setSelectedTicketInfo({
                                        ...ticket,
                                        title: ev.title,
                                        date: ev.date,
                                        location: ev.location,
                                        type: ev.type,
                                        onlineLink: ev.onlineLink
                                      });
                                      setShowTicketModal(true);
                                    }} 
                                    className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
                                  >
                                    View Details
                                  </button>
                                  
                                  {ev.type === 'online' && (() => {
                                    const active = isDayOfEventOrPassed(ev.date);
                                    return (
                                      <div className="flex flex-col sm:flex-row items-center gap-2">
                                        <button 
                                          onClick={() => {
                                            if (active) {
                                              window.open(ev.onlineLink || '#', '_blank');
                                            } else {
                                              setToast({ message: `Event link not yet active. It opens on the event day (${ev.date})!`, show: true });
                                              setTimeout(() => setToast({ message: '', show: false }), 4000);
                                            }
                                          }} 
                                          className={`text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md ${
                                            active 
                                              ? 'bg-purple-600 hover:bg-purple-700 text-white active:scale-95' 
                                              : 'bg-purple-300 dark:bg-purple-900/40 text-purple-100 dark:text-purple-700 cursor-not-allowed opacity-60'
                                          }`}
                                        >
                                          Join Event
                                        </button>
                                        {!active && (
                                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">
                                            Active on event day
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {myTicketsTab === 'history' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                       <div className="divide-y divide-slate-50 dark:divide-slate-800">
                        {userTickets.filter(t => t.status === 'past').length === 0 ? (
                          <div className="p-8 text-center text-slate-500">
                            No past event history.
                          </div>
                        ) : (
                          userTickets.filter(t => t.status === 'past').map(ticket => {
                            const ev = events.find(e => e.id === ticket.eventId) || {
                              title: 'Street Food Carnival',
                              location: 'Kota Tua, Jakarta',
                              image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
                              category: 'Food & Drink'
                            };
                            const isScrapbook = isScrapbookCategory(ev.category);

                            if (isScrapbook) {
                              return (
                                <div key={ticket.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-indigo-500/5 dark:from-purple-950/10 dark:via-pink-950/10 dark:to-indigo-950/10 transition-all border-b border-slate-100 dark:border-slate-800">
                                  <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-white dark:bg-slate-800 p-1 rounded-sm shadow-md transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300 flex-shrink-0 border border-slate-200/50 dark:border-slate-700/50">
                                      <img src={ev.image} className="w-full h-full object-cover rounded-sm" alt={ev.title} />
                                    </div>
                                    <div>
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 mb-1.5 border border-purple-200/30">
                                        📸 Memory Scrapbook
                                      </span>
                                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight leading-snug">{ev.title}</h4>
                                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                                        <MapPin className="w-3 h-3 text-purple-400" /> {ev.location}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 self-end sm:self-auto">
                                    <span className="text-xs font-bold text-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 px-3 py-1 rounded-lg border border-indigo-100/50 dark:border-indigo-900/30">
                                      Attended
                                    </span>
                                    <button 
                                      onClick={() => setSelectedScrapbookTicket({ ticket, ev })}
                                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black transition-all active:scale-[0.97] hover:scale-[1.03] shadow-md shadow-purple-200/50 dark:shadow-none cursor-pointer"
                                    >
                                      <Sparkles className="w-3.5 h-3.5" /> Buka Scrapbook
                                    </button>
                                  </div>
                                </div>
                              );
                            }

                            // Non-scrapbook categories (Tech, Sports, etc.)
                            return (
                              <div key={ticket.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <img src={ev.image} className="w-full h-full object-cover grayscale opacity-70" alt={ev.title} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                                    <p className="text-xs text-slate-400 font-medium">Past • {ev.location}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">Attended</span>
                                  {ev.provideCertificate && (
                                    ev.certificateReleased ? (
                                      <button 
                                        onClick={() => handleDownloadCertificate(ticket, ev)}
                                        className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg text-xs font-bold transition-all active:scale-[0.97] shadow-sm cursor-pointer"
                                      >
                                        <Award className="w-3.5 h-3.5" /> Unduh Sertifikat
                                      </button>
                                    ) : (
                                      <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-3 py-1 rounded-lg" title="Sertifikat sedang disiapkan oleh penyelenggara">Sertifikat Belum Rilis</span>
                                    )
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                       </div>
                    </div>
                  )}
                </motion.div>
              )}



              {audienceTab === 'revasst' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.aiMatchmakerSidebar}</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t.aiMatchmakerDesc}</p>
                  </div>
                  
                  {!showRecommendations ? (
                    <div className="text-white p-8 rounded-3xl shadow-xl overflow-hidden relative fluid-dynamic-ai">
                      <div className="absolute top-0 right-0 p-8 opacity-20"><Sparkles className="w-32 h-32" /></div>
                      <div className="relative z-10 max-w-lg">
                        <h3 className="text-2xl font-black mb-2">{t.aiRecProcessed}</h3>
                        <p className="text-indigo-100 mb-6 font-medium">{t.engineReadyDesc}</p>
                        <button 
                          onClick={() => { setShowRecommendations(true); loadAiRecommendations(); }} 
                          className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
                        >
                          {t.seeResults}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                          Recommended experiences matching your profile:
                        </h3>
                        <button 
                          onClick={() => setShowRecommendations(false)} 
                          className="text-sm text-indigo-600 font-bold hover:underline"
                        >
                          ← Back
                        </button>
                      </div>
                      
                      {isRecommendationsLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-sm font-bold text-slate-500 animate-pulse">REva is calculating matches...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {recommendedEvents.map(ev => {
                          const isSaved = savedEventIds.includes(ev.id);
                          return (
                            <div key={ev.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col gap-4 hover:shadow-md transition-shadow group relative">
                              <div className="aspect-video rounded-2xl overflow-hidden relative">
                                <img src={ev.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSavedEventIds(prev => 
                                      isSaved ? prev.filter(id => id !== ev.id) : [...prev, ev.id]
                                    );
                                  }} 
                                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-xl text-indigo-600 hover:scale-110 transition-transform"
                                >
                                  <HeartHandshake className={`w-5 h-5 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                                </button>
                                <span className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                  {ev.category}
                                </span>
                              </div>
                              <div className="flex-grow flex flex-col justify-between">
                                <div>
                                  <h4 className="font-black text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors mb-1">{ev.title}</h4>
                                  <p className="text-slate-500 text-xs font-semibold mb-2">{ev.date} @ {ev.type === 'online' ? 'Online' : ev.location}</p>
                                  <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 mb-4">{ev.description}</p>
                                </div>
                                <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
                                  <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">{ev.price}</span>
                                  <button 
                                    onClick={() => handleGetTickets(ev)} 
                                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 text-indigo-600 font-bold rounded-xl text-xs transition-colors"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {recommendedEvents.length === 0 && (
                          <div className="bg-slate-50 dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center col-span-2 text-slate-500 py-12">
                            No events found matching your preferred categories. Go to "Interests" tab to update them!
                          </div>
                        )}
                      </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {audienceTab === 'savedEvents' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.savedEvents}</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t.savedEventsDesc}</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-800 flex items-center gap-4 mb-6">
                     <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                     <p className="text-sm font-bold text-orange-800 dark:text-orange-200">{t.aiPredictionText}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.filter(ev => savedEventIds.includes(ev.id)).map(ev => (
                      <div key={ev.id} onClick={() => { handleGetTickets(ev); }} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow group relative">
                        <div className="aspect-video rounded-2xl overflow-hidden relative">
                          <img src={ev.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSavedEventIds(prev => prev.filter(id => id !== ev.id));
                            }} 
                            className="absolute top-4 right-4 bg-white/90 p-2 rounded-xl text-red-500 hover:scale-110 transition-transform"
                          >
                            <HeartHandshake className="w-5 h-5 fill-current" />
                          </button>
                        </div>
                        <div>
                          <h4 className="font-black text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{ev.title}</h4>
                          <p className="text-slate-500 font-medium text-sm">{ev.price}</p>
                        </div>
                      </div>
                    ))}
                    {events.filter(ev => savedEventIds.includes(ev.id)).length === 0 && (
                      <p className="text-slate-500 col-span-full">No saved events yet.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {audienceTab === 'interestPreferences' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.interestPreferences}</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t.interestPrefDesc}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm max-w-2xl">
                    <div className="space-y-6">
                        <div>
                        <label className="text-sm font-bold text-slate-900 dark:text-white mb-3 block">{t.categoriesLabel}</label>
                        <div className="flex flex-wrap gap-2">
                          {['Music', 'Tech', 'Food & Drink', 'Culture', 'Sports'].map(cat => {
                            const isSelected = prefCategories.includes(cat);
                            return (
                              <button 
                                key={cat} 
                                onClick={() => {
                                  setPrefCategories(prev => 
                                    prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                                  );
                                }}
                                className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                                  isSelected 
                                    ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 active:scale-95' 
                                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300 active:scale-95'
                                }`}
                              >
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-bold text-slate-900 dark:text-white mb-3 block">Preferred Format</label>
                        <select value={prefFormat} onChange={e => setPrefFormat(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                          <option value="Any">Any Format</option>
                          <option value="Seminar">Seminar</option>
                          <option value="Workshop">Workshop</option>
                          <option value="Concert">Concert</option>
                          <option value="Conference">Conference</option>
                          <option value="Festival">Festival</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-slate-900 dark:text-white mb-3 block">Attendance Mode</label>
                        <select value={prefAttendanceMode} onChange={e => setPrefAttendanceMode(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                          <option value="Any">Any Mode</option>
                          <option value="Online">Online</option>
                          <option value="Offline">Offline</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-slate-900 dark:text-white mb-3 block">Preferred Budget</label>
                        <select value={prefBudget} onChange={e => setPrefBudget(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                          <option value="Any">Any Budget</option>
                          <option value="Free">Free Only</option>
                          <option value="Under 100k">Under 100k IDR</option>
                          <option value="100k - 500k">100k - 500k IDR</option>
                          <option value="Above 500k">Above 500k IDR</option>
                        </select>
                      </div>

                      <button 
                        onClick={async () => {
                          try {
                            const updatedUser = await apiFetch('/api/auth/profile', {
                              method: 'PUT',
                              body: JSON.stringify({
                                preferences: { 
                                  categories: prefCategories,
                                  format: prefFormat,
                                  attendanceMode: prefAttendanceMode,
                                  budget: prefBudget
                                }
                              })
                            });
                            setCurrentUser(updatedUser);
                            setToast({ message: "Preferences updated successfully!", show: true });
                            setTimeout(() => setToast({ message: '', show: false }), 4000);
                          } catch (err: any) {
                            setToast({ message: err.message || "Failed to update preferences", show: true });
                            setTimeout(() => setToast({ message: '', show: false }), 4000);
                          }
                        }}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold w-full mt-4"
                      >
                        {t.updatePreferences}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}



              {audienceTab === 'accountPayment' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="mb-10">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.accountPayment}</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{t.accountPaymentDesc}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm w-full overflow-hidden">
                    <div className="h-40 sm:h-56 bg-slate-900 dark:bg-slate-950 w-full relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"></div>
                      <label className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 opacity-0 group-hover:opacity-100 cursor-pointer">
                        <Camera className="w-4 h-4" /> Cover
                        <input type="file" accept="image/*" className="hidden" />
                      </label>
                    </div>
                    <div className="px-8 pb-12 sm:px-16 relative flex flex-col sm:flex-row gap-8 sm:gap-16 items-start mt-[-4rem] sm:mt-[-5rem]">
                      <div className="relative group">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-xl flex-shrink-0">
                          <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-4xl sm:text-5xl relative overflow-hidden group-hover:bg-indigo-200 transition-colors">
                            {profilePicUrl ? <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" /> : profileName ? profileName.substring(0, 2).toUpperCase() : 'U'}
                            <label className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                              <Camera className="w-8 h-8 text-white" />
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const url = URL.createObjectURL(e.target.files[0]);
                                  setProfilePicUrl(url);
                                }
                              }} />
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 w-full pt-4 sm:pt-24 space-y-8">
                        <div className="relative w-full mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                          <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="absolute right-0 top-0 text-slate-400 hover:text-indigo-600 transition-colors bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{t.fullNameLabel}</label>
                          <input type="text" value={profileName} disabled={!isEditingProfile} onChange={e => setProfileName(e.target.value)} className={`w-full bg-transparent border-b-2 ${isEditingProfile ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-900 dark:text-white'} pb-2 text-2xl font-bold focus:outline-none transition-colors cursor-${isEditingProfile ? 'text' : 'default'}`} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{t.emailAddress}</label>
                          <input type="email" value={profileEmail} disabled={!isEditingProfile} onChange={e => setProfileEmail(e.target.value)} className={`w-full bg-transparent border-b-2 ${isEditingProfile ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-900 dark:text-white'} pb-2 text-xl font-medium focus:outline-none transition-colors cursor-${isEditingProfile ? 'text' : 'default'}`} />
                        </div>
                        
                        <div className="pt-8 flex flex-col sm:flex-row gap-4 items-center border-t border-slate-100 dark:border-slate-800">
                          <button onClick={() => { setIsEditingProfile(false); setToast({ message: 'Profile saved seamlessly.', show: true }); setTimeout(() => setToast({ message: '', show: false }), 4000); }} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-xl font-bold hover:scale-105 transition-all text-sm w-full sm:w-auto shadow-xl">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 sm:p-12">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Manage your billing</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">View transaction history, download invoices, and track refund status.</p>
                    
                    <div className="space-y-6">
                      {userTickets.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                          No transaction or billing history found.
                        </div>
                      ) : (
                        userTickets.map(ticket => {
                          const ev = ticket.event || events.find(e => e.id === ticket.eventId) || {
                            title: 'Tech Summit 2024',
                            location: 'Tech Hub, BSD City',
                            date: 'Nov 25, 2025',
                            price: 'IDR 250.000'
                          };
                          
                          const txnId = ticket.qrCode 
                            ? ticket.qrCode.replace('TKT-', 'TXN-') 
                            : `TXN-${ticket.id}0${ticket.eventId}39`;
                            
                          const purchaseDate = ticket.purchaseDate 
                            ? new Date(ticket.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : 'Nov 25, 2025';
                            
                          const isCancelled = ticket.status === 'cancelled' || ev.status === 'cancelled' || ticket.status === 'refunded';

                          if (isCancelled) {
                            return (
                              <div key={ticket.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <div>
                                  <h4 className="font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                                  <p className="text-xs text-slate-500 mt-1">Transaction ID: {txnId} • {purchaseDate}</p>
                                  <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">Event Cancelled - Refund Processing</p>
                                </div>
                                <div className="flex flex-wrap gap-3 items-center">
                                  <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 rounded-lg text-xs font-bold uppercase tracking-wider">Refund Pending</span>
                                  <button onClick={() => {
                                    setSelectedRefund({ 
                                      event: ev.title, 
                                      date: purchaseDate, 
                                      amount: ticket.price || ev.price || 'IDR 250.000', 
                                      transactionId: txnId 
                                    });
                                    setShowRefundModal(true);
                                  }} className="px-4 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold rounded-xl text-xs hover:bg-indigo-100 transition-colors">View Refund Status</button>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div key={ticket.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                              <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">Transaction ID: {txnId} • {purchaseDate}</p>
                              </div>
                              <div className="flex flex-wrap gap-3 items-center">
                                <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 rounded-lg text-xs font-bold uppercase tracking-wider">Paid</span>
                                <button onClick={async () => {
                                  setToast({ message: "Generating PDF Invoice...", show: true });
                                  try {
                                    const response = await fetch(`/api/tickets/invoice/${txnId}`, {
                                      headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                                      }
                                    });
                                    if (!response.ok) throw new Error('Failed to generate invoice.');

                                    const blob = await response.blob();
                                    const downloadUrl = window.URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = downloadUrl;
                                    link.download = `Invoice_${txnId}.pdf`;
                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                    window.URL.revokeObjectURL(downloadUrl);

                                    setToast({ message: 'Invoice downloaded successfully.', show: true });
                                    setTimeout(() => setToast({ message: '', show: false }), 3000);
                                  } catch (err: any) {
                                    setToast({ message: err.message || "Failed to download invoice.", show: true });
                                    setTimeout(() => setToast({ message: '', show: false }), 4000);
                                  }
                                }} className="px-4 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold rounded-xl text-xs hover:bg-indigo-100 transition-colors">Download Invoice (PDF)</button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-8 sm:p-12">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Preferences & Settings</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Customize your application experience.</p>
                    
                    <div className="space-y-4">
                      {/* Theme Appearance Card */}
                      <div className="hidden lg:flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">Theme Appearance</h4>
                          <p className="text-xs text-slate-500 mt-1">Switch between Light and Dark mode.</p>
                        </div>
                        <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl text-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm">
                          {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </button>
                      </div>

                      {/* Switch Mode Card */}
                      <div className="hidden items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">Switch Mode</h4>
                          <p className="text-xs text-slate-500 mt-1">Switch to Pro Organizer Mode to create and manage events.</p>
                        </div>
                        <button onClick={toggleRole} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
                          <ArrowLeftRight className="w-4 h-4" />
                          Organizer Mode
                        </button>
                      </div>

                      {/* Interest Preferences Card */}
                      <div className="flex lg:hidden items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">Interest Preferences</h4>
                          <p className="text-xs text-slate-500 mt-1">Update preferences to help AI find the best events.</p>
                        </div>
                        <button onClick={() => setShowInterestModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl text-sm border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-650 transition-colors shadow-sm">
                          <Sliders className="w-4 h-4 text-indigo-600" />
                          Configure
                        </button>
                      </div>

                      {/* Sign Out Card */}
                      <div className="hidden items-center justify-between p-6 bg-red-50 dark:bg-red-950/10 rounded-2xl border border-red-100 dark:border-red-900/30">
                        <div>
                          <h4 className="font-bold text-red-650 dark:text-red-400">Sign Out</h4>
                          <p className="text-xs text-red-500 dark:text-red-350 mt-1">Log out of the current REventS session.</p>
                        </div>
                        <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
        
        {/* Ticket Detail Modal */}
        <AnimatePresence>
          {showTicketModal && selectedTicketInfo && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 20 }} 
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full relative overflow-hidden border border-slate-100 dark:border-slate-800/80 flex flex-col"
              >
                {/* Top Ticket Header Banner */}
                <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 p-6 text-center border-b border-dashed border-slate-200 dark:border-slate-800/60 relative">
                  <button 
                    onClick={() => setShowTicketModal(false)} 
                    className="absolute top-4 right-4 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                  <span className="text-[9px] font-black tracking-widest uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-0.5 rounded-full mb-2 inline-block">Active Ticket</span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 leading-snug">{selectedTicketInfo.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">{selectedTicketInfo.date || 'TBA'} • {selectedTicketInfo.location || 'TBA'}</p>
                </div>

                {/* Left/Right Ticket Tear Holes */}
                <div className="absolute left-0 top-[138px] -ml-3 w-6 h-6 bg-slate-950/60 dark:bg-slate-950 rounded-full z-10 hidden sm:block"></div>
                <div className="absolute right-0 top-[138px] -mr-3 w-6 h-6 bg-slate-950/60 dark:bg-slate-950 rounded-full z-10 hidden sm:block"></div>

                {/* QR Code Container - Ultra Clear & High Contrast for Easy Scanning */}
                <div className="p-6 text-center flex flex-col items-center">
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm max-w-[200px] w-full aspect-square flex items-center justify-center mb-3">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${selectedTicketInfo.qrCode}`} 
                      alt="Ticket QR Code" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
                    Code: <span className="text-slate-700 dark:text-slate-300 font-black">{selectedTicketInfo.qrCode}</span>
                  </p>
                  <p className="text-[10px] text-indigo-500 dark:text-indigo-400 mt-1 font-semibold flex items-center gap-1 justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Present at entrance for check-in
                  </p>
                </div>

                {/* Tear-off Dashed Line */}
                <div className="border-t border-dashed border-slate-200 dark:border-slate-800 mx-6"></div>

                {/* Ticket Metadata Details */}
                <div className="p-6 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Attendee</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTicketInfo.fullName || 'Guest'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Email</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{selectedTicketInfo.email || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Category</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTicketInfo.audienceCategory || 'General Admission'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Price Paid</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{selectedTicketInfo.price || 'Free'}</span>
                  </div>
                  {selectedTicketInfo.type === 'online' && selectedTicketInfo.onlineLink && (
                    <div className="flex justify-between items-center pt-1 mt-1 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">Access Link</span>
                      <a 
                        href={selectedTicketInfo.onlineLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-[180px]"
                      >
                        {selectedTicketInfo.onlineLink}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Refund Status Modal */}
        <AnimatePresence>
          {showRefundModal && selectedRefund && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl max-w-md w-full relative border border-slate-100 dark:border-slate-800">
                <button onClick={() => setShowRefundModal(false)} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                <div className="mb-6">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10"></path><path d="M3.51 15A9 9 0 0 0 18.36 18.36L23 14"></path></svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Refund Status</h3>
                  <p className="text-sm text-slate-500 font-medium">{selectedRefund.event} • {selectedRefund.amount}</p>
                </div>
                
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-6">
                  <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-indigo-600 rounded-full -left-[7px] top-1.5 shadow-[0_0_0_4px_rgba(79,70,229,0.2)]"></div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Refund Requested</h4>
                    <p className="text-xs text-slate-500">Dec 03, 2025 • Request initiated due to event cancellation.</p>
                  </div>
                  <div className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-amber-500 rounded-full -left-[7px] top-1.5 shadow-[0_0_0_4px_rgba(245,158,11,0.2)]"></div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Processing by Bank</h4>
                    <p className="text-xs text-slate-500">Dec 04, 2025 • Your bank is processing the refund.</p>
                  </div>
                  <div className="relative pl-6 opacity-40">
                    <div className="absolute w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-full -left-[7px] top-1.5"></div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Completed</h4>
                    <p className="text-xs text-slate-500">Estimated Dec 06, 2025</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button onClick={() => setShowRefundModal(false)} className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl text-sm">Close</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved Events Modal */}
        <AnimatePresence>
          {showSavedEventModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl max-w-4xl w-full relative border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto no-scrollbar">
                <button onClick={() => setShowSavedEventModal(false)} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white z-10"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                <div className="mb-10">
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.savedEvents}</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{t.savedEventsDesc}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-800 flex items-center gap-4 mb-6">
                   <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                   <p className="text-sm font-bold text-orange-800 dark:text-orange-200">{t.aiPredictionText}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.filter(ev => savedEventIds.includes(ev.id)).map(ev => (
                    <div key={ev.id} onClick={() => { setShowSavedEventModal(false); handleGetTickets(ev); }} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow group relative">
                      <div className="aspect-video rounded-2xl overflow-hidden relative">
                        <img src={ev.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSavedEventIds(prev => prev.filter(id => id !== ev.id));
                          }} 
                          className="absolute top-4 right-4 bg-white/90 p-2 rounded-xl text-red-500 hover:scale-110 transition-transform"
                        >
                          <HeartHandshake className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{ev.title}</h4>
                        <p className="text-slate-500 font-medium text-sm">{ev.price}</p>
                      </div>
                    </div>
                  ))}
                  {events.filter(ev => savedEventIds.includes(ev.id)).length === 0 && (
                    <p className="text-slate-500 col-span-full">No saved events yet.</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interest Modal */}
        <AnimatePresence>
          {showInterestModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl max-w-2xl w-full relative border border-slate-100 dark:border-slate-800">
                <button onClick={() => setShowInterestModal(false)} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white z-10"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
                <div className="mb-10">
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t.interestPreferences}</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{t.interestPrefDesc}</p>
                </div>
                <div className="space-y-6">
                    <div>
                    <label className="text-sm font-bold text-slate-900 dark:text-white mb-3 block">{t.categoriesLabel}</label>
                    <div className="flex flex-wrap gap-2">
                      {['Music', 'Tech', 'Food & Drink', 'Culture', 'Sports'].map(cat => {
                        const isSelected = prefCategories.includes(cat);
                        return (
                          <button 
                            key={cat} 
                            onClick={() => {
                              setPrefCategories(prev => 
                                prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                              );
                            }}
                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                              isSelected 
                                ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 active:scale-95' 
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300 active:scale-95'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-slate-900 dark:text-white mb-3 block">Preferred Format</label>
                    <select value={prefFormat} onChange={e => setPrefFormat(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="Any">Any Format</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Concert">Concert</option>
                      <option value="Conference">Conference</option>
                      <option value="Festival">Festival</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-900 dark:text-white mb-3 block">Attendance Mode</label>
                    <select value={prefAttendanceMode} onChange={e => setPrefAttendanceMode(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="Any">Any Mode</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-900 dark:text-white mb-3 block">Preferred Budget</label>
                    <select value={prefBudget} onChange={e => setPrefBudget(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="Any">Any Budget</option>
                      <option value="Free">Free Only</option>
                      <option value="Under 100k">Under 100k IDR</option>
                      <option value="100k - 500k">100k - 500k IDR</option>
                      <option value="Above 500k">Above 500k IDR</option>
                    </select>
                  </div>

                  <button 
                    onClick={async () => {
                      try {
                        const updatedUser = await apiFetch('/api/auth/profile', {
                          method: 'PUT',
                          body: JSON.stringify({
                            preferences: { 
                              categories: prefCategories,
                              format: prefFormat,
                              attendanceMode: prefAttendanceMode,
                              budget: prefBudget
                            }
                          })
                        });
                        setCurrentUser(updatedUser);
                        setToast({ message: "Preferences updated successfully!", show: true });
                        setTimeout(() => setToast({ message: '', show: false }), 4000);
                        setShowInterestModal(false);
                      } catch (err: any) {
                        setToast({ message: err.message || "Failed to update preferences", show: true });
                        setTimeout(() => setToast({ message: '', show: false }), 4000);
                      }
                    }}
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold w-full mt-4"
                  >
                    {t.updatePreferences}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );

  const isFullScreenView = view === 'ticket-preview' || view === 'checkout-details' || view === 'checkout' || view === 'dashboard' || view === 'create-event';
  
  const showHeader = !isFullScreenView || (isMobile && (view === 'dashboard' || view === 'create-event'));
  const useFullScreenLayout = isFullScreenView && !(isMobile && (view === 'dashboard' || view === 'create-event'));

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className={`min-h-screen font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-indigo-100 dark:selection:bg-indigo-900/50 ${useFullScreenLayout ? 'overflow-hidden h-screen' : 'overflow-x-hidden max-w-full w-full pt-16'} relative`}>
        {/* Slow glowing low-opacity background animation blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-indigo-500/10 to-purple-500/15 blur-[120px] animate-slow-glow-1" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-pink-500/10 to-indigo-500/15 blur-[120px] animate-slow-glow-2" />
          <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-blue-500/5 to-cyan-500/10 blur-[140px] animate-slow-glow-3" />
        </div>
        {showHeader && Header()}
        
        <div className={useFullScreenLayout ? 'h-full overflow-y-auto no-scrollbar pb-24 lg:pb-0' : 'pb-24 lg:pb-0'}>
          <AnimatePresence mode="wait">
            {view === 'landing' && <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{LandingView()}</motion.div>}
{view === 'auth' && <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{AuthView()}</motion.div>}
            {view === 'onboarding' && <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{OnboardingView()}</motion.div>}
            {(view === 'dashboard' || view === 'create-event') && <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{DashboardView()}</motion.div>}
            {view === 'create-event' && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm p-4 sm:p-8">
                  <motion.div key="create" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 max-w-3xl mx-auto w-full flex flex-col items-center">
                
                {!showCreateForm ? (
                  <div className="flex items-center justify-center py-8 w-full min-h-[70vh]">
                    <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl w-full max-w-lg rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden p-8 flex flex-col items-center justify-center text-center relative">
                      {/* Accent Glow blobs */}
                      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[40px] pointer-events-none" />
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[40px] pointer-events-none" />
                      
                      {/* Sparkle Icon Badge */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/20 dark:shadow-none">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      
                      {/* Header Title */}
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                        Create Your Next Event
                      </h2>
                      
                      {/* Description */}
                      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm text-sm leading-relaxed font-medium">
                        Set up your event details, configure ticketing, and launch your experience in minutes.
                      </p>
                      
                      {/* Primary Action Button */}
                      <button 
                        onClick={() => { 
                          setEventEditReturnContext({ organizerTab: 'myPublishedEvents', publishedEventsTab: 'published', managingEvent: null }); 
                          setShowCreateForm(true); 
                        }}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                      >
                        Start Event Builder
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      
                      {/* Return to Dashboard */}
                      <button 
                        onClick={() => { setView('dashboard'); switchOrganizerTab('dashboard'); }} 
                        className="mt-4 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-bold transition-colors text-xs py-2 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 pb-28 sm:pb-8 shadow-xl border border-slate-100 dark:border-slate-800 w-full relative">
                    <button 
                      onClick={() => {
                        setShowCreateForm(false);
                        
                        // Clear form input fields
                        setEditingEventId(null);
                        setEventTitle('');
                        setEventDescShort('');
                        setEventDescFull('');
                        setEventPosterUrl(null);
                        setEventAddress('');
                        setEventOnlineLink('');
                        setEventPrice('150000');
                        setEventCapacity('100');
                        setProvideCertificate(false);
                        setEventIsExternal(false);
                        setEventExternalUrl('');
                        setEventExternalProvider('');

                        if (eventEditReturnContext) {
                          setView('dashboard');
                          setOrganizerTab(eventEditReturnContext.organizerTab);
                          setPublishedEventsTab(eventEditReturnContext.publishedEventsTab);
                          if (eventEditReturnContext.managingEvent) {
                            setManagingEvent(eventEditReturnContext.managingEvent);
                          }
                        } else {
                          setView('dashboard');
                          setOrganizerTab('myPublishedEvents');
                        }
                        setEventEditReturnContext(null);
                      }}
                      className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create Your Event</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Fill in the details below to launch your event.</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Event Poster/Banner</label>
                        <div className="w-full aspect-[21/9] bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden relative group">
                          {eventPosterUrl ? (
                            <img src={eventPosterUrl} alt="Event Poster" className="w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                              <Camera className="w-8 h-8 mb-2 text-indigo-300" />
                              <span className="text-sm font-bold">Unggah Poster Banner</span>
                            </div>
                          )}
                          <div className={`absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center gap-3 ${eventPosterUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} transition-opacity`}>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              id="poster-upload" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (!file.type.startsWith('image/')) {
                                    setToast({ message: 'Harap unggah file gambar (PNG/JPG)', show: true });
                                    setTimeout(() => setToast({ message: '', show: false }), 3000);
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onloadend = async () => {
                                    const base64Data = reader.result as string;
                                    setIsGlobalLoading(true);
                                    try {
                                      const res = await apiFetch('/api/upload/upload', {
                                        method: 'POST',
                                        body: JSON.stringify({ image: base64Data })
                                      });
                                      setEventPosterUrl(res.url);
                                      setToast({ message: 'Poster berhasil diunggah! 📸', show: true });
                                      setTimeout(() => setToast({ message: '', show: false }), 3000);
                                    } catch (err: any) {
                                      setToast({ message: err.message || 'Gagal mengunggah poster', show: true });
                                      setTimeout(() => setToast({ message: '', show: false }), 4000);
                                    } finally {
                                      setIsGlobalLoading(false);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <label htmlFor="poster-upload" className="bg-white text-indigo-600 cursor-pointer hover:bg-indigo-50 font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg transition-all">
                              Choose Image File
                            </label>
                            {eventPosterUrl && <button className="bg-red-500/90 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm hover:bg-red-600 transition-all" onClick={() => setEventPosterUrl(null)}>Remove Image</button>}
                          </div>
                        </div>
                      </div>

                      {/* 1. Event Info */}
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Basic Event Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Event Title <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <input type="text" maxLength={80} placeholder="e.g. Next-Gen Tech Meetup 2026" value={eventTitle} onChange={e => setEventTitle(e.target.value)} className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                              <button
                                type="button"
                                onClick={() => handleVoiceInputForField('title')}
                                className={`absolute right-3 top-3 p-1.5 rounded-full transition-all ${activeVoiceField === 'title' ? 'bg-red-500 text-white animate-pulse shadow-md' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-750'}`}
                              >
                                <Mic className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Max 80 characters.</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Event Date <span className="text-red-500">*</span></label>
                              <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Event Category <span className="text-red-500">*</span></label>
                              <select value={eventCategory} onChange={e => setEventCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none">
                                <option value="Music">Music</option>
                                <option value="Tech">Tech</option>
                                <option value="Food & Drink">Food & Drink</option>
                                <option value="Culture">Culture</option>
                                <option value="Sports">Sports</option>
                              </select>
                            </div>
                          </div>
                          {['Tech', 'Sports', 'Culture'].includes(eventCategory) && (
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 mt-2">
                              <div className="text-left">
                                <span className="text-sm font-bold text-slate-850 dark:text-slate-200">Sediakan E-Sertifikat untuk Peserta?</span>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Aktifkan sertifikat digital yang bisa diunduh peserta setelah hadir.</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setProvideCertificate(!provideCertificate)}
                                className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${provideCertificate ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-650'}`}
                              >
                                <span className="sr-only">Toggle E-Sertifikat</span>
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${provideCertificate ? 'left-7' : 'left-1'}`} />
                              </button>
                            </div>
                          )}
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Organizer Name</label>
                            <input type="text" defaultValue={profileName} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                          </div>
                        </div>
                      </div>

                      <hr className="border-slate-100 dark:border-slate-800" />

                      {/* 2. Location */}
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Event Location</h3>
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <button onClick={() => setEventType('offline')} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${eventType === 'offline' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-indigo-300'}`}>Physical Venue (Offline)</button>
                            <button onClick={() => setEventType('online')} className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${eventType === 'online' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-indigo-300'}`}>Online Event</button>
                          </div>

                          {eventType === 'offline' ? (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">City (for search filter) <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="e.g. Jakarta, ID" value={eventCity} onChange={e => setEventCity(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Detailed Address <span className="text-red-500">*</span></label>
                                <textarea rows={3} placeholder="Building Name, Floor, or Google Maps link" value={eventAddress} onChange={e => setEventAddress(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Online Link (Zoom/Meet/YouTube) <span className="text-red-500">*</span></label>
                              <input type="url" placeholder="https://" value={eventOnlineLink} onChange={e => setEventOnlineLink(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                          )}
                        </div>
                      </div>

                      <hr className="border-slate-100 dark:border-slate-800" />

                      {/* 3. Detail & Deskripsi */}
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Details & Description</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Short Description (Summary) <span className="text-red-500">*</span></label>
                            <input type="text" maxLength={140} placeholder="Write an engaging event summary (max 140 characters)..." value={eventDescShort} onChange={e => setEventDescShort(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Description <span className="text-red-500">*</span></label>
                            <div className="w-full border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                              <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-2 flex justify-between items-center">
                                <div className="flex gap-2">
                                  <button type="button" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded font-bold text-sm">B</button>
                                  <button type="button" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded italic text-sm">I</button>
                                  <button type="button" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded underline text-sm">U</button>
                                </div>
                              </div>
                              <textarea rows={6} placeholder="Describe terms & conditions, rundown, speaker profiles, etc..." value={eventDescFull} onChange={e => setEventDescFull(e.target.value)} className="w-full px-4 py-3 bg-transparent dark:text-white outline-none resize-none" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <hr className="border-slate-100 dark:border-slate-800" />

                      {/* 4. Ticket Configuration */}
                      <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Ticket Settings</h3>
                        
                        {/* External Event Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4">
                          <div className="text-left">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">Event Eksternal (Aggregator Mode)</span>
                            <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5">
                              Aktifkan jika pendaftaran tiket dilakukan melalui platform eksternal (seperti Loket.com, Eventbrite, Klook, dsb).
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEventIsExternal(!eventIsExternal)}
                            className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${eventIsExternal ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-650'}`}
                          >
                            <span className="sr-only">Toggle Event Eksternal</span>
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${eventIsExternal ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>

                        {eventIsExternal ? (
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Provider Eksternal <span className="text-red-500">*</span></label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. Loket.com, Eventbrite, Klook" 
                                  value={eventExternalProvider} 
                                  onChange={e => setEventExternalProvider(e.target.value)} 
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tautan Pendaftaran (URL) <span className="text-red-500">*</span></label>
                                <input 
                                  type="url" 
                                  placeholder="https://" 
                                  value={eventExternalUrl} 
                                  onChange={e => setEventExternalUrl(e.target.value)} 
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Jenis Tiket Tampilan <span className="text-red-500">*</span></label>
                                <select value={ticketType} onChange={(e) => setTicketType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none">
                                  <option value="paid">Paid</option>
                                  <option value="free">Free</option>
                                </select>
                              </div>
                              {ticketType !== 'free' && (
                                <div>
                                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Harga Tiket Tampilan (IDR)</label>
                                  <div className="relative">
                                    <span className="absolute left-4 top-3 text-slate-500 font-bold">Rp</span>
                                    <input type="number" placeholder="0" value={eventPrice} onChange={e => setEventPrice(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ticket Name <span className="text-red-500">*</span></label>
                                  <input type="text" placeholder="e.g. VIP, Presale 1, Early Bird" value={eventTicketName} onChange={e => setEventTicketName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ticket Type <span className="text-red-500">*</span></label>
                                  <select value={ticketType} onChange={(e) => setTicketType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none">
                                    <option value="paid">Paid</option>
                                    <option value="free">Free</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ticket Price (IDR)</label>
                                  <div className="relative">
                                    <span className="absolute left-4 top-3 text-slate-500 font-bold">Rp</span>
                                    <input type="number" disabled={ticketType === 'free'} placeholder="0" value={eventPrice} onChange={e => setEventPrice(e.target.value)} className={`w-full pl-12 pr-4 py-3 rounded-xl border ${ticketType === 'free' ? 'bg-slate-100 dark:bg-slate-900 border-transparent text-slate-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white'} focus:ring-2 focus:ring-indigo-500 outline-none`} />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Capacity (Quota/Stock) <span className="text-red-500">*</span></label>
                                  <input type="number" placeholder="e.g. 100" value={eventCapacity} onChange={e => setEventCapacity(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-end">
                        {!(editingEventId && events.find(e => e.id === editingEventId)?.status === 'active') && (
                          <button onClick={() => handleCreateEventSubmit('draft')} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all text-sm">Save Draft</button>
                        )}
                        <button onClick={() => handleCreateEventSubmit('active')} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all text-sm">
                          {editingEventId && events.find(e => e.id === editingEventId)?.status === 'active' ? 'Save Changes' : 'Publish Event'}
                        </button>
                      </div>

                      
                    </div>
                  </div>
                )}
              </motion.div>

            </div>
            )}
            {view === 'ticket-preview' && <motion.div key="ticket-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-slate-50 dark:bg-slate-950">{TicketPreviewView()}</motion.div>}
            {view === 'checkout-details' && <motion.div key="checkout-details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-slate-50 dark:bg-slate-950">{CheckoutDetailsView()}</motion.div>}
            {view === 'checkout' && <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-slate-50 dark:bg-slate-950">{CheckoutView()}</motion.div>}
          </AnimatePresence>

          {!isFullScreenView && (
            <footer id="footer" className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800 pt-16 pb-8 px-8 transition-colors shrink-0">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                  <div className="md:col-span-1 space-y-4">
                    <button onClick={() => setView('landing')} className="flex items-center text-3xl font-black text-indigo-500 tracking-tighter hover:opacity-90 transition-opacity">
                      <span>REventS</span>
                    </button>
                    <p className="text-sm text-slate-400 font-medium">
                      Discover, create, and manage events effortlessly with AI-powered matchmaking and seamless ticketing.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-bold text-white uppercase tracking-wider text-xs">Platform</h4>
                    <ul className="space-y-2 text-sm font-medium text-slate-400">
                      <li><button onClick={() => setView('landing')} className="hover:text-indigo-400 transition-colors">Explore Events</button></li>
                      <li><button onClick={() => { if(isAuthenticated){ setRole('organizer'); setView('create-event'); } else { setView('auth'); setAuthMode('login'); } }} className="hover:text-indigo-400 transition-colors">Create Event</button></li>
                      <li><button onClick={() => { if(isAuthenticated){ setRole('audience'); setView('dashboard'); setAudienceTab('myTickets'); } else { setView('auth'); setAuthMode('login'); } }} className="hover:text-indigo-400 transition-colors">My Tickets</button></li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-white uppercase tracking-wider text-xs">Resources</h4>
                    <ul className="space-y-2 text-sm font-medium text-slate-400">
                      <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
                      <li><a href="#" className="hover:text-indigo-400 transition-colors">Community Guidelines</a></li>
                      <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact Support</a></li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-white uppercase tracking-wider text-xs">Connect</h4>
                    <div className="flex gap-4">
                      <a href="https://www.instagram.com/rampung_space" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-600 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      </a>
                      <a href="https://www.linkedin.com/in/anissa-nursafitri-36a972279/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                      <a href="https://www.rampung.space" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <Globe className="w-5 h-5 block" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                  <span className="text-xs font-semibold text-slate-400">&copy;2026 Anissa Nursafitri | Rampung Space. All rights reserved.</span>
                  <div className="flex gap-6 text-xs font-semibold text-slate-400">
                    <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
                  </div>
                </div>
              </div>
            </footer>
        )}
        </div>

        {/* Global Loading Overlay */}
        <AnimatePresence>
          {isGlobalLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-500/30 rounded-full animate-spin border-t-indigo-500 mb-6 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center -mt-6">
                  <Bot className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <h2 className="text-white font-black tracking-widest text-xl uppercase drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">Memproses...</h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unique Success Toast Notification */}
        <AnimatePresence>
          {toast.show && (
            <motion.div 
              initial={{ opacity: 0, y: -40, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -20, scale: 0.95 }} 
              className="fixed top-8 left-1/2 z-[150] transform -translate-x-1/2"
            >
              <div className="bg-slate-900/70 backdrop-blur-xl border border-indigo-500/30 text-white px-6 py-4 rounded-3xl shadow-[0_0_30px_rgba(99,102,241,0.2)] flex items-center space-x-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
                <div className="relative bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5 rounded-full shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="font-bold text-sm tracking-tight relative z-10">{toast.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Duplicate Ticket Email Popup Alert */}
        <AnimatePresence>
          {showDuplicateEmailModal && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.95, y: 20 }} 
                className="bg-white text-slate-800 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 space-y-4"
              >
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-black text-slate-900">Duplicate Ticket Request</h3>
                  <p className="text-sm text-slate-500 leading-normal">
                    You have already purchased/registered a ticket for this event under this email address: <strong>{checkoutEmail}</strong>. 
                  </p>
                  <p className="text-xs text-slate-400">
                    To prevent double booking, only one active ticket per event is allowed per email address.
                  </p>
                </div>
                <button 
                  onClick={() => setShowDuplicateEmailModal(false)}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all text-sm"
                >
                  Understood
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Digital Scrapbook Memory Modal */}
        <AnimatePresence>
          {selectedScrapbookTicket && (() => {
            const { ticket, ev } = selectedScrapbookTicket;
            const getScrapbookQuote = (category: string, title: string) => {
              const cat = category.toLowerCase();
              if (cat.includes('music')) {
                return `Dancing under the stage lights, singing every word, and feeling the bass in our chest. ${title} was an absolute dream. 🎸✨`;
              } else if (cat.includes('food')) {
                return `Tasting every flavor, laughing with friends, and satisfying our inner foodie. ${title} was a delicious journey! 🍔🍕`;
              } else if (cat.includes('culture') || cat.includes('art')) {
                return `Immersed in beauty, expression, and story. ${title} connected us to the heart of art and heritage. 🏛️🎨`;
              } else {
                return `Good vibes, great company, and memories that will last a lifetime. Thank you, ${title}! 🌟`;
              }
            };

            const getCategoryBadge = (category: string) => {
              const cat = category.toLowerCase();
              if (cat.includes('music')) return { label: 'Music Fanatic 🎵', bg: 'from-pink-500 to-rose-500 text-white' };
              if (cat.includes('food')) return { label: 'Foodie Gold 🍔', bg: 'from-amber-400 to-orange-500 text-amber-950 font-black' };
              if (cat.includes('culture') || cat.includes('art')) return { label: 'VIP Culture 🏛️', bg: 'from-indigo-500 to-purple-600 text-white' };
              return { label: 'Special Guest ✨', bg: 'from-teal-400 to-emerald-500 text-white' };
            };

            const badge = getCategoryBadge(ev.category || '');
            const quote = getScrapbookQuote(ev.category || '', ev.title);

            return (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 bg-slate-950/80 z-[150] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto no-scrollbar"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 30 }} 
                  animate={{ scale: 1, y: 0 }} 
                  exit={{ scale: 0.9, y: 30 }} 
                  className="bg-slate-900/90 dark:bg-slate-950/95 border border-purple-500/20 text-white w-full max-w-md rounded-[2.5rem] shadow-[0_0_50px_rgba(168,85,247,0.25)] overflow-hidden flex flex-col relative my-auto"
                >
                  {/* Close button */}
                  <button 
                    onClick={() => {
                      setSelectedScrapbookTicket(null);
                      setShowInstagramSharePreview(false);
                    }} 
                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all z-10 hover:scale-105 active:scale-95"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Decorative glowing backdrops */}
                  <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none"></div>
                  <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none"></div>

                  <div className="p-6 pb-2 relative z-10">
                    <h3 className="text-2xl font-black text-center bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mt-4 tracking-tight">
                      Koleksi Kenangan Anda
                    </h3>
                    <p className="text-center text-[10px] text-purple-400 font-extrabold uppercase tracking-widest mb-6">
                      ✨ REventS Memory Lane ✨
                    </p>

                    {/* Polaroid Frame */}
                    <div className="relative mx-auto max-w-[280px] mb-6">
                      {/* Polaroid Tape Effect */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-white/20 dark:bg-slate-800/40 backdrop-blur-[2px] shadow-sm transform -rotate-1 border border-white/10 pointer-events-none z-10"></div>
                      
                      <div className="bg-white text-slate-800 p-4 pb-6 shadow-2xl rounded-sm transform rotate-[-1.5deg] border border-slate-100/50 flex flex-col relative overflow-visible">
                        {/* Memory circular badge stamp */}
                        <div className={`absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-tr ${badge.bg} text-[8px] font-black flex items-center justify-center text-center uppercase tracking-wider transform rotate-12 shadow-lg border border-white dark:border-slate-800 z-10 p-1`}>
                          {badge.label}
                        </div>

                        {/* Image */}
                        <div className="w-full h-48 overflow-hidden bg-slate-100 rounded-sm border border-slate-200/50 mb-4">
                          <img src={ev.image} className="w-full h-full object-cover" alt={ev.title} />
                        </div>

                        {/* Handwritten Details */}
                        <div className="text-center font-['Caveat',_cursive] text-slate-800 space-y-1">
                          <h4 className="text-2xl font-bold leading-tight select-all">{ev.title}</h4>
                          <p className="text-lg text-slate-500 font-medium tracking-tight">
                            {ev.date || 'Past Event'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Personalized Quote card */}
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl max-w-sm mx-auto text-center mb-6">
                      <p className="text-xs text-slate-300 italic leading-relaxed font-medium">
                        "{quote}"
                      </p>
                    </div>
                  </div>

                  {/* Social Share Drawer */}
                  <div className="border-t border-white/10 pt-5 px-6 pb-6 bg-slate-950/40 rounded-b-[2.5rem] mt-auto relative z-10">
                    <h4 className="text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">
                      Bagikan Ke Media Sosial
                    </h4>
                    
                    <div className="grid grid-cols-4 gap-3">
                      {/* Instagram */}
                      <button 
                        onClick={() => setShowInstagramSharePreview(true)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/50 border border-white/5 transition-all text-white group cursor-pointer"
                      >
                        <div className="p-2.5 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                          <Instagram className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] font-bold">Instagram</span>
                      </button>

                      {/* Twitter/X */}
                      <a 
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Look at my Memory Scrapbook from ${ev.title}! Saved forever on @REventS. ✨\n\n`)}&url=${encodeURIComponent(`https://revents.io/memory/${ticket.qrCode}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/50 border border-white/5 transition-all text-white group cursor-pointer text-center"
                      >
                        <div className="p-2.5 bg-slate-800 text-white rounded-xl group-hover:scale-110 transition-transform flex items-center justify-center">
                          <Twitter className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold">Twitter</span>
                      </a>

                      {/* Facebook */}
                      <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://revents.io/memory/${ticket.qrCode}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/50 border border-white/5 transition-all text-white group cursor-pointer text-center"
                      >
                        <div className="p-2.5 bg-indigo-600 text-white rounded-xl group-hover:scale-110 transition-transform flex items-center justify-center">
                          <Facebook className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold">Facebook</span>
                      </a>

                      {/* Copy Link */}
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`https://revents.io/memory/${ticket.qrCode}`);
                          setToast({ message: "Link memory disalin ke clipboard! 📋", show: true });
                          setTimeout(() => setToast({ message: '', show: false }), 3000);
                        }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/50 border border-white/5 transition-all text-white group cursor-pointer"
                      >
                        <div className="p-2.5 bg-emerald-600 text-white rounded-xl group-hover:scale-110 transition-transform flex items-center justify-center">
                          <Link2 className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold">Salin Link</span>
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Simulated Instagram Stories Sharing Preview Overlay */}
                <AnimatePresence>
                  {showInstagramSharePreview && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 bg-slate-950/95 z-[160] flex flex-col items-center justify-center p-4"
                    >
                      {/* Instagram Device Frame */}
                      <div className="w-[310px] h-[550px] bg-gradient-to-tr from-purple-800 via-pink-700 to-orange-600 rounded-[3rem] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between p-6">
                        {/* Notch / Dynamic Island */}
                        <div className="w-24 h-4 bg-slate-800 rounded-full absolute top-2 left-1/2 -translate-x-1/2"></div>
                        
                        {/* Story Progress Bar */}
                        <div className="flex gap-1 w-full px-2 mt-4 absolute top-4 left-0">
                          <div className="h-1 bg-white/80 rounded-full flex-1"></div>
                          <div className="h-1 bg-white/30 rounded-full flex-1"></div>
                        </div>

                        {/* Story Header (Profile Mockup) */}
                        <div className="flex items-center gap-2 mt-4 self-start w-full px-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-pink-500 overflow-hidden">
                            <img src={currentUser?.profilePicUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] font-bold text-white tracking-wide shadow-sm">
                            {currentUser?.fullName?.toLowerCase().replace(/\s+/g, '_') || 'my_revents_memory'}
                          </span>
                          <span className="text-[9px] text-white/60">3h</span>
                        </div>

                        {/* Centered Polaroid Content */}
                        <div className="my-auto flex flex-col items-center">
                          <div className="bg-white text-slate-800 p-4 pb-6 shadow-2xl rounded-sm transform rotate-[1deg] border border-slate-100/50 flex flex-col relative w-[220px]">
                            {/* Stamp sticker inside instagram story */}
                            <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-tr ${badge.bg} text-[6px] font-black flex items-center justify-center text-center uppercase tracking-wider transform rotate-12 shadow-lg border border-white z-10 p-0.5`}>
                              {badge.label}
                            </div>
                            <div className="w-full h-36 overflow-hidden bg-slate-100 rounded-sm border border-slate-200/50 mb-3">
                              <img src={ev.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-center font-['Caveat',_cursive] text-slate-800 space-y-0.5">
                              <h4 className="text-lg font-bold leading-tight">{ev.title}</h4>
                              <p className="text-sm text-slate-500 font-medium">{ev.date}</p>
                            </div>
                          </div>
                          
                          {/* Simulated Sticker Badge */}
                          <div className="mt-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white text-[10px] font-bold tracking-wide shadow-md flex items-center gap-1.5 transform -rotate-2">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Tap to view on REventS
                          </div>
                        </div>

                        {/* Story Footer Input */}
                        <div className="w-full flex items-center gap-3 px-2 mb-2">
                          <div className="flex-1 bg-transparent border border-white/40 rounded-full px-4 py-2 text-[10px] text-white/70">
                            Send message...
                          </div>
                          <Send className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Instagram Share Modal Actions */}
                      <div className="flex gap-4 mt-6">
                        <button 
                          onClick={() => {
                            setToast({ message: "Foto memory berhasil diunduh ke galeri! 💾", show: true });
                            setTimeout(() => setToast({ message: '', show: false }), 3000);
                          }}
                          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          Unduh Story 📸
                        </button>
                        <button 
                          onClick={() => setShowInstagramSharePreview(false)}
                          className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-black hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                        >
                          Kembali
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* External Event Redirecting Modal */}
        <AnimatePresence>
          {redirectingEvent && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-slate-950/80 z-[150] flex items-center justify-center p-4 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.9, y: 20 }} 
                className="bg-slate-900/90 dark:bg-slate-950/95 border border-indigo-500/20 text-white w-full max-w-md rounded-[2.5rem] shadow-[0_0_50px_rgba(99,102,241,0.25)] overflow-hidden flex flex-col p-8 relative"
              >
                {/* Close/Cancel top-right button */}
                <button 
                  onClick={handleCancelRedirect} 
                  className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all hover:scale-105 active:scale-95 z-20"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Decorative glowing backdrops */}
                <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none"></div>

                <div className="flex flex-col items-center text-center space-y-6 relative z-10 py-4">
                  {/* Glowing Spinner Icon Container */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* Ring background */}
                    <div className="absolute inset-0 rounded-full border-4 border-slate-700/50"></div>
                    {/* Rotating gradient ring */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-indigo-400"
                    ></motion.div>
                    
                    {/* Globe icon in the center */}
                    <div className="bg-slate-800 text-indigo-400 rounded-full p-4 shadow-inner">
                      <Globe className="w-8 h-8 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                      Mengarahkan Anda ke Platform Asli
                    </h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      Anda sedang dialihkan ke platform <strong>{redirectingEvent.externalProvider || 'Penyedia Eksternal'}</strong> untuk menyelesaikan pendaftaran secara resmi.
                    </p>
                  </div>

                  {/* Visual Connection Card */}
                  <div className="w-full bg-slate-850/60 border border-slate-700/40 p-4 rounded-2xl flex items-center justify-between text-left gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                        <img src={redirectingEvent.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{redirectingEvent.title}</h4>
                        <span className="text-[10px] text-slate-400">{redirectingEvent.location.split(',')[0]}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded-md border border-indigo-500/20">
                        {redirectingEvent.externalProvider || 'Partner'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full space-y-2">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                        animate={{ width: `${redirectProgress}%` }}
                        transition={{ ease: "easeInOut" }}
                      ></motion.div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                      <span>REventS Discovery</span>
                      <span>{redirectProgress}%</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCancelRedirect}
                    className="px-6 py-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Batal & Tetap di REventS
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkout Modal Flow */}
        <AnimatePresence mode="wait">
          {checkoutModal && (
            <motion.div 
              key="checkout-modal-overlay"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md overflow-y-auto no-scrollbar p-4 md:p-8 flex justify-center items-start"
            >
               {/* Floating Close Button */}
               <button 
                 onClick={() => setCheckoutModal(null)} 
                 className="fixed top-6 right-6 z-[60] bg-slate-950/80 hover:bg-slate-900/90 text-white hover:text-indigo-400 p-3 rounded-full backdrop-blur-md transition-all border border-slate-800 flex items-center justify-center shadow-2xl hover:scale-105"
                 title="Close Checkout"
               >
                 <X className="w-5 h-5" />
               </button>

               <motion.div 
                 initial={{ scale: 0.95, y: 20 }} 
                 animate={{ scale: 1, y: 0 }} 
                 exit={{ scale: 0.95, y: 20 }} 
                 className="bg-transparent max-w-6xl w-full relative my-auto outline-none border-none"
               >
                 {checkoutModal === 'preview' && TicketPreviewView()}
                 {checkoutModal === 'details' && CheckoutDetailsView()}
                 {checkoutModal === 'checkout' && CheckoutView()}
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating AI Matchmaker & Chatbot */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-24 right-4 left-4 sm:right-8 sm:left-auto z-[100] sm:w-[350px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
              style={{ maxHeight: 'calc(100vh - 8rem)' }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">REvas'st</h3>
                    <p className="text-[10px] text-indigo-100">Online | Ready to chat</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px] bg-slate-50 dark:bg-slate-800">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-600 rounded-tl-sm'
                    }`}>
                      <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\r\n/g, '<br/>') }} />
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={chatMessagesEndRef} />
              </div>

              <form onSubmit={handleSendChat} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Search events (e.g., Music Concert)" 
                  className="flex-1 bg-slate-100 dark:bg-slate-800 dark:text-white px-4 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                  type="submit" 
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-[90] flex items-center shadow-2xl justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2.5 lg:pr-6 lg:pl-2 lg:py-2 rounded-full text-sm font-bold"
        >
          <div className="bg-white/20 p-2 rounded-full relative">
            <Bot className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute top-0 right-0 text-yellow-300" />
          </div>
          <span className="hidden lg:inline ml-2">{isChatOpen ? 'Close Chat' : t.aiMatchmaker}</span>
        </motion.button>

        {/* Floating Bottom Navigation Bar for Mobile */}
        {isAuthenticated && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800/80 px-2 py-2 pb-safe shadow-lg flex justify-around items-center">
            {role === 'organizer' ? (
              <>
                {/* Left tab 1: Dashboard */}
                <button
                  onClick={() => {
                    setView('dashboard');
                    switchOrganizerTab('dashboard');
                  }}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                    view === 'dashboard' && organizerTab === 'dashboard'
                      ? 'text-indigo-600 dark:text-indigo-400 font-black'
                      : 'text-slate-400 dark:text-slate-500 font-bold'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="text-[10px] tracking-tight">Dashboard</span>
                </button>

                {/* Left tab 2: Events */}
                <button
                  onClick={() => {
                    setView('dashboard');
                    switchOrganizerTab('myPublishedEvents');
                  }}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                    view === 'dashboard' && organizerTab === 'myPublishedEvents'
                      ? 'text-indigo-600 dark:text-indigo-400 font-black'
                      : 'text-slate-400 dark:text-slate-500 font-bold'
                  }`}
                >
                  <CalendarDays className="w-5 h-5" />
                  <span className="text-[10px] tracking-tight">Events</span>
                </button>

                {/* Center Menonjol: Create Event */}
                <button
                  onClick={() => {
                    setEventEditReturnContext({
                      organizerTab: 'myPublishedEvents',
                      publishedEventsTab: 'published',
                      managingEvent: null
                    });
                    setShowCreateForm(true);
                    setView('create-event');
                  }}
                  className="bg-indigo-600 dark:bg-indigo-500 text-white w-14 h-14 -mt-7 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/35 border-4 border-white dark:border-slate-900 transition-all hover:scale-105 active:scale-95 shrink-0"
                  title="Create Event"
                >
                  <Plus className="w-7 h-7 stroke-[3]" />
                </button>

                {/* Right tab 1: Rev Co-pilot */}
                <button
                  onClick={() => {
                    setView('dashboard');
                    switchOrganizerTab('aiEventCoPilot');
                  }}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                    view === 'dashboard' && organizerTab === 'aiEventCoPilot'
                      ? 'text-indigo-600 dark:text-indigo-400 font-black'
                      : 'text-slate-400 dark:text-slate-500 font-bold'
                  }`}
                >
                  <BrainCircuit className="w-5 h-5" />
                  <span className="text-[10px] tracking-tight">Co-pilot</span>
                </button>

                {/* Right tab 2: Menu / Account */}
                <button
                  onClick={() => {
                    setView('dashboard');
                    switchOrganizerTab('settings');
                  }}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                    view === 'dashboard' && organizerTab === 'settings'
                      ? 'text-indigo-600 dark:text-indigo-400 font-black'
                      : 'text-slate-400 dark:text-slate-500 font-bold'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="text-[10px] tracking-tight">Menu</span>
                </button>
              </>
            ) : (
              <>
                {/* Left tab 1: REva'st */}
                <button
                  onClick={() => {
                    setView('dashboard');
                    setAudienceTab('revasst');
                  }}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                    view === 'dashboard' && audienceTab === 'revasst'
                      ? 'text-indigo-600 dark:text-indigo-400 font-black'
                      : 'text-slate-400 dark:text-slate-500 font-bold'
                  }`}
                >
                  <Bot className="w-5 h-5" />
                  <span className="text-[10px] tracking-tight">REva'st</span>
                </button>

                {/* Left tab 2: Tickets */}
                <button
                  onClick={() => {
                    setView('dashboard');
                    setAudienceTab('myTickets');
                  }}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                    view === 'dashboard' && audienceTab === 'myTickets'
                      ? 'text-indigo-600 dark:text-indigo-400 font-black'
                      : 'text-slate-400 dark:text-slate-500 font-bold'
                  }`}
                >
                  <Ticket className="w-5 h-5" />
                  <span className="text-[10px] tracking-tight">Tickets</span>
                </button>

                {/* Center Menonjol: Explore */}
                <button
                  onClick={() => {
                    setView('landing');
                    clearCopilotState();
                  }}
                  className="bg-indigo-600 dark:bg-indigo-500 text-white w-14 h-14 -mt-7 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/35 border-4 border-white dark:border-slate-900 transition-all hover:scale-105 active:scale-95 shrink-0"
                  title="Explore Events"
                >
                  <Globe className="w-7 h-7" />
                </button>

                {/* Right tab 1: Saved */}
                <button
                  onClick={() => {
                    setView('dashboard');
                    setAudienceTab('savedEvents');
                  }}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                    view === 'dashboard' && audienceTab === 'savedEvents'
                      ? 'text-indigo-600 dark:text-indigo-400 font-black'
                      : 'text-slate-400 dark:text-slate-500 font-bold'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                  <span className="text-[10px] tracking-tight">Saved</span>
                </button>

                {/* Right tab 2: Account */}
                <button
                  onClick={() => {
                    setView('dashboard');
                    setAudienceTab('accountPayment');
                  }}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                    view === 'dashboard' && audienceTab === 'accountPayment'
                      ? 'text-indigo-600 dark:text-indigo-400 font-black'
                      : 'text-slate-400 dark:text-slate-500 font-bold'
                  }`}
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="text-[10px] tracking-tight">Account</span>
                </button>
              </>
            )}
          </div>
        )}

        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      </div>
    </div>
  );
}
