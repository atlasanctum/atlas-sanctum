import { FileText, Zap, Users, DollarSign, Shield, Code } from "lucide-react";
import { motion } from "framer-motion";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  fields: {
    title: string;
    description: string;
    category: string;
  };
}

interface ProposalTemplatesProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

export function ProposalTemplates({ onSelectTemplate, onClose }: ProposalTemplatesProps) {
  const templates: Template[] = [
    {
      id: "grant",
      name: "Grant Proposal",
      description: "Request funding for a project or initiative",
      category: "funding",
      icon: <DollarSign className="w-6 h-6" />,
      fields: {
        title: "Grant Proposal: [Project Name]",
        description: `## Project Overview
[Provide a brief overview of your project]

## Objectives
- [Objective 1]
- [Objective 2]
- [Objective 3]

## Budget Breakdown
- Item 1: $X,XXX
- Item 2: $X,XXX
- Total: $X,XXX

## Timeline
- Phase 1: [Duration]
- Phase 2: [Duration]
- Completion: [Date]

## Team
[List team members and qualifications]

## Expected Outcomes
[Describe measurable results]`,
        category: "funding",
      },
    },
    {
      id: "governance",
      name: "Governance Change",
      description: "Propose changes to DAO governance structure",
      category: "governance",
      icon: <Users className="w-6 h-6" />,
      fields: {
        title: "Governance Proposal: [Change Description]",
        description: `## Current State
[Describe the current governance mechanism]

## Proposed Change
[Clearly outline the proposed changes]

## Rationale
[Explain why this change is needed]

## Implementation
[Describe how the change will be implemented]

## Impact Assessment
- Positive Impacts: [List benefits]
- Potential Risks: [List concerns]
- Mitigation Strategy: [How to address risks]

## Community Feedback
[Summarize any prior discussions]`,
        category: "governance",
      },
    },
    {
      id: "technical",
      name: "Technical Upgrade",
      description: "Propose technical improvements or upgrades",
      category: "technical",
      icon: <Code className="w-6 h-6" />,
      fields: {
        title: "Technical Proposal: [Feature/Upgrade Name]",
        description: `## Technical Specification
[Provide detailed technical specifications]

## Problem Statement
[Describe the problem this solves]

## Proposed Solution
[Detail the technical solution]

## Architecture
[Include diagrams or architecture description]

## Security Considerations
[List security implications and mitigations]

## Testing Plan
[Describe testing methodology]

## Deployment Strategy
[Outline rollout plan]

## Maintenance
[Long-term maintenance considerations]`,
        category: "technical",
      },
    },
    {
      id: "ethics",
      name: "Ethics Framework",
      description: "Propose ethical guidelines or frameworks",
      category: "ethics",
      icon: <Shield className="w-6 h-6" />,
      fields: {
        title: "Ethics Proposal: [Framework Name]",
        description: `## Ethical Principles
[List core ethical principles]

## Scope
[Define what this framework covers]

## Guidelines
1. [Guideline 1]
2. [Guideline 2]
3. [Guideline 3]

## Implementation
[How to implement these ethics]

## Monitoring & Enforcement
[How to ensure compliance]

## Review Process
[How often will this be reviewed]

## Alignment with Universal Values
- Human Dignity: [How it aligns]
- Fairness: [How it aligns]
- Transparency: [How it aligns]`,
        category: "ethics",
      },
    },
    {
      id: "partnership",
      name: "Partnership Proposal",
      description: "Propose partnerships or collaborations",
      category: "governance",
      icon: <Users className="w-6 h-6" />,
      fields: {
        title: "Partnership Proposal: [Partner Name]",
        description: `## Partner Overview
[Information about the partner organization]

## Partnership Objectives
[What we aim to achieve together]

## Benefits to DAO
- [Benefit 1]
- [Benefit 2]
- [Benefit 3]

## Terms & Conditions
[Key terms of the partnership]

## Resource Commitment
[What resources are required]

## Timeline
[Partnership duration and milestones]

## Success Metrics
[How to measure partnership success]

## Exit Strategy
[How to end partnership if needed]`,
        category: "governance",
      },
    },
    {
      id: "blank",
      name: "Blank Proposal",
      description: "Start from scratch with a blank template",
      category: "governance",
      icon: <FileText className="w-6 h-6" />,
      fields: {
        title: "",
        description: "",
        category: "governance",
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-1">Proposal Templates</h2>
              <p className="text-sm text-gray-600">
                Choose a template to get started quickly
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <motion.button
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="mt-3">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {template.category}
                      </span>
                    </div>
                  </div>
                  <Zap className="w-5 h-5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Templates help ensure your proposal includes all necessary information
          </p>
        </div>
      </motion.div>
    </div>
  );
}
