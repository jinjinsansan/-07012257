import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの初期化
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ローカルモードの設定を確認
const localMode = import.meta.env.VITE_LOCAL_MODE === 'true';

// Supabaseクライアントを作成（ローカルモードでない場合のみ）
export const supabase = !localMode && supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ユーザーサービス
export const userService = {
  // ユーザーの作成または取得
  async createOrGetUser(lineUsername: string) {
    if (!supabase) return null;
    
    try {
      // 既存のユーザーを検索
      const { data: existingUsers, error: searchError } = await supabase
        .from('users')
        .select('*')
        .eq('line_username', lineUsername)
        .limit(1);
      
      if (searchError) {
        console.error('ユーザー検索エラー:', searchError);
        return null;
      }
      
      // 既存のユーザーが見つかった場合はそれを返す
      if (existingUsers && existingUsers.length > 0) {
        return existingUsers[0];
      }
      
      // 新しいユーザーを作成
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ line_username: lineUsername }])
        .select()
        .single();
      
      if (createError) {
        console.error('ユーザー作成エラー:', createError);
        return null;
      }
      
      return newUser;
    } catch (error) {
      console.error('ユーザーサービスエラー:', error);
      return null;
    }
  }
};

// 日記サービス
export const diaryService = {
  // 日記の同期
  async syncDiaries(userId: string, diaries: any[]) {
    if (!supabase) {
      return { success: false, error: 'Supabase接続がありません' };
    }
    
    try {
      if (!diaries || diaries.length === 0) {
        return { success: true };
      }
      
      // 各日記エントリーにuser_idを設定
      const diariesWithUserId = diaries.map(diary => ({
        ...diary,
        user_id: userId
      }));
      
      // 一括挿入（競合時は更新）
      const { error } = await supabase
        .from('diary_entries')
        .upsert(diariesWithUserId, {
          onConflict: 'id',
          ignoreDuplicates: false,
          returning: 'minimal'
        });
      
      if (error) {
        console.error('日記同期エラー:', error, 'データ件数:', diariesWithUserId.length, 'エラー詳細:', error.details);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (err) {
      console.error('日記同期エラー:', err);
      return { success: false, error: err instanceof Error ? err.message : '不明なエラー' };
    }
  }
};

// 同意履歴サービス
export const consentService = {
  // 同意履歴の取得
  async getAllConsentHistories() {
    if (!supabase) return [];
    
    try {
      const { data, error } = await supabase
        .from('consent_histories')
        .select('*')
        .order('consent_date', { ascending: false });
      
      if (error) {
        console.error('同意履歴取得エラー:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('同意履歴サービスエラー:', error);
      return [];
    }
  }
};

// 同期サービス
export const syncService = {
  // 同意履歴の同期
  async syncConsentHistories() {
    if (!supabase) return false;
    
    try {
      // ローカルストレージから同意履歴を取得
      const savedHistories = localStorage.getItem('consent_histories');
      if (!savedHistories) return true;
      
      const histories = JSON.parse(savedHistories);
      if (!Array.isArray(histories) || histories.length === 0) return true;
      
      // Supabaseに同期
      const { error } = await supabase
        .from('consent_histories')
        .upsert(histories, {
          onConflict: 'id',
          ignoreDuplicates: false
        });
      
      if (error) {
        console.error('同意履歴同期エラー:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('同意履歴同期エラー:', error);
      return false;
    }
  },
  
  // Supabaseから同意履歴を同期
  async syncConsentHistoriesToLocal() {
    if (!supabase) return false;
    
    try {
      // Supabaseから同意履歴を取得
      const { data, error } = await supabase
        .from('consent_histories')
        .select('*')
        .order('consent_date', { ascending: false });
      
      if (error) {
        console.error('Supabaseからの同意履歴取得エラー:', error);
        return false;
      }
      
      if (data && data.length > 0) {
        // ローカルストレージに保存
        localStorage.setItem('consent_histories', JSON.stringify(data));
      }
      
      return true;
    } catch (error) {
      console.error('Supabaseからの同意履歴同期エラー:', error);
      return false;
    }
  }
};

// チャットサービス
export const chatService = {
  // チャットメッセージの取得
  async getChatMessages(chatRoomId: string) {
    if (!supabase) return [];
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_room_id', chatRoomId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('メッセージ取得エラー:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('チャットサービスエラー:', error);
      return [];
    }
  },
  
  // メッセージの送信
  async sendMessage(chatRoomId: string, content: string, senderId?: string, counselorId?: string) {
    if (!supabase) return null;
    
    try {
      const isCounselor = !!counselorId;
      
      const message = {
        chat_room_id: chatRoomId,
        content,
        sender_id: isCounselor ? null : senderId,
        counselor_id: isCounselor ? counselorId : null,
        is_counselor: isCounselor
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert([message])
        .select()
        .single();
      
      if (error) {
        console.error('メッセージ送信エラー:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      return null;
    }
  }
};

export default {
  supabase,
  userService,
  diaryService,
  consentService,
  syncService,
  chatService
};