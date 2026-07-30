/**
 * ProjectCreate Page
 * Multi-step wizard for creating new regenerative projects
 */

import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useDropzone } from 'react-dropzone';
import type {
  ProjectType,
  ClimateClassification} from '../types/marketplace';
import {
  PROJECT_TYPE_LABELS,
  CLIMATE_LABELS,
} from '../types/marketplace';
import type {
  ProjectCreateInput,
  ProjectMedia,
} from '../services/projectService';
import projectService from '../services/projectService';
import notificationService from '../services/notificationService';

// Validation Schemas
const projectInfoSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  projectType: z.enum(['reforestation', 'renewable_energy', 'methane_capture', 'ocean_restoration', 'soil_carbon', 'direct_air_capture']),
  climateClassification: z.enum(['tropical_rainforest', 'tropical_savanna', 'arid_desert', 'temperate_grassland', 'boreal_forest', 'temperate_deciduous', 'mediterranean', 'tundra', 'ocean_coastal', 'mountain']).optional(),
});

const locationSchema = z.object({
  location: z.string().min(2, 'Location is required'),
  country: z.string().min(2, 'Country is required'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

const carbonSchema = z.object({
  pricePerCredit: z.number().min(1, 'Price must be at least 1'),
  totalCredits: z.number().min(1, 'Total credits must be at least 1'),
  vintageYear: z.number().min(2000).max(2100),
  certification: z.string().min(1, 'Certification is required'),
  methodology: z.string().optional(),
  co2OffsetPerCredit: z.number().min(0.1, 'CO2 offset must be at least 0.1'),
});

type ProjectInfoForm = z.infer<typeof projectInfoSchema>;
type LocationForm = z.infer<typeof locationSchema>;
type CarbonForm = z.infer<typeof carbonSchema>;

// Steps Configuration
const STEPS = [
  { id: 'info', title: 'Project Information', description: 'Basic details about your project' },
  { id: 'location', title: 'Location', description: 'Where is your project located?' },
  { id: 'carbon', title: 'Carbon Credits', description: 'Configure your carbon credits' },
  { id: 'media', title: 'Media', description: 'Add photos and documents' },
  { id: 'review', title: 'Review & Submit', description: 'Review your project details' },
];

type StepId = typeof STEPS[number]['id'];

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<StepId>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<ProjectMedia[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [projectInfo, setProjectInfo] = useState<ProjectInfoForm>({
    title: '',
    description: '',
    projectType: 'reforestation',
    climateClassification: undefined,
  });

  const [location, setLocation] = useState<LocationForm>({
    location: '',
    country: '',
    latitude: undefined,
    longitude: undefined,
  });

  const [carbon, setCarbon] = useState<CarbonForm>({
    pricePerCredit: 25,
    totalCredits: 10000,
    vintageYear: new Date().getFullYear(),
    certification: '',
    methodology: '',
    co2OffsetPerCredit: 1,
  });

  // File Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const media: ProjectMedia = {
          id: uuidv4(),
          type: file.type.startsWith('image') ? 'image' : 'document',
          url: URL.createObjectURL(file),
          title: file.name,
          uploadedAt: new Date().toISOString(),
        };
        setUploadedMedia((prev) => [...prev, media]);
      });
    }
    e.target.value = ''; // Reset input
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const media: ProjectMedia = {
        id: uuidv4(),
        type: file.type.startsWith('image') ? 'image' : 'document',
        url: URL.createObjectURL(file),
        title: file.name,
        uploadedAt: new Date().toISOString(),
      };
      setUploadedMedia((prev) => [...prev, media]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Navigation
  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const goToStep = (stepId: StepId) => {
    setCurrentStep(stepId);
  };

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const goToPrevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  // Submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const input: ProjectCreateInput = {
        title: projectInfo.title,
        description: projectInfo.description,
        location: location.location,
        country: location.country,
        projectType: projectInfo.projectType,
        climateClassification: projectInfo.climateClassification,
        pricePerCredit: carbon.pricePerCredit,
        totalCredits: carbon.totalCredits,
        vintageYear: carbon.vintageYear,
        certification: carbon.certification,
        methodology: carbon.methodology,
        co2OffsetPerCredit: carbon.co2OffsetPerCredit,
      };

      const project = await projectService.createProject(input);

      // Upload media
      for (const media of uploadedMedia) {
        if (media.url.startsWith('blob:')) {
          await projectService.uploadMedia(project.id, new File([], media.title || 'file'));
        }
      }

      // Show success notification
      notificationService.showToast({
        type: 'success',
        title: 'Project Created',
        message: 'Your project has been submitted for review.',
      });

      navigate(`/projects/${project.id}`);
    } catch (err) {
      setError('Failed to create project. Please try again.');
      console.error('Error creating project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove media
  const removeMedia = (mediaId: string) => {
    setUploadedMedia((prev) => prev.filter((m) => m.id !== mediaId));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Create New Project</h1>
          <p className="text-slate-600 mt-2">
            Submit a new regenerative project for carbon credit certification
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => index <= currentStepIndex && goToStep(step.id)}
                className={`flex items-center ${
                  index <= currentStepIndex ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                disabled={index > currentStepIndex}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStepIndex
                      ? 'bg-emerald-500 text-white'
                      : index === currentStepIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {index < currentStepIndex ? '✓' : index + 1}
                </div>
                <div className="ml-2 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    index <= currentStepIndex ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < currentStepIndex ? 'bg-emerald-500' : 'bg-slate-200'
                  }`} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {/* Step 1: Project Information */}
          {currentStep === 'info' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">Project Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={projectInfo.title}
                  onChange={(e) => setProjectInfo({ ...projectInfo, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Amazon Rainforest Conservation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={projectInfo.description}
                  onChange={(e) => setProjectInfo({ ...projectInfo, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your project in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Project Type *
                </label>
                <select
                  value={projectInfo.projectType}
                  onChange={(e) => setProjectInfo({ ...projectInfo, projectType: e.target.value as ProjectType })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Climate Classification
                </label>
                <select
                  value={projectInfo.climateClassification || ''}
                  onChange={(e) => setProjectInfo({ ...projectInfo, climateClassification: e.target.value as ClimateClassification || undefined })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select classification</option>
                  {Object.entries(CLIMATE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 'location' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">Project Location</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location Description *
                </label>
                <input
                  type="text"
                  value={location.location}
                  onChange={(e) => setLocation({ ...location, location: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Pará State, Brazil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={location.country}
                  onChange={(e) => setLocation({ ...location, country: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Brazil"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Latitude (optional)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={location.latitude || ''}
                    onChange={(e) => setLocation({ ...location, latitude: parseFloat(e.target.value) || undefined })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="-3.4653"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Longitude (optional)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={location.longitude || ''}
                    onChange={(e) => setLocation({ ...location, longitude: parseFloat(e.target.value) || undefined })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="-62.2159"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Carbon Credits */}
          {currentStep === 'carbon' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">Carbon Credits Configuration</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price per Credit (USD) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={carbon.pricePerCredit}
                    onChange={(e) => setCarbon({ ...carbon, pricePerCredit: parseFloat(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Total Credits *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={carbon.totalCredits}
                    onChange={(e) => setCarbon({ ...carbon, totalCredits: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vintage Year *
                </label>
                <select
                  value={carbon.vintageYear}
                  onChange={(e) => setCarbon({ ...carbon, vintageYear: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Certification Standard *
                </label>
                <select
                  value={carbon.certification}
                  onChange={(e) => setCarbon({ ...carbon, certification: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select certification</option>
                  <option value="VCS">Verified Carbon Standard (VCS)</option>
                  <option value="Gold Standard">Gold Standard</option>
                  <option value="Plan Vivo">Plan Vivo</option>
                  <option value="ACR">American Carbon Registry (ACR)</option>
                  <option value="CDM">Clean Development Mechanism (CDM)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Methodology (optional)
                </label>
                <input
                  type="text"
                  value={carbon.methodology || ''}
                  onChange={(e) => setCarbon({ ...carbon, methodology: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., VM0007"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  CO2 Offset per Credit (tons) *
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={carbon.co2OffsetPerCredit}
                  onChange={(e) => setCarbon({ ...carbon, co2OffsetPerCredit: parseFloat(e.target.value) || 0.1 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-2">Funding Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Potential Revenue</p>
                    <p className="font-semibold text-emerald-600">
                      ${(carbon.pricePerCredit * carbon.totalCredits).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Total CO2 Offset</p>
                    <p className="font-semibold text-slate-900">
                      {(carbon.co2OffsetPerCredit * carbon.totalCredits).toLocaleString()} tons
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Est. Value per Ha</p>
                    <p className="font-semibold text-slate-900">
                      ${carbon.pricePerCredit}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Media Upload */}
          {currentStep === 'media' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">Project Media</h2>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-slate-600">
                  <p className="font-medium">Drag & drop files here, or click to select</p>
                  <p className="text-sm mt-1">PNG, JPG, GIF, PDF up to 10MB</p>
                </div>
              </div>

              {uploadedMedia.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {uploadedMedia.map((media) => (
                    <div key={media.id} className="relative group">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={media.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center">
                          <span className="text-slate-500 text-sm">PDF</span>
                        </div>
                      )}
                      <button
                        onClick={() => removeMedia(media.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                      <p className="text-xs text-slate-500 mt-1 truncate">{media.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">Review Your Project</h2>
              
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-2">Project Details</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Title</dt>
                      <dd className="font-medium text-slate-900">{projectInfo.title}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Type</dt>
                      <dd className="font-medium text-slate-900">
                        {PROJECT_TYPE_LABELS[projectInfo.projectType]}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Location</dt>
                      <dd className="font-medium text-slate-900">
                        {location.location}, {location.country}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="font-medium text-slate-900 mb-2">Carbon Credits</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Price per Credit</dt>
                      <dd className="font-medium text-slate-900">${carbon.pricePerCredit}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Total Credits</dt>
                      <dd className="font-medium text-slate-900">{carbon.totalCredits.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Certification</dt>
                      <dd className="font-medium text-slate-900">{carbon.certification}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Vintage Year</dt>
                      <dd className="font-medium text-slate-900">{carbon.vintageYear}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    By submitting this project, you agree to the{' '}
                    <a href="/terms" className="underline">Terms of Service</a> and{' '}
                    <a href="/privacy" className="underline">Privacy Policy</a>.
                    Your project will be reviewed within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={goToPrevStep}
              disabled={isFirstStep || isSubmitting}
              className={`px-6 py-2 rounded-lg font-medium ${
                isFirstStep
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Back
            </button>
            
            {isLastStep ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Project'
                )}
              </button>
            ) : (
              <button
                onClick={goToNextStep}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
