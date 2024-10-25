export interface Todo {
    id: string;
    title: string;
    description?: string;
    dueDate: string; // Можно использовать Date, если дата будет парситься
    isCompleted: boolean;
}