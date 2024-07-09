import axios from "axios";
import React, { FC, memo, useContext, useEffect, useState } from "react";
import { ContactContext, ContactContextModel } from "../context/contacts-context";

interface ContactsProps {
    readonly onContactItemClick: (id: number) => (event: React.MouseEvent)=> void;
}

interface ContactProps {
    readonly id: number;
    readonly name: string;
    readonly avatar: string;
    readonly onContactItemClick: (id: number) => (event: React.MouseEvent) => void;
}

const URL = 'https://61c32f169cfb8f0017a3e9f4.mockapi.io/api/v1/contacts';

const Contact: FC<ContactProps> = ({ id, name, avatar, onContactItemClick }: ContactProps): JSX.Element => (
    <div
        className='contacts'
        key={id}
        onClick={onContactItemClick(id)}
    >
        <div className='title'>Name: {name}</div>
        <img className="img" src={avatar} alt={name}/>
    </div>
);


const Contacts: FC<ContactsProps> = memo(({ onContactItemClick }: ContactsProps): JSX.Element => {
    const { storeFetchedContacts, contacts }: ContactContextModel = useContext(ContactContext) as ContactContextModel;
    const [error, setError] = useState<string>('');

    useEffect(() =>  {
        (async () => {
            try {
                const { data } = await axios.get(URL);
                storeFetchedContacts(data || []);
            } catch (error) {
                setError((error as Error).message || 'There was an error fetching the contacts');
            }
        })();
    }, [storeFetchedContacts]);

    if (error) {
        return (
            <div className="error-message">
                {error}
            </div>
        )
    }

    return (
        <div className="contacts-wrapper">
            {!!contacts.contactIds.length && <div className="contacts-number">Number of contacts available in the list:{contacts.contactIds.length}</div>}
            <div className="contacts-list">
                {contacts.contactIds.map((id: number) => {
                    const { name, avatar } = contacts.contacts[id];

                    return <Contact key={id} id={id} name={name} avatar={avatar} onContactItemClick={onContactItemClick} />;
                })}
            </div>
        </div>
    );
});

export default Contacts;