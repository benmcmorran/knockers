//
//  AuthService.swift
//  Knockt
//
//  Created by Yang Liu on 1/15/17.
//  Copyright © 2017 Yang Liu. All rights reserved.
//

class AuthService: BaseService {
    
    private var userIdToken: String?
    
    override init() {
        super.init()
    }
    
    class var shared: AuthService {
        struct Singleton {
            static let instance = AuthService()
        }
        return Singleton.instance
    }
    
    func setUserIdToken(userIdToken: String) {
        self.userIdToken = userIdToken
    }
    
    func getUserIdToken() -> String? {
        return self.userIdToken
    }
}
