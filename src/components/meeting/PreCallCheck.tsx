'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  requestMediaPermissions,
  getMediaDevices,
  supportsWebRTC,
} from '@/lib/daily/client';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PreCallCheckProps {
  userName: string;
  onJoin: (config: { audioEnabled: boolean; videoEnabled: boolean }) => void;
  onCancel: () => void;
}

interface DeviceState {
  audioInputs: MediaDeviceInfo[];
  audioOutputs: MediaDeviceInfo[];
  videoInputs: MediaDeviceInfo[];
  selectedAudioInput: string;
  selectedVideoInput: string;
}

export function PreCallCheck({ userName, onJoin, onCancel }: PreCallCheckProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissions, setPermissions] = useState({ audio: false, video: false });
  const [devices, setDevices] = useState<DeviceState>({
    audioInputs: [],
    audioOutputs: [],
    videoInputs: [],
    selectedAudioInput: '',
    selectedVideoInput: '',
  });
  const [error, setError] = useState<string | null>(null);

  // Check WebRTC support and request permissions
  useEffect(() => {
    async function initializeDevices() {
      setIsLoading(true);
      setError(null);

      // Check WebRTC support
      if (!supportsWebRTC()) {
        setError('Votre navigateur ne supporte pas les appels vidéo. Veuillez utiliser un navigateur moderne.');
        setIsLoading(false);
        return;
      }

      try {
        // Request permissions
        const perms = await requestMediaPermissions();
        setPermissions(perms);

        if (!perms.audio && !perms.video) {
          setError('Permissions caméra et microphone refusées. Veuillez les autoriser dans les paramètres de votre navigateur.');
          setIsLoading(false);
          return;
        }

        // Get available devices
        const deviceList = await getMediaDevices();
        setDevices({
          audioInputs: deviceList.audioInputs,
          audioOutputs: deviceList.audioOutputs,
          videoInputs: deviceList.videoInputs,
          selectedAudioInput: deviceList.audioInputs[0]?.deviceId || '',
          selectedVideoInput: deviceList.videoInputs[0]?.deviceId || '',
        });

        // Start preview stream
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: perms.audio,
          video: perms.video ? { facingMode: 'user' } : false,
        });
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('[PreCallCheck] Error:', err);
        setError('Erreur lors de l\'initialisation. Veuillez rafraîchir la page.');
      }

      setIsLoading(false);
    }

    initializeDevices();

    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Toggle audio
  const handleToggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !audioEnabled;
      });
    }
    setAudioEnabled(!audioEnabled);
  };

  // Toggle video
  const handleToggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !videoEnabled;
      });
    }
    setVideoEnabled(!videoEnabled);
  };

  // Handle join
  const handleJoin = () => {
    // Stop preview stream before joining
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onJoin({ audioEnabled, videoEnabled });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">
            Prêt à rejoindre ?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Video Preview */}
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {videoEnabled && permissions.video ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-teal-600 flex items-center justify-center text-white text-3xl font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Preview Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <Button
                variant={audioEnabled ? 'secondary' : 'destructive'}
                size="icon"
                className="rounded-full"
                onClick={handleToggleAudio}
                disabled={!permissions.audio}
              >
                {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button
                variant={videoEnabled ? 'secondary' : 'destructive'}
                size="icon"
                className="rounded-full"
                onClick={handleToggleVideo}
                disabled={!permissions.video}
              >
                {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Permission Status */}
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              {permissions.audio ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={cn('text-sm', permissions.audio ? 'text-green-600' : 'text-red-600')}>
                Microphone
              </span>
            </div>
            <div className="flex items-center gap-2">
              {permissions.video ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={cn('text-sm', permissions.video ? 'text-green-600' : 'text-red-600')}>
                Caméra
              </span>
            </div>
          </div>

          {/* Device Selection */}
          {(devices.audioInputs.length > 1 || devices.videoInputs.length > 1) && (
            <div className="grid gap-4 md:grid-cols-2">
              {devices.audioInputs.length > 1 && (
                <div className="space-y-2">
                  <Label>Microphone</Label>
                  <Select
                    value={devices.selectedAudioInput}
                    onValueChange={(value) =>
                      setDevices({ ...devices, selectedAudioInput: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un micro" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.audioInputs.map((device) => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `Micro ${device.deviceId.slice(0, 5)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {devices.videoInputs.length > 1 && (
                <div className="space-y-2">
                  <Label>Caméra</Label>
                  <Select
                    value={devices.selectedVideoInput}
                    onValueChange={(value) =>
                      setDevices({ ...devices, selectedVideoInput: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une caméra" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.videoInputs.map((device) => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `Caméra ${device.deviceId.slice(0, 5)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button
              onClick={handleJoin}
              className="bg-teal-600 hover:bg-teal-700"
              disabled={!permissions.audio && !permissions.video}
            >
              Rejoindre la session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
