import { useEffect, useState } from 'react';
import Filter from './components/Filter';
import UserForm from './components/UserForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

import {
  createNotification,
  createErrorNotification,
  DEFAULT_NOTIFICATION,
} from './components/notification.utils';

import {
  confirmDeleteOperation,
  confirmUpdateOperation,
  excludeName,
  findByName,
  getUpdatedPersons,
  nameIncludes,
} from './app.utils';

import {
  createPerson,
  deletePerson,
  getAllPersons,
  updatePerson,
} from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState(DEFAULT_NOTIFICATION);

  useEffect(() => {
    getAllPersons().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleAddUser = (event) => {
    event.preventDefault();

    const oldPerson = findByName({ name: newName, persons });

    if (oldPerson && confirmUpdateOperation(oldPerson.name)) {
      const changedPerson = { ...oldPerson, number: newNumber };
      updatePerson(changedPerson)
        .then((updatedPerson) => {
          setPersons(getUpdatedPersons(updatedPerson, persons));

          const updateNtf = createNotification(
            `User ${newName} updated`,
            notification
          );
          setNotification(updateNtf);
        })
        .catch((error) => {
          const errorNtf = createErrorNotification(
            `Could not update user ${newName}`,
            notification,
            error
          );
          setNotification(errorNtf);
        });
    } else if (!oldPerson) {
      const newPerson = { name: newName, number: newNumber };

      createPerson(newPerson)
        .then((createdPerson) => {
          setPersons([...persons, createdPerson]);

          const createNtf = createNotification(
            `User ${newName} added`,
            notification
          );
          setNotification(createNtf);
        })
        .catch((error) => {
          const errorNtf = createErrorNotification(
            `Could not add user ${newName}`,
            notification,
            error
          );
          setNotification(errorNtf);
        });
    }
  };

  const handleDeleteUser = ({ name, id }) => {
    if (confirmDeleteOperation(name)) {
      deletePerson(id)
        .then(() => {
          const leftPersons = persons.filter(excludeName(name));
          setPersons(leftPersons);
          setNotification(
            createNotification(`User ${name} deleted`, notification)
          );
        })
        .catch((error) => {
          const errorNtf = createErrorNotification(
            `Could not delete user ${name}`,
            notification,
            error
          );
          setNotification(errorNtf);
        });
    }
  };

  const handleNameInput = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} onFilterInputChange={handleFilterChange} />
      <h2>add a new</h2>
      <UserForm
        name={newName}
        number={newNumber}
        onAddUser={handleAddUser}
        onNameInput={handleNameInput}
        onNumberInput={handleNumberInput}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons.filter(nameIncludes(filter))}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default App;
