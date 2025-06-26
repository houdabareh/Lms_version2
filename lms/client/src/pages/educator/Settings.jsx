import React, { useState, Fragment, useContext } from 'react';
import { Disclosure, Transition, Switch } from '@headlessui/react';
import {
  ChevronDownIcon,
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  FolderOpenIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';
import profileImg3 from '../../assets/profile_img3.png'; // Import the new profile image

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Profile Settings
  const [profile, setProfile] = useState({
    name: 'Educator Name',
    avatar: profileImg3, // Set the avatar to the imported image
    bio: 'Experienced educator passionate about online learning and student success.',
    email: 'educator@example.com',
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notifications
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    courseAlerts: true,
    messageNotifications: false,
    meetingReminders: true,
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
  });

  // Platform Preferences
  const [preferences, setPreferences] = useState({
    language: 'English',
    timezone: 'UTC+0',
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (field) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSecurityChange = (field) => {
    setSecurity(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real application, you'd send this data to your backend
    console.log('Saving changes:', { profile, notifications, security, preferences, newPassword });
    alert('Settings saved successfully!');
    // Implement API calls here
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setProfile({
        name: 'Educator Name',
        avatar: profileImg3, // Reset avatar to the imported image
        bio: 'Experienced educator passionate about online learning and student success.',
        email: 'educator@example.com',
      });
      setNewPassword('');
      setConfirmPassword('');
      setNotifications({
        emailUpdates: true,
        courseAlerts: true,
        messageNotifications: false,
        meetingReminders: true,
      });
      setSecurity({
        twoFactorAuth: false,
      });
      setPreferences({
        language: 'English',
        timezone: 'UTC+0',
      });
      // Optionally reset theme if it's part of preferences
      // if (theme === 'dark') toggleTheme();
      alert('Settings reset to default!');
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-darkBg p-6 sm:p-8 lg:p-10 font-inter"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">Your Settings</h1>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Disclosure as="div" defaultOpen>
            {({ open }) => (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <Disclosure.Button className="flex w-full justify-between items-center px-6 py-5 text-left text-xl font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
                  <span className="flex items-center">
                    <UserCircleIcon className="h-7 w-7 mr-3 text-primary-dark" /> Profile Settings
                  </span>
                  <ChevronDownIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } h-7 w-7 text-gray-500 transition-transform duration-200`}
                  />
                </Disclosure.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 -translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-2"
                >
                  <Disclosure.Panel as={motion.div} variants={sectionVariants} initial="hidden" animate="visible" className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="space-y-5">
                      <div className="flex items-center space-x-6">
                        <img src={profile.avatar} alt="Avatar Preview" className="h-20 w-20 rounded-full object-cover border-2 border-primary-light dark:border-accent" />
                        <div>
                          <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Change Avatar</label>
                          <input type="file" id="avatar" name="avatar" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input type="text" id="name" name="name" value={profile.name} onChange={handleProfileChange} className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input type="email" id="email" name="email" value={profile.email} onChange={handleProfileChange} className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent" disabled />
                      </div>
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                        <textarea id="bio" name="bio" value={profile.bio} onChange={handleProfileChange} rows="3" className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"></textarea>
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                        <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent" />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent" />
                      </div>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>

          {/* Notifications */}
          <Disclosure as="div">
            {({ open }) => (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <Disclosure.Button className="flex w-full justify-between items-center px-6 py-5 text-left text-xl font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
                  <span className="flex items-center">
                    <BellIcon className="h-7 w-7 mr-3 text-primary-dark" /> Notifications
                  </span>
                  <ChevronDownIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } h-7 w-7 text-gray-500 transition-transform duration-200`}
                  />
                </Disclosure.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 -translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-2"
                >
                  <Disclosure.Panel as={motion.div} variants={sectionVariants} initial="hidden" animate="visible" className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="space-y-4">
                      <Switch.Group as="div" className="flex items-center justify-between">
                        <span className="flex-grow text-gray-700 dark:text-gray-300">Email Updates</span>
                        <Switch
                          checked={notifications.emailUpdates}
                          onChange={() => handleNotificationChange('emailUpdates')}
                          className={`${notifications.emailUpdates ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}
                            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                        >
                          <span
                            aria-hidden="true"
                            className={`${notifications.emailUpdates ? 'translate-x-5' : 'translate-x-0'}
                              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </Switch.Group>
                      <Switch.Group as="div" className="flex items-center justify-between">
                        <span className="flex-grow text-gray-700 dark:text-gray-300">Course Alerts</span>
                        <Switch
                          checked={notifications.courseAlerts}
                          onChange={() => handleNotificationChange('courseAlerts')}
                          className={`${notifications.courseAlerts ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}
                            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                        >
                          <span
                            aria-hidden="true"
                            className={`${notifications.courseAlerts ? 'translate-x-5' : 'translate-x-0'}
                              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </Switch.Group>
                      <Switch.Group as="div" className="flex items-center justify-between">
                        <span className="flex-grow text-gray-700 dark:text-gray-300">Message Notifications</span>
                        <Switch
                          checked={notifications.messageNotifications}
                          onChange={() => handleNotificationChange('messageNotifications')}
                          className={`${notifications.messageNotifications ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}
                            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                        >
                          <span
                            aria-hidden="true"
                            className={`${notifications.messageNotifications ? 'translate-x-5' : 'translate-x-0'}
                              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </Switch.Group>
                      <Switch.Group as="div" className="flex items-center justify-between">
                        <span className="flex-grow text-gray-700 dark:text-gray-300">Meeting Reminders</span>
                        <Switch
                          checked={notifications.meetingReminders}
                          onChange={() => handleNotificationChange('meetingReminders')}
                          className={`${notifications.meetingReminders ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}
                            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                        >
                          <span
                            aria-hidden="true"
                            className={`${notifications.meetingReminders ? 'translate-x-5' : 'translate-x-0'}
                              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </Switch.Group>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>

          {/* Security Settings */}
          <Disclosure as="div">
            {({ open }) => (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <Disclosure.Button className="flex w-full justify-between items-center px-6 py-5 text-left text-xl font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
                  <span className="flex items-center">
                    <ShieldCheckIcon className="h-7 w-7 mr-3 text-primary-dark" /> Security Settings
                  </span>
                  <ChevronDownIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } h-7 w-7 text-gray-500 transition-transform duration-200`}
                  />
                </Disclosure.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 -translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-2"
                >
                  <Disclosure.Panel as={motion.div} variants={sectionVariants} initial="hidden" animate="visible" className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="space-y-4">
                      <Switch.Group as="div" className="flex items-center justify-between">
                        <span className="flex-grow text-gray-700 dark:text-gray-300">Two-Factor Authentication (2FA)</span>
                        <Switch
                          checked={security.twoFactorAuth}
                          onChange={() => handleSecurityChange('twoFactorAuth')}
                          className={`${security.twoFactorAuth ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}
                            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                        >
                          <span
                            aria-hidden="true"
                            className={`${security.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'}
                              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </Switch.Group>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Recent Login Activity:
                        <ul className="list-disc list-inside mt-2">
                          <li>Last login: Today, 10:30 AM from Chrome on Windows</li>
                          <li>Previous login: Yesterday, 3:15 PM from Safari on macOS</li>
                        </ul>
                      </p>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>

          {/* Platform Preferences */}
          <Disclosure as="div">
            {({ open }) => (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <Disclosure.Button className="flex w-full justify-between items-center px-6 py-5 text-left text-xl font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75">
                  <span className="flex items-center">
                    <GlobeAltIcon className="h-7 w-7 mr-3 text-primary-dark" /> Platform Preferences
                  </span>
                  <ChevronDownIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } h-7 w-7 text-gray-500 transition-transform duration-200`}
                  />
                </Disclosure.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 -translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 -translate-y-2"
                >
                  <Disclosure.Panel as={motion.div} variants={sectionVariants} initial="hidden" animate="visible" className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="space-y-5">
                      <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                        <select id="language" name="language" value={preferences.language} onChange={handlePreferenceChange} className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent">
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                        <select id="timezone" name="timezone" value={preferences.timezone} onChange={handlePreferenceChange} className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent">
                          <option value="UTC+0">UTC+0 (London)</option>
                          <option value="UTC-5">UTC-5 (New York)</option>
                          <option value="UTC+8">UTC+8 (Beijing)</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex-grow text-gray-700 dark:text-gray-300">Dark Mode</span>
                        <Switch
                          checked={theme === 'dark'}
                          onChange={toggleTheme}
                          className={`${theme === 'dark' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}
                            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                        >
                          <span
                            aria-hidden="true"
                            className={`${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}
                              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                          />
                        </Switch>
                      </div>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" /> Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300 flex items-center"
          >
            <FolderOpenIcon className="h-5 w-5 mr-2" /> Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
