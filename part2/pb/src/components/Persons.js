function Persons({ persons, filterText, handleDeletePerson }) {
  return (
    <div>
      <ul>
        {persons
          .filter((person) => person.name.includes(filterText))
          .map((person) => (
            <div key={person.name}>
              <li>
                {person.name} {person.number}
                <button onClick={() => handleDeletePerson(person.name)}>
                  delete
                </button>
              </li>
            </div>
          ))}
      </ul>
    </div>
  );
}

export default Persons;
