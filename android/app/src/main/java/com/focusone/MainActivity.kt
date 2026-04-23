package com.focusone

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate

class MainActivity : ReactActivity() {
  override fun getMainComponentName(): String = "FocusOne"

  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegate(this, mainComponentName)
  }
}
