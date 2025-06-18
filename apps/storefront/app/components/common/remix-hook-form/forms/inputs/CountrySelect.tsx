import { Select, type SelectProps } from '@app/components/common/forms/inputs/Select';
import type { StoreRegionCountry } from '@medusajs/types';
import { useController, useFormContext } from 'react-hook-form';
import clsx from 'clsx';

type CountrySelectProps = Omit<SelectProps, 'children'> & {
  countries: StoreRegionCountry[];
};

export const CountrySelect = ({ name, countries, className, ...props }: CountrySelectProps) => {
  const { control } = useFormContext();

  if (!name) {
    return null;
  }

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const countryOptions =
    countries
      ?.map((country) => ({
        value: country.iso_2,
        label: country.display_name || country.iso_2,
      }))
      .sort((a, b) => (a.label ?? '').localeCompare(b.label ?? '')) ?? [];

  return (
    <Select {...props} {...field} error={error?.message} className={className}>
      {countryOptions.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
}; 