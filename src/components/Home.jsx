import React, { useState, useEffect, useMemo } from 'react';
import { FaWallet, FaCar, FaMapMarkerAlt, FaShieldAlt, FaChevronLeft, FaChevronRight, FaCheckCircle, FaTiktok, FaSnapchat, FaDownload } from 'react-icons/fa';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { FiFacebook } from 'react-icons/fi';
import { PiTelegramLogoLight, PiGithubLogo } from 'react-icons/pi';
import { BiLogoInstagram } from 'react-icons/bi';
import ReactCountryFlag from 'react-country-flag';
import WhatsAppButton from './WhatsAppButton';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { fetchSections } from '../services/api';
// Import images - adjust paths based on your assets folder location
// import googlePlay from '../assets/googleplay.png';
// import appstore from '../assets/appstore.jpg';
// import huawei from '../assets/huawel.webp';

const Home = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.ar;
  const isRTL = language === 'ar' || language === 'ur';
  
  // API Data State
  const [sectionsData, setSectionsData] = useState(null);
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchSections();
        if (response.success && response.data) {
          setSectionsData(response.data.sections || []);
          setReviewsData(response.data.reviews || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Helper function to get section by prefix_name
  const getSectionByPrefix = (prefix) => {
    if (!sectionsData) return null;
    return sectionsData.find(section => section.prefix_name === prefix);
  };
  
  // Helper function to get translated text from API
  const getTranslatedText = (textObj) => {
    if (!textObj) return '';
    
    // Check if the requested language exists
    if (textObj[language]) {
      return textObj[language];
    }
    
    // Fallback chain: Arabic -> English -> empty
    return textObj.ar || textObj.en || '';
  };
  
  // Responsive state - use both width and height for better rotation handling
  const getResponsiveState = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const isLandscape = width > height; // More reliable check for landscape
    
    // Check if mobile based on width (considering rotation)
    const mobile = width <= 600;
    // Check if tablet
    const tablet = width > 600 && width <= 1366;
    
    // iPad Pro detection - improved for rotation
    const iPadPro = (width >= 768 && width <= 1366 && height >= 1024) || 
                    (height >= 768 && height <= 1366 && width >= 1024);
    
    // Large iPhone detection - improved for rotation
    const largeiPhone = (width >= 375 && width <= 600 && height >= 700) ||
                        (height >= 375 && height <= 600 && width >= 700);
    
    // iPhone SE detection - small screen iPhone
    const iPhoneSE = (width <= 375 && height <= 700) || (height <= 375 && width <= 700);
    
    return { mobile, tablet, iPadPro, largeiPhone, iPhoneSE, isPortrait, isLandscape };
  };
  
  const initialState = getResponsiveState();
  const [isMobile, setIsMobile] = useState(initialState.mobile);
  const [isTablet, setIsTablet] = useState(initialState.tablet);
  const [isIPadPro, setIsIPadPro] = useState(initialState.iPadPro);
  const [isLargeiPhone, setIsLargeiPhone] = useState(initialState.largeiPhone);
  const [isiPhoneSE, setIsiPhoneSE] = useState(initialState.iPhoneSE);
  const [isPortrait, setIsPortrait] = useState(initialState.isPortrait);
  const [isLandscape, setIsLandscape] = useState(initialState.isLandscape);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  
  useEffect(() => {
    let timeoutId = null;
    let checkInterval = null;
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    let lastOrientation = window.orientation !== undefined ? window.orientation : null;
    let lastScreenAngle = window.screen?.orientation?.angle !== undefined ? window.screen.orientation.angle : null;
    
    const updateResponsiveState = () => {
      const state = getResponsiveState();
      setIsMobile(state.mobile);
      setIsTablet(state.tablet);
      setIsIPadPro(state.iPadPro);
      setIsLargeiPhone(state.largeiPhone);
      setIsiPhoneSE(state.iPhoneSE);
      setIsPortrait(state.isPortrait);
      setIsLandscape(state.isLandscape);
      setWindowHeight(window.innerHeight);
      lastWidth = window.innerWidth;
      lastHeight = window.innerHeight;
      if (window.orientation !== undefined) {
        lastOrientation = window.orientation;
      }
      if (window.screen?.orientation?.angle !== undefined) {
        lastScreenAngle = window.screen.orientation.angle;
      }
    };
    
    // Smart rotation detection function
    const checkRotation = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      const currentOrientation = window.orientation !== undefined ? window.orientation : null;
      const currentScreenAngle = window.screen?.orientation?.angle !== undefined ? window.screen.orientation.angle : null;
      
      // Check if dimensions changed significantly (rotation indicator)
      const widthChanged = Math.abs(currentWidth - lastWidth) > 50;
      const heightChanged = Math.abs(currentHeight - lastHeight) > 50;
      
      // Check if orientation angle changed
      const orientationChanged = currentOrientation !== null && currentOrientation !== lastOrientation;
      const screenAngleChanged = currentScreenAngle !== null && currentScreenAngle !== lastScreenAngle;
      
      // Check if portrait/landscape changed
      const wasPortrait = lastHeight > lastWidth;
      const isNowPortrait = currentHeight > currentWidth;
      const portraitChanged = wasPortrait !== isNowPortrait;
      
      // If any rotation indicator detected, update state
      if (widthChanged || heightChanged || orientationChanged || screenAngleChanged || portraitChanged) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateResponsiveState();
        }, 50);
      }
    };
    
    // Handle resize events
    const handleResize = () => {
      checkRotation();
    };
    
    // Handle orientation change event
    const handleOrientationChange = () => {
      clearTimeout(timeoutId);
      // Update immediately
      updateResponsiveState();
      // Update again after delay to ensure dimensions are correct
      timeoutId = setTimeout(() => {
        updateResponsiveState();
      }, 200);
    };
    
    // MatchMedia API for orientation detection (smart solution)
    let portraitMediaQuery = null;
    let landscapeMediaQuery = null;
    let handleMediaChange = null;
    
    if (window.matchMedia) {
      portraitMediaQuery = window.matchMedia('(orientation: portrait)');
      landscapeMediaQuery = window.matchMedia('(orientation: landscape)');
      
      handleMediaChange = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          updateResponsiveState();
        }, 50);
      };
      
      // Modern browsers support addEventListener
      if (portraitMediaQuery.addEventListener) {
        portraitMediaQuery.addEventListener('change', handleMediaChange);
        landscapeMediaQuery.addEventListener('change', handleMediaChange);
      } else {
        // Fallback for older browsers
        portraitMediaQuery.addListener(handleMediaChange);
        landscapeMediaQuery.addListener(handleMediaChange);
      }
    }
    
    // Initial call
    updateResponsiveState();
    
    // Add event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
    
    // For better iOS support, use visualViewport API if available
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize, { passive: true });
    }
    
    // Also listen to screen orientation API if available
    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange, { passive: true });
    }
    
    // Smart polling check - checks every 200ms for rotation changes (fallback)
    checkInterval = setInterval(() => {
      checkRotation();
    }, 200);
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      clearInterval(checkInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      }
      if (portraitMediaQuery && handleMediaChange) {
        if (portraitMediaQuery.removeEventListener) {
          portraitMediaQuery.removeEventListener('change', handleMediaChange);
          landscapeMediaQuery.removeEventListener('change', handleMediaChange);
        } else {
          portraitMediaQuery.removeListener(handleMediaChange);
          landscapeMediaQuery.removeListener(handleMediaChange);
        }
      }
    };
  }, []);
  
  // Adjust carousel slide for mobile (skip first image)
  useEffect(() => {
    if (isMobile && currentSlide === 0) {
      setCurrentSlide(1);
    } else if (!isMobile && currentSlide >= 1) {
      // Reset to 0 when switching from mobile to desktop
      setCurrentSlide(0);
    }
  }, [isMobile]);
  
  // Calculate dynamic paddingBottom based on content and orientation
  const backgroundPaddingBottom = useMemo(() => {
    // Use calc() for better browser compatibility with vh units
    // Calculate based on actual content positions - match content exactly
    
    if (isMobile) {
      // Bottom image: calc(50vh + 1350px) + 600px (image height) = 50vh + 1950px
      // Reduced slightly for mobile only
      if (isPortrait) {
        return 'calc(50vh + 1550px)'; // Reduced by 100px for mobile portrait
      } else {
        // Landscape: less vertical space needed
        return 'calc(50vh + 1650px)'; // Reduced by 100px for mobile landscape
      }
    }
    
    if (isTablet) {
      // Bottom image: calc(50vh + 1200px + 500px) + 200px
      if (isPortrait) {
        return 'calc(50vh + 1800px)'; // Reduced for tablet portrait
      } else {
        return 'calc(50vh + 1750px)'; // Reduced for tablet landscape
      }
    }
    
    if (isIPadPro) {
      if (isPortrait) {
        return 'calc(50vh + 1750px)'; // Reduced for iPad Pro portrait
      } else {
        return 'calc(50vh + 1700px)'; // Reduced for iPad Pro landscape
      }
    }
    
    // Desktop - reduced
    return 'calc(50vh + 1800px)';
  }, [isMobile, isTablet, isIPadPro, isPortrait]);
  
  // Calculate dynamic minHeight based on content and orientation
  const backgroundMinHeight = useMemo(() => {
    // Match paddingBottom to ensure proper coverage
    if (isLargeiPhone) {
      return isPortrait ? 'calc(50vh + 1550px)' : 'calc(50vh + 1650px)';
    }
    if (isMobile) {
      return isPortrait ? 'calc(50vh + 1550px)' : 'calc(50vh + 1650px)';
    }
    if (isIPadPro) {
      return isPortrait ? 'calc(50vh + 1750px)' : 'calc(50vh + 1700px)';
    }
    if (isTablet) {
      return isPortrait ? 'calc(50vh + 1800px)' : 'calc(50vh + 1750px)';
    }
    return 'calc(50vh + 1800px)';
  }, [isMobile, isTablet, isIPadPro, isPortrait, isLargeiPhone]);
  
  // Calculate phone size and gap for carousel based on orientation
  const carouselPhoneSize = useMemo(() => {
    if (isMobile) {
      if (isPortrait) {
        return { width: '120px', gap: '20px' };
      } else {
        return { width: '100px', gap: '15px' };
      }
    }
    if (isTablet) {
      if (isPortrait) {
        return { width: '160px', gap: '30px' };
      } else {
        return { width: '140px', gap: '25px' };
      }
    }
    return { width: '180px', gap: '30px' };
  }, [isMobile, isTablet, isPortrait]);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Get sections from API (must be before phoneMockups)
  const firstSection = getSectionByPrefix('first-section');
  // Single hero image from first-section
const heroImage = firstSection?.images?.[0];

  const secondSection = getSectionByPrefix('second-section');
  // Single image for second-section
const secondSectionImage = secondSection?.images?.[0];

  const thirdSection = getSectionByPrefix('third-section');
  // Single image for second-section

  const fourthSection = getSectionByPrefix('fourth-section');
  const navSection = getSectionByPrefix('nav-section');
  const logoImage = navSection?.images?.[0];
  console.log('navSection:', navSection);
console.log('logoImage:', logoImage);

  // Phone mockups for carousel from API or fallback
  const phoneMockups = useMemo(() => {
    if (thirdSection && thirdSection.images && thirdSection.images.length > 0) {
      return thirdSection.images.map(imageUrl => ({ image: imageUrl }));
    }
    // Fallback to default images
    return [
      { image: "/1.jpeg" },
      { image: "/9.jpeg" },
      { image: "/8.jpeg" },
      { image: "/2.jpeg" },
      { image: "/3.jpeg" },
      { image: "/4.jpeg" },
      { image: "/5.jpeg" },
      { image: "/6.jpeg" },
      { image: "/7.jpeg" },
    ];
  }, [thirdSection]);
    
  // Calculate max slide based on visible phones (responsive)
  const phonesPerView = isMobile ? 1 : isTablet ? 2 : 3;
  const maxSlide = Math.max(0, phoneMockups.length - phonesPerView);
  
  // Handle carousel navigation - infinite loop
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => {
      const calculatedMax = Math.max(0, phoneMockups.length - phonesPerView);
      if (prev <= 0) return calculatedMax; // Go to end if at start
      return Math.max(0, prev - 2); // Move 2 steps at a time
    });
  };
  
  const handleNextSlide = () => {
    setCurrentSlide((prev) => {
      // Calculate max slide to keep phones visible within image bounds
      const calculatedMax = Math.max(0, phoneMockups.length - phonesPerView);
      if (prev >= calculatedMax) return 0; // Go to start if at end
      return Math.min(calculatedMax, prev + 2); // Move 2 steps at a time
    });
  };
  
  // Hero section data from API
  const heroData = useMemo(() => {
    if (firstSection) {
      return {
        title: getTranslatedText(firstSection.title),
        subtitle: getTranslatedText(firstSection.description)?.split('\n')[0] || '',
        description: getTranslatedText(firstSection.description),
        googleLink: firstSection.content?.google_link || 'https://play.google.com/store',
        appleLink: firstSection.content?.apple_link || 'https://apps.apple.com/',
        hawaiiLink: firstSection.content?.hawaii_link || ''
      };
    }
    return {
      title: '',
      subtitle: '',
      description: '',
      googleLink: 'https://play.google.com/store',
      appleLink: 'https://apps.apple.com/',
      hawaiiLink: ''
    };
  }, [firstSection, language]);
  
  // Footer data from API
  const footerData = useMemo(() => {
    if (fourthSection) {
      return {
        description: getTranslatedText(fourthSection.title),
        facebookLink: fourthSection.content?.facebook_link || 'https://www.facebook.com/share/1byo91GvPN/',
        instagramLink: fourthSection.content?.instagram_link || 'https://www.instagram.com/kashfalrukaab?utm_source=qr&igsh=MW9nOTNzYmtkbnRudQ==',
        snapchatLink: fourthSection.content?.snapchat_link || 'https://www.snapchat.com/add/kashfalrukaab?share_id=LSm2j3461g8&locale=ar-EG',
        tiktokLink: fourthSection.content?.tiktok_link || 'https://www.tiktok.com/@.kashfalrukaab?_r=1&_t=ZS-9238ZERO2CX',
        whatsappLink: fourthSection.content?.whatsapp_link || ''
      };
    }
    return {
      description: '',
      facebookLink: 'https://www.facebook.com/share/1byo91GvPN/',
      instagramLink: 'https://www.instagram.com/kashfalrukaab?utm_source=qr&igsh=MW9nOTNzYmtkbnRudQ==',
      snapchatLink: 'https://www.snapchat.com/add/kashfalrukaab?share_id=LSm2j3461g8&locale=ar-EG',
      tiktokLink: 'https://www.tiktok.com/@.kashfalrukaab?_r=1&_t=ZS-9238ZERO2CX',
      whatsappLink: ''
    };
  }, [fourthSection, language]);
  
  // Features data from API
  const features = useMemo(() => {
    if (secondSection && secondSection.content) {
      const content = secondSection.content;
      return [
        {
          title: getTranslatedText(content['payment-info']?.title),
          description: getTranslatedText(content['payment-info']?.description),
          icon: FaWallet,
          side: 'left',
          position: 'top'
        },
        {
          title: getTranslatedText(content['car-info']?.title),
          description: getTranslatedText(content['car-info']?.description),
          icon: FaCar,
          side: 'left',
          position: 'bottom'
        },
        {
          title: getTranslatedText(content['map-info']?.title),
          description: getTranslatedText(content['map-info']?.description),
          icon: FaMapMarkerAlt,
          side: 'right',
          position: 'top'
        },
        {
          title: getTranslatedText(content['security-info']?.title),
          description: getTranslatedText(content['security-info']?.description),
          icon: FaShieldAlt,
          side: 'right',
          position: 'bottom'
        }
      ];
    }
    // Return empty features if no data from API
    return [
      {
        title: '',
        description: '',
        icon: FaWallet,
        side: 'left',
        position: 'top'
      },
      {
        title: '',
        description: '',
        icon: FaCar,
        side: 'left',
        position: 'bottom'
      },
      {
        title: '',
        description: '',
        icon: FaMapMarkerAlt,
        side: 'right',
        position: 'top'
      },
      {
        title: '',
        description: '',
        icon: FaShieldAlt,
        side: 'right',
        position: 'bottom'
      }
    ];
  }, [secondSection, language]);

  // Reviews data from API
  const reviews = useMemo(() => {
    if (reviewsData && reviewsData.length > 0) {
      return reviewsData.map(review => ({
        name: review.customer_name || '',
        text: review.customer_comment || '',
        countryCode: review.country_code || '',
        rating: review.customer_rate || 5
      }));
    }
    // Return empty array if no data from API
    return [];
  }, [reviewsData]);

  // Star rating component - displays stars based on rating value
  const StarRating = ({ isMobile, rating = 5 }) => {
    const ratingValue = Math.min(Math.max(parseInt(rating) || 5, 0), 5); // Ensure rating is between 0 and 5
    return (
      <div style={{ display: 'flex', gap: isMobile ? '1px' : '2px', alignItems: 'center' }}>
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            style={{ 
              color: i < ratingValue ? '#FFD700' : '#E0E0E0', 
              fontSize: isMobile ? '10px' : '12px' 
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Review card component
  const ReviewCard = ({ name, text, countryCode, rating, isMobile, isTablet, isPortrait }) => {
    // Calculate card width based on orientation
    const cardWidth = isMobile 
      ? (isPortrait ? '180px' : '160px') // Smaller in landscape to fit more
      : isTablet 
        ? '200px' 
        : '220px';
    
    return (
    <div
      style={{
        flex: '0 0 auto',
        minWidth: cardWidth,
        maxWidth: cardWidth,
        padding: isMobile ? '10px' : '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '4px' : '8px',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <StarRating isMobile={isMobile} rating={rating} />
      <h3 style={{ fontWeight: 'bold', fontSize: isMobile ? '9px' : '12px', color: '#000', margin: 0, display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'center', lineHeight: '1.3' }}>
        {countryCode && (
          <ReactCountryFlag
            countryCode={countryCode}
            svg
            style={{
              width: isMobile ? '14px' : '18px',
              height: isMobile ? '10px' : '13px',
              borderRadius: '2px',
              flexShrink: 0
            }}
          />
        )}
        <span>{name}</span>
      </h3>
      <p style={{ 
        fontSize: isMobile ? '10px' : '12px', 
        color: '#333', 
        lineHeight: isMobile ? '1.8' : '1.4', 
        margin: 0,
        fontWeight: 'bold',
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        overflow: 'visible',
        minHeight: isMobile ? '40px' : 'auto',
        maxHeight: isMobile ? 'none' : 'auto'
      }}>
        {text}
      </p>
    </div>
    );
  };

  return (
    <>
      <style>
        {`
          .reviews-section::-webkit-scrollbar {
            display: none;
          }
          .reviews-section {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <div 
        className="w-full min-h-screen bg-white relative"
        style={{
          margin: 0,
          paddingLeft: isMobile ? '16px' : isTablet ? '24px' : '40px',
          paddingRight: isMobile ? '16px' : isTablet ? '24px' : '40px',
          paddingBottom: isMobile ? '50px' : '50px',
          minHeight: isMobile ? 'auto' : '100vh',
          width: '100%',
          maxWidth: '100%',
          overflow: 'visible',
          contain: 'layout style paint', // Performance optimization
          transform: 'translateZ(0)' // GPU acceleration
        }}
      >
      <div 
        className="w-full relative"
        style={{
          backgroundColor: '#ffffff', // Changed from pink lines to solid white background
          margin: 0,
          padding: 0,
          paddingBottom: backgroundPaddingBottom,
          minHeight: backgroundMinHeight,
          height: 'auto',
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'scroll', // Changed from fixed to scroll for better performance
          willChange: 'auto',
          transform: 'translateZ(0)', // GPU acceleration
          backfaceVisibility: 'hidden'
        }}
      >
      {/* Logo - opposite side of text */}
      <div 
        className="absolute top-8 z-30"
        style={{
          zIndex: 30,
          top: isMobile 
            ? (isPortrait ? '16px' : '10px') 
            : isTablet 
              ? (isPortrait ? '50px' : '25px') 
              : (isPortrait ? '32px' : '25px'),
          // Logo always opposite to text: RTL (text right) -> logo left, LTR (text left) -> logo right
          [isRTL ? 'left' : 'right']: isMobile 
            ? (isPortrait ? '16px' : '10px') 
            : isTablet 
              ? (isPortrait ? '50px' : '25px') 
              : (isPortrait ? '32px' : '25px')
        }}
      >
        <img
  src={logoImage || ''}

          alt="Logo"
          style={{
            height: 'auto',
            width: 'auto',
            maxHeight: isMobile 
              ? (isPortrait ? '50px' : '32px') 
              : isTablet 
                ? (isPortrait ? '60px' : '40px') 
                : (isPortrait ? '80px' : '55px'),
            display: 'block'
          }}
        />
      </div>

      {/* Green dots */}
      <div 
        className="absolute top-8 left-1/2 transform -translate-x-1/2 flex z-10"
        style={{
          top: isMobile 
            ? (isPortrait ? '16px' : '10px') 
            : isTablet 
              ? (isPortrait ? '50px' : '25px') 
              : (isPortrait ? '32px' : '25px'),
          gap: isMobile 
            ? (isPortrait ? '8px' : '5px') 
            : (isPortrait ? '20px' : '12px')
        }}
      >
        <div 
          className={`${isMobile 
            ? (isPortrait ? 'w-2 h-2' : 'w-1.5 h-1.5') 
            : (isPortrait ? 'w-3 h-3' : 'w-2 h-2')} rounded-full`} 
          style={{ backgroundColor: '#84D29A' }}
        ></div>
        <div 
          className={`${isMobile 
            ? (isPortrait ? 'w-2 h-2' : 'w-1.5 h-1.5') 
            : (isPortrait ? 'w-3 h-3' : 'w-2 h-2')} rounded-full`} 
          style={{ backgroundColor: '#84D29A' }}
        ></div>
        <div 
          className={`${isMobile 
            ? (isPortrait ? 'w-2 h-2' : 'w-1.5 h-1.5') 
            : (isPortrait ? 'w-3 h-3' : 'w-2 h-2')} rounded-full`} 
          style={{ backgroundColor: '#84D29A' }}
        ></div>
        <div 
          className={`${isMobile 
            ? (isPortrait ? 'w-2 h-2' : 'w-1.5 h-1.5') 
            : (isPortrait ? 'w-3 h-3' : 'w-2 h-2')} rounded-full`} 
          style={{ backgroundColor: '#84D29A' }}
        ></div>
        <div 
          className={`${isMobile 
            ? (isPortrait ? 'w-2 h-2' : 'w-1.5 h-1.5') 
            : (isPortrait ? 'w-3 h-3' : 'w-2 h-2')} rounded-full`} 
          style={{ backgroundColor: '#84D29A' }}
        ></div>
      </div>

      {/* SVG Definitions for wave clipPath and mask */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <clipPath id="waveClip" clipPathUnits="objectBoundingBox">
            <path d="M0,0 L1,0 L1,0.95 C0.95,0.96 0.9,0.95 0.85,0.96 C0.8,0.97 0.75,0.96 0.7,0.95 C0.65,0.94 0.6,0.95 0.55,0.96 C0.5,0.97 0.45,0.96 0.4,0.95 C0.35,0.94 0.3,0.95 0.25,0.96 C0.2,0.97 0.15,0.96 0.1,0.95 C0.05,0.94 0,0.95 0,0.99 L0,1 Z" />
          </clipPath>
          <mask id="phoneMask" maskUnits="objectBoundingBox">
            <rect width="1" height="1" fill="white" />
            <ellipse cx="0.25" cy="0.5" rx="0.08" ry="0.15" fill="black" />
          </mask>
        </defs>
      </svg>

      {/* Green gradient section in the middle */}
      <div 
        className="absolute top-0 z-20"
        style={{
          position: 'absolute',
          top: '0',
          left: isMobile 
            ? (isPortrait ? '-16px' : '-12px') 
            : isTablet 
              ? (isPortrait ? '-24px' : '-20px') 
              : '-40px',
          right: isMobile 
            ? (isPortrait ? '-16px' : '-12px') 
            : isTablet 
              ? (isPortrait ? '-24px' : '-20px') 
              : '-40px',
          width: isMobile 
            ? (isPortrait ? 'calc(100% + 32px)' : 'calc(100% + 24px)') 
            : isTablet 
              ? (isPortrait ? 'calc(100% + 48px)' : 'calc(100% + 40px)') 
              : 'calc(100% + 80px)',
          height: isMobile 
            ? (isPortrait ? '50vh' : '45vh') 
            : '50vh',
          minHeight: isMobile 
            ? (isPortrait ? '450px' : '300px') 
            : '50vh',
          borderRadius: '8px',
          overflow: 'visible',
          paddingBottom: isMobile 
            ? (isPortrait ? '60px' : '40px') 
            : '0',
          paddingTop: isMobile ? '0' : '0',
          marginTop: isMobile ? '0' : '0',
          marginBottom: isMobile ? '0' : '0',
          zIndex: 20
        }}
      >
        {/* Green gradient background with diagonal lines */}
        <div
          style={{
            width: '100%',
            height: isMobile 
              ? (isPortrait ? 'calc(100% + 60px)' : 'calc(100% + 40px)') 
              : 'calc(100% + 60px)',
            background: 'linear-gradient(180deg, rgba(68, 123, 83, 0.4) 0%, rgba(54, 111, 69, 0.9) 60%, rgba(54, 111, 69, 0.80) 100%)',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 2,
            clipPath: 'url(#waveClip)',
            display: isMobile ? 'flex' : 'block',
            alignItems: isMobile ? 'center' : 'flex-start',
            justifyContent: isMobile ? 'flex-start' : 'flex-start',
            padding: isMobile 
              ? (isPortrait ? '20px' : '15px') 
              : '0',
            paddingTop: isMobile 
              ? (isPortrait ? '60px' : '40px') 
              : '40px',
            paddingBottom: isMobile 
              ? (isPortrait ? '20px' : '15px') 
              : '40px',
            gap: isMobile 
              ? (isPortrait ? '20px' : '15px') 
              : '0'
          }}
        >
          {/* Subtle diagonal lines pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 2px, transparent 2px, transparent 8px)',
              opacity: 0.6,
              pointerEvents: 'none',
              willChange: 'auto',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          />
          {/* Remove green under phone area */}
          {!isMobile && (
          <div
            style={{
              position: 'absolute',
              left: '120px',
              top: '50%',
              width: '200px',
              height: '350px',
              backgroundColor: 'transparent',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              zIndex: 5,
              background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(255, 255, 255, 0) 100%)',
              mixBlendMode: 'difference'
            }}
          />
          )}

        {/* Text content - comes first before phone */}
        <div
          style={{
            position: isMobile ? 'relative' : 'absolute',
            top: isMobile ? 'auto' : isTablet ? '55%' : '50%',
            [isRTL ? 'right' : 'left']: isMobile ? 'auto' : isTablet ? '24px' : '100px',
            [isRTL ? 'left' : 'right']: isMobile ? 'auto' : 'auto',
            transform: isMobile ? 'none' : 'translateY(calc(-50% - 30px))',
            zIndex: 30,
            maxWidth: isMobile 
              ? (isPortrait ? 'calc(100% - 160px)' : 'calc(100% - 120px)') 
              : isTablet ? '400px' : '500px',
            minWidth: isMobile ? '0' : 'auto',
            flex: isMobile ? '1' : 'none',
            pointerEvents: 'auto',
            padding: isMobile ? '0' : '0',
            paddingTop: isMobile ? '0' : '20px',
            marginTop: isMobile 
              ? (isPortrait ? '-20px' : '-15px') 
              : isTablet ? '20px' : '0',
            textAlign: isRTL ? 'right' : 'left',
            display: isMobile ? 'flex' : 'block',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? (isRTL ? 'flex-start' : 'flex-end') : (isRTL ? 'flex-start' : 'flex-end'),
            justifyContent: isMobile ? 'center' : (isRTL ? 'flex-start' : 'flex-end'),
            overflow: isMobile ? 'visible' : 'visible'
          }}
        >
          <h1
            style={{
              fontSize: isMobile 
                ? (isPortrait ? '0.8rem' : '0.4rem') 
                : isIPadPro || isTablet
                  ? (isPortrait ? '2.2rem' : '1.4rem') 
                  : (isPortrait ? '3.2rem' : '2.4rem'),
              fontWeight: 'bold',
              color: 'white',
              marginBottom: isMobile 
                ? (isPortrait ? '12px' : '6px') 
                : (isPortrait ? '24px' : '16px'),
              lineHeight: '1.3',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              margin: isMobile 
                ? (isPortrait ? '0 0 12px 0' : '0 0 6px 0') 
                : (isPortrait ? '0 0 24px 0' : '0 0 16px 0'),
              whiteSpace: isMobile ? 'normal' : 'normal',
              wordBreak: isMobile ? 'normal' : 'normal',
              overflowWrap: isMobile ? 'break-word' : 'normal',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {heroData.title}
          </h1>
          <p
            style={{
              fontSize: isMobile 
                ? (isPortrait ? '0.7rem' : '0.4rem') 
                : isIPadPro || isTablet
                  ? (isPortrait ? '1.15rem' : '0.75rem') 
                  : (isPortrait ? '1.4rem' : '1.1rem'),
              color: 'white',
              marginBottom: isMobile 
                ? (isPortrait ? '16px' : '10px') 
                : (isPortrait ? '32px' : '20px'),
              lineHeight: '1.6',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              margin: isMobile 
                ? (isPortrait ? '0 0 16px 0' : '0 0 10px 0') 
                : (isPortrait ? '0 0 32px 0' : '0 0 20px 0'),
              whiteSpace: 'pre-line'
            }}
          >
            {heroData.description}
          </p>
          <p
            style={{
              fontSize: isMobile 
                ? (isPortrait ? '0.75rem' : '0.45rem') 
                : isIPadPro || isTablet
                  ? (isPortrait ? '1.05rem' : '0.75rem')
                  : (isPortrait ? '1rem' : '0.75rem'),
              color: 'white',
              marginBottom: isMobile 
                ? (isPortrait ? '8px' : '8px') 
                : (isPortrait ? '24px' : '16px'),
              fontWeight: '500',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              margin: isMobile 
                ? (isPortrait ? '0 0 12px 0' : '0 0 8px 0') 
                : (isPortrait ? '0 0 24px 0' : '0 0 16px 0'),
            textAlign: isRTL ? 'right' : 'left',
            alignSelf: isMobile ? (isRTL ? 'flex-end' : 'flex-start') : 'auto'
            }}
          >
            {t.downloadText}
          </p>
          <div style={{ 
            display: 'flex', 
            flexDirection: isRTL ? 'row-reverse' : 'row',
            gap: isMobile 
              ? (isPortrait ? '6px' : '4px') 
              : (isPortrait ? '12px' : '8px'), 
            flexWrap: isTablet ? 'wrap' : 'nowrap', 
            alignItems: 'center',
            justifyContent: isMobile ? (isRTL ? 'flex-end' : 'flex-start') : (isRTL ? 'flex-end' : 'flex-start')
          }}>
            {/* App Store */}
            <a
              href={heroData.appleLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src="/appstore.jpg"
                alt="Download on App Store"
                style={{
                  height: isMobile 
                    ? (isPortrait ? '40px' : '28px') 
                    : (isPortrait ? '60px' : '48px'),
                  width: 'auto',
                  borderRadius: '8px',
                  display: 'block'
                }}
              />
            </a>

            {/* Google Play */}
            <a
              href={heroData.googleLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src="/googleplay.png"
                alt="Get it on Google Play"
                style={{
                  height: isMobile 
                    ? (isPortrait ? '40px' : '28px') 
                    : (isPortrait ? '60px' : '48px'),
                  width: 'auto',
                  borderRadius: '8px',
                  display: 'block'
                }}
              />
            </a>

            {/* APK Download */}
            <a
              href="/app-release.apk"
              download="app-release.apk"
              title={t.downloadAppTooltip || 'تحميل التطبيق'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
                cursor: 'pointer',
                backgroundColor: '#84D29A',
                borderRadius: '8px',
                padding: isMobile 
                  ? (isPortrait ? '10px' : '8px') 
                  : (isPortrait ? '14px' : '12px'),
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                width: isMobile 
                  ? (isPortrait ? '40px' : '28px') 
                  : (isPortrait ? '60px' : '48px'),
                height: isMobile 
                  ? (isPortrait ? '40px' : '28px') 
                  : (isPortrait ? '60px' : '48px')
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
              }}
            >
              <FaDownload 
                style={{
                  color: '#fff',
                  fontSize: isMobile 
                    ? (isPortrait ? '20px' : '14px') 
                    : (isPortrait ? '28px' : '22px')
                }}
              />
            </a>
          </div>
        </div>

        {/* Phone mockup on green section - comes after text */}
        <div 
          className={isMobile ? '' : 'absolute'}
          style={{
            position: isMobile ? 'relative' : 'absolute',
            // Phone position: RTL (text right) -> phone left, LTR (text left) -> phone right
            [isRTL ? 'left' : 'right']: isMobile 
              ? 'auto' 
              : isIPadPro 
                ? (isPortrait ? '60px' : '30px') 
                : isTablet 
                  ? (isPortrait ? '50px' : '20px') 
                  : (isPortrait ? '250px' : '220px'),
            top: isMobile ? 'auto' : '60%',
            transform: isMobile ? (isRTL ? 'translateX(15px)' : 'translateX(-15px)') : 'translateY(calc(-50% - 20px))',
            zIndex: 25,
            width: isMobile 
              ? (isPortrait ? '160px' : '100px') 
              : isIPadPro 
                ? (isPortrait ? '220px' : '150px') 
                : isTablet 
                  ? (isPortrait ? '200px' : '140px') 
                  : '220px',
            height: 'auto',
            [isRTL ? 'marginRight' : 'marginLeft']: isMobile 
              ? (isPortrait ? '20px' : '10px') 
              : '0',
            marginTop: isMobile ? '0' : '0',
            marginBottom: isMobile 
              ? (isPortrait ? '20px' : '10px') 
              : '0',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: isMobile 
                ? (isPortrait ? '160px' : '100px') 
                : isIPadPro 
                  ? (isPortrait ? '220px' : '150px') 
                  : isTablet 
                    ? (isPortrait ? '200px' : '140px') 
                    : '220px',
              height: isMobile 
                ? (isPortrait ? '280px' : '180px') 
                : isIPadPro 
                  ? (isPortrait ? '370px' : '260px') 
                  : isTablet 
                    ? (isPortrait ? '340px' : '240px') 
                    : '370px',
              backgroundColor: 'rgba(205, 179, 179, 0.3)',
              borderRadius: '15px',
              padding: '0',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              position: 'relative',
              border: '4px solid #e7e7e7',
              overflow: 'hidden',
              backgroundColor: 'rgba(253, 227, 229, 0.3)'
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(253, 227, 229, 0.3)',
                borderRadius: '11px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                padding: isMobile ? '8px' : '12px',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img
                src={heroImage || ''}

                alt="Phone Screen"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  borderRadius: '11px',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
            </div>
          </div>
        </div>
        </div>ذ
      </div>

      {/* Reviews Section - positioned right after green section */}
      <div
        className={isMobile ? 'reviews-section' : (isTablet || isIPadPro) ? 'reviews-section' : 'reviews-section'}
        style={{
          position: 'absolute',
          top: isMobile 
            ? (isiPhoneSE ? 'calc(50vh + 80px)' : 'calc(50vh + 60px)')
            : 'calc(50vh + 40px)',
          left: isMobile ? '0' : isTablet ? '-24px' : '-40px',
          right: isMobile ? '0' : isTablet ? '-24px' : '-40px',
          width: isMobile ? '100%' : isTablet ? 'calc(100% + 48px)' : 'calc(100% + 80px)',
          padding: isMobile ? '20px 16px' : isTablet ? '20px 24px' : '24px 40px',
          marginTop: isMobile ? '0' : '0',
          marginBottom: isMobile ? '40px' : '0',
          zIndex: 15,
          display: 'flex',
          gap: isMobile ? '8px' : '16px',
          justifyContent: isMobile ? 'flex-start' : 'flex-start',
          alignItems: 'flex-start',
          flexWrap: 'nowrap', // Keep side by side on all devices
          overflowX: 'auto', // Allow horizontal scrolling on all devices
          overflowY: 'visible',
          maxWidth: '100%',
          WebkitOverflowScrolling: 'touch',
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        {reviews.map((review, index) => (
          <ReviewCard key={index} name={review.name} text={review.text} countryCode={review.countryCode} rating={review.rating} isMobile={isMobile} isTablet={isTablet} isPortrait={isPortrait} />
        ))}
      </div>

      {/* Green Dots Below Reviews */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 flex z-15" 
        style={{ 
          position: 'absolute',
          top: isMobile 
            ? (isiPhoneSE ? 'calc(50vh + 320px)' : 'calc(50vh + 280px)')
            : isTablet ? 'calc(50vh + 320px)' : 'calc(50vh + 290px)',
          gap: isMobile ? '8px' : '20px'
        }}
      >
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#84D29A' }}></div>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#84D29A' }}></div>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#84D29A' }}></div>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#84D29A' }}></div>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#84D29A' }}></div>
      </div>

      {/* Features Section - positioned below reviews */}
      <div
        style={{
          position: 'absolute',
          top: isMobile 
            ? (isiPhoneSE ? 'calc(50vh + 360px)' : 'calc(50vh + 280px)')
            : isTablet ? 'calc(50vh + 340px)' : 'calc(50vh + 280px)',
          left: isMobile ? '-16px' : isTablet ? '-24px' : '-40px',
          right: isMobile ? '-16px' : isTablet ? '-24px' : '-40px',
          width: isMobile ? 'calc(100% + 32px)' : isTablet ? 'calc(100% + 48px)' : 'calc(100% + 80px)',
          padding: isMobile ? '20px' : isTablet ? '30px' : '40px',
          marginBottom: isMobile ? '0' : '0',
          zIndex: 15,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '12px' : isTablet ? '30px' : '80px', // Increased gap for desktop to separate features from phone
          flexWrap: 'wrap',
          flexDirection: isMobile ? 'column' : 'row'
        }}
      >
        {/* Left side features - desktop/tablet */}
        {!isMobile && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              flex: '1',
              maxWidth: isTablet ? '250px' : '300px',
              alignItems: isRTL ? 'flex-end' : 'flex-start',
              order: isRTL ? 3 : 1,
              [isRTL ? 'marginLeft' : 'marginRight']: isTablet ? '10px' : '20px'
            }}
          >
            {features
              .filter(f => f.side === 'left')
              .sort((a, b) => (a.position === 'top' ? -1 : 1))
              .map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
              alignItems: isRTL ? 'flex-end' : 'flex-start',
              textAlign: isRTL ? 'right' : 'left',
              maxWidth: '280px'
                  }}
                >
                  <div style={{ 
                    fontSize: '32px', 
                    marginBottom: '8px', 
                    color: '#000',
                    display: 'flex',
                    justifyContent: isRTL ? 'flex-end' : 'flex-start',
                    width: '100%',
                    transform: isRTL ? 'scaleX(-1)' : 'scaleX(1)',
                    transition: 'transform 0.3s ease'
                  }}>
                    {React.createElement(feature.icon)}
                  </div>
                  <h3 style={{ 
                    fontWeight: 'bold', 
                    fontSize: '16px', 
                    color: '#000', 
                    margin: 0,
                    textAlign: isRTL ? 'right' : 'left',
                    alignSelf: isRTL ? 'flex-end' : 'flex-start',
                    width: '100%'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ 
                    fontSize: '13px', 
                    color: '#666', 
                    lineHeight: '1.6', 
                    margin: 0,
                    textAlign: isRTL ? 'right' : 'left'
                  }}>
                    {feature.description}
                  </p>
                </div>
              ))}
          </div>
        )}

        {/* Mobile: Features with phone in center - grid layout */}
        {isMobile && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gridTemplateRows: 'auto auto',
              gap: '8px',
              columnGap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              order: 1
            }}
          >
            {/* Top row: Left top feature - طرق الدفع */}
            {features
              .filter(f => f.side === (isRTL ? 'right' : 'left') && f.position === 'top')
              .map((feature, index) => (
                <div
                  key={`left-top-${index}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    alignItems: 'center',
                    textAlign: 'center',
                    gridColumn: isRTL ? '3' : '1',
                    gridRow: '1',
                    [isRTL ? 'marginLeft' : 'marginRight']: '6px'
                  }}
                >
                  <div style={{ fontSize: '18px', marginBottom: '0px', color: '#000' }}>
                    {React.createElement(feature.icon)}
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '9px', color: '#000', margin: 0, lineHeight: '1.15' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '7.5px', color: '#666', lineHeight: '1.25', margin: 0 }}>
                    {feature.description}
                  </p>
                </div>
              ))}

            {/* Phone mockup in center - spans both rows */}
            <div
              style={{
                width: '120px',
                height: '240px',
                backgroundColor: '#4a4a4a',
                borderRadius: '25px',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #4a4a4a',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                position: 'relative',
                flexShrink: 0,
                gridColumn: '2',
                gridRow: '1 / 3',
                alignSelf: 'center'
              }}
            >
              {/* Volume buttons */}
              <div
                style={{
                  position: 'absolute',
                  left: '-4px',
                  top: '90px',
                  width: '5px',
                  height: '32px',
                  backgroundColor: '#4a4a4a',
                  borderRadius: '2px 0 0 2px',
                  zIndex: 5
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '-4px',
                  top: '130px',
                  width: '5px',
                  height: '32px',
                  backgroundColor: '#4a4a4a',
                  borderRadius: '2px 0 0 2px',
                  zIndex: 5
                }}
              />
              
              {/* Power button */}
              <div
                style={{
                  position: 'absolute',
                  right: '-4px',
                  top: '110px',
                  width: '5px',
                  height: '48px',
                  backgroundColor: '#4a4a4a',
                  borderRadius: '0 2px 2px 0',
                  zIndex: 5
                }}
              />
          
          {/* Screen */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#e0e0e0',
              borderRadius: '25px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <img
  src={secondSectionImage || "/some-image.png"}

              alt="Phone Screen"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '25px',
                display: 'block'
              }}
            />
            {/* Thin Notch */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '8px',
                backgroundColor: '#4a4a4a',
                borderBottomLeftRadius: '4px',
                borderBottomRightRadius: '4px',
                zIndex: 10
              }}
            />
          </div>
            </div>

            {/* Top row: Right top feature - تتبع الرحلة */}
            {features
              .filter(f => f.side === (isRTL ? 'left' : 'right') && f.position === 'top')
              .map((feature, index) => (
                <div
                  key={`right-top-${index}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    alignItems: 'center',
                    textAlign: 'center',
                    gridColumn: isRTL ? '1' : '3',
                    gridRow: '1'
                  }}
                >
                  <div style={{ fontSize: '18px', marginBottom: '0px', color: '#000' }}>
                    {React.createElement(feature.icon)}
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '9px', color: '#000', margin: 0, lineHeight: '1.15' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '7.5px', color: '#666', lineHeight: '1.25', margin: 0 }}>
                    {feature.description}
                  </p>
                </div>
              ))}

            {/* Bottom row: Left bottom feature - حجز سريع */}
            {features
              .filter(f => f.side === (isRTL ? 'right' : 'left') && f.position === 'bottom')
              .map((feature, index) => (
                <div
                  key={`left-bottom-${index}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    alignItems: 'center',
                    textAlign: 'center',
                    gridColumn: isRTL ? '3' : '1',
                    gridRow: '2',
                    [isRTL ? 'marginLeft' : 'marginRight']: '6px'
                  }}
                >
                  <div style={{ fontSize: '18px', marginBottom: '0px', color: '#000' }}>
                    {React.createElement(feature.icon)}
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '9px', color: '#000', margin: 0, lineHeight: '1.15' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '7.5px', color: '#666', lineHeight: '1.25', margin: 0 }}>
                    {feature.description}
                  </p>
                </div>
              ))}

            {/* Bottom row: Right bottom feature - الأمان */}
            {features
              .filter(f => f.side === (isRTL ? 'left' : 'right') && f.position === 'bottom')
              .map((feature, index) => (
                <div
                  key={`right-bottom-${index}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    alignItems: 'center',
                    textAlign: 'center',
                    gridColumn: isRTL ? '1' : '3',
                    gridRow: '2'
                  }}
                >
                  <div style={{ fontSize: '18px', marginBottom: '0px', color: '#000' }}>
                    {React.createElement(feature.icon)}
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '9px', color: '#000', margin: 0, lineHeight: '1.15' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '7.5px', color: '#666', lineHeight: '1.25', margin: 0 }}>
                    {feature.description}
                  </p>
                </div>
              ))}
          </div>
        )}

        {/* Phone mockup in center - desktop/tablet */}
        {!isMobile && (
          <div
            style={{
              width: isTablet ? '170px' : '200px',
              height: isTablet ? '340px' : '400px',
              backgroundColor: '#4a4a4a',
              borderRadius: '30px',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #4a4a4a',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              position: 'relative',
              order: 2,
              flexShrink: 0
            }}
          >
            {/* Volume buttons */}
            <div
              style={{
                position: 'absolute',
                left: '-4px',
                top: '90px',
                width: '3px',
                height: '35px',
                backgroundColor: '#4a4a4a',
                borderRadius: '2px 0 0 2px',
                zIndex: 5
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '-4px',
                top: '135px',
                width: '3px',
                height: '35px',
                backgroundColor: '#4a4a4a',
                borderRadius: '2px 0 0 2px',
                zIndex: 5
              }}
            />
            
            {/* Power button */}
            <div
              style={{
                position: 'absolute',
                right: '-4px',
                top: '110px',
                width: '3px',
                height: '50px',
                backgroundColor: '#4a4a4a',
                borderRadius: '0 2px 2px 0',
                zIndex: 5
              }}
            />
            
            {/* Screen */}
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#e0e0e0',
                borderRadius: '25px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <img
  src={secondSectionImage || "/some-image.png"}
  alt="Phone Screen"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '25px',
                  display: 'block'
                }}
              />
              {/* Thin Notch */}
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '8px',
                  backgroundColor: '#4a4a4a',
                  borderBottomLeftRadius: '4px',
                  borderBottomRightRadius: '4px',
                  zIndex: 10
                }}
              />
            </div>
          </div>
        )}

        {/* Right side features - on desktop/tablet */}
        {!isMobile && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              flex: '1',
              maxWidth: isTablet ? '250px' : '300px',
              alignItems: isRTL ? 'flex-end' : 'flex-start',
              order: isRTL ? 1 : 3
            }}
          >
            {features
              .filter(f => f.side === 'right')
              .sort((a, b) => (a.position === 'top' ? -1 : 1))
              .map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
              alignItems: isRTL ? 'flex-end' : 'flex-start',
              textAlign: isRTL ? 'right' : 'left',
              maxWidth: '280px'
                  }}
                >
                  <div style={{ 
                    fontSize: '32px', 
                    marginBottom: '8px', 
                    color: '#000',
                    display: 'flex',
                    justifyContent: isRTL ? 'flex-end' : 'flex-start',
                    width: '100%',
                    transform: isRTL ? 'scaleX(-1)' : 'scaleX(1)',
                    transition: 'transform 0.3s ease'
                  }}>
                    {React.createElement(feature.icon)}
                  </div>
                  <h3 style={{ 
                    fontWeight: 'bold', 
                    fontSize: '16px', 
                    color: '#000', 
                    margin: 0,
                    textAlign: isRTL ? 'right' : 'left',
                    alignSelf: isRTL ? 'flex-end' : 'flex-start',
                    width: '100%'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ 
                    fontSize: '10px', 
                    color: '#666', 
                    lineHeight: '1.6', 
                    margin: 0,
                    textAlign: isRTL ? 'right' : 'left'
                  }}>
                    {feature.description}
                  </p>
                </div>
              ))}
          </div>
        )}

      </div>

      {/* Phone Carousel Section - below features */}
      <div
        style={{
          position: 'absolute',
          top: isMobile 
            ? (isiPhoneSE ? 'calc(50vh + 900px)' : 'calc(50vh + 720px)')
            : isTablet ? 'calc(50vh + 820px)' : 'calc(50vh + 820px)',
          left: isMobile ? '-16px' : isTablet ? '-24px' : '-40px',
          right: isMobile ? '-16px' : isTablet ? '-24px' : '-40px',
          width: isMobile ? 'calc(100% + 32px)' : isTablet ? 'calc(100% + 48px)' : 'calc(100% + 80px)',
          minHeight: isMobile ? '400px' : '500px',
          padding: isMobile ? '20px' : isTablet ? '30px' : '40px',
          marginBottom: isMobile ? '0' : '0',
          zIndex: 15,
          borderRadius: '2px', // Thin edges
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: 'transparent'
        }}
      >
        {/* Background Image */}
        <img
          src="/ph.jpeg"
          alt="Background"
          loading="lazy"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate3d(-50%, -50%, 0) scaleX(0.95) scaleY(${isMobile ? (isPortrait ? '1' : '0.70') : '1'})`,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0,
            opacity: '0.9',
            filter: 'none',
            imageRendering: 'auto',
            WebkitFontSmoothing: 'auto',
            backfaceVisibility: 'hidden',
            willChange: 'transform',
            transformOrigin: 'center center'
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            width: isMobile ? '100%' : '85%',
            maxWidth: '1200px',
            margin: '0 auto',
            overflow: 'hidden',
            paddingLeft: isMobile ? '40px' : isTablet ? '50px' : '60px',
            paddingRight: isMobile ? '40px' : isTablet ? '50px' : '60px'
          }}
        >
          {/* Left Arrow */}
          <button
            onClick={handlePrevSlide}
            style={{
              position: 'absolute',
              [isRTL ? 'right' : 'left']: isMobile ? '5px' : '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: isMobile ? '32px' : '50px',
              height: isMobile ? '32px' : '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            {isRTL ? (
              <FaChevronRight style={{ fontSize: isMobile ? '12px' : '20px', color: '#333', fontWeight: 'bold' }} />
            ) : (
              <FaChevronLeft style={{ fontSize: isMobile ? '12px' : '20px', color: '#333', fontWeight: 'bold' }} />
            )}
          </button>

          {/* Carousel Container */}
          <div
            style={{
              display: 'flex',
              transform: `translateX(calc(${isRTL ? '' : '-'}${currentSlide} * (${carouselPhoneSize.width} + ${carouselPhoneSize.gap}) + 0px))`,
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              gap: carouselPhoneSize.gap,
              width: 'fit-content',
              justifyContent: isRTL ? 'flex-end' : 'flex-start',
              alignItems: 'center',
              willChange: 'transform',
              [isRTL ? 'paddingRight' : 'paddingLeft']: '0px',
              direction: isRTL ? 'rtl' : 'ltr'
            }}
          >
            {phoneMockups.map((phone, index) => {
              // Hide first image (1.jpeg) on mobile
              if (isMobile && index === 0) {
                return null;
              }
              
              // Calculate phone size based on device and orientation
              const getPhoneSize = () => {
                if (isMobile) {
                  // For mobile, adjust size based on orientation
                  if (isPortrait) {
                    return { width: carouselPhoneSize.width, height: '240px' };
                  } else {
                    // Landscape: smaller phones
                    return { width: carouselPhoneSize.width, height: '200px' };
                  }
                }
                if (isTablet) {
                  if (isPortrait) {
                    return { width: carouselPhoneSize.width, height: '320px' };
                  } else {
                    return { width: carouselPhoneSize.width, height: '280px' };
                  }
                }
                // Desktop
                return { width: carouselPhoneSize.width, height: '360px' };
              };
              
              const phoneSize = getPhoneSize();
              
              return (
              <div
                key={index}
                style={{
                  minWidth: phoneSize.width,
                  width: phoneSize.width,
                  height: phoneSize.height,
                  backgroundColor: '#B0B0B0', // Screen color extends to edges
                  borderRadius: '30px',
                  padding: '0', // Removed padding so screen goes to edges
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '6px solid #e7e7e7', // Increased border width
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  position: 'relative',
                  flexShrink: 0
                }}
              >
                {/* Volume buttons */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-3px',
                    top: '90px',
                    width: '3px',
                    height: '35px',
                    backgroundColor: '#e7e7e7',
                    borderRadius: '2px 0 0 2px'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '-3px',
                    top: '135px',
                    width: '3px',
                    height: '35px',
                    backgroundColor: '#e7e7e7',
                    borderRadius: '2px 0 0 2px'
                  }}
                />
                
                {/* Power button */}
                <div
                  style={{
                    position: 'absolute',
                    right: '-3px',
                    top: '110px',
                    width: '3px',
                    height: '50px',
                    backgroundColor: '#e7e7e7',
                    borderRadius: '0 2px 2px 0'
                  }}
                />
                
                {/* Screen */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#B0B0B0', // Light gray background
                    borderRadius: '27px', // Matches outer border radius minus border width
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
<img
        src={phone.image}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
                  
                </div>
              </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNextSlide}
            style={{
              position: 'absolute',
              [isRTL ? 'left' : 'right']: isMobile ? '5px' : '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 20,
              width: isMobile ? '32px' : '50px',
              height: isMobile ? '32px' : '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            {isRTL ? (
              <FaChevronLeft style={{ fontSize: isMobile ? '12px' : '20px', color: '#333', fontWeight: 'bold' }} />
            ) : (
              <FaChevronRight style={{ fontSize: isMobile ? '12px' : '20px', color: '#333', fontWeight: 'bold' }} />
            )}
          </button>
      </div>
      </div>

      {/* Footer Section - Logo and Contact */}
      <div
        style={{
          position: 'absolute',
          top: isMobile 
            ? (isiPhoneSE ? 'calc(50vh + 1250px)' : 'calc(50vh + 1120px)')
            : isTablet ? 'calc(50vh + 1290px)' : 'calc(50vh + 1290px)',
          left: isMobile ? '-16px' : isTablet ? '-40px' : '-40px',
          right: isMobile ? '-16px' : isTablet ? '-40px' : '-40px',
          width: isMobile ? 'calc(100% + 32px)' : isTablet ? 'calc(100% + 80px)' : 'calc(100% + 80px)',
          padding: isMobile ? '30px 16px' : isTablet ? '35px 40px' : '35px 40px',
          marginBottom: isMobile ? '0' : '0',
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? '20px' : isTablet ? '20px' : '20px'
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isMobile ? '20px' : isTablet ? '15px' : '15px'
          }}
        >
          {/* Tiger Logo */}
          <div
            style={{
             borderRadius: '2px',
              padding: '0',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={logoImage}

              alt="Tiger Logo"
              style={{
                width: isMobile ? '120px' : isTablet ? '130px' : '130px',
                height: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
          
        </div>

        {/* Description Text */}
        <p
          style={{
            fontSize: isMobile ? '11px' : isTablet ? '14px' : '14px',
            color: '#000',
            textAlign: 'center',
            maxWidth: isMobile ? '100%' : '500px',
            lineHeight: '1.8',
            margin: 0,
            fontFamily: 'Tajawal, sans-serif',
            fontWeight: '500',
            padding: isMobile ? '0 16px' : '0',
            whiteSpace: isMobile ? 'normal' : isTablet ? 'nowrap' : 'nowrap'
          }}
        >
         {footerData.description}
        </p>

        {/* Contact Button - Oval */}
        <button
          style={{
            background: 'linear-gradient(135deg, rgba(104, 213, 133, 0.7) 0%, rgba(104, 213, 133, 0.7) 70%, rgba(54, 111, 69, 0.5) 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '50px',
            padding: isMobile ? '12px 50px' : isTablet ? '12px 60px' : '12px 60px',
            fontSize: isMobile ? '16px' : isTablet ? '16px' : '16px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Tajawal, sans-serif',
            boxShadow: '0 4px 12px rgba(54, 111, 69, 0.3)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(132, 210, 154, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(132, 210, 154, 0.3)';
          }}
        >
          {t.contactButton}
        </button>

        {/* Social Media Icons */}
        <div
          style={{
            display: 'flex',
            gap: isMobile ? '12px' : '16px',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: isMobile ? '16px' : '20px',
            pointerEvents: 'auto',
            position: 'relative',
            zIndex: 2000
          }}
        >
          {/* Facebook */}
          <a
            href={footerData.facebookLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: isMobile ? '28px' : '32px',
              height: isMobile ? '28px' : '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.55)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FiFacebook style={{ fontSize: '16px', color: '#000' }} />
          </a>

          {/* Instagram */}
          <a
            href={footerData.instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: isMobile ? '28px' : '32px',
              height: isMobile ? '28px' : '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.55)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <BiLogoInstagram style={{ fontSize: isMobile ? '14px' : '16px', color: '#000' }} />
          </a>

          {/* TikTok */}
          <a
            href={footerData.tiktokLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: isMobile ? '28px' : '32px',
              height: isMobile ? '28px' : '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.55)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaTiktok style={{ fontSize: isMobile ? '14px' : '16px', color: '#000' }} />
          </a>

          {/* Snapchat */}
          <a
            href={footerData.snapchatLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: isMobile ? '28px' : '32px',
              height: isMobile ? '28px' : '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.55)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaSnapchat style={{ fontSize: isMobile ? '14px' : '16px', color: '#000' }} />
          </a>
        </div>
      </div>

      {/* Bottom Image Section */}
      <div
        style={{
          position: 'absolute',
          top: isMobile 
            ? (isiPhoneSE ? 'calc(50vh + 1450px - 120px)' : 'calc(50vh + 1350px - 120px)')
            : isTablet 
              ? 'calc(50vh + 1200px + 500px - 120px)' 
              : 'calc(50vh + 1200px + 500px - 120px)',
          left: isMobile ? '-16px' : isTablet ? '-40px' : '-40px',
          right: isMobile ? '-16px' : isTablet ? '-40px' : '-40px',
          width: isMobile ? 'calc(100% + 32px)' : isTablet ? 'calc(100% + 80px)' : 'calc(100% + 80px)',
          padding: '0px',
          marginBottom: isMobile ? '0' : '0',
          zIndex: 15,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            src="/Screenshot_2025-12-11_093148-removebg-preview.png"
            alt="Bottom Image"
            style={{
              width: isMobile ? '75%' : '100%',
              maxWidth: isMobile ? '75%' : '100%',
              height: isMobile 
                ? '600px' 
                : isIPadPro 
                  ? '250px'
                  : isTablet 
                    ? '220px' 
                    : '280px',
              minHeight: isMobile 
                ? '600px' 
                : isIPadPro 
                  ? '250px'
                  : isTablet 
                    ? '220px' 
                    : '280px',
              maxHeight: isMobile 
                ? '600px' 
                : isIPadPro 
                  ? '250px'
                  : isTablet 
                    ? '220px' 
                    : '280px',
              objectFit: 'contain',
              display: 'block',
              opacity: '0.85',
              transform: isMobile 
                ? 'scale(1.8)' 
                : isIPadPro 
                  ? 'scale(1.25)'
                  : isTablet 
                    ? 'scale(1.1)' 
                    : 'scale(1.25)',
              transformOrigin: 'center center',
              margin: isMobile ? '0 auto' : '0'
            }}
          />
          {/* Copyright Text Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 'auto',
              bottom: isMobile ? '270px' : isTablet ? '60px' : isIPadPro ? '20px' : '40px', // Moved up for desktop
              right: isMobile ? '10px' : isTablet ? '95px' : isIPadPro ? '95px' : '95px',
              left: isMobile ? 'auto' : 'auto',
              zIndex: 20
            }}
          >
            <p
              style={{
                fontSize: isMobile ? '12px' : isTablet ? '15px' : isIPadPro ? '15px' : '15px',
                color: '#ffffff',
                margin: 0,
                fontFamily: 'Tajawal, sans-serif',
                fontWeight: '400',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                textAlign: isMobile ? 'center' : (isRTL ? 'right' : 'left')
              }}
            >
              {t.copyright}
            </p>
          </div>
        </div>
      </div>

      </div>
    </div>
    <LanguageSwitcher />
    <WhatsAppButton whatsappLink={footerData?.whatsappLink} />
    </>
  );
};

export default Home;

