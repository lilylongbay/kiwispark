import { describe, it, expect } from 'vitest';
import { signupSchema, signinSchema } from '../lib/validations';

describe('Signup Schema Validation', () => {
  it('should validate correct signup data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      name: '张三',
    };

    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'Password123',
      confirmPassword: 'Password123',
      name: '张三',
    };

    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('请输入有效的邮箱地址');
    }
  });

  it('should reject weak password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '123',
      confirmPassword: '123',
      name: '张三',
    };

    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('密码至少需要8个字符');
    }
  });

  it('should reject password without uppercase letter', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      name: '张三',
    };

    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('密码必须包含至少一个小写字母、一个大写字母和一个数字');
    }
  });

  it('should reject empty name', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      name: '',
    };

    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('姓名是必填项');
    }
  });

  it('should reject name with special characters', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      name: 'John@Doe',
    };

    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('姓名只能包含字母、中文和空格');
    }
  });

  it('should accept name with spaces', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      name: 'John Doe',
    };

    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should accept Chinese names', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      name: '李小明',
    };

    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe('Signin Schema Validation', () => {
  it('should validate correct signin data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'anypassword',
    };

    const result = signinSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'anypassword',
    };

    const result = signinSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('请输入有效的邮箱地址');
    }
  });

  it('should reject empty password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '',
    };

    const result = signinSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('密码是必填项');
    }
  });

  it('should reject empty email', () => {
    const invalidData = {
      email: '',
      password: 'anypassword',
    };

    const result = signinSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('邮箱是必填项');
    }
  });
});

