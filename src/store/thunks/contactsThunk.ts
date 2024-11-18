import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosAPI';
import { IContact, IContactMutation } from '../../types';

export const fetchAllContacts = createAsyncThunk<IContact[]>('contacts/fetchAll', async () => {
  const { data } = await axiosApi.get('contacts.json');
  return Object.keys(data || {}).map((key) => ({
    ...data[key],
    id: key
  }));
});

export const createContact = createAsyncThunk<IContact, IContactMutation>(
  'contacts/createContact',
  async (contactData) => {
    const { data } = await axiosApi.post('contacts.json', contactData);
    return { ...contactData, id: data.name };
  }
);

export const updateContact = createAsyncThunk<IContact, IContact & { id: string }>(
  'contacts/updateContact',
  async (contactData) => {
    await axiosApi.put(`contacts/${contactData.id}.json`, contactData);
    return contactData;
  }
);

export const deleteOneContact = createAsyncThunk<string, string>(
  'contacts/deleteOneContact',
  async (id: string) => {
    await axiosApi.delete(`contacts/${id}.json`);
    return id;
  }
);

