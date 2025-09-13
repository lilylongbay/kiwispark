import { describe, it, expect } from 'vitest';
import { recalculateRating } from '../lib/rating-utils';

describe('评分重新计算工具函数', () => {
  describe('recalculateRating', () => {
    it('应该正确计算第一个评分', () => {
      const result = recalculateRating(0, 0, 5);
      expect(result.newAverage).toBe(5);
      expect(result.newCount).toBe(1);
    });

    it('应该正确计算多个评分的平均值', () => {
      // 当前评分: 4.0, 评论数: 3, 新评分: 5
      // 总分数: 4.0 * 3 + 5 = 17, 新评论数: 4, 新平均分: 17/4 = 4.25
      const result = recalculateRating(4.0, 3, 5);
      expect(result.newAverage).toBe(4.3); // 保留一位小数
      expect(result.newCount).toBe(4);
    });

    it('应该正确处理低评分', () => {
      // 当前评分: 4.5, 评论数: 2, 新评分: 1
      // 总分数: 4.5 * 2 + 1 = 10, 新评论数: 3, 新平均分: 10/3 = 3.33...
      const result = recalculateRating(4.5, 2, 1);
      expect(result.newAverage).toBe(3.3); // 保留一位小数
      expect(result.newCount).toBe(3);
    });

    it('应该正确处理中等评分', () => {
      // 当前评分: 3.2, 评论数: 5, 新评分: 3
      // 总分数: 3.2 * 5 + 3 = 19, 新评论数: 6, 新平均分: 19/6 = 3.166...
      const result = recalculateRating(3.2, 5, 3);
      expect(result.newAverage).toBe(3.2); // 保留一位小数
      expect(result.newCount).toBe(6);
    });

    it('应该正确处理边界情况 - 所有评分都是5分', () => {
      const result = recalculateRating(5.0, 10, 5);
      expect(result.newAverage).toBe(5.0);
      expect(result.newCount).toBe(11);
    });

    it('应该正确处理边界情况 - 所有评分都是1分', () => {
      const result = recalculateRating(1.0, 5, 1);
      expect(result.newAverage).toBe(1.0);
      expect(result.newCount).toBe(6);
    });

    it('应该正确处理小数精度', () => {
      // 当前评分: 3.33, 评论数: 3, 新评分: 4
      // 总分数: 3.33 * 3 + 4 = 13.99, 新评论数: 4, 新平均分: 13.99/4 = 3.4975
      const result = recalculateRating(3.33, 3, 4);
      expect(result.newAverage).toBe(3.5); // 四舍五入到一位小数
      expect(result.newCount).toBe(4);
    });

    it('应该正确处理大量评论的情况', () => {
      // 当前评分: 4.2, 评论数: 100, 新评分: 5
      // 总分数: 4.2 * 100 + 5 = 425, 新评论数: 101, 新平均分: 425/101 = 4.207...
      const result = recalculateRating(4.2, 100, 5);
      expect(result.newAverage).toBe(4.2); // 保留一位小数
      expect(result.newCount).toBe(101);
    });

    it('应该正确处理新评分对平均值影响很小的情况', () => {
      // 当前评分: 4.8, 评论数: 50, 新评分: 2
      // 总分数: 4.8 * 50 + 2 = 242, 新评论数: 51, 新平均分: 242/51 = 4.745...
      const result = recalculateRating(4.8, 50, 2);
      expect(result.newAverage).toBe(4.7); // 保留一位小数
      expect(result.newCount).toBe(51);
    });
  });
});
