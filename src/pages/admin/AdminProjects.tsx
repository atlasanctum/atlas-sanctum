import { motion } from "framer-motion";
import ProjectsTable from "@/components/admin/ProjectsTable";

const AdminProjects = () => {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Manage Projects
        </h1>
        <p className="text-muted-foreground">
          Create, edit, and manage carbon offset projects
        </p>
      </motion.div>

      <ProjectsTable />
    </div>
  );
};

export default AdminProjects;
