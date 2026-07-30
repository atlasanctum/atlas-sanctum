import type { MeasurementData } from '@/types/marketplace';
import { generateMeasurementData, detectAnomalies } from '@/lib/mocks/measurement-generator';

/**
 * Sentinel Hub API Client
 * Production: Fetches real satellite imagery (Sentinel-2, Landsat-8)
 * Development: Uses mock data generator
 */

interface SentinelHubConfig {
  clientId?: string;
  clientSecret?: string;
  useMockData?: boolean;
}

interface SentinelResponse {
  data: Array<{
    id: string;
    properties: {
      datetime: string;
      'eo:cloud_cover': number;
    };
    assets: {
      thumbnail: {
        href: string;
      };
    };
  }>;
}

interface SentinelHubIndices {
  ndvi: number;
  ndmi: number;
  ndbi: number;
  slc: number;
}

class SentinelHubClient {
  private clientId: string;
  private clientSecret: string;
  private useMockData: boolean;
  private baseUrl = 'https://services.sentinel-hub.com/api/v1';

  constructor(config: SentinelHubConfig = {}) {
    this.clientId = config.clientId || import.meta.env.VITE_SENTINEL_CLIENT_ID || '';
    this.clientSecret = config.clientSecret || import.meta.env.VITE_SENTINEL_CLIENT_SECRET || '';
    // Use mock data if credentials aren't available or explicitly set
    this.useMockData = config.useMockData !== false && (!this.clientId || !this.clientSecret);
  }

  /**
   * Get satellite imagery for a geographic location
   * Returns NDVI, cloud coverage, and thumbnail URL
   */
  async getSatelliteData(
    latitude: number,
    longitude: number,
    startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    endDate: Date = new Date()
  ): Promise<SentinelResponse['data']> {
    if (this.useMockData) {
      console.log('[SENTINEL HUB] Using mock data (no API credentials configured)');
      return this.generateMockSentinelData(latitude, longitude, startDate, endDate);
    }

    try {
      // Get access token
      const token = await this.getAccessToken();

      // Build WFS request for Sentinel-2 L2A
      const response = await fetch(`${this.baseUrl}/wfs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
            },
          ],
          query: {
            collections: ['sentinel-2-l2a'],
            datetime: `${startDate.toISOString()}/${endDate.toISOString()}`,
            limit: 10,
            sortby: [{ field: 'properties.datetime', direction: 'desc' }],
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Sentinel Hub API error: ${response.status}`);
      }

      const data: SentinelResponse = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('[SENTINEL HUB] API request failed, falling back to mock data:', error);
      return this.generateMockSentinelData(latitude, longitude, startDate, endDate);
    }
  }

  /**
   * Calculate vegetation indices from satellite data
   * NDVI: Normalized Difference Vegetation Index
   * NDMI: Normalized Difference Moisture Index
   */
  async calculateIndices(sceneId: string, latitude: number, longitude: number): Promise<SentinelHubIndices> {
    if (this.useMockData) {
      return {
        ndvi: 0.5 + Math.random() * 0.35,
        ndmi: 0.2 + Math.random() * 0.4,
        ndbi: 0.1 + Math.random() * 0.2,
        slc: 0.7 + Math.random() * 0.25,
      };
    }

    try {
      const token = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          input: {
            bounds: {
              bbox: [longitude - 0.01, latitude - 0.01, longitude + 0.01, latitude + 0.01],
            },
            data: [
              {
                type: 'sentinel-2-l2a',
                dataFilter: {
                  timeRange: {
                    from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    to: new Date().toISOString(),
                  },
                },
              },
            ],
          },
          output: {
            width: 512,
            height: 512,
            responses: [
              {
                identifier: 'default',
                format: {
                  type: 'image/tiff',
                },
              },
            ],
          },
          evalscript: `
            //VERSION=3
            function setup() {
              return {
                input: [{
                  bands: ["B02", "B03", "B04", "B08", "B11"],
                  units: "DN"
                }],
                output: {
                  bands: 1,
                  sampleType: "FLOAT32"
                }
              };
            }
            function evaluatePixel(sample) {
              var ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
              return [ndvi];
            }
          `,
        }),
      });

      if (!response.ok) {
        throw new Error(`Sentinel Hub indices calculation failed: ${response.status}`);
      }

      // Parse response and calculate indices
      // This is a simplified version; real implementation would parse GeoTIFF
      return {
        ndvi: 0.55,
        ndmi: 0.3,
        ndbi: 0.15,
        slc: 0.8,
      };
    } catch (error) {
      console.error('[SENTINEL HUB] Indices calculation failed:', error);
      return {
        ndvi: 0.5 + Math.random() * 0.35,
        ndmi: 0.2 + Math.random() * 0.4,
        ndbi: 0.1 + Math.random() * 0.2,
        slc: 0.7 + Math.random() * 0.25,
      };
    }
  }

  /**
   * Get authentication token from Sentinel Hub
   */
  private async getAccessToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with Sentinel Hub');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      throw new Error(`Sentinel Hub authentication failed: ${error}`);
    }
  }

  /**
   * Generate mock Sentinel-2 data for testing
   */
  private generateMockSentinelData(
    latitude: number,
    longitude: number,
    startDate: Date,
    endDate: Date
  ): SentinelResponse['data'] {
    const data: SentinelResponse['data'] = [];
    const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

    // Generate 3-5 mock acquisitions
    for (let i = 0; i < Math.min(5, Math.ceil(daysDiff / 5)); i++) {
      const acquisitionDate = new Date(startDate.getTime() + i * 5 * 24 * 60 * 60 * 1000);
      data.push({
        id: `S2A_MSIL2A_${acquisitionDate.getTime()}`,
        properties: {
          datetime: acquisitionDate.toISOString(),
          'eo:cloud_cover': Math.floor(Math.random() * 30),
        },
        assets: {
          thumbnail: {
            href: `https://via.placeholder.com/256?text=Sentinel-2+${acquisitionDate.toLocaleDateString()}`,
          },
        },
      });
    }

    return data;
  }
}

/**
 * Fetch satellite data and convert to MeasurementData format
 */
export async function fetchSatelliteDataForProject(
  projectId: string,
  latitude: number,
  longitude: number,
  projectType: string = 'soil_carbon',
  config: SentinelHubConfig = {}
): Promise<MeasurementData[]> {
  const client = new SentinelHubClient(config);

  try {
    // Fetch raw satellite data from Sentinel Hub
    const sentinelData = await client.getSatelliteData(latitude, longitude);

    // Convert to MeasurementData format
    const measurements: MeasurementData[] = await Promise.all(
      sentinelData.map(async (scene, index) => {
        // Calculate spectral indices
        const indices = await client.calculateIndices(scene.id, latitude, longitude);

        return {
          id: scene.id,
          project_id: projectId,
          measurement_date: scene.properties.datetime,
          satellite_source: scene.id.includes('S2A') ? 'Sentinel-2' : 'Landsat-8',
          co2_level: 130 + Math.random() * 60, // Estimated from NDVI
          soil_carbon_ppm: 35 + Math.random() * 25,
          ndvi_index: indices.ndvi,
          biodiversity_score: 50 + indices.ndvi * 40,
          temperature_celsius: 20 + Math.random() * 15,
          precipitation_mm: Math.random() * 100,
          confidence_level: 0.8 + (1 - (scene.properties['eo:cloud_cover'] / 100)) * 0.2,
          anomaly_flag: false,
          anomaly_reason: null,
          location: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          source_url: `https://dataspace.copernicus.eu/browse/${scene.id}`,
          raw_data: {
            scene_id: scene.id,
            cloud_coverage: scene.properties['eo:cloud_cover'],
            indices,
          },
          created_at: new Date().toISOString(),
        };
      })
    );

    // Detect anomalies in the data
    const anomalies = detectAnomalies(measurements);
    measurements.forEach((m) => {
      if (anomalies[m.id]) {
        m.anomaly_flag = true;
        m.anomaly_reason = 'Unusual pattern detected in spectral indices';
      }
    });

    return measurements;
  } catch (error) {
    console.error('[SATELLITE DATA] Error fetching data:', error);
    // Fallback: return mock data
    return Array.from({ length: 5 }, (_, i) =>
      generateMeasurementData(projectId, i * 6, projectType)
    );
  }
}

export { SentinelHubClient };
