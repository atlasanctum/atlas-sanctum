import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-f7350c8a/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== STORIES ENDPOINTS =====

// Get all stories
app.get("/make-server-f7350c8a/stories", async (c) => {
  try {
    const stories = await kv.getByPrefix("story:");
    // Sort by timestamp (newest first)
    const sortedStories = stories.sort((a, b) => b.timestamp - a.timestamp);
    return c.json({ success: true, data: sortedStories });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return c.json({ success: false, error: "Failed to fetch stories" }, 500);
  }
});

// Submit a new story
app.post("/make-server-f7350c8a/stories", async (c) => {
  try {
    const body = await c.req.json();
    const { title, category, story, author, authorImage } = body;

    if (!title || !category || !story) {
      return c.json({ success: false, error: "Missing required fields" }, 400);
    }

    const storyId = `story:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const storyData = {
      id: storyId,
      title,
      category,
      excerpt: story.substring(0, 200),
      fullStory: story,
      author: author || "Anonymous",
      authorImage: authorImage || "",
      likes: 0,
      comments: 0,
      timestamp: Date.now(),
      image: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop`, // Default image
    };

    await kv.set(storyId, storyData);
    console.log(`Story created successfully: ${storyId}`);
    
    return c.json({ success: true, data: storyData });
  } catch (error) {
    console.error("Error creating story:", error);
    return c.json({ success: false, error: "Failed to create story" }, 500);
  }
});

// Like a story
app.post("/make-server-f7350c8a/stories/:id/like", async (c) => {
  try {
    const storyId = c.req.param("id");
    const story = await kv.get(storyId);

    if (!story) {
      return c.json({ success: false, error: "Story not found" }, 404);
    }

    story.likes = (story.likes || 0) + 1;
    await kv.set(storyId, story);

    return c.json({ success: true, data: story });
  } catch (error) {
    console.error("Error liking story:", error);
    return c.json({ success: false, error: "Failed to like story" }, 500);
  }
});

// ===== DISCUSSIONS ENDPOINTS =====

// Get all discussions
app.get("/make-server-f7350c8a/discussions", async (c) => {
  try {
    const discussions = await kv.getByPrefix("discussion:");
    // Sort by timestamp (newest first)
    const sortedDiscussions = discussions.sort((a, b) => b.timestamp - a.timestamp);
    return c.json({ success: true, data: sortedDiscussions });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return c.json({ success: false, error: "Failed to fetch discussions" }, 500);
  }
});

// Create a new discussion
app.post("/make-server-f7350c8a/discussions", async (c) => {
  try {
    const body = await c.req.json();
    const { title, content, author, authorImage, tag } = body;

    if (!title || !content) {
      return c.json({ success: false, error: "Missing required fields" }, 400);
    }

    const discussionId = `discussion:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const discussionData = {
      id: discussionId,
      title,
      content,
      author: author || "Anonymous",
      authorImage: authorImage || "",
      tag: tag || "General",
      replies: 0,
      timestamp: Date.now(),
      time: "Just now",
    };

    await kv.set(discussionId, discussionData);
    console.log(`Discussion created successfully: ${discussionId}`);
    
    return c.json({ success: true, data: discussionData });
  } catch (error) {
    console.error("Error creating discussion:", error);
    return c.json({ success: false, error: "Failed to create discussion" }, 500);
  }
});

// ===== RESEARCH DATA ENDPOINTS =====

// Get research nodes for knowledge graph
app.get("/make-server-f7350c8a/research/nodes", async (c) => {
  try {
    const nodes = await kv.getByPrefix("research_node:");
    return c.json({ success: true, data: nodes });
  } catch (error) {
    console.error("Error fetching research nodes:", error);
    return c.json({ success: false, error: "Failed to fetch research nodes" }, 500);
  }
});

// Initialize default data (call this once to seed the database)
app.post("/make-server-f7350c8a/init-data", async (c) => {
  try {
    // Seed some initial stories
    const defaultStories = [
      {
        id: "story:default_1",
        title: "Preserving Indigenous Languages with AI",
        category: "Culture & Tech",
        author: "Elena Rodriguez",
        authorImage: "https://github.com/shadcn.png",
        image: "https://images.unsplash.com/photo-1758599669186-9eaf14f6f3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnZpcm9ubWVudGFsJTIwaW1wYWN0JTIwbmF0dXJlJTIwc3VzdGFpbmFibGUlMjBmdXR1cmV8ZW58MXx8fHwxNzY2NTc2NDc2fDA&ixlib=rb-4.1.0&q=80&w=1080",
        excerpt: "How a local community in the Amazon is using machine learning to archive and teach their endangered dialect.",
        fullStory: "How a local community in the Amazon is using machine learning to archive and teach their endangered dialect.",
        likes: 124,
        comments: 18,
        timestamp: Date.now() - 86400000,
      },
      {
        id: "story:default_2",
        title: "Sustainable Agriculture Networks",
        category: "Environment",
        author: "David Chen",
        authorImage: "",
        image: "https://images.unsplash.com/photo-1749006590475-4592a5dbf99f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFydGlmaWNpYWwlMjBpbnRlbGxpZ2VuY2UlMjB0ZWNobm9sb2d5JTIwbmV0d29ya3xlbnwxfHx8fDE3NjY1NzY0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        excerpt: "Connecting farmers across Southeast Asia to share data-driven sustainable farming practices.",
        fullStory: "Connecting farmers across Southeast Asia to share data-driven sustainable farming practices.",
        likes: 89,
        comments: 42,
        timestamp: Date.now() - 172800000,
      },
      {
        id: "story:default_3",
        title: "The Ethics of Open Knowledge",
        category: "Policy",
        author: "Sarah Johnson",
        authorImage: "",
        image: "https://images.unsplash.com/photo-1762732526878-3dd89d99c904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaWJyYXJ5JTIwcmVzZWFyY2glMjBrbm93bGVkZ2UlMjBlZHVjYXRpb258ZW58MXx8fHwxNzY2NTc2NDc2fDA&ixlib=rb-4.1.0&q=80&w=1080",
        excerpt: "Exploring the boundaries of data privacy and open access in the age of global digital libraries.",
        fullStory: "Exploring the boundaries of data privacy and open access in the age of global digital libraries.",
        likes: 256,
        comments: 67,
        timestamp: Date.now() - 259200000,
      },
    ];

    // Seed some initial discussions
    const defaultDiscussions = [
      {
        id: "discussion:default_1",
        title: "Project: AI for Coral Reef Restoration",
        author: "MarineLab",
        authorImage: "https://github.com/shadcn.png",
        tag: "Collaboration",
        replies: 12,
        time: "2h ago",
        content: "We are looking for data scientists to help analyze underwater drone footage. Is anyone interested in joining our open source initiative?",
        timestamp: Date.now() - 7200000,
      },
      {
        id: "discussion:default_2",
        title: "Question: Best practices for digital archiving?",
        author: "HeritageFdn",
        authorImage: "",
        tag: "Help Wanted",
        replies: 8,
        time: "5h ago",
        content: "We have thousands of hours of oral history recordings. What are the current standards for long-term preservation?",
        timestamp: Date.now() - 18000000,
      },
      {
        id: "discussion:default_3",
        title: "New Tool: Language Preservation API",
        author: "DevTeam_Alpha",
        authorImage: "",
        tag: "Tooling",
        replies: 24,
        time: "1d ago",
        content: "Just released v1.0 of our API. It supports 40+ low-resource languages. Check it out and let us know what you think!",
        timestamp: Date.now() - 86400000,
      },
      {
        id: "discussion:default_4",
        title: "Workshop: Ethics in AI Development",
        author: "EthicsBoard",
        authorImage: "",
        tag: "Event",
        replies: 45,
        time: "2d ago",
        content: "Join us this Friday for a workshop on implementing ethical guidelines in your ML pipelines.",
        timestamp: Date.now() - 172800000,
      },
    ];

    // Store all default data
    for (const story of defaultStories) {
      await kv.set(story.id, story);
    }
    for (const discussion of defaultDiscussions) {
      await kv.set(discussion.id, discussion);
    }

    console.log("Default data initialized successfully");
    return c.json({ success: true, message: "Default data initialized" });
  } catch (error) {
    console.error("Error initializing data:", error);
    return c.json({ success: false, error: "Failed to initialize data" }, 500);
  }
});

Deno.serve(app.fetch);