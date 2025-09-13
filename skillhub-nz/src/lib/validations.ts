import { z } from 'zod';

// 注册表单验证schema
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, '邮箱是必填项')
    .email('请输入有效的邮箱地址'),
  password: z
    .string()
    .min(8, '密码至少需要8个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含至少一个小写字母、一个大写字母和一个数字'),
  confirmPassword: z
    .string()
    .min(1, '请确认密码'),
  name: z
    .string()
    .min(1, '姓名是必填项')
    .min(2, '姓名至少需要2个字符')
    .max(50, '姓名不能超过50个字符')
    .regex(/^[a-zA-Z\u4e00-\u9fa5\s]+$/, '姓名只能包含字母、中文和空格'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密码不匹配",
  path: ["confirmPassword"],
});

// 登录表单验证schema
export const signinSchema = z.object({
  email: z
    .string()
    .min(1, '邮箱是必填项')
    .email('请输入有效的邮箱地址'),
  password: z
    .string()
    .min(1, '密码是必填项'),
});

// 评论表单验证schema
export const reviewSchema = z.object({
  courseId: z.string().min(1, '课程ID是必填项'),
  rating: z.number().int().min(1, '评分至少为1').max(5, '评分最多为5'),
  content: z.string().min(10, '评论内容至少需要10个字符').max(800, '评论内容不能超过800个字符'),
});

// 教育机构注册表单验证schema
export const institutionSignupSchema = z.object({
  email: z
    .string()
    .min(1, '邮箱是必填项')
    .email('请输入有效的邮箱地址'),
  password: z
    .string()
    .min(8, '密码至少需要8个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含至少一个小写字母、一个大写字母和一个数字'),
  confirmPassword: z
    .string()
    .min(1, '请确认密码'),
  name: z
    .string()
    .min(1, '联系人姓名是必填项')
    .min(2, '联系人姓名至少需要2个字符')
    .max(50, '联系人姓名不能超过50个字符')
    .regex(/^[a-zA-Z\u4e00-\u9fa5\s]+$/, '联系人姓名只能包含字母、中文和空格'),
  institutionName: z
    .string()
    .min(1, '机构名称是必填项')
    .min(2, '机构名称至少需要2个字符')
    .max(100, '机构名称不能超过100个字符'),
  phoneNumber: z
    .string()
    .min(1, '联系电话是必填项')
    .regex(/^[\d\s\-\+\(\)]+$/, '请输入有效的电话号码'),
  address: z
    .string()
    .min(1, '机构地址是必填项')
    .min(5, '机构地址至少需要5个字符'),
  website: z
    .string()
    .url('请输入有效的网站地址')
    .optional()
    .or(z.literal('')),
  establishedYear: z
    .number()
    .int()
    .min(1900, '成立年份不能早于1900年')
    .max(new Date().getFullYear(), '成立年份不能晚于当前年份'),
  licenseNumber: z
    .string()
    .optional()
    .or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密码不匹配",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type SigninFormData = z.infer<typeof signinSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type InstitutionSignupFormData = z.infer<typeof institutionSignupSchema>;

