import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAssetUrl } from "../services/api";
import { addMember, createNote, getProject, getProjectAnalytics, summarizeNote, updateProject, uploadProjectFile } from "../services/projectService";

function ProjectWorkspace() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [files, setFiles] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [note, setNote] = useState({ title: "", content: "" });
  const [memberEmail, setMemberEmail] = useState("");
  const [editingProject, setEditingProject] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", description: "", visibility: "private" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadWorkspace = async () => {
    try {
      setLoading(true);
      setError("");
      const [workspace, stats] = await Promise.all([getProject(id), getProjectAnalytics(id)]);
      setProject(workspace.project);
      setProjectForm({
        name: workspace.project.name,
        description: workspace.project.description || "",
        visibility: workspace.project.visibility,
      });
      setNotes(workspace.notes || []);
      setFiles(workspace.project?.files || workspace.files || []);
      setAnalytics(stats);
    } catch (err) {
      setError(err.message || "Unable to load this workspace.");
    } finally {
      setLoading(false);
    }
  };

  const isOwner = project?.owner?._id === user?.id || project?.owner?._id === user?._id || project?.owner === user?.id;

  const handleProjectUpdate = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const data = await updateProject(id, projectForm);
      setProject(data.project);
      setEditingProject(false);
      setSuccess("Project updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update project.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [id]);

  const handleNote = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const data = await createNote(id, note);
      setNotes((current) => [data.note, ...current]);
      setNote({ title: "", content: "" });
      setSuccess("Markdown note saved.");
    } catch (err) {
      setError(err.message || "Unable to save note.");
    } finally {
      setSaving(false);
    }
  };

  const handleSummary = async (noteId) => {
    try {
      setError("");
      const data = await summarizeNote(id, noteId);
      setNotes((current) => current.map((item) => item._id === noteId ? data.note : item));
      setSuccess("AI summary generated.");
    } catch (err) {
      setError(err.message || "Unable to generate AI summary.");
    }
  };

  const handleMember = async (event) => {
    event.preventDefault();
    try {
      const data = await addMember(id, memberEmail);
      if (data.project) setProject(data.project);
      setMemberEmail("");
      setSuccess(data.message || (data.invited ? "Invitation email sent." : "Collaborator added."));
    } catch (err) {
      setError(err.message || "Unable to add collaborator.");
    }
  };

  const handleFile = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    try {
      const data = await uploadProjectFile(id, selectedFile);
      setFiles((current) => [...current, data.file]);
      setSuccess("File uploaded.");
    } catch (err) {
      setError(err.message || "Unable to upload file.");
    }
    event.target.value = "";
  };

  if (loading) return <div className="loading">Loading workspace...</div>;
  if (!project) return <div className="page-container"><div className="error-box">{error || "Project not found."}</div></div>;

  return (
    <div className="page-container workspace-page">
      <Link to="/projects" className="back-link">← All projects</Link>
      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <header className="workspace-hero">
        <div>
          <span className={`visibility-badge ${project.visibility}`}>{project.visibility}</span>
          <h1>{project.name}</h1>
          <p>{project.description || "A shared project workspace."}</p>
        </div>
        <div className="workspace-actions">
          {isOwner && <button className="btn btn-secondary" onClick={() => setEditingProject((current) => !current)}>{editingProject ? "Close edit" : "Edit project"}</button>}
          <button className="btn btn-danger" type="button" disabled title="Delete is unavailable because the backend has no delete endpoint">Delete project</button>
          {project.visibility === "public" && <Link className="btn btn-secondary" to={`/share/projects/${project.slug}`}>Open public page</Link>}
        </div>
      </header>

      {editingProject && isOwner && (
        <form className="workspace-panel project-edit-form" onSubmit={handleProjectUpdate}>
          <span className="eyebrow">PROJECT SETTINGS</span>
          <div className="form-group"><label htmlFor="edit-project-name">Project name</label><input id="edit-project-name" value={projectForm.name} onChange={(event) => setProjectForm({ ...projectForm, name: event.target.value })} required /></div>
          <div className="form-group"><label htmlFor="edit-project-description">Description</label><textarea id="edit-project-description" rows="4" value={projectForm.description} onChange={(event) => setProjectForm({ ...projectForm, description: event.target.value })} /></div>
          <div className="form-group"><label htmlFor="edit-project-visibility">Visibility</label><select id="edit-project-visibility" value={projectForm.visibility} onChange={(event) => setProjectForm({ ...projectForm, visibility: event.target.value })}><option value="private">Private</option><option value="public">Public share page</option></select></div>
          <button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
        </form>
      )}

      <div className="workspace-layout">
        <main>
          <section className="workspace-panel">
            <div className="workspace-section-heading"><div><span className="eyebrow">MARKDOWN NOTES</span><h2>Project knowledge</h2></div><span>{notes.length} notes</span></div>
            <form className="note-editor" onSubmit={handleNote}>
              <input value={note.title} onChange={(event) => setNote({ ...note, title: event.target.value })} placeholder="Note title" required />
              <textarea value={note.content} onChange={(event) => setNote({ ...note, content: event.target.value })} placeholder="Write markdown: decisions, research, meeting notes..." rows="7" required />
              <button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : "Save markdown note"}</button>
            </form>
            <div className="note-list">
              {notes.map((item) => <article className="note-card" key={item._id}><div className="note-card-heading"><div><h3>{item.title}</h3><small>Updated {new Date(item.updatedAt).toLocaleString()}</small></div><button className="btn btn-small btn-outline" onClick={() => handleSummary(item._id)}>AI summary</button></div><pre>{item.content}</pre>{item.aiSummary && <div className="ai-box"><strong>AI summary</strong><p>{item.aiSummary}</p></div>}</article>)}
            </div>
          </section>
        </main>

        <aside className="workspace-sidebar">
          <section className="workspace-panel"><span className="eyebrow">COLLABORATORS</span><h2>{project.members?.length || 0} members</h2><div className="member-list">{project.members?.map((member) => <div className="member-row" key={member.user._id}><span>{member.user.name}</span><small>{member.role}</small></div>)}</div><form className="inline-form" onSubmit={handleMember}><input type="email" value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} placeholder="member@email.com" required /><button className="btn btn-primary">Add</button></form></section>
          <section className="workspace-panel"><span className="eyebrow">FILES</span><h2>Project files</h2><label className="file-drop">Upload file<input type="file" onChange={handleFile} /></label><div className="file-list">{files.map((file) => <a href={getAssetUrl(file.url)} target="_blank" rel="noreferrer" key={file.id}>{file.originalName}</a>)}</div></section>
          <section className="workspace-panel"><span className="eyebrow">CONTRIBUTIONS</span><h2>{analytics?.summary?.total || 0} activities</h2><div className="contribution-list">{analytics?.byUser?.map((item) => <div className="member-row" key={item.user.email}><span>{item.user.name}</span><strong>{item.count}</strong></div>)}</div></section>
        </aside>
      </div>
    </div>
  );
}

export default ProjectWorkspace;
