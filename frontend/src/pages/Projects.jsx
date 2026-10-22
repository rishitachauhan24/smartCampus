import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createProject, getProjects } from "../services/projectService";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", visibility: "private" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      const data = await createProject(form);
      setProjects((current) => [data.project, ...current]);
      setForm({ name: "", description: "", visibility: "private" });
      setSuccess("Project created successfully.");
    } catch (err) {
      setError(err.message || "Unable to create project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container workspace-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">COLLABORATION HUB</span>
          <h1>Your Projects</h1>
          <p>Build together, keep decisions in markdown, and see who is contributing.</p>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <div className="workspace-layout">
        <section className="workspace-panel">
          <h2>Start a project</h2>
          <form className="issue-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="project-name">Project name</label>
              <input id="project-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required placeholder="Campus Innovation Lab" />
            </div>
            <div className="form-group">
              <label htmlFor="project-description">Description</label>
              <textarea id="project-description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What are you building?" rows="4" />
            </div>
            <div className="form-group">
              <label htmlFor="project-visibility">Visibility</label>
              <select id="project-visibility" value={form.visibility} onChange={(event) => setForm({ ...form, visibility: event.target.value })}>
                <option value="private">Private</option>
                <option value="public">Public share page</option>
              </select>
            </div>
            <button className="btn btn-primary" disabled={saving}>{saving ? "Creating..." : "Create project"}</button>
          </form>
        </section>

        <section>
          <div className="workspace-section-heading">
            <h2>Active projects</h2>
            <span>{projects.length} total</span>
          </div>
          {loading && <div className="loading">Loading projects...</div>}
          {!loading && !projects.length && <div className="empty-box"><h2>No projects yet</h2><p>Create your first shared workspace.</p></div>}
          <div className="project-grid">
            {projects.map((project) => (
              <Link className="project-card" to={`/projects/${project._id}`} key={project._id}>
                <div className="project-card-top"><span className={`visibility-badge ${project.visibility}`}>{project.visibility}</span><span>{project.members?.length || 0} members</span></div>
                <h3>{project.name}</h3>
                <p>{project.description || "No description yet."}</p>
                <strong>Open workspace →</strong>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Projects;
