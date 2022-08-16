import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { collection, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore/lite";
import cors from 'cors';
import { signInWithEmailAndPassword, getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import admin from "firebase-admin";
import { API_ROUTE, NewQuiz, Quiz } from '../src/Types';
import { generatePermalink } from './src/utils';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { db, firebaseAdminApp, firebaseAuth } from './src/firebase';
import { schemas, validate } from './src/validation';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(bodyParser.json());

const getUserFromToken = async (token: string) => {
  try {
    const user = await admin.auth(firebaseAdminApp).verifySessionCookie(token);
    return user;
  } catch (error) {
    return null;
  }
};

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  try {
    await admin.auth(firebaseAdminApp).verifySessionCookie(token);
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
}

const getQuizes = async () => {
  const quizesCol = collection(db, "quizes");
  const quizesSnapshot = await getDocs(quizesCol);
  return quizesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Quiz[];
};

app.get(`/${API_ROUTE['get-quiz']}`, async (req: Request, res: Response) => {
  const permalink = req.query.permalink;
  if (!permalink) {
    res.status(400).send("No quiz permalink provided.");
    return;
  }

  const quizes = await getQuizes();
  const quiz = quizes.find((quiz) => quiz.permalink === permalink);

  if (quiz) {
    res.send(quiz);
  } else {
    res.statusMessage = "Quiz not found.";
    res.status(400).send()
  }
});

app.use(`/${API_ROUTE['get-my-quizes']}`, checkAuth);
app.get(`/${API_ROUTE['get-my-quizes']}`, async (req: Request, res: Response) => {
  const user = await getUserFromToken(req.cookies.token as string);
  if (!user || !user.uid) {
    res.status(401).send("Unauthorized");
    return;
  }

  const quizes = await getQuizes();
  const myQuizes = quizes.filter((quiz) => quiz.userId === user.uid);

  res.send(myQuizes);
});

app.use(`/${API_ROUTE['publish-quiz']}`, checkAuth);
app.post(`/${API_ROUTE['publish-quiz']}`, validate(schemas.newQuiz), async (req: Request, res: Response) => {
  const user = await getUserFromToken(req.cookies.token as string);
  const quiz = req.body.quiz as NewQuiz;

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  await addDoc(collection(db, "quizes"), {
    ...quiz,
    userId: user.uid,
    permalink: generatePermalink()
  });

  res.send('Success');
});

app.use(`/${API_ROUTE['delete-quiz']}`, checkAuth);
app.delete(`/${API_ROUTE['delete-quiz']}`, async (req: Request, res: Response) => {
  const user = await getUserFromToken(req.cookies.token as string);
  const quizId = req.body.quizId as string;

  const quizes = await getQuizes();
  const quizToDelete = quizes.find((quiz) => quiz.id === quizId);

  if (!quizToDelete) {
    res.status(400).send("Quiz not found.");
  }

  // Check for user and if user owns quiz to delete
  if (!user || quizToDelete?.userId !== user.uid) {
    res.status(401).send("Unauthorized");
    return;
  }

  await deleteDoc(doc(db, "quizes", quizId));

  res.send('Success');
});

app.post(`/${API_ROUTE['login']}`, async (req: Request, res: Response) => {
  const email = req.body.email as string;
  const password = req.body.password as string;

  try {
    const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const token = await user.getIdToken(true);
    const cookie = await admin.auth(firebaseAdminApp).createSessionCookie(token, {expiresIn: 60 * 60 * 1000});
  
    res.cookie("token", cookie, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(new Date().getTime() + 60 * 60 * 1000)
    }).send(user.uid);
  } catch (err) {
    const error = err as Error;
    res.status(400).send(error.message);
  }
});

app.get(`/${API_ROUTE['load-user-from-token']}`, async (req: Request, res: Response) => {
  const user = await getUserFromToken(req.cookies.token as string);
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  res.send(user.uid);
});

app.post(`/${API_ROUTE['logout']}`, async (_: Request, res: Response) => {
  res.clearCookie("token").send("Success");
});

app.post(`/${API_ROUTE['signup']}`, async (req: Request, res: Response) => {
  const email = req.body.email as string;
  const password = req.body.password as string;

  try {
    const { user } = await createUserWithEmailAndPassword(getAuth(), email, password);
    const token = await user.getIdToken(true);
    const cookie = await admin.auth(firebaseAdminApp).createSessionCookie(token, {expiresIn: 60 * 60 * 1000});
  
    res.cookie("token", cookie, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      expires: new Date(new Date().getTime() + 60 * 60 * 1000)
    }).send(user.uid);
  } catch (err) {
    const error = err as Error;
    res.status(400).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});