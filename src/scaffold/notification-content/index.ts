import { infoPlist } from './infoPlist';
import { mainInterfaceStoryboard } from './mainInterfaceStoryboard';
import { notificationViewControllerH } from './notificationViewControllerH';
import { notificationViewControllerM } from './notificationViewControllerM';

export const notificationContentFiles = {
  'NotificationViewController.h': notificationViewControllerH,
  'NotificationViewController.m': notificationViewControllerM,
  'Base.lproj': {
    'MainInterface.storyboard': mainInterfaceStoryboard,
  },
  'Info.plist': infoPlist,
};
