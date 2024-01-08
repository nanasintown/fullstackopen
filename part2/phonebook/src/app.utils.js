export const findByName = ({ name, persons }) =>
  persons.find((p) => p.name.toLowerCase() === name.toLocaleLowerCase());

export const nameIncludes =
  (filter) =>
  ({ name }) =>
    name.toLowerCase().includes(filter.toLowerCase());

export const excludeName =
  (excludedName) =>
  ({ name }) =>
    name !== excludedName;

export const confirmUpdateOperation = (name) =>
  window.confirm(
    `${name} is already added to phonebook, replace the old number with a new one?`
  );

export const confirmDeleteOperation = (name) =>
  window.confirm(`Delete ${name}?`);

export const getUpdatedPersons = (updatedPerson, persons) =>
  persons.map((p) => (p.id === updatedPerson.id ? updatedPerson : p));
