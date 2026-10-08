export type User = {
  id: string;
  username: string;
};

export type ToDoItem = {
  id: string;
  title: string;
  assigneeId: string;
  createdAt: number;
};
