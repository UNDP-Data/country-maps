/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import maplibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as pmtiles from 'pmtiles';
import UNDPColorModule from 'undp-viz-colors';
import { MpiDataTypeNational, TooltipData } from '../Types';
import { TooltipSubnational } from '../Components/TooltipSubnational';

interface Props {
  countryData?: MpiDataTypeNational;
  mapSource: string;
}
export function CountryMap(props: Props) {
  const { countryData, mapSource } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLDivElement>(null);
  const protocol = new pmtiles.Protocol();
  let lat = 0;
  let lon = 0;
  const [hoverData, setHoverData] = useState<null | TooltipData>(null);
  const country = countryData ? countryData.country : 'Afghanistan';
  useEffect(() => {
    if (
      countryData !== undefined &&
      countryData.bbox.ne !== undefined &&
      countryData.bbox.sw !== undefined
    ) {
      lon = (countryData.bbox.ne.lon + countryData.bbox.sw.lon) / 2;
      lat = (countryData.bbox.ne.lat + countryData.bbox.sw.lat) / 2;
    }
    maplibreGl.addProtocol('pmtiles', protocol.tile);
    if (map.current) return;
    // initiate map and add base layer
    (map as any).current = new maplibreGl.Map({
      container: mapContainer.current as any,
      style: {
        version: 8,
        sources: {
          admin0: {
            type: 'vector',
            url: 'pmtiles://../data/geoBADM0.pmtiles',
          },
          mpiData: {
            type: 'vector',
            url: 'pmtiles://../data/adm_Export_jso_FeaturesToJSO.pmtiles',
          },
          electricityData: {
            type: 'vector',
            url: 'pmtiles://https://undpngddlsgeohubdev01.blob.core.windows.net/admin/rural_urban_District_Electricity_Access_20230421004438.pmtiles',
          },
        },
        layers: [
          {
            id: 'admin0fill',
            type: 'fill',
            source: 'admin0',
            'source-layer': 'geoBADM0',
            paint: {
              'fill-color': '#EDEFF0',
              'fill-outline-color': '#fff',
            },
            minzoom: 0,
            maxzoom: 22,
          },
          /* mpi layers */
          {
            id: 'mpiChoropleth',
            type: 'fill',
            source: 'mpiData',
            'source-layer': 'adm_Export_jso_FeaturesToJSO',
            /* filter: ['==', 'admin level', selectedAdminLevel], */
            paint: {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'MPI'],
                0,
                UNDPColorModule.sequentialColors.negativeColorsx07[0],
                0.0999,
                UNDPColorModule.sequentialColors.negativeColorsx07[0],
                0.1,
                UNDPColorModule.sequentialColors.negativeColorsx07[1],
                0.1999,
                UNDPColorModule.sequentialColors.negativeColorsx07[1],
                0.2,
                UNDPColorModule.sequentialColors.negativeColorsx07[2],
                0.2999,
                UNDPColorModule.sequentialColors.negativeColorsx07[2],
                0.3,
                UNDPColorModule.sequentialColors.negativeColorsx07[3],
                0.3999,
                UNDPColorModule.sequentialColors.negativeColorsx07[3],
                0.4,
                UNDPColorModule.sequentialColors.negativeColorsx07[4],
                0.4999,
                UNDPColorModule.sequentialColors.negativeColorsx07[4],
                0.5,
                UNDPColorModule.sequentialColors.negativeColorsx07[5],
                0.5999,
                UNDPColorModule.sequentialColors.negativeColorsx07[5],
                0.6,
                UNDPColorModule.sequentialColors.negativeColorsx07[6],
                1,
                UNDPColorModule.sequentialColors.negativeColorsx07[6],
              ],
              'fill-outline-color': '#fff',
            },
          },
          {
            id: 'mpiOverlay',
            type: 'fill',
            source: 'mpiData',
            'source-layer': 'adm_Export_jso_FeaturesToJSO',
            paint: {
              'fill-color': '#000',
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.2,
                0,
              ],
            },
          },
          /* electricity access layers */
          {
            id: 'electricityChoropleth',
            type: 'fill',
            source: 'electricityData',
            'source-layer': 'tmpl3ue0da4',
            paint: {
              'fill-color': [
                'let',
                'percentAccess',
                ['/', ['get', 'PopAccess2020'], ['get', 'TotPopulation']],
                [
                  'interpolate',
                  ['linear'],
                  ['var', 'percentAccess'],
                  0,
                  UNDPColorModule.sequentialColors.negativeColorsx10[0],
                  0.0999,
                  UNDPColorModule.sequentialColors.negativeColorsx10[0],
                  0.1,
                  UNDPColorModule.sequentialColors.negativeColorsx10[1],
                  0.1999,
                  UNDPColorModule.sequentialColors.negativeColorsx10[1],
                  0.2,
                  UNDPColorModule.sequentialColors.negativeColorsx10[2],
                  0.2999,
                  UNDPColorModule.sequentialColors.negativeColorsx10[2],
                  0.3,
                  UNDPColorModule.sequentialColors.negativeColorsx10[3],
                  0.3999,
                  UNDPColorModule.sequentialColors.negativeColorsx10[3],
                  0.4,
                  UNDPColorModule.sequentialColors.negativeColorsx10[4],
                  0.4999,
                  UNDPColorModule.sequentialColors.negativeColorsx10[4],
                  0.5,
                  UNDPColorModule.sequentialColors.negativeColorsx10[5],
                  0.5999,
                  UNDPColorModule.sequentialColors.negativeColorsx10[5],
                  0.6,
                  UNDPColorModule.sequentialColors.negativeColorsx10[6],
                  0.6999,
                  UNDPColorModule.sequentialColors.negativeColorsx10[6],
                  0.7,
                  UNDPColorModule.sequentialColors.negativeColorsx10[7],
                  0.7999,
                  UNDPColorModule.sequentialColors.negativeColorsx10[7],
                  0.8,
                  UNDPColorModule.sequentialColors.negativeColorsx10[8],
                  0.8999,
                  UNDPColorModule.sequentialColors.negativeColorsx10[8],
                  0.9,
                  UNDPColorModule.sequentialColors.negativeColorsx10[9],
                  1,
                  UNDPColorModule.sequentialColors.negativeColorsx10[9],
                ],
              ],
              'fill-opacity': 1,
              'fill-outline-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                'hsla(0, 0%, 0%, 1)',
                'hsla(0, 0%, 100%, 0.5)',
              ],
            },
            layout: { visibility: 'none' },
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'electricityOverlay',
            type: 'fill',
            source: 'electricityData',
            'source-layer': 'tmpl3ue0da4',
            paint: {
              'fill-color': '#000',
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.2,
                0,
              ],
            },
            layout: { visibility: 'none' },
          },
        ],
      },
      center: [lon, lat],
    });
    let districtHoveredStateId: string | null = null;
    (map as any).current.on('mousemove', 'mpiOverlay', (e: any) => {
      (map as any).current.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        if (districtHoveredStateId) {
          (map as any).current.setFeatureState(
            {
              source: 'mpiData',
              id: districtHoveredStateId,
              sourceLayer: 'adm_Export_jso_FeaturesToJSO',
            },
            { hover: false },
          );
        }
        districtHoveredStateId = e.features[0].id;
        setHoverData({
          subregion: e.features[0].properties.region,
          country: e.features[0].properties.country,
          year: e.features[0].properties.year,
          values: [
            { title: 'MPI: ', value: e.features[0].properties.MPI, unit: '' },
            {
              title: 'Headcount Ratio: ',
              value: e.features[0].properties['Headcount Ratio (H, %)'],
              unit: '%',
            },
            {
              title: 'Intensity: ',
              value: e.features[0].properties['Intensity (A, %)'],
              unit: '%',
            },
          ],
          xPosition: e.originalEvent.clientX,
          yPosition: e.originalEvent.clientY,
        });
        (map as any).current.setFeatureState(
          {
            source: 'mpiData',
            id: districtHoveredStateId,
            sourceLayer: 'adm_Export_jso_FeaturesToJSO',
          },
          { hover: true },
        );
      }
    });
    (map as any).current.on('mouseleave', 'mpiOverlay', () => {
      if (districtHoveredStateId) {
        setHoverData(null);
        (map as any).current.setFeatureState(
          {
            source: 'mpiData',
            id: districtHoveredStateId,
            sourceLayer: 'adm_Export_jso_FeaturesToJSO',
          },
          { hover: false },
        );
      }
      districtHoveredStateId = null;
    });
    (map as any).current.on('mousemove', 'electricityOverlay', (e: any) => {
      (map as any).current.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        if (districtHoveredStateId) {
          (map as any).current.setFeatureState(
            {
              source: 'electricityData',
              id: districtHoveredStateId,
              sourceLayer: 'tmpl3ue0da4',
            },
            { hover: false },
          );
        }
        districtHoveredStateId = e.features[0].id;
        setHoverData({
          subregion: e.features[0].properties.adm2_name,
          country: e.features[0].properties.adm0_name,
          year: '2020',
          values: [
            {
              title: 'Access to reliable energy services: ',
              value:
                (e.features[0].properties.PopAccess2020 /
                  e.features[0].properties.TotPopulation) *
                100,
              unit: '%',
            },
            {
              title:
                'Number of people without access to reliable energy services',
              value: ' - ',
              unit: '',
            },
            {
              title: 'Total: ',
              value: e.features[0].properties.PopNoAccess2020,
              unit: '',
            },
            {
              title: 'Rural: ',
              value: e.features[0].properties.PopRuralNoAccess2020,
              unit: '',
            },
            {
              title: 'Urban: ',
              value: e.features[0].properties.PopUrbanNoAccess2020,
              unit: '',
            },
          ],
          xPosition: e.originalEvent.clientX,
          yPosition: e.originalEvent.clientY,
        });
        (map as any).current.setFeatureState(
          {
            source: 'electricityData',
            id: districtHoveredStateId,
            sourceLayer: 'tmpl3ue0da4',
          },
          { hover: true },
        );
      }
    });
    (map as any).current.on('mouseleave', 'electricityOverlay', () => {
      if (districtHoveredStateId) {
        setHoverData(null);
        (map as any).current.setFeatureState(
          {
            source: 'electricityData',
            id: districtHoveredStateId,
            sourceLayer: 'tmpl3ue0da4',
          },
          { hover: false },
        );
      }
      districtHoveredStateId = null;
    });
  }, []);
  // when changing country
  useEffect(() => {
    if (
      countryData !== undefined &&
      countryData.bbox.ne !== undefined &&
      countryData.bbox.sw !== undefined
    ) {
      lon = (countryData.bbox.ne.lon + countryData.bbox.sw.lon) / 2;
      lat = (countryData.bbox.ne.lat + countryData.bbox.sw.lat) / 2;
    } else {
      lon = 0;
      lat = 0;
    }

    if (map.current) {
      if (
        (map as any).current.getLayer('mpiChoropleth') &&
        (map as any).current.getLayer('mpiOverlay') &&
        (map as any).current.getLayer('electricityChoropleth') &&
        (map as any).current.getLayer('electricityOverlay')
      ) {
        const filters = [
          'all',
          ['==', 'country', countryData?.country],
          /* ['==', 'admin level', selectedAdminLevel], */
        ];
        (map as any).current.setFilter('mpiChoropleth', filters);
        (map as any).current.setFilter('mpiOverlay', filters);
        (map as any).current.setFilter('electricityChoropleth', [
          '==',
          'adm0_name',
          country,
        ]);
        (map as any).current.setFilter('electricityOverlay', [
          '==',
          'adm0_name',
          country,
        ]);

        (map as any).current.flyTo({
          center: [lon, lat],
        });
        (map as any).current.fitBounds([
          [countryData?.bbox.sw.lon, countryData?.bbox.sw.lat],
          [countryData?.bbox.ne.lon, countryData?.bbox.ne.lat],
        ]);
      }
    }
  }, [countryData?.country]);
  // changing map
  useEffect(() => {
    if (map.current) {
      if (
        (map as any).current.getLayer('mpiChoropleth') &&
        (map as any).current.getLayer('mpiOverlay') &&
        (map as any).current.getLayer('electricityChoropleth') &&
        (map as any).current.getLayer('electricityOverlay')
      ) {
        (map as any).current.setLayoutProperty(
          'mpiChoropleth',
          'visibility',
          mapSource === 'mpiData' ? 'visible' : 'none',
        );
        (map as any).current.setLayoutProperty(
          'mpiOverlay',
          'visibility',
          mapSource === 'mpiData' ? 'visible' : 'none',
        );
        (map as any).current.setLayoutProperty(
          'electricityChoropleth',
          'visibility',
          mapSource === 'electricityData' ? 'visible' : 'none',
        );
        (map as any).current.setLayoutProperty(
          'electricityOverlay',
          'visibility',
          mapSource === 'electricityData' ? 'visible' : 'none',
        );
      }
    }
  }, [mapSource]);
  return (
    <div style={{ width: '1000px', height: '700px' }}>
      <div
        ref={mapContainer}
        className='map'
        style={{ width: '100%', height: '100%' }}
      />
      {hoverData ? <TooltipSubnational data={hoverData} /> : null}
    </div>
  );
}
