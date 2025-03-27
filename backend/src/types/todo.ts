export interface ITodoBody {
  title: string;
  description: string;
  userId?: string;
  imageUrl?: string;
  fileUrl?: string;
  recommendation?: string;
  tags?: string[];
  completed?: boolean;
}

export interface ITodo {
  _id: string;
  body: ITodoBody;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoCreateDTO {
  body: {
    title: string;
    description: string;
    userId?: string;
    imageUrl?: string;
    fileUrl?: string;
    tags?: string[];
  }
}

export interface TodoUpdateDTO {
  body: {
    title?: string;
    description?: string;
    completed?: boolean;
    imageUrl?: string;
    fileUrl?: string;
    tags?: string[];
  }
}