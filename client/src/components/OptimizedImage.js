import React, { useState, useRef, useEffect } from 'react';

/**
 * Mobile-Optimized Image Component with Lazy Loading
 * Supports responsive images, WebP format, and accessibility
 */

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  loadingClassName = 'skeleton',
  errorClassName = 'bg-slate-200',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, isInView]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  // Generate responsive src set for different screen densities
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc) return '';
    
    const extension = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(`.${extension}`, '');
    
    return [
      `${baseName}.${extension} 1x`,
      `${baseName}@2x.${extension} 2x`,
      `${baseName}@3x.${extension} 3x`
    ].join(', ');
  };

  // Create WebP sources for modern browsers
  const webpSrc = src ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp') : null;

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {!isInView && !priority && (
        <div 
          className={`absolute inset-0 ${loadingClassName}`}
          style={{ width, height }}
          aria-hidden="true"
        />
      )}

      {(isInView || priority) && (
        <picture className="block w-full h-full">
          {/* WebP source for modern browsers */}
          {webpSrc && (
            <source
              srcSet={generateSrcSet(webpSrc)}
              sizes={sizes}
              type="image/webp"
            />
          )}
          
          {/* Fallback image */}
          <img
            src={src}
            srcSet={generateSrcSet(src)}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            className={`
              w-full h-full object-cover transition-opacity duration-300
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
              ${hasError ? errorClassName : ''}
            `}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...props}
          />

          {/* Loading placeholder */}
          {!isLoaded && !hasError && (
            <div 
              className={`absolute inset-0 ${loadingClassName}`}
              aria-hidden="true"
            />
          )}

          {/* Error state */}
          {hasError && (
            <div className={`absolute inset-0 flex items-center justify-center ${errorClassName}`}>
              <div className="text-center">
                <svg 
                  className="w-8 h-8 text-slate-400 mx-auto mb-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <p className="text-xs text-slate-500">Image unavailable</p>
              </div>
            </div>
          )}
        </picture>
      )}
    </div>
  );
};

/**
 * Avatar component with fallback to initials
 */
export const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg'
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  };

  return (
    <div className={`relative rounded-full overflow-hidden bg-slate-200 flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {src && !hasError ? (
        <OptimizedImage
          src={src}
          alt={alt || `${name}'s avatar`}
          className="absolute inset-0"
          onError={() => setHasError(true)}
          priority={true}
          {...props}
        />
      ) : (
        <span className="font-semibold text-slate-600" aria-hidden="true">
          {getInitials(name || alt)}
        </span>
      )}
    </div>
  );
};

/**
 * Logo component with brand recognition optimization
 */
export const Logo = ({
  src,
  alt,
  width = 120,
  height = 40,
  className = '',
  fallbackText = 'StartupNamer.org',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`flex items-center ${className}`}>
      {src && !hasError ? (
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="object-contain"
          onError={() => setHasError(true)}
          priority={true}
          {...props}
        />
      ) : (
        <div 
          className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          style={{ width, height, display: 'flex', alignItems: 'center' }}
        >
          {fallbackText}
        </div>
      )}
    </div>
  );
};

/**
 * Hero image with multiple breakpoints
 */
export const HeroImage = ({
  src,
  mobileSrc,
  tabletSrc,
  alt,
  className = '',
  ...props
}) => {
  return (
    <picture className={`block w-full ${className}`}>
      {/* Mobile */}
      <source
        media="(max-width: 768px)"
        srcSet={mobileSrc || src}
        type="image/webp"
      />
      
      {/* Tablet */}
      <source
        media="(max-width: 1024px)"
        srcSet={tabletSrc || src}
        type="image/webp"
      />
      
      {/* Desktop WebP */}
      <source
        srcSet={src?.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
        type="image/webp"
      />
      
      {/* Fallback */}
      <OptimizedImage
        src={src}
        alt={alt}
        className="w-full h-auto"
        priority={true}
        {...props}
      />
    </picture>
  );
};

/**
 * Gallery component with optimized grid layout
 */
export const ImageGallery = ({
  images = [],
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  className = '',
  onImageClick
}) => {
  const gridClasses = `grid gap-${gap} grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;

  return (
    <div className={`${gridClasses} ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative cursor-pointer group"
          onClick={() => onImageClick && onImageClick(image, index)}
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            className="aspect-square rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-200"
            loadingClassName="skeleton aspect-square rounded-lg"
          />
          {image.caption && (
            <p className="text-sm text-slate-600 mt-2 text-center">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Responsive background image component
 */
export const BackgroundImage = ({
  src,
  mobileSrc,
  alt = '',
  children,
  className = '',
  overlay = false,
  overlayOpacity = 0.5,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);

  useEffect(() => {
    const updateSrc = () => {
      const width = window.innerWidth;
      if (width <= 768 && mobileSrc) {
        setCurrentSrc(mobileSrc);
      } else {
        setCurrentSrc(src);
      }
    };

    updateSrc();
    window.addEventListener('resize', updateSrc);
    return () => window.removeEventListener('resize', updateSrc);
  }, [src, mobileSrc]);

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {/* Background image */}
      {currentSrc && (
        <>
          <img
            src={currentSrc}
            alt={alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
            loading="eager"
          />
          
          {/* Loading placeholder */}
          {!isLoaded && (
            <div className="absolute inset-0 skeleton" aria-hidden="true" />
          )}
        </>
      )}

      {/* Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default OptimizedImage;