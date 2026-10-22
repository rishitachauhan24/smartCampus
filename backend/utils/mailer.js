import nodemailer from "nodemailer";

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const missingSettings = [
    ["SMTP_HOST", SMTP_HOST],
    ["SMTP_PORT", SMTP_PORT],
    ["SMTP_USER", SMTP_USER],
    ["SMTP_PASS", SMTP_PASS]
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingSettings.length) {
    throw new Error(`Email service is not configured. Missing: ${missingSettings.join(", ")}. Add them to backend/.env and restart the backend.`);
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_PORT) === "465",
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
};

export const sendProjectInvitation = async ({ email, project, inviterName }) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const projectUrl = `${clientUrl}/projects/${project._id}`;
  const registerUrl = `${clientUrl}/register?email=${encodeURIComponent(email)}`;

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: `${inviterName} invited you to collaborate on ${project.name}`,
    text: `${inviterName} invited you to collaborate on "${project.name}" in SmartCampus.\n\nCreate your account: ${registerUrl}\n\nAfter registering, open the project: ${projectUrl}`,
    html: `<p><strong>${inviterName}</strong> invited you to collaborate on <strong>${project.name}</strong> in SmartCampus.</p><p><a href="${registerUrl}">Create your account</a>, then open the <a href="${projectUrl}">project workspace</a>.</p>`
  });
};