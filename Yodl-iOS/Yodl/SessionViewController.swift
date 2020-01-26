//
//  SessionViewController.swift
//  Yodl
//
//  Created by Andrew Arpasi on 1/25/20.
//  Copyright © 2020 Andrew Arpasi. All rights reserved.
//

import UIKit

class SessionViewController: UIViewController {

    @IBOutlet weak var sessionField: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    @IBAction func cancelBtn(_ sender: Any) {
        self.dismiss(animated: true, completion: nil)
    }
    
    @IBAction func joinBtn(_ sender: Any) {
    }
    
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
