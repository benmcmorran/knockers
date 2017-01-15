//
//  BaseService.swift
//  Knockt
//
//  Created by Yang Liu on 1/15/17.
//  Copyright © 2017 Yang Liu. All rights reserved.
//
import Alamofire
class BaseService:NSObject {
    let BASE_URL = "http://api.knockt.com"
    
    func post(url: String,params: Parameters, finish: @escaping (_ json: Any) -> Void){
        var parameters: Parameters = params
        parameters["token"] = AuthService.shared.getUserIdToken()
        Alamofire
            .request(url, method: .post, parameters: parameters, encoding: JSONEncoding.default)
            .responseJSON{ response in
                if let json = response.result.value {
                    finish(json)
                }
        }
    }
}
