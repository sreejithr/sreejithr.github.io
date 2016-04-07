---
layout: post
title: React Native Integration for Production
subtitle: Integrate React Native-based activities in your Android app
---

Last month was a rollercoaster ride for my team-mates and I, at DriveU. With plans of eventually completely replacing our apps with React Native, we were tasked with making and integrating one page in our app in React Native as sort of a proof of concept. This had to be good.

If you've been active in the React Native circles, you know for a fact, that Android always tends to get a raw deal in the documentation department.

The [official documentation](https://facebook.github.io/react-native/docs/embedded-app-android.html) for integrating React Native into an existing app lacks a lot of details. Which is why I hoping this will help save you a lot of time.

Here I'll cover:

* Integrate a React Native based activity into the app.
* Obtain an optimized, minified production RN bundle to include in your app.


### Create an Android activity
Add this activity in your Android project.

```
package com.yourproject;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;

import com.yourproject.BuildConfig;
import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;


public class YourActivity extends Activity implements DefaultHardwareBackBtnHandler {
    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mReactRootView = new ReactRootView(this);
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG) // Remove in Production
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();
        mReactRootView.startReactApplication(mReactInstanceManager, "YourReactApp", null);

        setContentView(mReactRootView);
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onResume(this, this);
        }
    }


    @Override
    public void onBackPressed() {
        if (mReactInstanceManager != null) {
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }
}

```
Removing `.setUseDeveloperSupport(BuildConfig.DEBUG)` gets rid of the developer options which come up when you shake the device.

### Add dependencies to build.gradle
Add this to the `dependencies` section of your `build.gradle`, for, you know, reasons.

```
compile 'com.facebook.react:react-native:0.19.+'
```

### Edit the Manifest file

Add `<activity android:name=".activity.YourActivity"/>`. If you want this screen to come up **at launch**, add this:

```
<activity android:name=".activity.YourActivity"
          android:screenOrientation="portrait">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

### Edit the gradle.properties

While building, you may encounter issues like `Error: NDK integration is deprecated in the current plugin`. To fix this error, add,

```
android.useDeprecatedNdk=true
```
to your `gradle.properties` file.

### Get & Include the JS Bundle

To get the JS bundle (named `index.android.bundle` for this project. See `YourActivity` code), start your packaging server (if not already running) using `npm start` and do a curl,

```
curl http://localhost:8081/index.android.bundle?platform=android&dev=false&hot=false&minify=true -o index.android.bundle
```

This is a production grade file; with hot code replacement and developer mode disabled. Put this file in your `android/app/src/main/assets/`.

There's ways to get this bundle using the `react-native bundle` command. But, it's painfully slow in my machine. So, I tend to curl out the bundle.

### Done!

That's it. Now run the app in your device and see your React view on the screen in all it's glory!

We're still assessing it's performance in production. I hope to get some juicy insights in a couple of weeks :)

