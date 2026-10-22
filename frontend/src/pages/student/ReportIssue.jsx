import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";

function ReportIssue() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    priority: "Medium",
    isAnonymous: false,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [image]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (image && image.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("location", formData.location);
      data.append("priority", formData.priority);
      data.append("isAnonymous", formData.isAnonymous);

      if (image) {
        data.append("image", image);
      }

      await apiRequest("/issues", {
        method: "POST",
        body: data,
      });

      setSuccess("Issue reported successfully!");

      window.setTimeout(() => {
        navigate("/student/issues");
      }, 900);

      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        priority: "Medium",
        isAnonymous: false,
      });

      setImage(null);

      const fileInput = document.getElementById("issue-image");

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (err) {
      setError(err.message || "Failed to report issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <div className="form-card">

        <h1>Report a Campus Issue</h1>

        <p className="form-description">
          Report a problem on campus and help us improve your campus
          experience.
        </p>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {success && (
          <div className="success-box">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="issue-form">

          {/* Title */}

          <div className="form-group">
            <label htmlFor="title">
              Issue Title
            </label>

            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Wi-Fi not working"
              required
            />
          </div>


          {/* Description */}

          <div className="form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the problem in detail..."
              rows="5"
              required
            />
          </div>


          {/* Category */}

          <div className="form-group">
            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Category
              </option>

              <option value="Wi-Fi / Network">
                Wi-Fi / Network
              </option>

              <option value="Classroom">
                Classroom
              </option>

              <option value="Hostel">
                Hostel
              </option>

              <option value="Library">
                Library
              </option>

              <option value="Cleanliness">
                Cleanliness
              </option>

              <option value="Electrical">
                Electrical
              </option>

              <option value="Water">
                Water
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>


          {/* Location */}

          <div className="form-group">
            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: Hostel Block A"
              required
            />
          </div>


          {/* Priority */}

          <div className="form-group">
            <label htmlFor="priority">
              Priority
            </label>

            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

              <option value="Critical">
                Critical
              </option>
            </select>
          </div>


          {/* Image */}

          <div className="form-group">
            <label htmlFor="issue-image">
              Upload Image
            </label>

            <input
              id="issue-image"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => {
                setImage(e.target.files[0] || null);
              }}
            />

            {imagePreview && (
              <div className="upload-preview">
                <img src={imagePreview} alt="Selected issue preview" />
                <span>{image.name}</span>
              </div>
            )}

            <small>
              Optional. Maximum size: 5MB.
            </small>
          </div>


          {/* Anonymous */}

          <div className="checkbox-group">

            <input
              id="isAnonymous"
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
            />

            <label htmlFor="isAnonymous">
              Report this issue anonymously
            </label>

          </div>


          {/* Submit */}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Report Issue"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ReportIssue;