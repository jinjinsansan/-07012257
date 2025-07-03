import { supabase } from './supabase';

/**
 * テストデータを削除する関数
 * @returns 削除結果
 */
export const cleanupTestData = async (): Promise<{
  localRemoved: number;
  supabaseRemoved: number;
  success: boolean;
}> => {
  let localRemoved = 0;
  let supabaseRemoved = 0;
  
  try {
    // ローカルストレージからテストデータを削除
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      const entries = JSON.parse(savedEntries);
      
      // テストデータを識別（例：特定のキーワードを含むエントリー）
      const realEntries = entries.filter((entry: any) => {
        // テストデータの特徴（例：特定のキーワードを含む、または特定の日付範囲内）
        const isTestData = 
          (entry.event && entry.event.includes('テスト')) || 
          (entry.realization && entry.realization.includes('テスト')) ||
          (entry.event && entry.event.includes('test')) ||
          (entry.realization && entry.realization.includes('test')) ||
          (entry.event && entry.event.includes('Bolt')) ||
          (entry.realization && entry.realization.includes('Bolt'));
        
        return !isTestData;
      });
      
      // 削除されたエントリー数を計算
      localRemoved = entries.length - realEntries.length;
      
      // 実際のユーザーデータのみを保存
      localStorage.setItem('journalEntries', JSON.stringify(realEntries));
    }
    
    // Supabaseからテストデータを削除（接続されている場合のみ）
    if (supabase) {
      try {
        // テストデータを識別して削除
        const { data, error } = await supabase
          .from('diary_entries')
          .delete()
          .or('event.ilike.%テスト%,event.ilike.%test%,event.ilike.%Bolt%,realization.ilike.%テスト%,realization.ilike.%test%,realization.ilike.%Bolt%')
          .select();
        
        if (error) {
          console.error('Supabaseテストデータ削除エラー:', error);
        } else {
          supabaseRemoved = data?.length || 0;
        }
      } catch (supabaseError) {
        console.error('Supabase接続エラー:', supabaseError);
      }
    }
    
    return {
      localRemoved,
      supabaseRemoved,
      success: true
    };
  } catch (error) {
    console.error('テストデータ削除エラー:', error);
    return {
      localRemoved,
      supabaseRemoved,
      success: false
    };
  }
};

/**
 * すべての日記を削除する関数
 * @returns 削除結果
 */
export const deleteAllDiaries = async (): Promise<{
  localRemoved: number;
  supabaseRemoved: number;
  success: boolean;
}> => {
  let localRemoved = 0;
  let supabaseRemoved = 0;
  
  try {
    // ローカルストレージからすべての日記を削除
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      const entries = JSON.parse(savedEntries);
      localRemoved = entries.length;
      
      // 空の配列を保存
      localStorage.setItem('journalEntries', JSON.stringify([]));
    }
    
    // Supabaseからすべての日記を削除（接続されている場合のみ）
    if (supabase) {
      try {
        // 現在のユーザーの日記のみを削除
        const lineUsername = localStorage.getItem('line-username');
        if (lineUsername) {
          // ユーザーIDを取得
          const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('line_username', lineUsername)
            .single();
          
          if (userData && userData.id) {
            // ユーザーの日記を削除
            const { data, error } = await supabase
              .from('diary_entries')
              .delete()
              .eq('user_id', userData.id)
              .select();
            
            if (error) {
              console.error('Supabase日記削除エラー:', error);
            } else {
              supabaseRemoved = data?.length || 0;
            }
          }
        } else {
          console.warn('ユーザー名が設定されていないため、Supabaseからの削除をスキップします');
        }
      } catch (supabaseError) {
        console.error('Supabase接続エラー:', supabaseError);
      }
    }
    
    return {
      localRemoved,
      supabaseRemoved,
      success: true
    };
  } catch (error) {
    console.error('日記削除エラー:', error);
    return {
      localRemoved,
      supabaseRemoved,
      success: false
    };
  }
};

/**
 * 重複エントリーを削除する関数
 * @returns 削除結果
 */
export const removeDuplicateEntries = async (): Promise<{
  localRemoved: number;
  supabaseRemoved: number;
  success: boolean;
}> => {
  let localRemoved = 0;
  let supabaseRemoved = 0;
  
  try {
    // ローカルストレージから重複エントリーを削除
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      const entries = JSON.parse(savedEntries);
      
      // 重複チェック用のマップ
      const uniqueMap = new Map();
      const uniqueEntries = [];
      
      for (const entry of entries) {
        // 重複チェック用のキーを作成（日付+感情+内容の先頭50文字）
        const key = `${entry.date}_${entry.emotion}_${entry.event?.substring(0, 50)}`;
        
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, entry);
          uniqueEntries.push(entry);
        }
      }
      
      // 削除された重複エントリー数を計算
      localRemoved = entries.length - uniqueEntries.length;
      
      // 重複のないエントリーのみを保存
      localStorage.setItem('journalEntries', JSON.stringify(uniqueEntries));
    }
    
    // Supabaseから重複エントリーを削除（接続されている場合のみ）
    if (supabase) {
      try {
        // 重複エントリーの削除はSupabaseのトリガーで自動的に行われるため、
        // ここでは何もしない（または必要に応じて実装）
        supabaseRemoved = 0;
      } catch (supabaseError) {
        console.error('Supabase接続エラー:', supabaseError);
      }
    }
    
    return {
      localRemoved,
      supabaseRemoved,
      success: true
    };
  } catch (error) {
    console.error('重複エントリー削除エラー:', error);
    return {
      localRemoved,
      supabaseRemoved,
      success: false
    };
  }
};