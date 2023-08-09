/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, Radio, RadioChangeEvent } from 'antd';
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

  const defaultCountry = 'Nigeria';
  const [selectedCountry, setSelectedCountry] =
    useState<string>(defaultCountry);
  const [mapSource, setMapSource] = useState<string>('mpiData');
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
      <div>
        <Radio.Group
          defaultValue='mpiData'
          onChange={(el: RadioChangeEvent) => setMapSource(el.target.value)}
          className='margin-bottom-05'
        >
          <Radio className='undp-radio' value='mpiData'>
            MPI
          </Radio>
          <Radio className='undp-radio' value='electricityData'>
            Electricity Access
          </Radio>
        </Radio.Group>
      </div>
      {national ? (
        <CountryMap countryData={countryData} mapSource={mapSource} />
      ) : null}
    </div>
  );
}
