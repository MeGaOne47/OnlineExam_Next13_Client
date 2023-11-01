interface IBlog {
    id:  number; 
    content: string;
    author: string;
    title: string;
}

interface IUser {
    sub: number;
    username: string | null;
    fullname: string | null;
    gender: string | null;
    birthdate: Date | null;
}

interface IAnswer {
    answerId: number;
    content: string;
    isCorrect: boolean;
  }
  
  interface IQuestion {
    questionId: number;
    content: string;
    answers: IAnswer[];
  }
  
  interface IExam {
    examId: number;
    numberOfQuestions: number;
    timeLimit: number;
    questions: IQuestion[];
    usersTook: any[]; // Hoặc bạn có thể xác định kiểu dữ liệu cụ thể cho usersTook
  }
  
  interface ITatistical{
    theNumberOfUser: number;
    theHigestScore: number;
    averageScore: number;

  }