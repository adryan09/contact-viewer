import { Context, createContext } from "react";
import { ContactModel, ContactsModel, FormStateModel } from "../models/contacts-models";

export interface ContactContextModel {
    readonly storeFetchedContacts: (contactsList: ContactModel[]) => void;
    readonly removeContact: (contactId: number) => void;
    readonly editContact: (contactDetails: FormStateModel, contactId: number) => void;
    readonly contacts: ContactsModel;
    readonly addContact: (contactDetails: FormStateModel) => void;
}

export type ContactContextInterface = ContactContextModel | null;
export const ContactContext: Context<ContactContextInterface> = createContext<ContactContextInterface>(null);
