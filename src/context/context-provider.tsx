import React, { FC, useCallback, useState } from "react";
import axios from "axios";
import { ContactContext } from "./contacts-context";
import { omit, isEmpty } from 'lodash';
import { ContactModel, ContactsModel, FormStateModel } from "../models/contacts-models";

const initValues: ContactsModel = {
   contactIds: [],
   contacts: {},
}

const ContactsProvider: FC<{}> = function({ children }){
    const [contacts, updateContacts] = useState<ContactsModel>(initValues);

    const storeFetchedContacts = useCallback((contactsList: ContactModel[]) => {
        const contacts: ContactsModel = contactsList.reduce((acc: ContactsModel, current:ContactModel) => {
            return {
                ...acc,
                contactIds: isEmpty(acc)
                ? [parseInt(current.id)] 
                : [...acc.contactIds, parseInt(current.id)],
                contacts: {
                    ...acc.contacts,
                    [current.id]: current,
                }
            }
        }, {} as ContactsModel);
        updateContacts(contacts);
    }, []);


    const addContact = useCallback(async (contactDetails: FormStateModel) => {
        try {
            const { name, email, phone, avatar, birthday } = contactDetails;

            const { status } = await axios.post('https://61c32f169cfb8f0017a3e9f4.mockapi.io/api/v1/contacts', {
                email,
                name,
                phone,
                avatar,
                birthday
            });

            if (status === 201) {
                const lastIdValue: number =  contacts.contactIds[contacts.contactIds.length - 1];
                const newContactId: number = lastIdValue + 1;
                const newContacts: ContactsModel = {
                    contactIds: [...contacts.contactIds, newContactId],
                    contacts: {
                        ...contacts.contacts,
                        [newContactId]: {
                            name,
                            email,
                            avatar,
                        }
                    }
                }
                updateContacts(newContacts);
            }
        } catch (error) {
            console.log('There was some issue with creating a new contact');
        }
    }, [contacts, updateContacts]);

    const editContact = useCallback(async (newDetails: FormStateModel, contactId: number) => {
        try {
            const response = await axios.put(`https://61c32f169cfb8f0017a3e9f4.mockapi.io/api/v1/contacts/${contactId}`, {
                ...newDetails
            });

            if (response.status === 200) {
                const newUpdatedContact: ContactModel = { ...contacts.contacts[contactId], ...newDetails };
                const newContacts: ContactsModel = {
                    contactIds: contacts.contactIds,
                    contacts: {
                        ...contacts.contacts,
                        [contactId]: newUpdatedContact,
                    }
                }
                updateContacts(newContacts);
            }
        } catch (e) {
            console.log('There was some issues with editing the contact');
        }
    }, [contacts]);


    const removeContact = useCallback(async (contactId: number) => {
        try {
            const { status } = await axios.delete(`https://61c32f169cfb8f0017a3e9f4.mockapi.io/api/v1/contacts/${contactId}`);

            if (status === 200) {
                const newContacts: ContactsModel = {
                    contactIds: contacts.contactIds.filter((id: number) => contactId !== id),
                    contacts: omit(contacts.contacts, contactId)
                };

                updateContacts(newContacts);
            }
        } catch (error) {
            console.log('There was some issues with removing the contact');
        }
    }, [contacts])

    return (
        <ContactContext.Provider value={{
            contacts,
            storeFetchedContacts,
            editContact,
            removeContact,
            addContact,
        }}>
            {children}
        </ContactContext.Provider>
    )
};

export default ContactsProvider;