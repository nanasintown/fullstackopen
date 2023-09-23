import { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newSearchName, setNewSearchName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const newPersonObj = { name: newName, number: newNumber };

    let exists = false;
    for (let i = 0; i < persons.length; i++) {
      if (persons[i].name === newPersonObj.name) {
        exists = true;
      }
    }

    if (exists) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(persons.concat(newPersonObj));
    }
    setNewName('');
    setNewNumber('');
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleSearchName = (event) => {
    setNewSearchName(event.target.value);
  };

  const personsToShow = () => {
    if (newSearchName === '' || !newSearchName) {
      return persons;
    } else {
      persons.filter((person) =>
        person.name.toLowerCase().includes(newSearchName.toLowerCase())
      );
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        newSearchName={newSearchName}
        handleSearchName={handleSearchName}
      />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} />
    </div>
  );
};

export default App;
