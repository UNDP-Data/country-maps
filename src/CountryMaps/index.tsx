/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { MpiDataTypeNational } from '../Types';
import { CountryMap } from './CountryMap';

interface Props {
  national: MpiDataTypeNational[];
}

export function CountryMaps(props: Props) {
  const { national } = props;
  const [countryData, setCountryData] = useState<
    MpiDataTypeNational | undefined
  >(undefined);

  const defaultCountry = 'Afghanistan';
  const [selectedCountry, setSelectedCountry] =
    useState<string>(defaultCountry);
  useEffect(() => {
    setCountryData(
      national.filter(
        (d: MpiDataTypeNational) => d.country === selectedCountry,
      )[0],
    );
  }, [selectedCountry]);
  return (
    <div>
      <div className='margin-bottom-08'>
        <p className='undp-typography label'>Select a country</p>
        <Select
          className='undp-select'
          value={selectedCountry}
          showSearch
          style={{ width: '400px' }}
          onChange={(d: any) => {
            setSelectedCountry(national[d as any].country);
          }}
        >
          {national.map((d, i) => (
            <Select.Option className='undp-select-option' key={i}>
              {d.country}
            </Select.Option>
          ))}
        </Select>
      </div>
      {national ? <CountryMap countryData={countryData} /> : null}
    </div>
  );
}
