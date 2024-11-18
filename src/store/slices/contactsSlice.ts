import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IContact } from '../../types';
import { createContact, updateContact, fetchAllContacts, deleteOneContact } from '../thunks/contactsThunk';
import { RootState } from '../../app/store.ts';

interface ContactsState {
  contacts: IContact[];
  isFetchLoading: boolean;
  isAddLoading: boolean;
  isEditLoading: boolean;
  isDeleteLoading: boolean;
}

const initialState: ContactsState = {
  contacts: [],
  isFetchLoading: false,
  isAddLoading: false,
  isEditLoading: false,
  isDeleteLoading: false,
};

export const selectContacts = (state: RootState) => state.contacts.contacts;
export const selectFetchContactsLoading = (state: RootState) => state.contacts.isFetchLoading;
export const selectAddContactsLoading = (state: RootState) => state.contacts.isAddLoading;
export const selectEditContactsLoading = (state: RootState) => state.contacts.isEditLoading;
export const selectDeleteContactsLoading = (state: RootState) => state.contacts.isDeleteLoading;

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllContacts.pending, (state) => {
        state.isFetchLoading = true;
      })
      .addCase(fetchAllContacts.fulfilled, (state, action: PayloadAction<IContact[]>) => {
        state.contacts = action.payload;
        state.isFetchLoading = false;
      })
      .addCase(fetchAllContacts.rejected, (state) => {
        state.isFetchLoading = false;
      })
      .addCase(createContact.pending, (state) => {
        state.isAddLoading = true;
      })
      .addCase(createContact.fulfilled, (state, action: PayloadAction<IContact>) => {
        state.contacts.push(action.payload);
        state.isAddLoading = false;
      })
      .addCase(createContact.rejected, (state) => {
        state.isAddLoading = false;
      })

      .addCase(updateContact.pending, (state) => {
        state.isEditLoading = true;
      })
      .addCase(updateContact.fulfilled, (state, action: PayloadAction<IContact>) => {
        const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = action.payload;
        }
        state.isEditLoading = false;
      })
      .addCase(updateContact.rejected, (state) => {
        state.isEditLoading = false;
      })

      .addCase(deleteOneContact.pending, (state) => {
        state.isDeleteLoading = true;
      })
      .addCase(deleteOneContact.fulfilled, (state, action: PayloadAction<string>) => {
        state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
        state.isDeleteLoading = false;
      })
      .addCase(deleteOneContact.rejected, (state) => {
        state.isDeleteLoading = false;
      });
  }
});

export const contactsReducer = contactsSlice.reducer;
