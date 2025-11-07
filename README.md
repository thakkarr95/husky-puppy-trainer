# 🐺 Husky Puppy Trainer

A comprehensive web application to help train and care for your Husky puppy. Track training progress, monitor feeding, log potty breaks, and follow an interactive daily schedule - all synced across your devices!

## � Live Demo

**🚀 Try it now:** https://thakkarr95.github.io/husky-puppy-trainer

## 🌟 Features

- **✅ Daily Todo List**: Interactive checklist with progress tracking for your puppy's daily schedule
- **🍖 Food Tracker**: Age-based feeding guidelines, meal logging, and weekly progress stats
- **🚽 Potty Tracker**: Mobile-optimized potty logging with success rate tracking
- **📋 Training Schedule**: 8-week comprehensive training program with 50+ husky-specific tasks
- **☁️ Multi-Device Sync**: Log on phone, view on computer - all data synchronized in real-time
- **📱 Mobile Optimized**: Large touch targets, responsive design, works as PWA (Progressive Web App)
- **� Offline Support**: Works without internet, syncs when reconnected

## 🚀 Quick Start

### Use the Live App (Recommended)
Just visit: **https://thakkarr95.github.io/husky-puppy-trainer**

Add to your phone's home screen for app-like experience!

### Run Locally

### Prerequisites

- Node.js >= 18
- npm or Yarn

## 📱 Installation

1. Clone the repository:
```sh
git clone https://github.com/thakkarr95/husky-puppy-trainer.git
cd husky-puppy-trainer
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev:all
```

This starts both the frontend (port 5173) and backend server (port 3001).

4. Open http://localhost:5173 in your browser

## 🏗️ Architecture

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Express.js REST API
- **Storage**: File-based JSON storage
- **Deployment**: 
  - Frontend: GitHub Pages
  - Backend: Railway
  - CDN: Cloudflare (automatic via GitHub Pages)

## 📚 Documentation

- [SETUP.md](SETUP.md) - Complete setup guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [MOBILE_SETUP.md](MOBILE_SETUP.md) - Mobile device setup
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture details

## � Technology Stack

- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Express.js** - Backend REST API
- **localStorage** - Offline data persistence
- **CSS3** - Custom responsive styling
- **GitHub Actions** - CI/CD (via gh-pages)

## 📖 Training Content

The app includes comprehensive husky-specific training content:
- 8-week puppy training program
- 50+ training tasks covering:
  - Potty training
  - Crate training
  - Socialization
  - Obedience commands
  - Bite inhibition
- Age-based feeding guidelines (8 weeks to adult)
- Daily schedule with 33 time-based activities
- Training tips for husky-specific behaviors

## 🌍 Deployment Status

- ✅ **Frontend**: https://thakkarr95.github.io/husky-puppy-trainer
- ✅ **Backend API**: https://husky-puppy-trainer-production.up.railway.app
- ✅ **Multi-device sync**: Enabled
- ✅ **Mobile PWA**: Supported

## 🤝 Contributing

This is a personal project for husky puppy training, but suggestions are welcome!

## 📄 License

This project is licensed under the MIT License.

## 🐾 About

Created to help new husky puppy owners navigate the challenging but rewarding first 8 weeks of puppy training. Includes research-backed training methods and husky-specific advice.

---

**Happy Training! 🐺🎓**
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
