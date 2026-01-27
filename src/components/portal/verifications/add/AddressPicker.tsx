import { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Input } from '@components/3rdparty/ui/input';
import { cn } from '@lib/utils';
import { AddressDetails } from './models';

interface AddressPickerProps {
  value: string;
  onChange: (address: AddressDetails) => void;
  error?: string;
  placeholder?: string;
}

// Mock Nigerian addresses for autocomplete simulation
const mockAddresses: AddressDetails[] = [
  {
    address: '15 Admiralty Way, Lekki Phase 1',
    formattedAddress: '15 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
    state: 'lagos',
    lga: 'eti-osa',
    coordinates: { lat: 6.4281, lng: 3.4219 },
  },
  {
    address: '25 Adeola Odeku Street, Victoria Island',
    formattedAddress: '25 Adeola Odeku Street, Victoria Island, Lagos, Nigeria',
    state: 'lagos',
    lga: 'eti-osa',
    coordinates: { lat: 6.4276, lng: 3.4225 },
  },
  {
    address: 'Plot 1234, Cadastral Zone B06, Mabushi',
    formattedAddress: 'Plot 1234, Cadastral Zone B06, Mabushi, Abuja, Nigeria',
    state: 'fct',
    lga: 'abuja-municipal',
    coordinates: { lat: 9.0833, lng: 7.4833 },
  },
  {
    address: '10 Isaac John Street, Ikeja GRA',
    formattedAddress: '10 Isaac John Street, Ikeja GRA, Lagos, Nigeria',
    state: 'lagos',
    lga: 'ikeja',
    coordinates: { lat: 6.5833, lng: 3.3500 },
  },
  {
    address: 'Block 5, Eleranigbe Layout, Ibeju-Lekki',
    formattedAddress: 'Block 5, Eleranigbe Layout, Ibeju-Lekki, Lagos, Nigeria',
    state: 'lagos',
    lga: 'ibeju-lekki',
    coordinates: { lat: 6.4500, lng: 3.7500 },
  },
  {
    address: '45 Trans Amadi Industrial Layout',
    formattedAddress: '45 Trans Amadi Industrial Layout, Port Harcourt, Rivers, Nigeria',
    state: 'rivers',
    lga: 'obio-akpor',
    coordinates: { lat: 4.8156, lng: 7.0498 },
  },
  {
    address: '22 Awolowo Road, Ikoyi',
    formattedAddress: '22 Awolowo Road, Ikoyi, Lagos, Nigeria',
    state: 'lagos',
    lga: 'eti-osa',
    coordinates: { lat: 6.4541, lng: 3.4341 },
  },
  {
    address: 'Plot 789, Wuse Zone 5',
    formattedAddress: 'Plot 789, Wuse Zone 5, Abuja, Nigeria',
    state: 'fct',
    lga: 'abuja-municipal',
    coordinates: { lat: 9.0765, lng: 7.4892 },
  },
];

export function AddressPicker({ value, onChange, error, placeholder }: AddressPickerProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressDetails[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    
    if (query.length >= 3) {
      setIsLoading(true);
      setIsOpen(true);
      
      // Simulate API delay
      setTimeout(() => {
        const filtered = mockAddresses.filter(addr =>
          addr.address.toLowerCase().includes(query.toLowerCase()) ||
          addr.formattedAddress.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
        setIsLoading(false);
      }, 300);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelectAddress = (address: AddressDetails) => {
    setInputValue(address.address);
    onChange(address);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleInputBlur = () => {
    // If user typed something but didn't select, create a partial address
    setTimeout(() => {
      if (inputValue && inputValue !== value) {
        onChange({
          address: inputValue,
          formattedAddress: inputValue,
        });
      }
    }, 200);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onBlur={handleInputBlur}
          placeholder={placeholder || "Start typing an address..."}
          className={cn("pl-10", error && "border-destructive")}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
        >
          {suggestions.map((address, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectAddress(address)}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-start gap-3"
            >
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{address.address}</p>
                <p className="text-xs text-muted-foreground">{address.formattedAddress}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && !isLoading && suggestions.length === 0 && inputValue.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">No addresses found. You can enter the address manually.</p>
        </div>
      )}

      <p className="mt-1.5 text-xs text-muted-foreground">
        🇳🇬 Search restricted to Nigeria. Start typing to see suggestions.
      </p>
    </div>
  );
}
