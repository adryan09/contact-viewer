export interface ContactModel {
    readonly name: string;
    readonly avatar: string;
    readonly email: string;
    readonly phone: string;
    readonly birthday: string;
    readonly id: string;
}

export interface ContactsModel {
    readonly contactIds: number[];
    readonly contacts: Record<string, ContactModel>;
}

export type FormStateModel = Omit<ContactModel, "createdAt" | "id">;