import React, { useEffect } from 'react';
import {Routes, Route } from 'react-router-dom';
import ToolBar from './components/ToolBar/ToolBar';
import ContactsList from './components/ContactsList/ContactsList';
import AddContact from './components/AddContact/AddContact';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllContacts } from './store/thunks/contactsThunk';
import { selectContacts, selectFetchContactsLoading } from './store/slices/contactsSlice';
import { AppDispatch } from './app/store.ts';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const contacts = useSelector(selectContacts);
  const isLoading = useSelector(selectFetchContactsLoading);

  useEffect(() => {
    dispatch(fetchAllContacts());
  }, [dispatch]);

  return (
    <>
      <ToolBar />
      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={<ContactsList contacts={contacts} isLoading={isLoading} />}
          />
          <Route path="/add" element={<AddContact />} />
          <Route path="/edit/:id" element={<AddContact />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
