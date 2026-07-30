import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Clock, ChevronRight, Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';

// Types for job opportunities
interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: 'entry' | 'mid' | 'senior' | 'lead';
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary: string;
  postedDate: string;
  closingDate: string;
}

// Types for application form
interface ApplicationFormData {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
  resume: File | null;
  coverLetter: string;
  comments?: string;
}

const Careers = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicationForm, setApplicationForm] = useState<ApplicationFormData>({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    resume: null,
    coverLetter: '',
    comments: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');

  // Fetch job opportunities (mock data for now)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // In real application, this would be an API call
        const mockJobs: Job[] = [
          {
            id: '1',
            title: 'Full Stack Developer',
            department: 'Engineering',
            location: 'Remote',
            type: 'full-time',
            experience: 'mid',
            description: 'We are looking for a skilled Full Stack Developer to join our team and help build the next generation of regenerative finance platforms.',
            requirements: [
              '5+ years of experience in full stack development',
              'Strong proficiency in React and Node.js',
              'Experience with TypeScript and modern frontend frameworks',
              'Knowledge of blockchain technology and smart contracts',
              'Excellent problem-solving and communication skills'
            ],
            responsibilities: [
              'Develop and maintain web applications using React and Node.js',
              'Collaborate with designers and product managers to build user-friendly interfaces',
              'Implement blockchain integrations and smart contract interactions',
              'Write clean, maintainable, and testable code',
              'Participate in code reviews and architectural discussions'
            ],
            benefits: [
              'Competitive salary and equity',
              'Remote work flexibility',
              'Health insurance and wellness benefits',
              'Professional development opportunities',
              '401(k) plan with company match'
            ],
            salary: '$120,000 - $160,000',
            postedDate: '2024-01-15',
            closingDate: '2024-02-28'
          },
          {
            id: '2',
            title: 'Blockchain Engineer',
            department: 'Engineering',
            location: 'San Francisco, CA',
            type: 'full-time',
            experience: 'senior',
            description: 'Join our blockchain team and work on cutting-edge regenerative finance solutions.',
            requirements: [
              '7+ years of experience in software development',
              '3+ years of blockchain development experience',
              'Strong knowledge of Solidity, Ethereum, and smart contracts',
              'Experience with DeFi protocols and token standards',
              'Understanding of cryptography and security best practices'
            ],
            responsibilities: [
              'Design and implement blockchain-based financial applications',
              'Develop secure smart contracts for DeFi protocols',
              'Audit existing smart contracts for security vulnerabilities',
              'Collaborate with research teams on new blockchain technologies',
              'Stay current with industry trends and emerging technologies'
            ],
            benefits: [
              'Competitive salary and equity',
              'Remote work options',
              'Health insurance and wellness benefits',
              'Professional development opportunities',
              'Flexible work hours'
            ],
            salary: '$140,000 - $180,000',
            postedDate: '2024-01-20',
            closingDate: '2024-03-01'
          },
          {
            id: '3',
            title: 'Sustainability Analyst',
            department: 'Impact',
            location: 'New York, NY',
            type: 'full-time',
            experience: 'mid',
            description: 'Help us measure and analyze the impact of regenerative finance projects.',
            requirements: [
              '3+ years of experience in sustainability or impact measurement',
              'Knowledge of carbon accounting and ESG metrics',
              'Strong analytical and research skills',
              'Experience with data analysis and visualization tools',
              'Excellent written and verbal communication skills'
            ],
            responsibilities: [
              'Develop and implement impact measurement frameworks',
              'Analyze project data to assess environmental and social impact',
              'Prepare reports for stakeholders and regulatory bodies',
              'Collaborate with project teams to improve impact outcomes',
              'Stay updated on industry standards and best practices'
            ],
            benefits: [
              'Competitive salary',
              'Health insurance and wellness benefits',
              'Remote work flexibility',
              'Professional development opportunities',
              'Paid time off'
            ],
            salary: '$80,000 - $110,000',
            postedDate: '2024-01-25',
            closingDate: '2024-03-15'
          },
          {
            id: '4',
            title: 'UX/UI Designer',
            department: 'Product',
            location: 'Remote',
            type: 'contract',
            experience: 'entry',
            description: 'Design beautiful and intuitive user interfaces for our regenerative finance platforms.',
            requirements: [
              '2+ years of experience in UX/UI design',
              'Strong portfolio showcasing web design projects',
              'Proficiency in Figma and other design tools',
              'Understanding of user-centered design principles',
              'Experience working in Agile development teams'
            ],
            responsibilities: [
              'Design wireframes, prototypes, and high-fidelity interfaces',
              'Collaborate with product managers and developers',
              'Conduct user research and usability testing',
              'Iterate on designs based on feedback',
              'Maintain design system documentation'
            ],
            benefits: [
              'Competitive hourly rate',
              'Remote work flexibility',
              'Access to design resources and tools',
              'Opportunity for full-time conversion'
            ],
            salary: '$45 - $65 per hour',
            postedDate: '2024-01-22',
            closingDate: '2024-02-25'
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to fetch job opportunities');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter && locationFilter !== "all") {
      filtered = filtered.filter(job => 
        job.location.toLowerCase() === locationFilter.toLowerCase()
      );
    }

    if (typeFilter && typeFilter !== "all") {
      filtered = filtered.filter(job => 
        job.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    if (experienceFilter && experienceFilter !== "all") {
      filtered = filtered.filter(job => 
        job.experience.toLowerCase() === experienceFilter.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  }, [searchTerm, locationFilter, typeFilter, experienceFilter, jobs]);

  // Handle application form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;
      setApplicationForm(prev => ({ ...prev, resume: file }));
    } else {
      setApplicationForm(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate application form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!applicationForm.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!applicationForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicationForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!applicationForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!applicationForm.resume) {
      errors.resume = 'Please upload your resume';
    } else if (applicationForm.resume.size > 5 * 1024 * 1024) { // 5MB limit
      errors.resume = 'Resume size must be less than 5MB';
    }

    if (!applicationForm.coverLetter.trim()) {
      errors.coverLetter = 'Cover letter is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle application submission
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // In real application, this would be an API call
      console.log('Application submitted for:', selectedJob?.title);
      console.log('Form data:', applicationForm);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Application submitted successfully!');
      setIsApplicationOpen(false);
      setApplicationForm({
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        portfolio: '',
        resume: null,
        coverLetter: '',
        comments: '',
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    }
  };

  // Handle job click
  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplicationOpen(false);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setTypeFilter('');
    setExperienceFilter('');
  };

  // Get unique locations for filter
  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location)));
  const uniqueTypes = Array.from(new Set(jobs.map(job => job.type)));
  const uniqueExperiences = Array.from(new Set(jobs.map(job => job.experience)));

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Careers at Atlas Sanctum
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join us in building a regenerative future through innovative finance and sustainability solutions
            </p>
          </div>

          {/* Search and Filter Section */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {uniqueExperiences.map(experience => (
                    <SelectItem key={experience} value={experience}>
                      {experience.charAt(0).toUpperCase() + experience.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Job Listings */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading job opportunities...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map(job => (
                  <Card 
                    key={job.id} 
                    className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedJob?.id === job.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleJobClick(job)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">{job.title}</h3>
                        <p className="text-muted-foreground">{job.department}</p>
                      </div>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{job.experience} level</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Briefcase className="w-4 h-4 mr-2" />
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {job.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <Badge variant="outline">
                        Closing: {new Date(job.closingDate).toLocaleDateString()}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium text-foreground mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-6">
                  No job opportunities match your current filters. Try adjusting your search criteria.
                </p>
                <Button onClick={handleClearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Job Details and Application Form */}
          {selectedJob && (
            <Card className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{selectedJob.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{selectedJob.department}</Badge>
                    <Badge variant="secondary">{selectedJob.type}</Badge>
                    <Badge variant="secondary">{selectedJob.experience} level</Badge>
                  </div>
                </div>
                <Button onClick={() => setIsApplicationOpen(!isApplicationOpen)}>
                  {isApplicationOpen ? 'Hide Application' : 'Apply Now'}
                </Button>
              </div>

              <Tabs defaultValue="overview">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{selectedJob.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-foreground">Location</h3>
                        <p className="text-muted-foreground">{selectedJob.location}</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-foreground">Salary</h3>
                        <p className="text-muted-foreground">{selectedJob.salary}</p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-foreground">Posted Date</h3>
                        <p className="text-muted-foreground">
                          {new Date(selectedJob.postedDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-foreground">Closing Date</h3>
                        <p className="text-muted-foreground">
                          {new Date(selectedJob.closingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="requirements">
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="responsibilities">
                  <ul className="space-y-2">
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="benefits">
                  <ul className="space-y-2">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>

              {/* Application Form */}
              {isApplicationOpen && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-xl font-bold text-foreground mb-6">Apply for this position</h3>
                  
                  <form onSubmit={handleSubmitApplication} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={applicationForm.name}
                          onChange={handleFormChange}
                          placeholder="John Doe"
                          className={formErrors.name ? 'border-destructive' : ''}
                        />
                        {formErrors.name && (
                          <p className="text-sm text-destructive flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" /> {formErrors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={applicationForm.email}
                          onChange={handleFormChange}
                          placeholder="john.doe@example.com"
                          className={formErrors.email ? 'border-destructive' : ''}
                        />
                        {formErrors.email && (
                          <p className="text-sm text-destructive flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" /> {formErrors.email}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={applicationForm.phone}
                          onChange={handleFormChange}
                          placeholder="+254759895739"
                          className={formErrors.phone ? 'border-destructive' : ''}
                        />
                        {formErrors.phone && (
                          <p className="text-sm text-destructive flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" /> {formErrors.phone}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          name="linkedin"
                          value={applicationForm.linkedin}
                          onChange={handleFormChange}
                          placeholder="https://linkedin.com/in/johndoe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio/Website</Label>
                        <Input
                          id="portfolio"
                          name="portfolio"
                          value={applicationForm.portfolio}
                          onChange={handleFormChange}
                          placeholder="https://johndoe.dev"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume/CV *</Label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, DOC, DOCX (Max. 5MB)
                            </p>
                          </div>
                          <Input
                            id="resume"
                            name="resume"
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFormChange}
                          />
                        </label>
                      </div>
                      {applicationForm.resume && (
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-sm text-foreground">{applicationForm.resume.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setApplicationForm(prev => ({ ...prev, resume: null }));
                              const fileInput = document.getElementById('resume') as HTMLInputElement;
                              if (fileInput) fileInput.value = '';
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      {formErrors.resume && (
                        <p className="text-sm text-destructive flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" /> {formErrors.resume}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Cover Letter *</Label>
                      <Textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={applicationForm.coverLetter}
                        onChange={handleFormChange}
                        placeholder="Please tell us why you're interested in this position and how your experience qualifies you..."
                        rows={6}
                        className={formErrors.coverLetter ? 'border-destructive' : ''}
                      />
                      {formErrors.coverLetter && (
                        <p className="text-sm text-destructive flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" /> {formErrors.coverLetter}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comments">Additional Comments</Label>
                      <Textarea
                        id="comments"
                        name="comments"
                        value={applicationForm.comments}
                        onChange={handleFormChange}
                        placeholder="Any additional information you'd like to share..."
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsApplicationOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        Submit Application
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Careers;