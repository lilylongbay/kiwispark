/**
 * 评分重新计算工具函数
 * 用于在添加新评论时重新计算课程的平均评分
 */

export interface RatingCalculationResult {
  newAverage: number;
  newCount: number;
}

/**
 * 重新计算评分平均值
 * @param currentRating 当前平均评分
 * @param currentCount 当前评论数量
 * @param newRating 新评论的评分
 * @returns 新的平均评分和评论数量
 */
export function recalculateRating(
  currentRating: number,
  currentCount: number,
  newRating: number
): RatingCalculationResult {
  const totalScore = currentRating * currentCount + newRating;
  const newCount = currentCount + 1;
  const newAverage = totalScore / newCount;
  
  return {
    newAverage: Math.round(newAverage * 10) / 10, // 保留一位小数
    newCount,
  };
}
