import React, { useState, useEffect, useMemo } from 'react';
import { FaWallet, FaCar, FaMapMarkerAlt, FaShieldAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { FiFacebook } from 'react-icons/fi';
import { PiTelegramLogoLight, PiGithubLogo } from 'react-icons/pi';
import { BiLogoInstagram } from 'react-icons/bi';
// Import images - adjust paths based on your assets folder location
// import googlePlay from '../assets/googleplay.png';
// import appstore from '../assets/appstore.jpg';
// import huawei from '../assets/huawel.webp';

const Home = () => {
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
    
    return { mobile, tablet, iPadPro, largeiPhone, isPortrait, isLandscape };
  };
  
  const initialState = getResponsiveState();
  const [isMobile, setIsMobile] = useState(initialState.mobile);
  const [isTablet, setIsTablet] = useState(initialState.tablet);
  const [isIPadPro, setIsIPadPro] = useState(initialState.iPadPro);
  const [isLargeiPhone, setIsLargeiPhone] = useState(initialState.largeiPhone);
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
  
  // Phone mockups for carousel
  const phoneMockups = Array.from({ length: 5 }, (_, i) => i);
  
  // Calculate max slide based on visible phones (responsive)
  const phonesPerView = isMobile ? 1 : isTablet ? 2 : 3;
  const maxSlide = Math.max(0, phoneMockups.length - phonesPerView);
  
  // Handle carousel navigation - stay within image bounds
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => {
      if (prev <= 0) return 0;
      return Math.max(0, prev - 2); // Move 2 steps at a time
    });
  };
  
  const handleNextSlide = () => {
    setCurrentSlide((prev) => {
      // Calculate max slide to keep phones visible within image bounds
      const calculatedMax = Math.max(0, phoneMockups.length - phonesPerView);
      if (prev >= calculatedMax) return calculatedMax;
      return Math.min(calculatedMax, prev + 2); // Move 2 steps at a time
    });
  };

  // Features data
  const features = [
    {
      title: 'طرق دفع مرنة ومناسبة لك',
      description: 'الدفع كاش أو فيزا أو من خلال محفظتك داخل التطبيق بكل سهولة وبدون تعقيد.',
      icon: FaWallet,
      side: 'left',
      position: 'top'
    },
    {
      title: 'حجز سريع خلال ثوان',
      description: 'واجهة بسيطة وسهلة تساعدك الحجز مشوارك في أقل وقت وتبدأ رحلتك فورا.',
      icon: FaCar,
      side: 'left',
      position: 'bottom'
    },
    {
      title: 'تتبع الرحلة لحظة بلحظة',
      description: 'اعرف مكان السائق في أي وقت وحدد وقت الوصول المتوقع بدقة بدون قلق أو انتظار طويل.',
      icon: FaMapMarkerAlt,
      side: 'right',
      position: 'top'
    },
    {
      title: 'أمان وثقة في كل مشوار',
      description: 'سائقين موثوقين بعد مراجعة هويتهم وتقييماتهم لضمان رحلة امنة ومريحة',
      icon: FaShieldAlt,
      side: 'right',
      position: 'bottom'
    }
  ];

  // Reviews data
  const reviews = [
    {
      name: 'محمد يوسف',
      text: 'جربته لأول مرة وكان سريع جدا في الاستجابة، من أول التسجيل لحد نهاية الرحلة.. كل حاجة سلسة ومرتبة.'
    },
    {
      name: 'كريم علاء',
      text: 'أسعار مناسبة جدا مقارنة بالتطبيقات الثانية، والتطبيق سهل وبسيط إن شاء الله هيفضل اختياري الأول.'
    },
    {
      name: 'احمد محمد',
      text: 'أكثر حاجة عجبتني إن الرحلة بتظهر لحظة بلحظة، وده بيطمني جدا خصوصا بالليل التجربة كلها كانت سهلة ومريحة.'
    },
    {
      name: 'أحمد سامى',
      text: 'الخدمة ممتازة جدا، أول ما يفتح التطبيق بلاقي عربية قريبة. والسواقين محترمين جدا. بقى التطبيق الأساسي في مشاويري اليومية.'
    }
  ];

  // Star rating component
  const StarRating = ({ isMobile }) => (
    <div style={{ display: 'flex', gap: isMobile ? '1px' : '2px', alignItems: 'center' }}>
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: '#FFD700', fontSize: isMobile ? '10px' : '12px' }}>★</span>
      ))}
    </div>
  );

  // Review card component
  const ReviewCard = ({ name, text, isMobile, isTablet, isPortrait }) => {
    // Calculate card width based on orientation
    const cardWidth = isMobile 
      ? (isPortrait ? '180px' : '160px') // Smaller in landscape to fit more
      : isTablet 
        ? 'calc(50% - 12px)' 
        : '200px';
    
    return (
    <div
      style={{
        flex: isMobile ? '0 0 auto' : '1',
        minWidth: cardWidth,
        maxWidth: isMobile ? cardWidth : isTablet ? 'calc(50% - 12px)' : '280px',
        padding: isMobile ? '10px' : '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '4px' : '8px',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <StarRating isMobile={isMobile} />
      <h3 style={{ fontWeight: 'bold', fontSize: isMobile ? '11px' : '14px', color: '#000', margin: 0 }}>
        {name}
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
      {isMobile && (
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
      )}
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
      {/* Logo */}
      <div 
        className="absolute top-8 left-8 z-30"
        style={{
          zIndex: 30,
          top: isMobile 
            ? (isPortrait ? '16px' : '10px') 
            : isTablet 
              ? (isPortrait ? '50px' : '25px') 
              : (isPortrait ? '32px' : '25px'),
          left: isMobile 
            ? (isPortrait ? '16px' : '10px') 
            : isTablet 
              ? (isPortrait ? '50px' : '25px') 
              : (isPortrait ? '32px' : '25px')
        }}
      >
        <img
          src="/WhatsApp Image 2025-12-07 at 4.42.22 PM 1.png"
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

        {/* Phone mockup on green section - left side */}
        <div 
          className={isMobile ? '' : 'absolute'}
          style={{
            position: isMobile ? 'relative' : 'absolute',
            left: isMobile 
              ? 'auto' 
              : isIPadPro 
                ? (isPortrait ? '60px' : '30px') 
                : isTablet 
                  ? (isPortrait ? '50px' : '20px') 
                  : (isPortrait ? '250px' : '220px'),
            top: isMobile ? 'auto' : '60%',
            transform: isMobile ? 'translateX(15px)' : 'translateY(calc(-50% - 20px))',
            zIndex: 25,
            width: isMobile 
              ? (isPortrait ? '130px' : '80px') 
              : isIPadPro 
                ? (isPortrait ? '180px' : '120px') 
                : isTablet 
                  ? (isPortrait ? '160px' : '110px') 
                  : '180px',
            height: 'auto',
            marginRight: isMobile 
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
                ? (isPortrait ? '130px' : '80px') 
                : isIPadPro 
                  ? (isPortrait ? '180px' : '120px') 
                  : isTablet 
                    ? (isPortrait ? '160px' : '110px') 
                    : '180px',
              height: isMobile 
                ? (isPortrait ? '260px' : '160px') 
                : isIPadPro 
                  ? (isPortrait ? '360px' : '240px') 
                  : isTablet 
                    ? (isPortrait ? '320px' : '220px') 
                    : '360px',
              backgroundColor: 'rgba(205, 179, 179, 0.3)',
              borderRadius: '15px',
              padding: '0',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              position: 'relative',
              border: '4px solid #e7e7e7',
              overflow: 'hidden',
              backgroundColor: 'rgba(253, 227, 229, 0.3)' // Removed striped background
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
              {/* Speech Bubble - في المنتصف */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: isMobile ? '4px' : '6px',
                  right: isMobile ? 'auto' : 'auto',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#ffffff',
                  borderRadius: '6px',
                  padding: isMobile ? '10px 14px' : '12px 16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 10,
                  width: isMobile ? 'calc(100% - 8px)' : 'calc(100% - 12px)',
                  maxWidth: isMobile ? 'calc(100% - 8px)' : 'calc(100% - 12px)',
                  minHeight: isMobile ? '60px' : '70px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? '4px' : '6px',
                  boxSizing: 'border-box'
                }}
              >
                {/* Name - في الأعلى */}
                <div
                  style={{
                    fontSize: isMobile ? '8px' : '10px',
                    color: '#333',
                    fontWeight: 'bold',
                    fontFamily: 'Tajawal, sans-serif',
                    textAlign: 'right',
                    direction: 'rtl',
                    margin: 0,
                    lineHeight: '1.2'
                  }}
                >
                  أحمد سامى
                </div>
                {/* Message - تحت الاسم */}
                <p
                  style={{
                    fontSize: isMobile ? '7px' : '9px',
                    color: '#333',
                    margin: 0,
                    lineHeight: '1.4',
                    fontFamily: 'Tajawal, sans-serif',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                >
                  الخدمة ممتازة جدا، أول ما يفتح التطبيق بلاقي عربية قريبة. والسواقين محترمين جدا.
                </p>
                {/* Speech bubble tail - يشير لأسفل */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: isMobile ? '15px' : '20px',
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '8px solid #ffffff'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right side content - text and download buttons - outside clipped div */}
        <div
          style={{
            position: isMobile ? 'relative' : 'absolute',
            top: isMobile ? 'auto' : isTablet ? '55%' : '50%',
            right: isMobile ? 'auto' : isTablet ? '24px' : '100px',
            left: isMobile ? 'auto' : 'auto',
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
            textAlign: isMobile ? 'right' : 'right',
            display: isMobile ? 'flex' : 'block',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'flex-start',
            justifyContent: isMobile ? 'center' : 'flex-start',
            overflow: isMobile ? 'visible' : 'visible'
          }}
        >
          <h1
            style={{
              fontSize: isMobile 
                ? (isPortrait ? '1.1rem' : '0.6rem') 
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
              overflowWrap: isMobile ? 'break-word' : 'normal'
            }}
          >
            وصّل مشاويرك بسهولة وامان   مع تطبيقنا 
          </h1>
          <p
            style={{
              fontSize: isMobile 
                ? (isPortrait ? '0.95rem' : '0.55rem') 
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
                : (isPortrait ? '0 0 32px 0' : '0 0 20px 0')
            }}
          >
            احجز مشوارك خلال ثواني، وتتبع الرحلة لحظة بلحظة، واستمتع بأسعار مناسبة وجودة خدمة عالية.
          </p>
          <p
            style={{
              fontSize: isMobile 
                ? (isPortrait ? '0.85rem' : '0.55rem') 
                : isIPadPro || isTablet
                  ? (isPortrait ? '1.05rem' : '0.75rem')
                  : (isPortrait ? '1rem' : '0.75rem'),
              color: 'white',
              marginBottom: isMobile 
                ? (isPortrait ? '12px' : '8px') 
                : (isPortrait ? '24px' : '16px'),
              fontWeight: '500',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              margin: isMobile 
                ? (isPortrait ? '0 0 12px 0' : '0 0 8px 0') 
                : (isPortrait ? '0 0 24px 0' : '0 0 16px 0'),
              textAlign: isMobile ? 'right' : 'right',
              alignSelf: isMobile ? 'flex-end' : 'auto'
            }}
          >
            قم بتنزيل تطبيقنا
          </p>
          <div style={{ 
            display: 'flex', 
            gap: isMobile 
              ? (isPortrait ? '6px' : '4px') 
              : (isPortrait ? '12px' : '8px'), 
            flexWrap: isTablet ? 'wrap' : 'nowrap', 
            alignItems: 'center',
            justifyContent: isMobile ? 'flex-end' : 'flex-end'
          }}>
            {/* App Store */}
            <a
              href="https://apps.apple.com/"
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
              href="https://play.google.com/store"
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
          </div>
        </div>
        </div>
        
        {/* Profile Picture - خارج clipped div - تظهر في جميع الأوضاع */}
        {true && (
          <div
            style={{
              position: 'absolute',
              bottom: isMobile
                ? 'calc(50% - 25px)'
                : isIPadPro 
                  ? (isPortrait ? 'calc(60% - 70px)' : 'calc(60% - 60px)') 
                  : isTablet 
                    ? (isPortrait ? 'calc(60% - 65px)' : 'calc(60% - 55px)') 
                    : (isPortrait ? 'calc(60% - 70px)' : 'calc(60% - 60px)'),
              left: isMobile
                ? (isLandscape ? 'calc(15px + 80px + 10px)' : 'auto')
                : isIPadPro 
                  ? (isPortrait ? 'calc(60px - 35px)' : 'calc(30px - 32px)') 
                  : isTablet 
                    ? (isPortrait ? 'calc(50px - 34px)' : 'calc(20px - 31px)') 
                    : (isPortrait ? 'calc(250px - 35px)' : 'calc(220px - 35px)'),
              width: isMobile ? '50px' : isIPadPro ? '70px' : isTablet ? '65px' : '80px',
              height: isMobile ? '50px' : isIPadPro ? '70px' : isTablet ? '65px' : '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              zIndex: 30,
              transform: isMobile ? (isLandscape ? 'translateY(50%)' : 'none') : 'translateY(50%)',
              display: 'block',
              backgroundColor: 'transparent'
            }}
          >
            <img
              src="/Ellipse 120.png"
              alt="أحمد سامى"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
        )}
      </div>

      {/* Reviews Section - positioned right after green section */}
      <div
        className={isMobile ? 'reviews-section' : ''}
        style={{
          position: 'absolute',
          top: isMobile ? 'calc(50vh + 60px)' : 'calc(50vh + 40px)',
          left: isMobile ? '0' : isTablet ? '-24px' : '-40px',
          right: isMobile ? '0' : isTablet ? '-24px' : '-40px',
          width: isMobile ? '100%' : isTablet ? 'calc(100% + 48px)' : 'calc(100% + 80px)',
          padding: isMobile ? '20px 16px' : isTablet ? '20px 24px' : '24px 40px',
          marginTop: isMobile ? '0' : '0',
          marginBottom: isMobile ? '40px' : '0',
          zIndex: 15,
          display: 'flex',
          gap: isMobile ? '8px' : '16px',
          justifyContent: isMobile ? 'flex-start' : 'center',
          alignItems: 'flex-start',
          flexWrap: isMobile ? 'nowrap' : 'wrap', // Keep side by side on mobile (both portrait and landscape)
          overflowX: isMobile ? 'auto' : 'visible', // Allow horizontal scrolling on mobile
          overflowY: 'visible',
          maxWidth: isMobile ? '100%' : 'none',
          WebkitOverflowScrolling: isMobile ? 'touch' : 'auto',
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        {reviews.map((review, index) => (
          <ReviewCard key={index} name={review.name} text={review.text} isMobile={isMobile} isTablet={isTablet} isPortrait={isPortrait} />
        ))}
      </div>

      {/* Green Dots Below Reviews */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 flex z-15" 
        style={{ 
          position: 'absolute',
          top: isMobile ? 'calc(50vh + 280px)' : isTablet ? 'calc(50vh + 320px)' : 'calc(50vh + 290px)',
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
          top: isMobile ? 'calc(50vh + 360px)' : 'calc(50vh + 340px)',
          left: isMobile ? '-16px' : isTablet ? '-24px' : '-40px',
          right: isMobile ? '-16px' : isTablet ? '-24px' : '-40px',
          width: isMobile ? 'calc(100% + 32px)' : isTablet ? 'calc(100% + 48px)' : 'calc(100% + 80px)',
          padding: isMobile ? '20px' : isTablet ? '30px' : '40px',
          marginBottom: isMobile ? '0' : '0',
          zIndex: 15,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '12px' : isTablet ? '30px' : '60px', // Increased gap for desktop to separate features from phone
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
              alignItems: 'flex-end',
              order: 1
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
                    alignItems: 'flex-end',
                    textAlign: 'right',
                    maxWidth: '280px'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '4px', color: '#000' }}>
                    {React.createElement(feature.icon)}
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '16px', color: '#000', margin: 0 }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', margin: 0 }}>
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
              gap: '12px',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              order: 1
            }}
          >
            {/* Top row: Left top feature - طرق الدفع */}
            {features
              .filter(f => f.side === 'left' && f.position === 'top')
              .map((feature, index) => (
                <div
                  key={`left-top-${index}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    alignItems: 'center',
                    textAlign: 'center',
                    gridColumn: '1',
                    gridRow: '1'
                  }}
                >
                  <div style={{ fontSize: '22px', marginBottom: '2px', color: '#000' }}>
                    {React.createElement(feature.icon)}
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '11px', color: '#000', margin: 0, lineHeight: '1.2' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '9px', color: '#666', lineHeight: '1.3', margin: 0 }}>
                    {feature.description}
                  </p>
                </div>
              ))}

            {/* Phone mockup in center - spans both rows */}
            <div
              style={{
                width: '140px',
                height: '280px',
                backgroundColor: '#4a4a4a',
                borderRadius: '30px',
                padding: '5px',
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
              .filter(f => f.side === 'right' && f.position === 'top')
              .map((feature, index) => (
                <div
                  key={`right-top-${index}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    alignItems: 'center',
                    textAlign: 'center',
                    gridColumn: '3',
                    gridRow: '1'
                  }}
                >
                  <div style={{ fontSize: '22px', marginBottom: '2px', color: '#000' }}>
                    {React.createElement(feature.icon)}
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '11px', color: '#000', margin: 0, lineHeight: '1.2' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '9px', color: '#666', lineHeight: '1.3', margin: 0 }}>
                    {feature.description}
                  </p>
                </div>
              ))}

            {/* Bottom row: Left bottom feature - حجز سريع */}
            {features
              .filter(f => f.side === 'left' && f.position === 'bottom')
              .map((feature, index) => (
                <div
                  key={`left-bottom-${index}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    alignItems: 'center',
                    textAlign: 'center',
                    gridColumn: '1',
                    gridRow: '2'
                  }}
                >
                  <div style={{ fontSize: '22px', marginBottom: '2px', color: '#000' }}>
                    {React.createElement(feature.icon)}
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '11px', color: '#000', margin: 0, lineHeight: '1.2' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '9px', color: '#666', lineHeight: '1.3', margin: 0 }}>
                    {feature.description}
                  </p>
                </div>
              ))}

            {/* Bottom row: Right bottom feature - الأمان */}
            {features
              .filter(f => f.side === 'right' && f.position === 'bottom')
              .map((feature, index) => (
                <div
                  key={`right-bottom-${index}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    alignItems: 'center',
                    textAlign: 'center',
                    gridColumn: '3',
                    gridRow: '2'
                  }}
                >
                  <div style={{ fontSize: '22px', marginBottom: '2px', color: '#000' }}>
                    {React.createElement(feature.icon)}
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '11px', color: '#000', margin: 0, lineHeight: '1.2' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '9px', color: '#666', lineHeight: '1.3', margin: 0 }}>
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
              alignItems: 'flex-end',
              order: 3
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
                    alignItems: 'flex-end',
                    textAlign: 'right',
                    maxWidth: '280px'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '4px', color: '#000' }}>
                    {React.createElement(feature.icon)}
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '16px', color: '#000', margin: 0 }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', margin: 0 }}>
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
          top: isMobile ? 'calc(50vh + 720px)' : isTablet ? 'calc(50vh + 820px)' : 'calc(50vh + 820px)',
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
          src="/Frame 34235.png"
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
              left: isMobile ? '5px' : '10px',
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
            <FaChevronLeft style={{ fontSize: isMobile ? '12px' : '20px', color: '#333', fontWeight: 'bold' }} />
          </button>

          {/* Carousel Container */}
          <div
            style={{
              display: 'flex',
              transform: `translateX(calc(-${currentSlide} * (${carouselPhoneSize.width} + ${carouselPhoneSize.gap}) + 0px))`,
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              gap: carouselPhoneSize.gap,
              width: 'fit-content',
              justifyContent: 'flex-start',
              alignItems: 'center',
              willChange: 'transform',
              paddingLeft: '0px'
            }}
          >
            {phoneMockups.map((phone, index) => {
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
                  {/* Status Bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: isMobile ? '10px' : '0',
                      left: '0',
                      right: '0',
                      height: '24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0 12px',
                      zIndex: 15,
                      backgroundColor: 'transparent'
                    }}
                  >
                    {/* Left side - Time */}
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#000',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
                      }}
                    >
                      9:41
                    </div>
                    
                    {/* Right side - Signal, WiFi, Battery */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {/* Signal bars */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1px', height: '10px' }}>
                        <div style={{ width: '2px', height: '4px', backgroundColor: '#000', borderRadius: '0.5px' }}></div>
                        <div style={{ width: '2px', height: '6px', backgroundColor: '#000', borderRadius: '0.5px' }}></div>
                        <div style={{ width: '2px', height: '8px', backgroundColor: '#000', borderRadius: '0.5px' }}></div>
                        <div style={{ width: '2px', height: '10px', backgroundColor: '#000', borderRadius: '0.5px' }}></div>
                      </div>
                      
                      {/* WiFi icon */}
                      <div style={{ width: '12px', height: '10px', position: 'relative' }}>
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" style={{ position: 'absolute', top: 0, left: 0 }}>
                          <path d="M6 0C3.5 0 1.5 1.5 0 3L6 9L12 3C10.5 1.5 8.5 0 6 0Z" fill="#000"/>
                          <path d="M6 3C4.5 3 3.5 4 3 5L6 8L9 5C8.5 4 7.5 3 6 3Z" fill="#000"/>
                          <circle cx="6" cy="6" r="1" fill="#000"/>
                        </svg>
                      </div>
                      
                      {/* Battery icon */}
                      <div style={{ width: '18px', height: '10px', position: 'relative' }}>
                        <div
                          style={{
                            width: '16px',
                            height: '8px',
                            border: 'none',
                            borderRadius: '1px',
                            position: 'absolute',
                            top: '1px',
                            left: '0'
                          }}
                        >
                          <div
                            style={{
                              width: '12px',
                              height: '6px',
                              backgroundColor: '#000',
                              borderRadius: '0.5px',
                              position: 'absolute',
                              top: '0.5px',
                              left: '0.5px'
                            }}
                          />
                        </div>
                        <div
                          style={{
                            width: '1px',
                            height: '4px',
                            backgroundColor: '#000',
                            borderRadius: '0 1px 1px 0',
                            position: 'absolute',
                            top: '3px',
                            right: '0'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
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
              right: isMobile ? '5px' : '10px',
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
            <FaChevronRight style={{ fontSize: isMobile ? '12px' : '20px', color: '#333', fontWeight: 'bold' }} />
          </button>
      </div>
      </div>

      {/* Footer Section - Logo and Contact */}
      <div
        style={{
          position: 'absolute',
          top: isMobile ? 'calc(50vh + 1120px)' : isTablet ? 'calc(50vh + 1290px)' : 'calc(50vh + 1290px)',
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
              src="/WhatsApp Image 2025-12-07 at 4.42.22 PM 1.png"
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
         . تطبيق نقل ذكي يسهل عليك مشاويرك اليومية بخدمة آمنة، سريعة، ومريحة في أي وقت
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
          اتصل بنا
        </button>

        {/* Social Media Icons */}
        <div
          style={{
            display: 'flex',
            gap: isMobile ? '12px' : '16px',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: isMobile ? '16px' : '20px'
          }}
        >
          {/* Facebook */}
          <div
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
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' // Shadow for better visibility
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FiFacebook style={{ fontSize: '16px', color: '#000' }} />
          </div>

          {/* Email/Message */}
          <div
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
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' // Shadow for better visibility
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <HiOutlineMail style={{ fontSize: isMobile ? '14px' : '16px', color: '#000' }} />
          </div>

          {/* Location */}
          <div
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
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' // Shadow for better visibility
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <HiOutlineLocationMarker style={{ fontSize: isMobile ? '14px' : '16px', color: '#000' }} />
          </div>

          {/* Telegram */}
          <div
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
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' // Shadow for better visibility
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <PiTelegramLogoLight style={{ fontSize: isMobile ? '14px' : '16px', color: '#000' }} />
          </div>

          {/* Instagram */}
          <div
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
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' // Shadow for better visibility
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <BiLogoInstagram style={{ fontSize: isMobile ? '14px' : '16px', color: '#000' }} />
          </div>
        </div>
      </div>

      {/* Bottom Image Section */}
      <div
        style={{
          position: 'absolute',
          top: isMobile 
            ? 'calc(50vh + 1350px - 120px)' 
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
          alignItems: 'center'
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
                textAlign: isMobile ? 'center' : isTablet ? 'right' : isIPadPro ? 'right' : 'right'
              }}
            >
              2025 جميع الحقوق محفوظة لتطبيقنا للنقل
            </p>
          </div>
        </div>
      </div>

      </div>
    </div>
    </>
  );
};

export default Home;

