import UIKit
import React

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene,
          let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }

    let window = UIWindow(windowScene: windowScene)

    // Pass the initial deep link (if the app was opened from one)
    var launchOptions: [AnyHashable: Any]? = nil
    if let url = connectionOptions.urlContexts.first?.url {
      launchOptions = [UIApplication.LaunchOptionsKey.url: url]
    }

    appDelegate.reactNativeFactory?.startReactNative(
      withModuleName: "swipeestate",
      in: window,
      launchOptions: launchOptions
    )

    self.window = window
    appDelegate.window = window
  }

  // Deep links while app is running
  func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    for context in URLContexts {
      RCTLinkingManager.application(
        UIApplication.shared,
        open: context.url,
        options: [:]
      )
    }
  }

  // Universal links
  func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
    RCTLinkingManager.application(
      UIApplication.shared,
      continue: userActivity,
      restorationHandler: { _ in }
    )
  }
}