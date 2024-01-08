const Filter = ({ filter, onFilterInputChange }) => {
  return (
    <div>
      filter show with
      <input value={filter} onChange={onFilterInputChange} />
    </div>
  );
};

export default Filter;
