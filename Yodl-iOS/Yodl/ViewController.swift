//
//  ViewController.swift
//  Yodl
//
//  Created by Andrew Arpasi on 1/24/20.
//  Copyright © 2020 Andrew Arpasi. All rights reserved.
//

import UIKit
import AVFoundation
import WebKit

class ViewController: UIViewController {

    let micSession = MicSession()
    
    @IBOutlet weak var micButton: UIButton!
    @IBOutlet weak var webView: WKWebView!
    @IBOutlet weak var statusLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if micSession.isActive {
            micButton.backgroundColor = .systemPink
        } else {
            micButton.backgroundColor = .systemGreen
        }
        
        // Do any additional setup after loading the view.
    }
    
    @IBAction func sessionPress(_ sender: Any) {
        self.performSegue(withIdentifier: "sessionSegue", sender: sender)
    }
    
    @IBAction func toggleMic(_ sender: Any) {
        micSession.toggle()
        if micSession.isActive {
            statusLabel.text = "Sing your lungs out!"
            micButton.backgroundColor = .systemPink
        } else {
            statusLabel.text = "Ready to sing!"
            micButton.backgroundColor = .systemGreen
        }
    }
    
    @IBAction func startMic(_ sender: Any) {
        micSession.start()
    }
    
    @IBAction func stopMic(_ sender: Any) {
        micSession.stop()
    }
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
        if segue.identifier == "sessionSegue" {
            let sessionVC = segue.destination as! SessionViewController
            sessionVC.callback = { id in
                let urlStr: String = "https://yodl.aws.andrewarpasi.com/vid.html?id=" + id
                print("Will load: " + urlStr)
                let link = URL(string: "https://yodl.aws.andrewarpasi.com/vid.html?id=" + id)!
                let request = URLRequest(url: link)
                self.webView.load(request)
            }
        }
    }

}
