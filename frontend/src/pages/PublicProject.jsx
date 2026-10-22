import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssetUrl } from "../services/api";
import { getPublicProject } from "../services/projectService";

function PublicProject() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicProject(slug).then(setData).catch((err) => setError(err.message || "Public project not found."));
  }, [slug]);

  if (error) return <div className="page-container"><div className="error-box">{error}</div></div>;
  if (!data) return <div className="loading">Loading public project...</div>;

  return (
    <div className="page-container public-project-page">
      <header className="public-project-hero"><span className="eyebrow">PUBLIC PROJECT</span><h1>{data.project.name}</h1><p>{data.project.description || "A project shared by the SmartCampus community."}</p><span>Led by {data.project.owner?.name}</span></header>
      <div className="public-project-grid">
        <main>
          <section className="workspace-panel"><span className="eyebrow">PROJECT NOTES</span><h2>What the team is building</h2>{data.notes.length ? data.notes.map((note) => <article className="note-card" key={note._id}><h3>{note.title}</h3><pre>{note.content}</pre>{note.aiSummary && <div className="ai-box"><strong>Summary</strong><p>{note.aiSummary}</p></div>}</article>) : <p>No public notes yet.</p>}</section>
        </main>
        <aside className="workspace-panel"><span className="eyebrow">TEAM</span><h2>{data.project.members?.length || 0} contributors</h2>{data.project.members?.map((member) => <div className="member-row" key={member.user._id}><span>{member.user.name}</span><small>{member.role}</small></div>)}<h2 className="public-files-heading">Files</h2>{data.files?.map((file) => <a className="file-link" href={getAssetUrl(file.url)} target="_blank" rel="noreferrer" key={file.id}>{file.originalName}</a>)}</aside>
      </div>
    </div>
  );
}

export default PublicProject;
