# 🐺 Husky Puppy Trainer

A mobile application built with React Native to help train and care for your Husky puppy. Track training progress, set reminders, and access training guides all in one place!

## 🌟 Features

- **Training Modules**: Step-by-step guides for common husky puppy training tasks
- **Progress Tracking**: Monitor your puppy's learning milestones
- **Behavior Logs**: Record and track behavioral patterns
- **Training Reminders**: Set notifications for training sessions
- **Tips & Resources**: Expert advice specific to Husky breeds
- **Photo Gallery**: Capture and organize training progress photos

## 🚀 Getting Started

> **Note**: Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

### Prerequisites

- Node.js >= 18
- npm or Yarn
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

## 📱 Installation

1. Clone the repository:
```sh
git clone https://github.com/YOUR_USERNAME/HuskyPuppyTrainer.git
cd HuskyPuppyTrainer
```

2. Install dependencies:
```sh
npm install
# OR
yarn install
```

3. For iOS, install CocoaPods dependencies:
```sh
cd ios
bundle install
bundle exec pod install
cd ..
```

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.


# Learn More

To learn more about React Native and Husky training:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [React Native Docs](https://reactnative.dev/docs/environment-setup) - official documentation.
- [Husky Training Guide](https://www.akc.org/dog-breeds/siberian-husky/) - AKC Husky resources.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐕 About Huskies

Siberian Huskies are intelligent, energetic dogs that require consistent training from an early age. This app is designed to help new Husky owners establish good training habits and track their puppy's progress.

---

Built with ❤️ for Husky lovers everywhere!
