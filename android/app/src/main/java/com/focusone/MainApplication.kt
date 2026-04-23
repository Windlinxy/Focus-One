package com.focusone

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.shell.MainReactPackage
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

  private val reactNativeHost = object : ReactNativeHost(this) {
    override fun getPackages(): List<ReactPackage> {
      return listOf(
        MainReactPackage()
        // Add your other packages here
      )
    }

    override fun getJSMainModuleName(): String {
      return "index"
    }

    override fun getUseDeveloperSupport(): Boolean {
      return true // Set to false in production
    }
  }

  override fun getReactNativeHost(): ReactNativeHost {
    return reactNativeHost
  }

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
  }
}
