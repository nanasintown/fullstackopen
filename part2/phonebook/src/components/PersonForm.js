function PersonForm({
  onSubmit,
  nameValue,
  onNameValueChange,
  numberValue,
  onNumberValueChange,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={nameValue} onChange={onNameValueChange} />
      </div>
      <div>
        number: <input value={numberValue} onChange={onNumberValueChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}

export default PersonForm;
