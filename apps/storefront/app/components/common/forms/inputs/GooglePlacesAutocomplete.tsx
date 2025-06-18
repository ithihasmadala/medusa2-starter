import { useRootLoaderData } from '@app/hooks/useRootLoaderData';
import { useController, useFormContext } from 'react-hook-form';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

interface GooglePlacesAutocompleteProps {
  name: string;
  prefix: string;
}

export const GooglePlacesAutocompleteInput = ({ name, prefix }: GooglePlacesAutocompleteProps) => {
  const { env } = useRootLoaderData();
  const { control, setValue } = useFormContext();

  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
  });

  if (!env?.GOOGLE_MAPS_API_KEY) {
    return (
      <div className="text-red-500">
        Google Maps API key is missing. Please configure it in your environment variables.
      </div>
    );
  }

  const handleSelect = async (place: any) => {
    onChange(place);

    const results = await geocodeByAddress(place.label);
    const { lat, lng } = await getLatLng(results[0]);

    const addressComponents = results[0].address_components;

    const getAddressComponent = (type: string) => {
      return addressComponents.find((component: any) => component.types.includes(type))?.long_name || '';
    };

    setValue(`${prefix}.address1`, getAddressComponent('street_number') + ' ' + getAddressComponent('route'));
    setValue(`${prefix}.city`, getAddressComponent('locality'));
    setValue(`${prefix}.province`, getAddressComponent('administrative_area_level_1'));
    setValue(`${prefix}.postalCode`, getAddressComponent('postal_code'));
    setValue(`${prefix}.countryCode`, getAddressComponent('country').toLowerCase());
  };

  return (
    <GooglePlacesAutocomplete
      apiKey={env.GOOGLE_MAPS_API_KEY}
      selectProps={{
        value,
        onChange: handleSelect,
        placeholder: 'Search for an address',
      }}
    />
  );
}; 