import { storiesApi, discussionsApi } from './api';

const SAMPLE_STORIES = [
  {
    title: "Preserving Indigenous Languages with AI",
    category: "Culture & Tech",
    story: "How a local community in the Amazon is using machine learning to archive and teach their endangered dialect. The project has successfully documented over 10,000 hours of audio recordings and created interactive learning materials.",
    author: "Elena Rodriguez",
    authorImage: "https://github.com/shadcn.png",
  },
  {
    title: "Sustainable Agriculture Networks",
    category: "Environment",
    story: "Connecting farmers across Southeast Asia to share data-driven sustainable farming practices. This network has helped reduce water usage by 30% while increasing crop yields by 25% across participating farms.",
    author: "David Chen",
    authorImage: "",
  },
  {
    title: "The Ethics of Open Knowledge",
    category: "Policy",
    story: "Exploring the boundaries of data privacy and open access in the age of global digital libraries. This research initiative brings together legal scholars, technologists, and ethicists to develop frameworks for responsible knowledge sharing.",
    author: "Sarah Johnson",
    authorImage: "",
  },
];

const SAMPLE_DISCUSSIONS = [
  {
    title: "Project: AI for Coral Reef Restoration",
    content: "We are looking for data scientists to help analyze underwater drone footage. Is anyone interested in joining our open source initiative? We have partnerships with marine biology departments and need help with computer vision models.",
    tag: "Collaboration",
    author: "MarineLab",
    authorImage: "https://github.com/shadcn.png",
  },
  {
    title: "Question: Best practices for digital archiving?",
    content: "We have thousands of hours of oral history recordings. What are the current standards for long-term preservation? Any recommendations for tools and workflows would be greatly appreciated.",
    tag: "Help Wanted",
    author: "HeritageFdn",
    authorImage: "",
  },
  {
    title: "New Tool: Language Preservation API",
    content: "Just released v1.0 of our API. It supports 40+ low-resource languages. Check it out and let us know what you think! Documentation and examples are available on our GitHub repository.",
    tag: "Tooling",
    author: "DevTeam_Alpha",
    authorImage: "",
  },
  {
    title: "Workshop: Ethics in AI Development",
    content: "Join us this Friday for a workshop on implementing ethical guidelines in your ML pipelines. We'll cover bias detection, fairness metrics, and responsible deployment practices. Register on our website!",
    tag: "Event",
    author: "EthicsBoard",
    authorImage: "",
  },
];

export const seedInitialData = async () => {
  try {
    console.log('Checking if data needs to be seeded...');
    
    // Check if stories exist
    const storiesResponse = await storiesApi.getAll();
    if (storiesResponse.stories.length === 0) {
      console.log('Seeding sample stories...');
      for (const story of SAMPLE_STORIES) {
        await storiesApi.submit(story);
        console.log(`Seeded story: ${story.title}`);
      }
    } else {
      console.log(`Found ${storiesResponse.stories.length} existing stories, skipping seed.`);
    }

    // Check if discussions exist
    const discussionsResponse = await discussionsApi.getAll();
    if (discussionsResponse.discussions.length === 0) {
      console.log('Seeding sample discussions...');
      for (const discussion of SAMPLE_DISCUSSIONS) {
        await discussionsApi.create(discussion);
        console.log(`Seeded discussion: ${discussion.title}`);
      }
    } else {
      console.log(`Found ${discussionsResponse.discussions.length} existing discussions, skipping seed.`);
    }

    console.log('Data seeding completed!');
  } catch (error) {
    console.error('Error seeding initial data:', error);
    // Don't throw - we want the app to continue even if seeding fails
  }
};
