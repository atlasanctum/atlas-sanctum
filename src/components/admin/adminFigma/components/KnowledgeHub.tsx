import React from 'react';
import { BookOpen, FileText, Video, Globe, Download, ExternalLink } from 'lucide-react';

const featuredResearch = [
  {
    title: 'Planetary Boundaries and Regenerative Economics',
    author: 'Rockström et al.',
    category: 'Environmental Science',
    year: 2021,
    downloads: '12.4K',
    type: 'Research Paper',
  },
  {
    title: 'Ethical AI Governance in Impact Finance',
    author: 'Floridi, L.',
    category: 'AI Ethics',
    year: 2022,
    downloads: '8.9K',
    type: 'Whitepaper',
  },
  {
    title: 'Blockchain for Regenerative Value Exchange',
    author: 'Tapscott & Tapscott',
    category: 'Blockchain',
    year: 2018,
    downloads: '15.2K',
    type: 'Book Chapter',
  },
  {
    title: 'Circular Economy and Bioeconomy Integration',
    author: 'Fullerton, J.',
    category: 'Economics',
    year: 2015,
    downloads: '10.1K',
    type: 'Framework',
  },
];

const caseStudies = [
  {
    title: 'Amazon Basin Carbon Credit Program',
    location: 'Brazil',
    impact: '48,000 tCO2 offset annually',
    organizations: 'Amazon Basin DAO, ReFi Alliance',
    status: 'Success',
  },
  {
    title: 'Great Barrier Reef Restoration Initiative',
    location: 'Australia',
    impact: '+120 marine species recovered',
    organizations: 'Ocean Guardian Network',
    status: 'Ongoing',
  },
  {
    title: 'African Community Health & Regeneration',
    location: 'Kenya',
    impact: '2,400 lives improved',
    organizations: 'Community Health DAO',
    status: 'Success',
  },
];

const educationalContent = [
  {
    title: 'Introduction to Regenerative Finance',
    type: 'Video Course',
    duration: '2h 45m',
    lessons: 12,
    level: 'Beginner',
  },
  {
    title: 'Moral AI: Ethics in Automated Decision-Making',
    type: 'Interactive Module',
    duration: '1h 30m',
    lessons: 8,
    level: 'Intermediate',
  },
  {
    title: 'Blockchain for Social Impact',
    type: 'Workshop Series',
    duration: '4h 15m',
    lessons: 16,
    level: 'Advanced',
  },
  {
    title: 'Planetary Health Metrics & Measurement',
    type: 'Guide',
    duration: '45m',
    lessons: 5,
    level: 'Beginner',
  },
];

export function KnowledgeHub() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          Knowledge Repository Hub
        </h1>
        <p className="text-gray-600">
          Academic research, case studies, and educational content for regenerative systems
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search research papers, case studies, or courses..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Categories</option>
            <option>Research Papers</option>
            <option>Case Studies</option>
            <option>Video Courses</option>
            <option>Frameworks</option>
          </select>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-indigo-700">Research Papers</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl text-indigo-900">142</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-700">Case Studies</span>
            <Globe className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl text-purple-900">67</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700">Video Courses</span>
            <Video className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl text-blue-900">34</p>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-emerald-700">Total Downloads</span>
            <Download className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl text-emerald-900">156K</p>
        </div>
      </div>

      {/* Featured Research */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Featured Research & Whitepapers</h3>
        <div className="space-y-3">
          {featuredResearch.map((paper, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-sm">{paper.title}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{paper.author}</span>
                    <span>•</span>
                    <span className="text-indigo-600">{paper.category}</span>
                    <span>•</span>
                    <span>{paper.year}</span>
                    <span>•</span>
                    <span>{paper.downloads} downloads</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                    {paper.type}
                  </span>
                  <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Studies */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Global Impact Case Studies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {caseStudies.map((study, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm pr-2">{study.title}</h4>
                <span
                  className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${
                    study.status === 'Success'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {study.status}
                </span>
              </div>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3 text-gray-400" />
                  <span>{study.location}</span>
                </div>
                <p className="text-emerald-600">{study.impact}</p>
                <p className="text-gray-500">{study.organizations}</p>
              </div>
              <button className="mt-3 w-full px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                Read Full Case Study
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg mb-4">Educational Content & Training</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {educationalContent.map((content, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-sm mb-2">{content.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      {content.type}
                    </span>
                    <span>•</span>
                    <span>{content.duration}</span>
                    <span>•</span>
                    <span>{content.lessons} lessons</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs flex-shrink-0 ml-2 ${
                    content.level === 'Beginner'
                      ? 'bg-emerald-100 text-emerald-700'
                      : content.level === 'Intermediate'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {content.level}
                </span>
              </div>
              <button className="w-full px-3 py-2 text-xs bg-indigo-600 text-white hover:bg-indigo-700 rounded transition-colors">
                Start Learning
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
