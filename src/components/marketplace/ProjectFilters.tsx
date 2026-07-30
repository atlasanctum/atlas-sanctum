import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { ProjectType} from '@/types/marketplace';
import { PROJECT_TYPE_LABELS, PROJECT_TYPE_ICONS } from '@/types/marketplace';

interface ProjectFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedType: ProjectType | undefined;
  onTypeChange: (type: ProjectType | undefined) => void;
}

const projectTypes: ProjectType[] = [
  'reforestation',
  'renewable_energy',
  'methane_capture',
  'ocean_restoration',
  'soil_carbon',
  'direct_air_capture',
];

export function ProjectFilters({ search, onSearchChange, selectedType, onTypeChange }: ProjectFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search projects by name, location, or description..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-card border-border/50 focus:border-primary/50"
          aria-label="Search projects"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedType === undefined ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange(undefined)}
          className={selectedType === undefined ? 'bg-primary' : 'border-border/50 hover:border-primary/30'}
          aria-pressed={selectedType === undefined}
        >
          All Projects
        </Button>
        {projectTypes.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTypeChange(type)}
            className={selectedType === type ? 'bg-primary' : 'border-border/50 hover:border-primary/30'}
            aria-pressed={selectedType === type}
          >
            {PROJECT_TYPE_ICONS[type]} {PROJECT_TYPE_LABELS[type]}
          </Button>
        ))}
      </div>
    </div>
  );
}
