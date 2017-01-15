//
//  DeviceService.swift
//  Knockt
//
//  Created by Yang Liu on 1/15/17.
//  Copyright © 2017 Yang Liu. All rights reserved.
//
import Alamofire
class DeviceService: BaseService {
    
    override init() {
        super.init()
    }
    
    class var shared: DeviceService {
        struct Singleton {
            static let instance = DeviceService()
        }
        return Singleton.instance
    }
    
    func addDevice(deviceName: String, deviceToken: String, userIdToken: String, finish: @escaping ()->Void) {
        let parameters: Parameters = [
            "token": userIdToken,
            "name": deviceName,
            "regkey": deviceToken
        ]
        Alamofire
            .request("\(BASE_URL)/adddevice", method: .post, parameters: parameters, encoding: JSONEncoding.default)
            .response { (response: DefaultDataResponse) in
                AuthService
                    .shared
                    .setUserIdToken(userIdToken: userIdToken)
                finish()
        }
    }
}
