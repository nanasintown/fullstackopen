const UserForm = ({ name, number, onNameInput, onNumberInput, onAddUser }) => {
  return (
    <form onSubmit={onAddUser}>
      <div>
        name: <input value={name} onChange={onNameInput} />
      </div>
      <div>
        number: <input value={number} onChange={onNumberInput} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default UserForm;
