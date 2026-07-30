import React, { useState } from 'react';
import { Camera, MapPin, Layers, TrendingUp, Info, QrCode } from 'lucide-react';

export function ARImpactOverlay() {
  const [arMode, setArMode] = useState<'scan' | 'view' | 'disabled'>('disabled');

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl mb-2 flex items-center gap-2 sm:gap-3">
          <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600" />
          AR Impact Overlay
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Point your mobile device at project sites to see real-time impact data
        </p>
      </div>

      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex items-start gap-3">
          <Camera className="w-6 h-6 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg mb-2">Augmented Reality Field Insights</h3>
            <p className="text-sm opacity-90 mb-3">
              Use your mobile device camera to overlay impact data on physical locations. See carbon sequestration, biodiversity metrics, and project progress in real-time AR.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/20 rounded text-xs">ARCore/ARKit</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">GPS Anchors</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">Real-Time Data</span>
              <span className="px-3 py-1 bg-white/20 rounded text-xs">QR Markers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-600" />
            Launch AR Experience
          </h3>
          
          <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-center">
              <div className="w-48 h-48 bg-white border-4 border-gray-300 rounded-lg flex items-center justify-center mb-3">
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`w-8 h-8 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">Scan with mobile device</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="flex items-start gap-2">
              <span>1️⃣</span>
              <span>Open camera app on your mobile device</span>
            </p>
            <p className="flex items-start gap-2">
              <span>2️⃣</span>
              <span>Point at QR code to launch AR experience</span>
            </p>
            <p className="flex items-start gap-2">
              <span>3️⃣</span>
              <span>Walk around project site to see data overlays</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg mb-4">AR Features</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h4 className="text-sm mb-1">Carbon Data Overlay</h4>
                <p className="text-xs text-gray-600">See tons of CO2 sequestered hovering above trees</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm mb-1">Biodiversity Scanner</h4>
                <p className="text-xs text-gray-600">Point at species to see identification and impact metrics</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="text-sm mb-1">Project Boundaries</h4>
                <p className="text-xs text-gray-600">Virtual fences show project area and zones</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-sm mb-1">IoT Sensor Data</h4>
                <p className="text-xs text-gray-600">Live soil moisture, temperature, and air quality readings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Example AR Views</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Forest View', emoji: '🌳', data: 'Carbon: 15.2 tons/hectare' },
            { title: 'Ocean View', emoji: '🌊', data: 'Coral Coverage: 67%' },
            { title: 'Solar Farm', emoji: '☀️', data: 'Output: 2.4 MW' },
          ].map((view, i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg p-4 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
              <div className="text-6xl mb-2">{view.emoji}</div>
              <h4 className="text-sm mb-1">{view.title}</h4>
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur rounded px-3 py-2">
                <p className="text-xs">{view.data}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Technical Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="mb-2">iOS Devices</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• iPhone 6S or newer</li>
              <li>• iOS 13 or later</li>
              <li>• ARKit compatible</li>
              <li>• Camera access enabled</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2">Android Devices</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• ARCore supported device</li>
              <li>• Android 7.0 or later</li>
              <li>• GPS enabled</li>
              <li>• Location services on</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
