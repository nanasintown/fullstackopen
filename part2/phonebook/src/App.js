import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import phonebookService from './services/person';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [message, setMessage] = useState({});

  useEffect(() => {
    phonebookService.getAll().then((personData) => setPersons(personData));
  }, []);

  const [newName, setNewName] = useState('');
  const [newNumber, setnewNumber] = useState('');
  const [filterText, setFilterText] = useState('');

  const handleNumberChange = (event) => {
    setnewNumber(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  };

  const addPhone = (event) => {
    event.preventDefault();

    const index = persons.findIndex((person) => person.name === newName);
    const person = persons[index];

    if (index !== -1) {
      if (person.number === newNumber) {
        alert(`${newName} is already added to phonebook with the same number`);
      } else {
        const userResponse = window.confirm(
          `${person.name} is already added to phonebook, replace the old number with the new one?`
        );

        if (userResponse) {
          phonebookService
            .update({ ...person, number: newNumber })
            .then((personData) => {
              setPersons(
                persons.map((p) => (p.id === personData.id ? personData : p))
              );

              setMessage({ value: `Updated ${person.name}`, type: 'success' });
              setTimeout(() => setMessage({}), 3000);
              setNewName('');
              setnewNumber('');
            })
            .catch((e) => {
              setMessage({
                value: `Information of ${person.name} has already been removed from server`,
                type: 'failure',
              });
              setTimeout(() => setMessage({}), 3000);
              setPersons(persons.filter((p) => p.id !== person.id));
              setNewName('');
              setnewNumber('');
            });
        }
      }
    } else {
      const newPerson = { name: newName, number: newNumber };

      phonebookService
        .create(newPerson)
        .then((personData) => setPersons([...persons, personData]));
      setNewName('');
      setnewNumber('');
      setMessage({ value: `Added ${newPerson.name}`, type: 'success' });
      setTimeout(() => setMessage({}), 3000);
    }
  };

  const deletePerson = (name) => {
    const userResponse = window.confirm(`delete ${name} ?`);

    const { id } = persons.find((person) => person.name === name);

    if (userResponse) {
      phonebookService.deletePerson(id).then((response) => {
        if (response === 200) {
          setPersons(persons.filter((p) => p.id !== id));
        }
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.value} type={message.type} />
      <Filter value={filterText} onChange={handleFilterTextChange} />
      <div>
        <h3>Add a new</h3>
      </div>
      <PersonForm
        onSubmit={addPhone}
        nameValue={newName}
        onNameValueChange={handleNameChange}
        numberValue={newNumber}
        onNumberValueChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        filterText={filterText}
        handleDeletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
