"use strict";(self.webpackChunkpublic_square=self.webpackChunkpublic_square||[]).push([[592],{9935:(O,E,r)=>{r.d(E,{R:()=>g});var m=r(4004),a=r(2076),v=r(6174),_=r(4650),P=r(2753),k=r(608),T=r(1250),u=r(8503);let g=(()=>{class f{constructor(o,s,t,l){this._arweave=o,this._userAuth=s,this._appSettings=t,this._utils=l,this._ardb1=new v.f(this._arweave.arweave),this._ardb2=new v.f(this._arweave.arweave)}follow(o,s,t=[]){const l=this._userAuth.getPrivateKey(),h=this._userAuth.loginMethod,n=[{name:"App-Name",value:this._appSettings.protocolName},{name:"Version",value:this._appSettings.protocolVersion},{name:"Type",value:"follow"},...t],b=o.length;if(b<=0)throw new Error("You need to follow at least one address!");for(let c=0;c<b;c++)n.push({name:"Wallet",value:o[c]});return this._arweave.uploadFileToArweave("follow","text/plain",l,n,h,s)}getFollowers(o=[],s,t){return this._ardb1.searchTransactions([],s,t,[{name:"App-Name",values:[this._appSettings.protocolName]},{name:"Content-Type",values:["text/plain"]},{name:"Type",values:["follow"]},{name:"Wallet",values:o}],["id","owner"]).pipe((0,m.U)(n=>n.map(e=>({id:e.id,owner:e.owner.address,blockId:e.block&&e.block.id?e.block.id:"",blockHeight:e.block&&e.block.height?e.block.height:0,dataSize:e.data?e.data.size:void 0,dataType:e.data?e.data.type:void 0,blockTimestamp:e.block&&e.block.timestamp?e.block.timestamp:void 0}))))}next(){return(0,a.D)(this._ardb1.next()).pipe((0,m.U)(o=>o&&o.length?o.map(t=>({id:t.id,owner:t.owner.address,blockId:t.block&&t.block.id?t.block.id:"",blockHeight:t.block&&t.block.height?t.block.height:0,dataSize:t.data?t.data.size:void 0,dataType:t.data?t.data.type:void 0,blockTimestamp:t.block&&t.block.timestamp?t.block.timestamp:void 0,tags:t.tags?t.tags:void 0})):[]))}getFollowing(o=[],s,t){return this._ardb2.searchTransactions(o,s,t,[{name:"App-Name",values:[this._appSettings.protocolName]},{name:"Content-Type",values:["text/plain"]},{name:"Type",values:["follow"]}],["id","owner","tags"]).pipe((0,m.U)(n=>n.map(e=>({id:e.id,owner:e.owner.address,blockId:e.block&&e.block.id?e.block.id:"",blockHeight:e.block&&e.block.height?e.block.height:0,dataSize:e.data?e.data.size:void 0,dataType:e.data?e.data.type:void 0,blockTimestamp:e.block&&e.block.timestamp?e.block.timestamp:void 0,tags:e.tags?e.tags:void 0}))))}nextFollowing(){return(0,a.D)(this._ardb2.next()).pipe((0,m.U)(o=>o&&o.length?o.map(t=>({id:t.id,owner:t.owner.address,blockId:t.block&&t.block.id?t.block.id:"",blockHeight:t.block&&t.block.height?t.block.height:0,dataSize:t.data?t.data.size:void 0,dataType:t.data?t.data.type:void 0,blockTimestamp:t.block&&t.block.timestamp?t.block.timestamp:void 0,tags:t.tags?t.tags:void 0})):[]))}}return f.\u0275fac=function(o){return new(o||f)(_.LFG(P.N),_.LFG(k.H),_.LFG(T.X),_.LFG(u.F))},f.\u0275prov=_.Yz7({token:f,factory:f.\u0275fac,providedIn:"root"}),f})()},3745:(O,E,r)=>{r.d(E,{q:()=>u});var m=r(4004),a=r(2076),v=r(6174),_=r(4650),P=r(2753),k=r(608),T=r(1250);let u=(()=>{class g{constructor(d,o,s){this._arweave=d,this._userAuth=o,this._appSettings=s,this._ardb=new v.f(this._arweave.arweave)}getLatestPosts(d=[],o,s){return this._ardb.searchTransactions(d,o,s,[{name:"App-Name",values:[this._appSettings.protocolName]},{name:"Content-Type",values:["text/plain"]},{name:"Type",values:["post","repost"]}]).pipe((0,m.U)(l=>l.map(n=>({id:n.id,owner:n.owner.address,blockId:n.block&&n.block.id?n.block.id:"",blockHeight:n.block&&n.block.height?n.block.height:0,dataSize:n.data?n.data.size:void 0,dataType:n.data?n.data.type:void 0,blockTimestamp:n.block&&n.block.timestamp?n.block.timestamp:void 0,tags:n.tags}))))}next(){return(0,a.D)(this._ardb.next()).pipe((0,m.U)(d=>d&&d.length?d.map(s=>({id:s.id,owner:s.owner.address,blockId:s.block&&s.block.id?s.block.id:"",blockHeight:s.block&&s.block.height?s.block.height:0,dataSize:s.data?s.data.size:void 0,dataType:s.data?s.data.type:void 0,blockTimestamp:s.block&&s.block.timestamp?s.block.timestamp:void 0,tags:s.tags})):[]))}getPendingPosts(d=[],o,s){return this.getLatestPosts(d,o,s).pipe((0,m.U)(t=>t.filter(h=>!h.blockId)))}}return g.\u0275fac=function(d){return new(d||g)(_.LFG(P.N),_.LFG(k.H),_.LFG(T.X))},g.\u0275prov=_.Yz7({token:g,factory:g.\u0275fac,providedIn:"root"}),g})()},2413:(O,E,r)=>{r.d(E,{r:()=>b});var m=r(727),a=r(4650),v=r(2425),_=r(2753),P=r(6895),k=r(3238),T=r(3162),u=r(3546),g=r(9197),f=r(5051);function d(e,c){1&e&&a._UZ(0,"mat-progress-bar",5)}function o(e,c){if(1&e&&(a.TgZ(0,"mat-card-title",8),a._uU(1),a.qZA()),2&e){const i=a.oxw(2);a.xp6(1),a.Oqu(i.profile.name)}}function s(e,c){if(1&e&&(a.TgZ(0,"mat-card-subtitle",8),a._uU(1),a.qZA()),2&e){const i=a.oxw(2);a.xp6(1),a.Oqu(i.profile.username)}}function t(e,c){if(1&e&&(a.TgZ(0,"mat-card-header"),a._UZ(1,"img",6),a.YNc(2,o,2,1,"mat-card-title",7),a.YNc(3,s,2,1,"mat-card-subtitle",7),a.qZA()),2&e){const i=a.oxw();a.xp6(1),a.Q6J("src",i.profile.avatarURL||i.defaultProfileImage,a.LSH),a.xp6(1),a.Q6J("ngIf",i.profile.name),a.xp6(1),a.Q6J("ngIf",i.profile.username)}}function l(e,c){if(1&e&&a._UZ(0,"img",9),2&e){const i=a.oxw();a.Q6J("src",i.getImageUrl(""),a.LSH)}}const h=function(){return[]},n=function(e){return["/",e]};let b=(()=>{class e{constructor(i,p){this._profile=i,this._arweave=p,this.address="",this.profile=null,this._profileSubscription=m.w0.EMPTY,this.defaultProfileImage="assets/images/blank-profile.jpg",this.loadingProfile=!1,this.disableNavigateToProfile=!1,this.hideSecondaryAddressess=!1}ngOnInit(){this.loadingProfile=!0,this._profileSubscription=this._profile.getProfileByAddress(this.address).subscribe({next:i=>{this.profile=i,this.loadingProfile=!1},error:i=>{console.error("ErrProfile:",i),this.loadingProfile=!1}})}ngOnDestroy(){this._profileSubscription.unsubscribe()}getImageUrl(i){let p=this._arweave.getImageUrl(i);return p||(p=this.defaultProfileImage),p}}return e.\u0275fac=function(i){return new(i||e)(a.Y36(v.H),a.Y36(_.N))},e.\u0275cmp=a.Xpm({type:e,selectors:[["app-user-card"]],inputs:{address:"address",disableNavigateToProfile:"disableNavigateToProfile",hideSecondaryAddressess:"hideSecondaryAddressess"},decls:6,vars:8,consts:[[1,"user-card","mat-elevation-z0",3,"routerLink"],["mode","buffer","color","accent",4,"ngIf"],[4,"ngIf"],["class","default-img","mat-card-avatar","",3,"src",4,"ngIf"],["matLine","",3,"address"],["mode","buffer","color","accent"],["mat-card-avatar","",3,"src"],["class","word-break",4,"ngIf"],[1,"word-break"],["mat-card-avatar","",1,"default-img",3,"src"]],template:function(i,p){1&i&&(a.TgZ(0,"mat-card",0),a.YNc(1,d,1,0,"mat-progress-bar",1),a.YNc(2,t,4,3,"mat-card-header",2),a.TgZ(3,"mat-card-content"),a.YNc(4,l,1,1,"img",3),a._UZ(5,"app-arweave-address",4),a.qZA()()),2&i&&(a.Q6J("routerLink",p.disableNavigateToProfile?a.DdM(5,h):a.VKq(6,n,p.address)),a.xp6(1),a.Q6J("ngIf",p.loadingProfile),a.xp6(1),a.Q6J("ngIf",p.profile),a.xp6(2),a.Q6J("ngIf",!p.profile),a.xp6(1),a.Q6J("address",p.address))},dependencies:[P.O5,k.X2,T.pW,u.a8,u.dk,u.dn,u.n5,u.$j,u.kc,g.rH,f.N],styles:[".user-card[_ngcontent-%COMP%]{width:100%;cursor:pointer;padding:20px;min-height:100%}.default-img[_ngcontent-%COMP%]{float:left;margin-right:12px;margin-left:6px}"]}),e})()}}]);