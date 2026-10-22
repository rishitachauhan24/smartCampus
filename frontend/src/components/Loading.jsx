function Loading({ text = "Loading..." }) {
  return (
    <div className="loading">
      <span className="loading-spinner" />
      {text}
    </div>
  );
}

export default Loading;