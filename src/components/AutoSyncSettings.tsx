import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle, Clock, Database, Settings } from 'lucide-react';

interface AutoSyncSettingsProps {
  isAutoSyncEnabled: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  error: string | null;
  onToggleAutoSync: (enabled: boolean) => void;
  onManualSync: () => Promise<void>;
}

const AutoSyncSettings: React.FC<AutoSyncSettingsProps> = ({
  isAutoSyncEnabled,
  isSyncing,
  lastSyncTime,
  error,
  onToggleAutoSync,
  onManualSync
}) => {
  const [lastSyncTimeFormatted, setLastSyncTimeFormatted] = useState<string>('なし');

  useEffect(() => {
    if (lastSyncTime) {
      const date = new Date(lastSyncTime);
      setLastSyncTimeFormatted(date.toLocaleString('ja-JP'));
    } else {
      setLastSyncTimeFormatted('なし');
    }
  }, [lastSyncTime]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start space-x-4 mb-6">
          <Database className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-jp-bold text-gray-900 mb-2">自動同期設定</h3>
            <p className="text-gray-700 font-jp-normal mb-4">
              自動同期機能は5分ごとにデータをクラウドに保存します。端末を変更する際にもデータが引き継がれます。
            </p>
          </div>
        </div>
        
        <button
          onClick={onManualSync}
          disabled={isSyncing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-jp-medium transition-colors flex items-center justify-center space-x-2 mb-4"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>同期中...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>今すぐ同期する</span>
            </>
          )}
        </button>
        
        <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isAutoSyncEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="font-jp-medium text-gray-900">自動同期</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isAutoSyncEnabled} 
              onChange={(e) => onToggleAutoSync(e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800 font-jp-normal">
              <p className="font-jp-medium mb-1">自動同期のメリット</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>端末変更時にデータが引き継がれます</li>
                <li>ブラウザのキャッシュクリアでデータが失われません</li>
                <li>カウンセラーがあなたの日記を確認できます</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* 同期状態表示 */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-start space-x-4 mb-6">
          <Settings className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-jp-bold text-gray-900 mb-2">同期状態</h3>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-jp-medium text-gray-700">最終同期時間</span>
            </div>
            <span className="text-sm text-gray-600">{lastSyncTimeFormatted}</span>
          </div>
          
          <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-jp-medium text-gray-700">同期間隔</span>
            </div>
            <span className="text-sm text-gray-600">5分</span>
          </div>
          
          <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-jp-medium text-gray-700">同期状態</span>
            </div>
            <span className={`text-sm font-jp-medium ${isSyncing ? 'text-blue-600' : isAutoSyncEnabled ? 'text-green-600' : 'text-gray-600'}`}>
              {isSyncing ? '同期中...' : isAutoSyncEnabled ? '有効' : '無効'}
            </span>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-jp-medium text-red-800 mb-1">同期エラー</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoSyncSettings;