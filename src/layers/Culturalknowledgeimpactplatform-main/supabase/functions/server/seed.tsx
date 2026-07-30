import * as kv from "./kv_store.tsx";

// Check if the database needs to be seeded with initial data
export const checkAndSeedData = async () => {
  try {
    // Check if data already exists
    const existingStories = await kv.getByPrefix("story:");
    const existingDiscussions = await kv.getByPrefix("discussion:");

    // Only seed if database is empty
    if (existingStories.length === 0 && existingDiscussions.length === 0) {
      console.log("Database is empty, seeding with initial data...");
      
      // Seed default stories
      const defaultStories = [
        {
          id: "story:seed-1",
          title: "Preserving Indigenous Languages with AI",
          category: "Culture & Tech",
          author: "Elena Rodriguez",
          authorImage: "https://github.com/shadcn.png",
          story: "How a local community in the Amazon is using machine learning to archive and teach their endangered dialect.",
          likes: 124,
          comments: 18,
          timestamp: Date.now() - 86400000 * 2, // 2 days ago
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: "story:seed-2",
          title: "Sustainable Agriculture Networks",
          category: "Environment",
          author: "David Chen",
          authorImage: "",
          story: "Connecting farmers across Southeast Asia to share data-driven sustainable farming practices.",
          likes: 89,
          comments: 42,
          timestamp: Date.now() - 86400000 * 3, // 3 days ago
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: "story:seed-3",
          title: "The Ethics of Open Knowledge",
          category: "Policy",
          author: "Sarah Johnson",
          authorImage: "",
          story: "Exploring the boundaries of data privacy and open access in the age of global digital libraries.",
          likes: 256,
          comments: 67,
          timestamp: Date.now() - 86400000 * 5, // 5 days ago
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
        }
      ];

      // Seed default discussions
      const defaultDiscussions = [
        {
          id: "discussion:seed-1",
          title: "Project: AI for Coral Reef Restoration",
          author: "MarineLab",
          authorImage: "https://github.com/shadcn.png",
          tag: "Collaboration",
          replies: 12,
          time: "2h ago",
          content: "We are looking for data scientists to help analyze underwater drone footage. Is anyone interested in joining our open source initiative?",
          timestamp: Date.now() - 7200000, // 2 hours ago
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: "discussion:seed-2",
          title: "Question: Best practices for digital archiving?",
          author: "HeritageFdn",
          authorImage: "",
          tag: "Help Wanted",
          replies: 8,
          time: "5h ago",
          content: "We have thousands of hours of oral history recordings. What are the current standards for long-term preservation?",
          timestamp: Date.now() - 18000000, // 5 hours ago
          createdAt: new Date(Date.now() - 18000000).toISOString()
        },
        {
          id: "discussion:seed-3",
          title: "New Tool: Language Preservation API",
          author: "DevTeam_Alpha",
          authorImage: "",
          tag: "Tooling",
          replies: 24,
          time: "1d ago",
          content: "Just released v1.0 of our API. It supports 40+ low-resource languages. Check it out and let us know what you think!",
          timestamp: Date.now() - 86400000, // 1 day ago
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "discussion:seed-4",
          title: "Workshop: Ethics in AI Development",
          author: "EthicsBoard",
          authorImage: "",
          tag: "Event",
          replies: 45,
          time: "2d ago",
          content: "Join us this Friday for a workshop on implementing ethical guidelines in your ML pipelines.",
          timestamp: Date.now() - 86400000 * 2, // 2 days ago
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ];

      // Insert seed data
      for (const story of defaultStories) {
        await kv.set(story.id, story);
      }

      for (const discussion of defaultDiscussions) {
        await kv.set(discussion.id, discussion);
      }

      console.log("Database seeded successfully!");
      return { seeded: true, storiesCount: defaultStories.length, discussionsCount: defaultDiscussions.length };
    } else {
      console.log("Database already contains data, skipping seed.");
      return { seeded: false, existingStories: existingStories.length, existingDiscussions: existingDiscussions.length };
    }
  } catch (error) {
    console.error("Error during database seeding:", error.message);
    return { seeded: false, error: error.message };
  }
};
