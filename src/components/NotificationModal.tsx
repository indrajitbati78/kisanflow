import React from 'react';
import { Bell, Check, CheckCheck, X, ShieldAlert, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  if (!isOpen) return null;

  return (
    <div id="notification-modal" className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="notification-container"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh] mt-12 sm:mt-14"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-base">Alerts & SMS Updates</h3>
              <p className="text-xs text-stone-500">Real-time procurement & queue notices</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              id="mark-all-read-btn"
              onClick={markAllNotificationsRead}
              className="p-1.5 text-xs text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Read all</span>
            </button>
            <button
              id="close-notifications-btn"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="overflow-y-auto flex-1 p-3 space-y-2.5 divide-y divide-stone-100">
          {notifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Bell className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-stone-600 font-medium">No alerts right now</p>
              <p className="text-xs text-stone-400 mt-1">You will receive SMS alerts as your produce moves through weighing & quality check.</p>
            </div>
          ) : (
            notifications.map((item) => {
              const getIcon = () => {
                switch (item.type) {
                  case 'success':
                    return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
                  case 'warning':
                    return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
                  case 'alert':
                    return <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />;
                  default:
                    return <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />;
                }
              };

              return (
                <div
                  key={item.id}
                  id={`notification-item-${item.id}`}
                  onClick={() => markNotificationRead(item.id)}
                  className={`pt-2.5 p-3 rounded-xl transition-all cursor-pointer ${
                    item.read 
                      ? 'bg-white hover:bg-stone-50 text-stone-700' 
                      : 'bg-emerald-50/70 border border-emerald-100 hover:bg-emerald-50 text-stone-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {getIcon()}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-sm tracking-tight ${item.read ? 'font-medium text-stone-800' : 'font-semibold text-emerald-950'}`}>
                          {item.title}
                        </h4>
                        <span className="text-[11px] text-stone-400 whitespace-nowrap">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{item.message}</p>
                      
                      <div className="flex items-center gap-2 mt-2 pt-1 border-t border-stone-100/70">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200/60 font-mono text-stone-600">
                          SMS Gateway: Delivered
                        </span>
                        {!item.read && (
                          <span className="text-[10px] text-emerald-700 font-medium ml-auto flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Tap to mark read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-stone-50 border-t border-stone-100 text-center">
          <p className="text-[11px] text-stone-500">
            Automated notifications sent via Govt SMS Gateway & WhatsApp API.
          </p>
        </div>
      </div>
    </div>
  );
};
