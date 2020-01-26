//
//  MicSession.swift
//  Yodl
//
//  Created by Andrew Arpasi on 1/25/20.
//  Copyright © 2020 Andrew Arpasi. All rights reserved.
//

import UIKit
import AVFoundation
import AudioKit

class MicSession {
    var isActive = false
    
    func start() {
        let mic = AKMicrophone()
        AudioKit.output = mic
        try! AudioKit.start()
        self.isActive = true
    }
    
    func stop() {
        try! AudioKit.stop()
        self.isActive = false
    }
    
    func toggle() {
        if self.isActive {
            stop()
        } else {
            start()
        }
    }
}
