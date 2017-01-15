//
//  RootViewController.swift
//  Knockt
//
//  Created by Yang Liu on 1/14/17.
//  Copyright © 2017 Yang Liu. All rights reserved.
//

import UIKit
import Firebase
import UserNotifications

class TutorialViewController: UIViewController, UIPageViewControllerDelegate, UIPageViewControllerDataSource {

    var pageViewController: UIPageViewController?
    var pageIdentifiers: [String]?


    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        // Configure the page view controller and add it as a child view controller.
        self.pageViewController = UIPageViewController(transitionStyle: .scroll, navigationOrientation: .horizontal, options: nil)
        self.pageViewController!.delegate = self
        
        self.pageIdentifiers = ["ScanCodeViewController", "MonitorActivityController", "EditInfoActivityController"]

        let viewControllers: [UIViewController] =  self.pageIdentifiers!.map { (identifier) -> UIViewController in
            return UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: identifier)
        }
        
        self.pageViewController!.setViewControllers([viewControllers.first!], direction: .forward, animated: true, completion: {done in })

        self.pageViewController!.dataSource = nil
        self.pageViewController!.dataSource = self

        self.addChildViewController(self.pageViewController!)
        self.view.addSubview(self.pageViewController!.view)
        self.pageViewController!.view.frame =  CGRect(x:0, y:0, width:self.view.bounds.size.width, height:self.view.bounds.size.height + 40)
        
        // Firebase
//        print(FIRAuth.auth()?.currentUser)
        
        let content = UNMutableNotificationContent()
        content.title = "Tutorial Reminder"
        content.body = "Just a reminder to read your tutorial over at appcoda.com!"
        content.sound = UNNotificationSound.default()
        let request = UNNotificationRequest(identifier: "textNotification", content: content, trigger: nil)
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
        UNUserNotificationCenter.current().add(request) {(error) in
            if let error = error {
                print("Uh oh! We had an error: \(error)")
            }
        }
        
        let delegate = UIApplication.shared.delegate as? AppDelegate
//        delegate?.scheduleNotification(at: NSDate())
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - UIPageViewController delegate methods

    func pageViewController(_ pageViewController: UIPageViewController,
                            viewControllerBefore viewController: UIViewController) -> UIViewController? {
        if let identifier = viewController.restorationIdentifier {
            print(identifier)
            if let index = pageIdentifiers!.index(of: identifier) {
                if index > 0 {
                    return self.storyboard?.instantiateViewController(withIdentifier: pageIdentifiers![index-1])
                }
            }
        }
        return nil
    }
    
    func pageViewController(_ pageViewController: UIPageViewController,
                            viewControllerAfter viewController: UIViewController) -> UIViewController? {
        if let identifier = viewController.restorationIdentifier {
            print("What?")
            if let index = pageIdentifiers!.index(of: identifier) {
                if index < pageIdentifiers!.count - 1 {
                    return self.storyboard?.instantiateViewController(withIdentifier: pageIdentifiers![index+1])
                }
            }
        }
        return nil
    }
    
    func presentationCount(for pageViewController: UIPageViewController) -> Int {
        return pageIdentifiers!.count
    }
    
    func presentationIndex(for pageViewController: UIPageViewController) -> Int {
        if let identifier = pageViewController.viewControllers?.first?.restorationIdentifier {
            if let index = pageIdentifiers!.index(of: identifier) {
                return index
            }
        }
        return 0
    }
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
}

