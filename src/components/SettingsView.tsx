import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Bell, Shield, Palette, Database, Download, Upload } from 'lucide-react';
import { Card, CardBody } from './ui/Card';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface SettingsViewProps {
  onExport: () => void;
  onImport: () => void;
}

export function SettingsView({ onExport, onImport }: SettingsViewProps) {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState({
    taskReminders: true,
    dailyReview: true,
    achievements: true,
    weeklyReport: false
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Notification preferences updated');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardBody>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Account</h3>
              <p className="text-sm text-slate-400">Manage your account settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div>
                <p className="text-sm font-medium text-slate-400">Email</p>
                <p className="text-white">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div>
                <p className="text-sm font-medium text-slate-400">Account Status</p>
                <p className="text-green-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Active
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              className="w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </motion.button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Notifications</h3>
              <p className="text-sm text-slate-400">Configure your notification preferences</p>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700"
              >
                <div>
                  <p className="text-white font-medium">
                    {key === 'taskReminders' && 'Task Reminders'}
                    {key === 'dailyReview' && 'Daily Review'}
                    {key === 'achievements' && 'Achievement Alerts'}
                    {key === 'weeklyReport' && 'Weekly Report'}
                  </p>
                  <p className="text-sm text-slate-400">
                    {key === 'taskReminders' && 'Get notified about upcoming tasks'}
                    {key === 'dailyReview' && 'Daily summary of your progress'}
                    {key === 'achievements' && 'Celebrate unlocked achievements'}
                    {key === 'weeklyReport' && 'Weekly performance analysis'}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(key as keyof typeof notifications)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    value ? 'bg-blue-500' : 'bg-slate-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: value ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                  />
                </button>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Data Management</h3>
              <p className="text-sm text-slate-400">Export or import your schedule data</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExport}
              className="p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Download className="w-5 h-5" />
              Export Data
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onImport}
              className="p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Upload className="w-5 h-5" />
              Import Data
            </motion.button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Privacy & Security</h3>
              <p className="text-sm text-slate-400">Your data is encrypted and secure</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Data Encryption</p>
                  <p className="text-sm text-slate-400">All data is encrypted at rest and in transit</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  Enabled
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Secure Authentication</p>
                  <p className="text-sm text-slate-400">Protected by Supabase authentication</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
