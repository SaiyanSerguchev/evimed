import React from 'react';
import './ContactSection.css';
import contactsMap from '../assets/images/contacts/contactsmap.png';
import { useRef, useState, useEffect } from 'react';

const ContactSection = () => {
  const kicker = 'Адреса и контакты';
  const title = 'Свяжитесь с нами';
  const description = 'Широкая сеть наших центров диагностики охватывает всю страну и постоянно растёт. Мы стараемся быть ближе к вам.';
  const phone = '+7 (495) 492-43-40';
  const email = 'info@axiomaykt.ru';

  // Data state
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Yandex Maps state
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [geocodedBranches, setGeocodedBranches] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [yandexMapsLoaded, setYandexMapsLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapContainerRef = useRef(null);

  const API_BASE = process.env.REACT_APP_API_URL || '/api';
  const YANDEX_API_KEY = process.env.REACT_APP_YANDEX_MAPS_API_KEY || '';

  // Load Yandex Maps API
  useEffect(() => {
    if (window.ymaps) {
      window.ymaps.ready(() => {
        setYandexMapsLoaded(true);
      });
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.ymaps) {
          window.ymaps.ready(() => {
            setYandexMapsLoaded(true);
          });
        }
      });
      return;
    }

    const script = document.createElement('script');
    const apiKeyParam = YANDEX_API_KEY ? `apikey=${YANDEX_API_KEY}&` : '';
    script.src = `https://api-maps.yandex.ru/2.1/?${apiKeyParam}lang=ru_RU`;
    script.async = true;
    script.onload = () => {
      if (window.ymaps) {
        window.ymaps.ready(() => {
          setYandexMapsLoaded(true);
        });
      } else {
        console.error('Yandex Maps API не загрузился');
        setMapError(true);
        setMapLoading(false);
      }
    };
    script.onerror = () => {
      console.error('Ошибка загрузки Yandex Maps API');
      setMapError(true);
      setMapLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup to avoid reloading
    };
  }, [YANDEX_API_KEY]);

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const response = await fetch(`${API_BASE}/branches`);
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Ошибка загрузки филиалов:', error);
      // Fallback к статичным данным
      setBranches([
        { id: 1, title: 'Головной центр рентгено-диагностики', address: 'Якутск, пр. Ленина 1, этаж 7, офис 721' },
        { id: 2, title: 'Филиал на Кирова', address: 'Якутск, пр. Кирова 28, этаж 1, офис 101' },
        { id: 3, title: 'Филиал на Автодорожной', address: 'Якутск, ул. Автодорожная 15, этаж 2, офис 201' },
        { id: 4, title: 'Филиал на Промышленной', address: 'Якутск, ул. Промышленная 8, этаж 3, офис 301' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simple text contacts
  const contactText = {
    phone,
    email
  };

  const [isDragging, setIsDragging] = useState(false);
  const [activeBranch, setActiveBranch] = useState(0); // Track active branch index
  const listRef = useRef(null);

  // Обработчики
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // только левая кнопка мыши
    setIsDragging(true);
    listRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    listRef.current.scrollTop -= e.movementY;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    listRef.current.style.cursor = 'grab';
  };

  // Geocoding function with caching
  const geocodeAddress = async (address) => {
    const cacheKey = `geocode_${address}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }

    if (!window.ymaps) return null;

    return new Promise((resolve) => {
      window.ymaps.ready(() => {
        try {
          window.ymaps.geocode(address).then((result) => {
            const firstGeoObject = result.geoObjects.get(0);
            if (firstGeoObject) {
              const coordinates = firstGeoObject.geometry.getCoordinates();
              const data = { coordinates, address: firstGeoObject.getAddressLine() };
              localStorage.setItem(cacheKey, JSON.stringify(data));
              resolve(data);
            } else {
              resolve(null);
            }
          }).catch((error) => {
            console.error(`Ошибка геокодирования адреса ${address}:`, error);
            resolve(null);
          });
        } catch (error) {
          console.error(`Ошибка геокодирования адреса ${address}:`, error);
          resolve(null);
        }
      });
    });
  };

  // Geocode all branches
  useEffect(() => {
    if (!yandexMapsLoaded || !branches.length) return;

    const geocodeBranches = async () => {
      try {
        const geocoded = await Promise.all(
          branches.map(async (branch) => {
            try {
              const geocoded = await geocodeAddress(branch.address);
              return {
                ...branch,
                coordinates: geocoded?.coordinates || null,
                geocodedAddress: geocoded?.address || branch.address
              };
            } catch (error) {
              console.warn(`Не удалось геокодировать адрес: ${branch.address}`, error);
              return {
                ...branch,
                coordinates: null,
                geocodedAddress: branch.address
              };
            }
          })
        );
        const validBranches = geocoded.filter(b => b.coordinates !== null);
        setGeocodedBranches(validBranches);
        
        // If no branches were geocoded, show error
        if (validBranches.length === 0 && geocoded.length > 0) {
          console.warn('Не удалось геокодировать ни один адрес');
        }
      } catch (error) {
        console.error('Ошибка при геокодировании филиалов:', error);
        setMapError(true);
      }
    };

    geocodeBranches();
  }, [yandexMapsLoaded, branches]);

  // Initialize map
  useEffect(() => {
    if (!yandexMapsLoaded || !mapContainerRef.current || mapInstance) return;
    if (!geocodedBranches.length) return;

    window.ymaps.ready(() => {
      try {
        // Default center: Yakutsk
        const defaultCenter = [62.0278, 129.7325];
        const center = geocodedBranches[0]?.coordinates || defaultCenter;

        const map = new window.ymaps.Map(mapContainerRef.current, {
          center: center,
          zoom: 12,
          controls: ['zoomControl', 'fullscreenControl'],
          behaviors: ['default', 'scrollZoom', 'dblClickZoom', 'drag', 'multiTouch']
        });

        setMapInstance(map);
        setMapLoading(false);
      } catch (error) {
        console.error('Ошибка инициализации карты:', error);
        setMapError(true);
        setMapLoading(false);
      }
    });
  }, [yandexMapsLoaded, geocodedBranches, mapInstance]);

  // Create markers
  useEffect(() => {
    if (!mapInstance || !geocodedBranches.length) return;

    window.ymaps.ready(() => {
      // Clear existing markers
      if (markers.length > 0) {
        markers.forEach(marker => {
          mapInstance.geoObjects.remove(marker.placemark);
        });
        setMarkers([]);
      }

      const newMarkers = geocodedBranches.map((branch, index) => {
        const placemark = new window.ymaps.Placemark(
          branch.coordinates,
          {
            balloonContentHeader: branch.title,
            balloonContentBody: `
              <div style="padding: 8px 0;">
                <div style="margin-bottom: 8px;"><strong>${branch.address}</strong></div>
                ${branch.phone ? `<div style="margin-bottom: 4px;"><a href="tel:${branch.phone.replace(/\s/g, '')}">${branch.phone}</a></div>` : ''}
                ${branch.email ? `<div style="margin-bottom: 4px;"><a href="mailto:${branch.email}">${branch.email}</a></div>` : ''}
                ${branch.workingHours ? `<div style="margin-bottom: 8px; color: #666;">${branch.workingHours}</div>` : ''}
                <div style="margin-top: 8px;">
                  ${branch.phone ? `<a href="tel:${branch.phone.replace(/\s/g, '')}" style="margin-right: 8px; color: #14488C;">Позвонить</a>` : ''}
                  ${branch.email ? `<a href="mailto:${branch.email}" style="margin-right: 8px; color: #14488C;">Написать</a>` : ''}
                  <a href="https://yandex.ru/maps/?pt=${branch.coordinates[1]},${branch.coordinates[0]}&z=15" target="_blank" style="color: #14488C;">Построить маршрут</a>
                </div>
              </div>
            `,
            hintContent: branch.title
          },
          {
            preset: 'islands#blueMedicalIcon'
          }
        );

        placemark.events.add('click', () => {
          const branchIndex = branches.findIndex(b => b.id === branch.id);
          if (branchIndex !== -1) {
            setActiveBranch(branchIndex);
          }
        });

        mapInstance.geoObjects.add(placemark);
        return { placemark, branchIndex: index, branchId: branch.id };
      });

      setMarkers(newMarkers);

      // Auto-fit bounds to show all markers
      if (newMarkers.length > 0) {
        const bounds = mapInstance.geoObjects.getBounds();
        if (bounds) {
          mapInstance.setBounds(bounds, { duration: 300, checkZoomRange: true });
        }
      }
    });
  }, [mapInstance, geocodedBranches, branches]);

  // Sync active branch with map
  useEffect(() => {
    if (!mapInstance || !markers.length || activeBranch === null) return;

    const activeBranchData = branches[activeBranch];
    if (!activeBranchData) return;

    const marker = markers.find(m => m.branchId === activeBranchData.id);
    if (marker) {
      mapInstance.setCenter(marker.placemark.geometry.getCoordinates(), 15, { duration: 300 });
      marker.placemark.balloon.open();
    }
  }, [activeBranch, mapInstance, markers, branches]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstance) {
        mapInstance.destroy();
      }
    };
  }, [mapInstance]);

  return (
    <section className="contact-section" id="contacts">
      <div className="contact-container">
        <div className="contact-header">
          <div className="contact-kicker">{kicker}</div>
          <h2 className="contact-title">{title}          
            <div className="title-line"></div>
          </h2>
          <p className="contact-description">{description}</p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-details">
              <div className="contact-lines">
                <a href="tel:+74954924340" className="contact-line">{contactText.phone}</a>
                <a href="mailto:info@axiomaykt.ru" className="contact-line">{contactText.email}</a>
              </div>
            </div>
              <div className="contact-branches">
                <div className="branches-title-row">
                  <h3 className="branches-title">Адреса</h3>
                  <div className="branches-title-divider" aria-hidden></div>
                </div>
                <ul ref={listRef} className="branches-list"   
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}>
                  {loading ? (
                    <li className="branch-item loading">
                      <div className="branch-content">
                        <div className="branch-name">Загрузка филиалов...</div>
                      </div>
                    </li>
                  ) : (
                    branches.map((branch, i) => (
                      <li 
                        className={`branch-item ${i === activeBranch ? 'active' : ''}`} 
                        key={branch.id || i}
                        onClick={() => setActiveBranch(i)}>
                        <div className="branch-content">
                          <div className="branch-name">{branch.title}</div>
                          <div className="branch-address">{branch.address}</div>
                          {branch.workingHours && (
                            <div className="branch-hours">{branch.workingHours}</div>
                          )}
                        </div>
                      <div className="branch-actions">
                        <button 
                          className="branch-action branch-action-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            const geocodedBranch = geocodedBranches.find(b => b.id === branch.id);
                            if (geocodedBranch && geocodedBranch.coordinates) {
                              const [lat, lon] = geocodedBranch.coordinates;
                              window.open(`https://yandex.ru/maps/?pt=${lon},${lat}&z=15`, '_blank');
                            } else {
                              // Fallback: открыть Yandex Maps с адресом
                              const encodedAddress = encodeURIComponent(branch.address);
                              window.open(`https://yandex.ru/maps/?text=${encodedAddress}`, '_blank');
                            }
                          }}
                          title="Построить маршрут"
                        >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.333 1.5C13.5296 1.5 14.5 2.47038 14.5 3.66699C14.4998 4.69125 13.7883 5.54664 12.833 5.77246V11.835C12.8329 13.3068 11.6399 14.5 10.168 14.5C8.69609 14.4999 7.50305 13.3068 7.50293 11.835V4.16797C7.50288 3.24683 6.75604 2.50012 5.83496 2.5C4.91374 2.5 4.16705 3.24676 4.16699 4.16797V10.2266C5.12208 10.4525 5.83286 11.3089 5.83301 12.333C5.83301 13.5295 4.86345 14.4998 3.66699 14.5C2.47038 14.5 1.5 13.5296 1.5 12.333C1.50015 11.3087 2.21159 10.4523 3.16699 10.2266V4.16797C3.16705 2.69448 4.36145 1.5 5.83496 1.5C7.30834 1.50012 8.50288 2.69456 8.50293 4.16797V11.835C8.50305 12.7545 9.24836 13.4999 10.168 13.5C11.0876 13.5 11.8329 12.7545 11.833 11.835V5.77246C10.878 5.54641 10.1671 4.69103 10.167 3.66699C10.167 2.47048 11.1365 1.50018 12.333 1.5ZM3.66699 11.167C3.02277 11.167 2.50018 11.6888 2.5 12.333C2.5 12.9773 3.02266 13.5 3.66699 13.5C4.31117 13.4998 4.83301 12.9772 4.83301 12.333C4.83283 11.6889 4.31106 11.1672 3.66699 11.167ZM12.333 2.5C11.6888 2.50018 11.167 3.02277 11.167 3.66699C11.1672 4.31106 11.6889 4.83283 12.333 4.83301C12.9772 4.83301 13.4998 4.31117 13.5 3.66699C13.5 3.02266 12.9773 2.5 12.333 2.5Z" fill="#14488C" fillOpacity="0.92"/>
</svg>
                        </button>
                      </div>
                    </li>
                    ))
                  )}
                </ul>
              </div>
          </div>
        </div>
      </div>
      <div className="contact-map" role="img" aria-label="Карта филиалов">
        {mapError || (!yandexMapsLoaded && !mapLoading && geocodedBranches.length === 0) ? (
          <img src={contactsMap} alt="Карта филиалов" />
        ) : (
          <div 
            ref={mapContainerRef} 
            id="yandex-map" 
            className="yandex-map-container"
          >
            {mapLoading && !mapInstance && (
              <div className="map-loading">
                Загрузка карты...
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
