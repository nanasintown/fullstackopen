import { useState, useEffect } from 'react';
import phonebookService from './services/person.js';

const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      filter shown with{' '}
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
    </div>
  );
};

const PersonForm = ({
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  addPhone,
}) => {
  return (
    <form onSubmit={addPhone}>
      <div>
        name:{' '}
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Person = ({ person, handleDelete }) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={handleDelete}>delete</button>
    </div>
  );
};

const Persons = ({ personsToShow, handleDelete }) => {
  return (
    <div>
      {personsToShow.map((person) => (
        <Person
          key={person.name}
          person={person}
          handleDelete={() => handleDelete(person.id)}
        />
      ))}
    </div>
  );
};

const Notification = ({ notification }) => {
  const notificationStyle = {
    color: notification.type === 'success' ? 'green' : 'red',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    borderColor: notification.type === 'success' ? 'green' : 'red',
    fontSize: 20,
    padding: 10,
    marginBottom: 10,
  };

  if (notification.message === null) {
    return null;
  }
  return <div style={notificationStyle}>{notification.message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  useEffect(() => {
    phonebookService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const personsToShow =
    filter === ''
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  const addPhone = (event) => {
    event.preventDefault();
    console.log('button clicked', event.target);
    if (
      persons.some(
        (person) => person.name.toLowerCase() === newName.toLowerCase()
      )
    ) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find(
          (p) => p.name.toLowerCase() === newName.toLowerCase()
        );
        const changedPerson = { ...person, number: newNumber };
        phonebookService
          .update(person.id, changedPerson)
          .then((returnedPhone) => {
            setPersons(
              persons.map((p) => (p.id !== person.id ? p : returnedPhone))
            );
            setNewName('');
            setNewNumber('');
            setNotification({
              type: 'success',
              message: `Updated ${returnedPhone.name}`,
            });
            setTimeout(() => {
              setNotification({ message: null, type: null });
            }, 5000);
          })
          .catch((error) => {
            if (error.response.status === 404) {
              setNotification({
                type: 'error',
                message: `Information of ${person.name} has already been removed from server`,
              });
              setTimeout(() => {
                setNotification({ message: null, type: null });
              }, 5000);
            } else if (error.response.status === 400) {
              setNotification({
                type: 'error',
                message: error.response.data.error,
              });
              setTimeout(() => {
                setNotification({ message: null, type: null });
              }, 5000);
            }
            setPersons(persons.filter((p) => p.id !== person.id));
            setNewName('');
            setNewNumber('');
          });
      }
      return;
    }
    const phoneObject = {
      name: newName,
      number: newNumber,
    };

    phonebookService
      .create(phoneObject)
      .then((returnedPhone) => {
        setPersons(persons.concat(returnedPhone));
        setNewName('');
        setNewNumber('');
        setNotification({
          type: 'success',
          message: `Added ${returnedPhone.name}`,
        });
        setTimeout(() => {
          setNotification({ message: null, type: null });
        }, 5000);
      })
      .catch((error) => {
        setNotification({ type: 'error', message: error.response.data.error });
        setTimeout(() => {
          setNotification({ message: null, type: null });
        }, 5000);
      });
  };

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
        })
        .catch((error) => {
          setNotification({
            type: 'error',
            message: `Information of ${person.name} has already been removed from server`,
          });
          setTimeout(() => {
            setNotification({ message: null, type: null });
          }, 5000);
          setPersons(persons.filter((p) => p.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        addPhone={addPhone}
      />
      <h2>Numbers</h2>
      {personsToShow.length === 0 && <div>no matches found</div>}
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
