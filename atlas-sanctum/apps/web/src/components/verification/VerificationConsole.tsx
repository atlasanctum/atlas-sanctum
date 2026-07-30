/**
 * Atlas Sanctum Verification Console
 * Where trust is won - evidence upload and impact verification
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Upload, 
  MapPin, 
  Clock, 
  Hash,
  FileText,
  Image,
  Video
} from 'lucide-react';

interface Evidence {
  id: string;
  interventionId: string;
  verifierWallet: string;
  fileUrl: string;
  fileType: 'image' | 'video' | 'document' | 'json';
  latitude?: number;
  longitude?: number;
  timestamp: string;
  notes?: string;
  hash: string;
  status: 'submitted' | 'accepted' | 'rejected';
}

interface ImpactReport {
  interventionId: string;
  deliveryConfirmed: boolean;
  householdsReached?: number;
  suppliesDelivered?: number;
  confidenceScore: number;
}

interface VerificationConsoleProps {
  interventionId: string;
  evidence: Evidence[];
  impactReport: ImpactReport | null;
  onUploadEvidence: (evidence: Omit<Evidence, 'id' | 'status'>) => void;
  onFinalize: () => void;
}

export function VerificationConsole({
  interventionId,
  evidence,
  impactReport,
  onUploadEvidence,
  onFinalize,
}: VerificationConsoleProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
          <span>Interventions</span>
          <span>/</span>
          <span>{interventionId}</span>
          <span>/</span>
          <span>Verification</span>
        </div>
        <h1 className="text-3xl font-bold">Verification Console</h1>
        <p className="text-slate-400 mt-2">
          Upload evidence and verify intervention impact
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evidence Upload */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-400" />
              Evidence Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-slate-500 mb-4" />
              <p className="text-lg font-medium mb-2">Drop evidence files here</p>
              <p className="text-sm text-slate-400 mb-4">
                Supports images, videos, documents, and JSON files
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Select Files
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.0000001"
                  placeholder="-1.2860000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.0000001"
                  placeholder="36.8170000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-slate-400 mb-2">
                Notes
              </label>
              <textarea
                placeholder="Describe the evidence..."
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
              />
            </div>

            <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">
              Submit Evidence
            </Button>
          </CardContent>
        </Card>

        {/* Impact Summary */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Impact Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {impactReport ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Delivery Confirmed</span>
                    {impactReport.deliveryConfirmed ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-400">Confidence Score</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500"
                        style={{ width: `${impactReport.confidenceScore * 100}%` }}
                      />
                    </div>
                    <span className="font-bold">
                      {Math.round(impactReport.confidenceScore * 100)}%
                    </span>
                  </div>
                </div>

                {impactReport.householdsReached && (
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <p className="text-sm text-slate-400">Households Reached</p>
                    <p className="text-2xl font-bold mt-1">
                      {impactReport.householdsReached.toLocaleString()}
                    </p>
                  </div>
                )}

                {impactReport.suppliesDelivered && (
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <p className="text-sm text-slate-400">Supplies Delivered</p>
                    <p className="text-2xl font-bold mt-1">
                      {impactReport.suppliesDelivered.toLocaleString()}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={onFinalize}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Finalize Verification
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No verification yet</p>
                <p className="text-sm mt-1">
                  Upload evidence to begin verification
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Evidence Gallery */}
      <Card className="mt-6 bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Evidence Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          {evidence.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidence.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getFileIcon(item.fileType)}
                      <span className="font-medium">{item.id}</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                      {item.status}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {item.latitude?.toFixed(6)}, {item.longitude?.toFixed(6)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Hash className="h-4 w-4" />
                      <span className="font-mono text-xs truncate">
                        {item.hash}
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="mt-3 text-sm text-slate-300">{item.notes}</p>
                  )}

                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-500">
                      Verifier: {item.verifierWallet.substring(0, 10)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No evidence submitted yet</p>
              <p className="text-sm mt-1">
                Evidence will appear here after upload
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
