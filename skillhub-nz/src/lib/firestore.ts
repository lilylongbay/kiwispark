import { 
  collection, 
  doc, 
  CollectionReference, 
  DocumentReference,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { firestore } from '@/firebase/client';
import type {
  UserDoc,
  CoachDoc,
  CourseDoc,
  ReviewDoc,
  ReplyDoc,
  CategoryDoc,
  ImageDoc
} from '@/types/domain';

// 集合引用辅助函数
export const getCollectionRef = <T>(collectionName: string): CollectionReference<T> => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export const getDocRef = <T>(collectionName: string, docId: string): DocumentReference<T> => {
  return doc(firestore, collectionName, docId) as DocumentReference<T>;
};

// 具体集合引用
export const usersRef = () => getCollectionRef<UserDoc>('users');
export const coachesRef = () => getCollectionRef<CoachDoc>('coaches');
export const coursesRef = () => getCollectionRef<CourseDoc>('courses');
export const reviewsRef = () => getCollectionRef<ReviewDoc>('reviews');
export const repliesRef = () => getCollectionRef<ReplyDoc>('replies');
export const categoriesRef = () => getCollectionRef<CategoryDoc>('categories');
export const imagesRef = () => getCollectionRef<ImageDoc>('images');

// 具体文档引用
export const userDocRef = (userId: string) => getDocRef<UserDoc>('users', userId);
export const coachDocRef = (coachId: string) => getDocRef<CoachDoc>('coaches', coachId);
export const courseDocRef = (courseId: string) => getDocRef<CourseDoc>('courses', courseId);
export const reviewDocRef = (reviewId: string) => getDocRef<ReviewDoc>('reviews', reviewId);
export const replyDocRef = (replyId: string) => getDocRef<ReplyDoc>('replies', replyId);
export const categoryDocRef = (categoryId: string) => getDocRef<CategoryDoc>('categories', categoryId);
export const imageDocRef = (imageId: string) => getDocRef<ImageDoc>('images', imageId);

// 数据转换器 - 添加时间戳
export const withTimestamps = <T extends Record<string, any>>(data: T): T & { createdAt: Timestamp; updatedAt: Timestamp } => {
  return {
    ...data,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };
};

// 数据转换器 - 只添加更新时间戳
export const withUpdatedAt = <T extends Record<string, any>>(data: T): T & { updatedAt: Timestamp } => {
  return {
    ...data,
    updatedAt: serverTimestamp() as Timestamp,
  };
};

// 特定文档类型的数据转换器
export const createUserDoc = (data: Omit<UserDoc, 'id' | 'createdAt' | 'updatedAt'>): Omit<UserDoc, 'id'> => {
  return withTimestamps(data);
};

export const createCoachDoc = (data: Omit<CoachDoc, 'id' | 'createdAt' | 'updatedAt'>): Omit<CoachDoc, 'id'> => {
  return withTimestamps(data);
};

export const createCourseDoc = (data: Omit<CourseDoc, 'id' | 'createdAt' | 'updatedAt'>): Omit<CourseDoc, 'id'> => {
  return withTimestamps(data);
};

export const createReviewDoc = (data: Omit<ReviewDoc, 'id' | 'createdAt' | 'updatedAt'>): Omit<ReviewDoc, 'id'> => {
  return withTimestamps(data);
};

export const createReplyDoc = (data: Omit<ReplyDoc, 'id' | 'createdAt' | 'updatedAt'>): Omit<ReplyDoc, 'id'> => {
  return withTimestamps(data);
};

export const createCategoryDoc = (data: Omit<CategoryDoc, 'id' | 'createdAt' | 'updatedAt'>): Omit<CategoryDoc, 'id'> => {
  return withTimestamps(data);
};

export const createImageDoc = (data: Omit<ImageDoc, 'id' | 'createdAt'>): Omit<ImageDoc, 'id'> => {
  return {
    ...data,
    createdAt: serverTimestamp() as Timestamp,
  };
};

// 更新文档的辅助函数
export const updateUserDoc = (data: Partial<Omit<UserDoc, 'id' | 'createdAt'>>): Partial<UserDoc> => {
  return withUpdatedAt(data);
};

export const updateCoachDoc = (data: Partial<Omit<CoachDoc, 'id' | 'createdAt'>>): Partial<CoachDoc> => {
  return withUpdatedAt(data);
};

export const updateCourseDoc = (data: Partial<Omit<CourseDoc, 'id' | 'createdAt'>>): Partial<CourseDoc> => {
  return withUpdatedAt(data);
};

export const updateReviewDoc = (data: Partial<Omit<ReviewDoc, 'id' | 'createdAt'>>): Partial<ReviewDoc> => {
  return withUpdatedAt(data);
};

export const updateReplyDoc = (data: Partial<Omit<ReplyDoc, 'id' | 'createdAt'>>): Partial<ReplyDoc> => {
  return withUpdatedAt(data);
};

export const updateCategoryDoc = (data: Partial<Omit<CategoryDoc, 'id' | 'createdAt'>>): Partial<CategoryDoc> => {
  return withUpdatedAt(data);
};
