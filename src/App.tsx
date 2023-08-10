/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv, json } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { MpiDataTypeNational, BboxDataType } from './Types';

import { CountryMaps } from './CountryMaps';

function App() {
  const [nationalData, setNationalData] = useState<
    MpiDataTypeNational[] | undefined
  >(undefined);
  useEffect(() => {
    Promise.all([
      csv('./data/MPI_national.csv'),
      json(
        'https://gist.githubusercontent.com/cplpearce/3bc5f1e9b1187df51d2085ffca795bee/raw/b36904c0c8ea72fdb82f68eb33f29891095deab3/country_codes',
      ),
    ]).then(([national, countries]) => {
      const countriesKeys = Object.keys(countries as object);
      const countriesArray: { iso_a3: string; boundingBox: BboxDataType }[] =
        [];
      countriesKeys.forEach((key: string) => {
        countriesArray.push({
          iso_a3: (countries as any)[key]['alpha-3'],
          boundingBox: (countries as any)[key].boundingBox,
        });
      });
      const nationalFetched = national.map((d: any) => ({
        country: d.country,
        iso_a3: d['country code'],
        adminLevel: d.admin,
        bbox: countriesArray[
          (countriesArray as object[]).findIndex(
            (k: any) => k.iso_a3 === d['country code'],
          )
        ].boundingBox,
      }));
      setNationalData(nationalFetched);
    });
  }, []);
  return (
    <div
      className='undp-container'
      style={{ maxWidth: '1280px', margin: 'auto' }}
    >
      {nationalData ? <CountryMaps national={nationalData} /> : null}
    </div>
  );
}

export default App;
