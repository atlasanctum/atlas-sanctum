import type { CarbonProject, ProjectType } from "@/types/marketplace";

export type SortBy = "newest" | "trending" | "price";
export type FilterType = "all" | ProjectType;

/**
 * Filters and sorts projects based on search query, category filter, and sort option
 */
export const filterAndSortProjects = (
  projects: CarbonProject[],
  searchQuery: string,
  selectedFilter: FilterType,
  sortBy: SortBy
): CarbonProject[] => {
  let filtered = [...projects];

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(project =>
      project.title?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.location?.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (selectedFilter !== "all") {
    filtered = filtered.filter(project => project.project_type === selectedFilter);
  }

  // Apply sorting
  const sorted = [...filtered];
  if (sortBy === "trending") {
    sorted.sort((a, b) => (b.available_credits || 0) - (a.available_credits || 0));
  } else if (sortBy === "price") {
    sorted.sort((a, b) => (a.price_per_credit || 0) - (b.price_per_credit || 0));
  } else if (sortBy === "newest") {
    sorted.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }

  return sorted;
};

/**
 * Formats filter name for display
 */
export const formatFilterName = (filter: string): string => {
  return filter.replace(/_/g, " ").charAt(0).toUpperCase() + filter.replace(/_/g, " ").slice(1);
};
