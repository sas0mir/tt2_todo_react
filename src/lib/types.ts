export interface Todo {
    id: string;
    title: string;
    description?: string;
    dueDate: string; // Можно использовать Date, если дата будет парситься
    isCompleted?: boolean;
}

export interface userData {
    username: string | null;
    token: string | null;
}

export interface TodoModalProps {
    open: boolean;
    handleClose: () => void;
    handleSave: (todo: { id: string, title: string; description: string; dueDate: string }) => void;
    initialData?: Todo | null;
}