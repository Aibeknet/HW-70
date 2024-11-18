import React, { useState, useCallback } from 'react';
import { IContact } from '../../types';
import Modal from '../../UI/Modal/Modal.tsx';
import { Link } from 'react-router-dom';
import { deleteOneContact, fetchAllContacts } from '../../store/thunks/contactsThunk.ts';
import { AppDispatch } from '../../app/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { selectDeleteContactsLoading } from '../../store/slices/contactsSlice';

interface ContactsListProps {
  contacts: IContact[];
  isLoading: boolean;
}

const ContactsList: React.FC<ContactsListProps> = ({ contacts, isLoading }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const isDeleteLoading = useSelector(selectDeleteContactsLoading);

  const openModal = (contact: IContact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedContact(null);
  };

  const deleteContact = useCallback(async (id: string) => {
    await dispatch(deleteOneContact(id));
    setShowModal(false);
    await dispatch(fetchAllContacts());
  }, [dispatch]);

  if (isLoading || isDeleteLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      {contacts.length === 0 ? (
        <p>Contacts not added yet</p>
      ) : (
        <ul className="list-group">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              onClick={() => openModal(contact)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <img
                  src={contact.urlPhoto}
                  alt="Avatar"
                  width="50"
                  height="50"
                  className="rounded-circle me-3"
                />
                <strong>{contact.name}</strong>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedContact && (
        <Modal show={showModal} closeModal={closeModal}>
          <div className="d-flex">
            <img
              src={selectedContact.urlPhoto}
              alt="Avatar"
              width="150"
              height="150"
              className="rounded-circle me-4 mb-4"
            />
            <div className="mt-3">
              <p><strong>Name:</strong> {selectedContact.name}</p>
              <p><strong>Phone:</strong> {selectedContact.phoneNumber}</p>
              <p><strong>Email:</strong> {selectedContact.email}</p>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <Link to={`/edit/${selectedContact.id}`} className="btn btn-warning px-4 me-3">
              Edit
            </Link>
            <button
              className="btn btn-danger px-4"
              onClick={() => selectedContact && deleteContact(selectedContact.id)}
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContactsList;
