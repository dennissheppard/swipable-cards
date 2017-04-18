import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SwipeGestureEventData, GesturesObserver, GestureTypes } from "ui/gestures";
import { GridLayout } from "ui/layouts/grid-layout";
import { AbsoluteLayout } from "ui/layouts/absolute-layout";
import { Label } from "ui/label";
import { Button } from "ui/button";
import { Image } from "ui/image";
import { CardService } from './card.service';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { School } from './school';

@Component({
    moduleId: module.id,
    templateUrl: "./card.component.html"
})
export class CardComponent implements OnInit {

    constructor(
        private cardService: CardService,
        private fonticon: TNSFontIconService
    ) { }

    schools: School[];
    i: number = 0;

    @ViewChild("absolutelayout") al: ElementRef;
    @ViewChild("yes") yes: ElementRef;
    @ViewChild("no") no: ElementRef;
    @ViewChild("swipeleft") swipeleft: ElementRef;
    @ViewChild("swiperight") swiperight: ElementRef;

    ngOnInit() {
        console.log('IN CARD COMPONENT');
        this.cardService.filterSchools()
            .subscribe((response) => {
                this.schools = response.results;
                console.log(this.schools);
                //get ready for the swiping!
                for (var key in this.schools) {
                    this.handleSwipe(key);
                }
            }, (error) => {
                console.log('ERRORS EVERYWHERE!!! ' + error);
            });

    }

    handleSwipe(key: any) {

        this.i--;
        let currentSchool = this.schools[key];

        let grid = new GridLayout();
        let collegeName = new Label();
        let bgImage = new Image();
        bgImage.src = currentSchool.photo_url;

        let yes = <Label>this.yes.nativeElement;
        let no = <Label>this.no.nativeElement;
        let absolutelayout = <AbsoluteLayout>this.al.nativeElement;

        //set the text on the card
        collegeName.text = currentSchool.name;
        //android specific
        collegeName.verticalAlignment = "center";

        //build the grid which is the card
        grid.cssClass = 'card ';//  + currentSchool.imageUrl;
        grid.id = 'card' + currentSchool.id;
        grid.marginTop = this.i;
        
        //add the emoji to the grid, and the grid to the absolutelayout
        grid.addChild(collegeName);
        grid.addChild(bgImage);
        absolutelayout.addChild(grid);

        //handle tapping
        /*swiperight.addEventListener("tap", function(){
            //animate yes
        });

        swipeleft.addEventListener("tap", function(){
            //animate no
        })*/

        //make card swipable
        grid.on(GestureTypes.swipe, function (args: SwipeGestureEventData) {
            if (args.direction == 1) {
                //right
                yes.animate({ opacity: 0, duration: 100 })
                    .then(() => yes.animate({ opacity: 1, duration: 100 }))
                    .then(() => yes.animate({ opacity: 0, duration: 100 }))
                    .then(() =>
                        grid.animate({ translate: { x: 1000, y: 100 } })
                            .then(function () { return grid.animate({ translate: { x: 0, y: -2000 } }); })
                            .catch(function (e) {
                                console.log(e.message);
                            })
                    )
                    .catch((e) => {
                        console.log(e.message);
                    });
            }
            else {
                //left
                no.animate({ opacity: 0, duration: 100 })
                    .then(() => no.animate({ opacity: 1, duration: 100 }))
                    .then(() => no.animate({ opacity: 0, duration: 100 }))
                    .then(() =>
                        grid.animate({ translate: { x: -1000, y: 100 } })
                            .then(function () { return grid.animate({ translate: { x: 0, y: -2000 } }); })
                            .catch(function (e) {
                                console.log(e.message);
                            })
                    )
                    .catch((e) => {
                        console.log(e.message);
                    });
            }
        });
    }

}