// One labelled field: label, the control (passed as children), an optional
// hint, and the validation message shown right below the control.
const EntryFormField = ({ id, label, error, hint, children }) => {
  return (
    <div className="c-field">
      {id ? (
        <label className="c-label" htmlFor={id}>
          {label}
        </label>
      ) : (
        <span className="c-label">{label}</span>
      )}
      {children}
      {error ? (
        <p className="c-error" role="alert">
          {error}
        </p>
      ) : null}
      {hint ? <p className="c-hint">{hint}</p> : null}
    </div>
  );
};

export default EntryFormField;
