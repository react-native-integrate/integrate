export const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
\t<key>NSExtension</key>
\t<dict>
\t\t<key>NSExtensionAttributes</key>
\t\t<dict>
\t\t\t<key>UNNotificationExtensionCategory</key>
\t\t\t<string>myNotificationCategory</string>
\t\t\t<key>UNNotificationExtensionInitialContentSizeRatio</key>
\t\t\t<real>1</real>
\t\t</dict>
\t\t<key>NSExtensionMainStoryboard</key>
\t\t<string>MainInterface</string>
\t\t<key>NSExtensionPointIdentifier</key>
\t\t<string>com.apple.usernotifications.content-extension</string>
\t</dict>
</dict>
</plist>
`;
