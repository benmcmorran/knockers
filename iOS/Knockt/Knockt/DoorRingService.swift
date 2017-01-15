//
//  DoorRingService.swift
//  Knockt
//
//  Created by Yang Liu on 1/15/17.
//  Copyright © 2017 Yang Liu. All rights reserved.
//
import Alamofire
class DoorRingService: BaseService {
    
    var currDoorBell: AnyObject?
    
    override init() {
        super.init()
    }
    
    class var shared: DoorRingService {
        struct Singleton {
            static let instance = DoorRingService()
        }
        return Singleton.instance
    }
    
    func setCurrentDoorBell(currDoorBell: AnyObject) {
        self.currDoorBell = currDoorBell
    }
    
    func getDoorRingList(finish: @escaping (_ json: [AnyObject]) -> Void) {
        let url: String = "\(BASE_URL)/listdoorbells"
        post(url: url, params: [:], finish: { (json) -> Void in
           if let bells: [AnyObject] = (json as! AnyObject)["data"] as! [AnyObject] {
                 finish(bells)
            }
        })
    }
    
    func getDoorBellCode(hash: String, finish: @escaping (_ imageData: Data) -> Void) {
        let url: String = "https://chart.googleapis.com/chart?cht=qr&chs=500x500&chl=knockt.com/r%23\(hash)&chld=Q"
        Alamofire.request(url, method:.get).responseData { (response) in
            if let data = response.result.value {
                finish(data)
            }
        }
    }
}
