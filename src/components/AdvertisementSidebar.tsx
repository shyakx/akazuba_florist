import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

type AdvertisementSidebarProps = {
  imagePath: string;
  enabled?: boolean;
  storageKey?: string;
};

export default function AdvertisementSidebar({ 
  imagePath, 
  enabled = true,
  storageKey = 'advertisement-sidebar-dismissed'
}: AdvertisementSidebarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      return;
    }

    // Check if sidebar was dismissed in this session
    const dismissed = sessionStorage.getItem(storageKey);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, [enabled, storageKey]);

  const handleClose = () => {
    setIsVisible(false);
    // Remember dismissal for this session
    sessionStorage.setItem(storageKey, 'true');
  };

  if (!isVisible) return null;

  return (
    <aside className="w-80 flex-shrink-0">
      <div className="sticky top-24">
        <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md transition-all hover:scale-110"
            aria-label="Close advertisement"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>

          {/* Image Container */}
          <div className="w-full">
            <img
              src={imagePath}
              alt="Special Offer Announcement"
              className="w-full h-auto object-contain"
              onError={() => {
                handleClose();
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

