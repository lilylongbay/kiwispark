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
  name: z
    .string()
    .min(1, '姓名是必填项')
    .min(2, '姓名至少需要2个字符')
    .max(50, '姓名不能超过50个字符')
    .regex(/^[a-zA-Z\u4e00-\u9fa5\s]+$/, '姓名只能包含字母、中文和空格'),
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

export type SignupFormData = z.infer<typeof signupSchema>;
export type SigninFormData = z.infer<typeof signinSchema>;

