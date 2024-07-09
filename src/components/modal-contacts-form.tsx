import React, { FC, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import validator from 'validator';
import Bem from 'bem-react-helper';
import { ContactContext, ContactContextModel } from '../context/contacts-context';
import { ContactModel, FormStateModel } from '../models/contacts-models';
import { reduce, isEqual, isEmpty } from 'lodash';
import { ScreenTypes } from "./modal-wrapper";
interface ContactsFormPublicProps {
    readonly isAddMode: boolean;
    readonly contactId: number | undefined;
    readonly closeModal: () => void;
    readonly screenType: ScreenTypes;
}

const initialValuesAddContactsMode: FormStateModel = {
    name: '',
    avatar: '',
    birthday: '',
    email: '',
    phone: '',
};

enum FieldTypes {
    NAME = "name",
    EMAIL = "email",
    PHONE = "phone",
    BIRTHDAY = "birthday",
    AVATAR = "avatar"
}

type FieldsValidationModel = {
    readonly [key in keyof FormStateModel]: boolean;
};

type FieldsErrors = {
    readonly [key: string]: string;
}
const INITIAL_VALIDATION_STATE = {
    avatar: false,
    birthday: false,
    email: false,
    name: false,
    phone: false,
};

const INITIAL_FIELDS_ERROR_STATE = {
    avatar: '',
    birthday: '',
    email: '',
    name: '',
    phone: '',
}

const FIELDS_ERRORS_TEXT: FieldsErrors = {
    name: 'Please enter a valid username',
    avatar: 'Please enter a valid avatar url',
    phone: 'Please enter a valid phone',
    birthday: 'Please enter a valid birthday',
    email: 'Please enter a valid email',
}



const ContactsForm: FC<ContactsFormPublicProps> = memo(function AddContactFormComponent(
    {
        isAddMode,
        contactId,
        closeModal,
        screenType,
    }: ContactsFormPublicProps
){

    const { addContact, contacts, editContact }: ContactContextModel = useContext(ContactContext) as ContactContextModel;
    const initialValues = useMemo(() => {
        if (isAddMode) {
            return initialValuesAddContactsMode;
        } else {
            if (!contactId) {
                throw new Error('contactId is not defined');
            }
            return contacts.contacts[contactId];
        }
    }, [isAddMode, contacts.contacts, contactId]);

    const [formFields, setFormFields] = useState<FormStateModel>(initialValues);
    const [fieldsValidationData, setFieldsValidationData] = useState<FieldsValidationModel>(INITIAL_VALIDATION_STATE);
    const [diff, setDiff] = useState<Partial<FormStateModel>>({});
    const [enabledSubmit, setEnabledSubmit] = useState<boolean>(false);
    const prevCountRef = useRef<Partial<FormStateModel> | undefined>();
    const [errors, setErrors] = useState<FieldsErrors>(INITIAL_FIELDS_ERROR_STATE);

    const validateUserName = useCallback(() => {

        const username: string | undefined = formFields.name;
        if (username && username.length > 3) {
            // clear any previous related error message
            if (errors.name) {
                setErrors((prevState) => ({...prevState, name: ''}));
            }
            // set the validation state to true
            setFieldsValidationData((prevState) => ({ ...prevState, name: true }));
        } else {
            setErrors((prevState) => ({ ...prevState, name: FIELDS_ERRORS_TEXT.name }));
            setFieldsValidationData((prevState) => ({ ...prevState, name: false }));
        }
    }, [formFields.name, errors.name]);

    const validateBirthDay = useCallback(() => {
        const birthDay: string | undefined = formFields.birthday;
        if (birthDay) {
            if (errors.birthday) {
                setErrors((prevState) => ({...prevState, birthday: ''}));
            }
            setFieldsValidationData((prevState) => ({ ...prevState, birthday: true }));
        } else {
            setErrors((prevState) => ({ ...prevState, birthday: FIELDS_ERRORS_TEXT.birthDay }));
            setFieldsValidationData((prevState) => {
                return { ...prevState, birthday: false }
            });
        }
    }, [formFields.birthday, errors.birthday]);

    const validateEmail = useCallback(()=> {
        const email: string | undefined = formFields.email;
        if (validator.isEmail(email as string)) {
            if (errors.email) {
                setErrors((prevState) => ({...prevState, email: ''}));
            }
            setFieldsValidationData((prevState) => ({...prevState, email: true }));
        } else {
            setErrors((prevState) => ({ ...prevState, email: FIELDS_ERRORS_TEXT.email }));
            setFieldsValidationData((prevState) => ({...prevState, email: false }));
        }
    }, [formFields.email, errors.email]);

    const validatePhone = useCallback(()=> {
        const phone: string | undefined = formFields.phone;
        if (validator.isMobilePhone(phone as string)) {
            if (errors.phone) {
                setErrors((prevState) => ({...prevState, phone: ''}));
            }
            setFieldsValidationData((prevState) => ({...prevState, phone: true }));
        } else {
            setErrors((prevState) => ({ ...prevState, phone: FIELDS_ERRORS_TEXT.phone }));
            setFieldsValidationData((prevState) => ({...prevState, phone: false }));
        }
    }, [formFields.phone, errors.phone]);

    const validateAvatar = useCallback(()=> {
        const avatar: string | undefined = formFields.avatar;
        if (validator.isURL(avatar as string)) {
            if (errors.avatar) {
                setErrors((prevState) => ({...prevState, avatar: ''}));
            }
            setFieldsValidationData((prevState) => ({...prevState, avatar: true }));
        } else {
            setErrors((prevState) => ({ ...prevState, avatar: FIELDS_ERRORS_TEXT.avatar }));
            setFieldsValidationData((prevState) => ({...prevState, avatar: false }));
        }
    }, [formFields.avatar, errors.avatar]);


    useEffect(() => {
        /*
          validate fields on edit mode
        */
        if (!isAddMode) {
            validateUserName();
            validateEmail();
            validateAvatar();
            validateBirthDay();
            validatePhone();
        }


        const stateContactsDetails: ContactModel = contacts.contacts[contactId as number];

        let difference = reduce(
            stateContactsDetails,
            (result, value, key) => {
                return isEqual(value, formFields[key as keyof FormStateModel])
                    ? result
                    : {...result, [key]: formFields[key as keyof FormStateModel]};
            },
            {}
        );

        if (!isEmpty(difference)) {
            prevCountRef.current = difference;
            setDiff(difference);
            setEnabledSubmit(true);
        } else if (!isEmpty(prevCountRef.current)) {
            setEnabledSubmit(false);
        }

    }, [formFields, contactId, contacts, isAddMode, validateUserName, validateEmail, validateAvatar, validateBirthDay, validatePhone]);

    const handleEvent = useCallback((fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>): void => {
        setFormFields((prevState) => {
            return {
                ...prevState,
                [fieldName]: event.target.value,
            }
        });
        if (event.type === 'blur') {
            if (fieldName === FieldTypes.NAME) {
                validateUserName();
            }

            if (fieldName === FieldTypes.EMAIL) {
                validateEmail();
            }

            if (fieldName === FieldTypes.PHONE) {
                validatePhone();
            }

            if (fieldName === FieldTypes.BIRTHDAY) {
                validateBirthDay();
            }

            if (fieldName === FieldTypes.AVATAR) {
                validateAvatar();
            }
        }

    }, [validateUserName, validateEmail, validatePhone, validateBirthDay, validateAvatar]);

    const handleSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        const formIsValid: boolean = Object.values(fieldsValidationData).every((value) => value === true);

        if (formIsValid) {
            if (isAddMode) {
                addContact(formFields);
            } else {
                if (Object.keys(diff).length) {
                    editContact(diff as FormStateModel, contactId!);
                }
            }
        } else {
            let newErrors: FieldsErrors = {};
            Object.keys(errors).forEach((key: string) => {
                if (errors[key as keyof FieldsErrors] === '') {
                    newErrors = {
                        ...errors,
                        [key]: FIELDS_ERRORS_TEXT[key],
                    }
                }
            });
            setErrors(newErrors)
        }

    }, [fieldsValidationData, isAddMode, addContact, formFields, diff, editContact, contactId, errors]);

    return (
        <div className="modal-form">
            <div className="close-form-container">
                <button className="close-form" onClick={closeModal}>X</button>
            </div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label>
                        <p>Name</p>
                        <input name="name" value={formFields.name} onBlur={handleEvent('name')}
                               onChange={handleEvent('name')}/>
                        {errors.name && <div className='error-message'>{errors.name}</div>}
                    </label>
                    <label>
                        <p>Avatar</p>
                        <input name="avatar" value={formFields.avatar} onBlur={handleEvent('avatar')}
                               onChange={handleEvent('avatar')}/>
                        {errors.avatar && <div className='error-message'>{errors.avatar}</div>}
                    </label>
                    <label>
                        <p>Email</p>
                        <input name="email" value={formFields.email} onBlur={handleEvent('email')}
                               onChange={handleEvent('email')}/>
                        {errors.email && <div className='error-message'>{errors.email}</div>}
                    </label>
                    <label>
                        <p>Phone</p>
                        <input name="phone" value={formFields.phone} onBlur={handleEvent('phone')}
                               onChange={handleEvent('phone')}/>
                        {errors.phone && <div className='error-message'>{errors.phone}</div>}
                    </label>
                    <label>
                        <p>Birthday</p>
                        <input name="birthday" type="date" value={formFields.birthday} onBlur={handleEvent('birthday')}
                               onChange={handleEvent('birthday')}/>
                        {errors.birthday && <div className='error-message'>{errors.birthday}</div>}
                    </label>
                </fieldset>
                <button className={Bem('Submit', {
                    mods: {Disabled: !enabledSubmit}
                })} type="submit">Submit
                </button>
            </form>
        </div>
    )
});

/*
    I do this hoc as a workaround to avoid having conditional hooks error in component
    Another way is to have a wrapper ofer the ContactsForm component and pass the props
 */
const withModalContactForm = function(ModalContactsFormComponent: FC<ContactsFormPublicProps>){
    return function ModalContactsFormWrapper(props: ContactsFormPublicProps) {
        if (!props.screenType) {
            return null;
        }

        return <ModalContactsFormComponent {...props} />
    }
}

export const ModalContactsForm = withModalContactForm(ContactsForm);
