import { Component, OnInit, TemplateRef  } from '@angular/core';


import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-samplemodal',
  templateUrl: './samplemodal.component.html',
  styleUrls: ['./samplemodal.component.css']
})
export class SamplemodalComponent implements OnInit {

  
  ngOnInit() {
  }
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) {
   
  }
 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  


}
