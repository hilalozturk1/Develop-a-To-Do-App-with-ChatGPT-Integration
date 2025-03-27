export interface ITodo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: Object;
  imageUrl: string;
  fileUrl: string;
  recommendation: string;
  tags: string[];
}

export interface TodoCreateDTO {
  title: string;
  description: string;
}

export interface TodoUpdateDTO {
  title?: string;
  description?: string;
  completed?: boolean;
} 