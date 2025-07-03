import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 日記エントリーをSupabase形式に変換する関数
export const formatDiaryForSupabase = (entry: any, userId: string) => {
  // 必須フィールドのみを含める
  const formattedEntry = {
    id: entry.id,
    user_id: userId,
    date: entry.date,
    emotion: entry.emotion,
    event: entry.event || '',
    realization: entry.realization || '',
    created_at: entry.created_at || new Date().toISOString()
  };
  
  // スコアフィールドの処理
  if (entry.emotion === '無価値感' || 
      entry.emotion === '嬉しい' || 
      entry.emotion === '感謝' || 
      entry.emotion === '達成感' || 
      entry.emotion === '幸せ') {
    
    // 自己肯定感スコアの処理
    if (typeof entry.selfEsteemScore === 'number') {
      formattedEntry.self_esteem_score = entry.selfEsteemScore;
    } else if (typeof entry.selfEsteemScore === 'string') {
      formattedEntry.self_esteem_score = parseInt(entry.selfEsteemScore) || 50;
    } else if (typeof entry.self_esteem_score === 'number') {
      formattedEntry.self_esteem_score = entry.self_esteem_score;
    } else if (typeof entry.self_esteem_score === 'string') {
      formattedEntry.self_esteem_score = parseInt(entry.self_esteem_score) || 50;
    } else {
      formattedEntry.self_esteem_score = 50;
    }
    
    // 無価値感スコアの処理
    if (typeof entry.worthlessnessScore === 'number') {
      formattedEntry.worthlessness_score = entry.worthlessnessScore;
    } else if (typeof entry.worthlessnessScore === 'string') {
      formattedEntry.worthlessness_score = parseInt(entry.worthlessnessScore) || 50;
    } else if (typeof entry.worthlessness_score === 'number') {
      formattedEntry.worthlessness_score = entry.worthlessness_score;
    } else if (typeof entry.worthlessness_score === 'string') {
      formattedEntry.worthlessness_score = parseInt(entry.worthlessness_score) || 50;
    } else {
      formattedEntry.worthlessness_score = 50;
    }
  }
  
  // カウンセラーメモの処理
  if (entry.counselor_memo !== undefined || entry.counselorMemo !== undefined) {
    formattedEntry.counselor_memo = entry.counselor_memo !== undefined ? 
                                   entry.counselor_memo : 
                                   entry.counselorMemo || '';
  }
  
  // 表示設定の処理
  if (entry.is_visible_to_user !== undefined || entry.isVisibleToUser !== undefined) {
    formattedEntry.is_visible_to_user = entry.is_visible_to_user !== undefined ? 
                                       entry.is_visible_to_user : 
                                       entry.isVisibleToUser || false;
  }
  
  // カウンセラー名の処理
  if (entry.counselor_name !== undefined || entry.counselorName !== undefined) {
    formattedEntry.counselor_name = entry.counselor_name !== undefined ? 
                                   entry.counselor_name : 
                                   entry.counselorName || '';
  }
  
  // 担当カウンセラーの処理
  if (entry.assigned_counselor !== undefined || entry.assignedCounselor !== undefined) {
    formattedEntry.assigned_counselor = entry.assigned_counselor !== undefined ? 
                                       entry.assigned_counselor : 
                                       entry.assignedCounselor || '';
  }
  
  // 緊急度の処理
  if (entry.urgency_level !== undefined || entry.urgencyLevel !== undefined) {
    // 緊急度の値を取得
    let urgencyValue = entry.urgency_level !== undefined ? 
                     entry.urgency_level : 
                     entry.urgencyLevel || '';

    // 許可された値のみを設定（high, medium, low、または空文字列）
    if (urgencyValue !== 'high' && urgencyValue !== 'medium' && urgencyValue !== 'low' && urgencyValue !== '') {
      // 無効な値の場合は空文字列に設定
      console.warn(`無効な緊急度の値: ${urgencyValue}、空に設定します`);
      urgencyValue = '';
    }
    
    formattedEntry.urgency_level = urgencyValue;
  }
  
  return formattedEntry;
};