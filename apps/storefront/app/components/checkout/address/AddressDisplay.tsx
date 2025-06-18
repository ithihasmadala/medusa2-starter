import type { Address } from '@libs/types';

export const AddressDisplay: React.FC<{
  title?: string;
  address: Address;
  countryOptions: { value: string; label: string }[];
}> = ({ title, address, countryOptions }) => {
  if (!address) return null;
  
  const countryName = address.countryCode 
    ? countryOptions.find(({ value }) => value === address.countryCode)?.label || address.countryCode
    : '';

  return (
    <div className="text-sm">
      {title && <h3 className="text-base font-semibold">{title}</h3>}
      <address className="not-italic">
        {(address.firstName || address.lastName) && (
          <div className="font-semibold">
            {address.firstName} {address.lastName}
          </div>
        )}
        {address.address1 && <div>{address.address1}</div>}
        {address.address2 && <div>{address.address2}</div>}
        {(address.city || address.province || address.postalCode) && (
          <div>
            {address.city && `${address.city}`}
            {address.province && address.city && `, `}
            {address.province && `${address.province}`} 
            {address.postalCode && `${address.postalCode}`}
          </div>
        )}
        {countryName && <div>{countryName}</div>}
      </address>
    </div>
  );
};
