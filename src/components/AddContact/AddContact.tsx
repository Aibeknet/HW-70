import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IContactMutation } from '../../types';
import { selectContacts, selectAddContactsLoading, selectEditContactsLoading } from '../../store/slices/contactsSlice';
import { createContact, updateContact } from '../../store/thunks/contactsThunk.ts';
import { AppDispatch } from '../../app/store.ts';

const AddContact: React.FC = () => {
  const [formData, setFormData] = useState<IContactMutation>({
    name: '',
    phoneNumber: '',
    email: '',
    urlPhoto: ''
  });

  const [emailError, setEmailError] = useState<string>('');
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const contacts = useSelector(selectContacts);

  const isAddLoading = useSelector(selectAddContactsLoading);
  const isEditLoading = useSelector(selectEditContactsLoading);

  useEffect(() => {
    if (id) {
      const contactToEdit = contacts.find(contact => contact.id === id);
      if (contactToEdit) {
        setFormData(contactToEdit);
      }
    }
  }, [id, contacts]);

  const checkEmailUniqueness = (email: string) => {
    const existingContact = contacts.find(contact => contact.email === email);
    if (existingContact && existingContact.id !== id) {
      setEmailError('This email is already in use');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'email') {
      checkEmailUniqueness(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkEmailUniqueness(formData.email)) {
      return;
    }

    if (id) {
      dispatch(updateContact({ id, ...formData }));
    } else {
      dispatch(createContact(formData));
    }
    navigate('/');
  };

  return (
    <div className="container mt-4">
      <h3>{id ? 'Edit Contact' : 'Add New Contact'}</h3>

      {(isAddLoading || isEditLoading) && (
        <div className="alert alert-info">
         Loading...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            className="form-control"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="text"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {emailError && <div className="text-danger">{emailError}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Photo</label>
          <input
            type="text"
            name="urlPhoto"
            className="form-control mb-3"
            value={formData.urlPhoto}
            onChange={handleChange}
          />
          <div className="d-flex flex-column mb-3">
            <label className="form-label">Photo Preview</label>
            {formData.urlPhoto && (
              <img
                src={formData.urlPhoto}
                alt="Preview"
                width="100"
                height="100"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary me-3" disabled={!!emailError}>
          Save
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="btn btn-secondary">
          Back to contacts
        </button>
      </form>
    </div>
  );
};

export default AddContact;
