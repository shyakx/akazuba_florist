import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { getBusinessStatus, getBusinessHoursString } from '../lib/businessHours';

export default function BusinessStatus() {
  const [status, setStatus] = useState(getBusinessStatus());

  useEffect(() => {
    // Update status every minute
    const interval = setInterval(() => {
      setStatus(getBusinessStatus());
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {status.isOpen ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
      <div className="text-sm">
        <div className={`font-medium ${status.isOpen ? 'text-green-600' : 'text-red-600'}`}>
          {status.isOpen ? 'Open Now' : 'Closed'}
        </div>
        <div className="text-gray-500 text-xs">
          {getBusinessHoursString()}
        </div>
        {!status.isOpen && status.nextOpenTime && (
          <div className="text-gray-500 text-xs">
            Opens at {status.nextOpenTime}
          </div>
        )}
        {status.isOpen && status.nextCloseTime && (
          <div className="text-gray-500 text-xs">
            Closes at {status.nextCloseTime}
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for footer
export function BusinessStatusCompact() {
  const [status, setStatus] = useState(getBusinessStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getBusinessStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {status.isOpen ? (
        <CheckCircle className="w-3 h-3 text-green-500" />
      ) : (
        <XCircle className="w-3 h-3 text-red-500" />
      )}
      <span className={`text-xs font-medium ${status.isOpen ? 'text-green-400' : 'text-red-400'}`}>
        {status.isOpen ? 'Open' : 'Closed'}
      </span>
    </div>
  );
}
