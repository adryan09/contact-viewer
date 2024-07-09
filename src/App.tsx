import React, { useCallback, useState } from 'react';
import './App.css';
import ContactsProvider from './context/context-provider';
import ModalWrapper from './components/modal-wrapper';
import Contacts from './components/contacts';

function App() {
  const [contactId, setContactId] = useState<number | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleClickContactItem = useCallback((id: number)=> (event: React.MouseEvent) => {
    event.stopPropagation();
    setContactId(id);
    setShowModal((prev) => !prev);
}, [setContactId, setShowModal]);

  const handleCloseModal = useCallback(() => {
    setShowModal((prev) => false);
  }, [setShowModal]);

  return (
      <div className="app">
          <div className="info">Click on a contact image to view details</div>
          <ContactsProvider>
              <Contacts onContactItemClick={handleClickContactItem}/>
              <ModalWrapper contactId={contactId} showModal={showModal} closeModal={handleCloseModal}/>
          </ContactsProvider>
      </div>
  );
}

export default App;
