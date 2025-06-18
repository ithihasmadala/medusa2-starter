import { StyledTextField } from '@app/components/common/remix-hook-form/forms/fields/StyledTextField';
import { CountrySelect } from '@app/components/common/remix-hook-form/forms/inputs/CountrySelect';
import type { StoreRegionCountry } from '@medusajs/types';
import { FieldLabel } from '@app/components/common/forms/fields/FieldLabel';
import { GooglePlacesAutocompleteInput } from '@app/components/common/forms/inputs/GooglePlacesAutocomplete';
import { useMemo } from 'react';

interface AddressFormProps {
  prefix: string;
  countries: StoreRegionCountry[];
}

export const AddressForm = ({ prefix, countries }: AddressFormProps) => {
  // Check if Google Maps API key is available
  const hasGoogleMapsApiKey = useMemo(() => {
    // This is a simple check - you might want to improve this based on how your app detects API key availability
    try {
      const googleMapsElement = document.querySelector('[src*="maps.googleapis.com"]');
      return !!googleMapsElement || typeof window.google?.maps !== 'undefined';
    } catch (e) {
      return false;
    }
  }, []);

  return (
    <div className="flex flex-col gap-y-6 mt-6">
      <div className="grid grid-cols-2 gap-x-4">
        <StyledTextField
          name={`${prefix}.firstName`}
          label="First Name"
          autoComplete="given-name"
          required
        />
        <StyledTextField
          name={`${prefix}.lastName`}
          label="Last Name"
          autoComplete="family-name"
          required
        />
      </div>
      
      {hasGoogleMapsApiKey && (
        <div className="my-4">
          <FieldLabel>Search for address</FieldLabel>
          <GooglePlacesAutocompleteInput name={`${prefix}.address_temp`} prefix={prefix} />
        </div>
      )}

      <StyledTextField
        name={`${prefix}.address1`}
        label="Address"
        autoComplete="address-line1"
        required
      />
      <StyledTextField
        name={`${prefix}.address2`}
        label="Apartment, suite, etc."
        autoComplete="address-line2"
      />
      <StyledTextField
        name={`${prefix}.city`}
        label="City"
        autoComplete="address-level2"
        required
      />
      
      <div>
        <FieldLabel>Country</FieldLabel>
        <CountrySelect
          name={`${prefix}.countryCode`}
          autoComplete="country"
          countries={countries}
          required
          className="!h-12 border-gray-200 bg-white text-[16px] shadow-sm !ring-0"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-x-4">
        <StyledTextField
          name={`${prefix}.province`}
          label="State / Province"
          autoComplete="address-level1"
        />
        <StyledTextField
          name={`${prefix}.postalCode`}
          label="Postal Code"
          autoComplete="postal-code"
          required
        />
      </div>

      <StyledTextField
        name={`${prefix}.phone`}
        label="Phone"
        autoComplete="tel"
        type="tel"
      />
    </div>
  );
}; 