"use strict";(self.webpackChunkpublic_square=self.webpackChunkpublic_square||[]).push([[243],{9243:(dt,w,r)=>{r.r(w),r.d(w,{HomeModule:()=>at});var f=r(6895),_=r(9197),t=r(4650),d=r(727),A=r(9646),P=r(4004),p=r(3900),S=r(5577),h=r(5938),v=r(2753),Z=r(9935),F=r(8503),M=r(2425),u=r(4006),R=r(6709),m=r(3546),b=r(4859),x=r(3238),C=r(3848),T=r(1572),y=r(2413);function O(i,a){if(1&i){const e=t.EpF();t.TgZ(0,"div",17)(1,"div",18)(2,"section",19)(3,"mat-checkbox",20),t.NdJ("change",function(s){const n=t.CHM(e),l=n.index,c=n.$implicit,g=t.oxw();return t.KtG(g.followingChange(s.checked,l,c,!0))}),t.qZA()()(),t.TgZ(4,"app-user-card",21),t.NdJ("click",function(){const s=t.CHM(e),n=s.index,l=s.$implicit,c=t.oxw();return t.KtG(c.followingChange(!c.aliasesFollowing.controls[n].value,n,l,!0))}),t.qZA()()}if(2&i){const e=a.$implicit,o=a.index;t.xp6(3),t.Q6J("formControlName",o),t.xp6(1),t.Q6J("disableNavigateToProfile",!0)("hideSecondaryAddressess",!0)("address",e)}}function N(i,a){1&i&&t._UZ(0,"mat-spinner",22)}function Y(i,a){1&i&&(t.TgZ(0,"div",23),t._uU(1," You are not following anyone yet! "),t.qZA())}function H(i,a){if(1&i){const e=t.EpF();t.TgZ(0,"div",24)(1,"div",18)(2,"section",19)(3,"mat-checkbox",20),t.NdJ("change",function(s){const n=t.CHM(e),l=n.index,c=n.$implicit,g=t.oxw();return t.KtG(g.followersChange(s.checked,l,c,!0))}),t.qZA()()(),t.TgZ(4,"app-user-card",25),t.NdJ("click",function(){const s=t.CHM(e),n=s.index,l=s.$implicit,c=t.oxw();return t.KtG(c.followersChange(!c.aliasesFollowers.controls[n].value,n,l,!0))}),t.qZA()()}if(2&i){const e=a.$implicit,o=a.index;t.xp6(3),t.Q6J("formControlName",o),t.xp6(1),t.Q6J("address",e)("disableNavigateToProfile",!0)}}function I(i,a){1&i&&t._UZ(0,"mat-spinner",22)}function L(i,a){1&i&&(t.TgZ(0,"div",23),t._uU(1," You have no followers yet! "),t.qZA())}let J=(()=>{class i{constructor(e,o,s,n,l,c,g){this._arweave=e,this._follow=o,this._utils=s,this._dialogRef=n,this.data=l,this._profile=c,this._fb=g,this._profileSubscription=d.w0.EMPTY,this.followers=new Set([]),this.maxFollowers=10,this.loadingFollowers=!1,this._followersSubscription=d.w0.EMPTY,this._nextResultsFollowersSubscription=d.w0.EMPTY,this.addressList=new Set([]),this.moreResultsAvailableFollowers=!0,this.following=new Set([]),this.maxFollowing=10,this.loadingFollowing=!1,this._followingSubscription=d.w0.EMPTY,this._nextResultsFollowingSubscription=d.w0.EMPTY,this.moreResultsAvailableFollowing=!0,this.filterForm=this._fb.group({following:this._fb.group({aliases:this._fb.array([])}),followers:this._fb.group({aliases:this._fb.array([])})})}get aliasesFollowing(){return this.filterForm.get("following").get("aliases")}addAliasFollowing(e){this.aliasesFollowing.push(this._fb.control(e))}get aliasesFollowers(){return this.filterForm.get("followers").get("aliases")}addAliasFollowers(e){this.aliasesFollowers.push(this._fb.control(e))}ngOnInit(){this._profileSubscription=this._profile.getProfileByAddress(this.data.address).subscribe({next:e=>{const o=e&&e.address?[e.address]:[this.data.address];this.loadFollowers(o),this.loadFollowing(o)},error:e=>{this._utils.message(e,"error")}})}close(e=[]){this._dialogRef.close(e)}loadFollowers(e){this.loadingFollowers=!0,this.followers.clear(),this._followersSubscription=this._arweave.getNetworkInfo().pipe((0,p.w)(o=>this._follow.getFollowers(e,this.maxFollowers,o.height))).subscribe({next:o=>{(!o||!o.length)&&(this.moreResultsAvailableFollowers=!1);for(const s of o)this.followers.has(s.owner)||(this.data.filterList.indexOf(s.owner)>=0?this.addAliasFollowers(s.owner):this.addAliasFollowers("")),this.followers.add(s.owner);this.loadingFollowers=!1},error:o=>{this.loadingFollowers=!1,this.moreResultsAvailableFollowers=!1,this._utils.message(o,"error")}})}moreResultsFollowers(){this.loadingFollowers=!0,this._nextResultsFollowersSubscription=this._follow.next().subscribe({next:e=>{(!e||!e.length)&&(this.moreResultsAvailableFollowers=!1);for(const o of e){if(!this.followers.has(o.owner)){const s=this.getIndexFromFollowing(o.owner);s>=0&&this.aliasesFollowing.controls[s].value||this.data.filterList.indexOf(o.owner)>=0?this.addAliasFollowers(o.owner):this.addAliasFollowers("")}this.followers.add(o.owner)}this.loadingFollowers=!1},error:e=>{this.loadingFollowers=!1,this._utils.message(e,"error")}})}ngOnDestroy(){this._followersSubscription.unsubscribe(),this._nextResultsFollowersSubscription.unsubscribe(),this._profileSubscription.unsubscribe(),this._followingSubscription.unsubscribe(),this._nextResultsFollowingSubscription.unsubscribe()}loadFollowing(e){this.loadingFollowing=!0,this.following.clear(),this._followingSubscription=this._arweave.getNetworkInfo().pipe((0,p.w)(o=>this._follow.getFollowing(e,this.maxFollowing,o.height))).subscribe({next:o=>{(!o||!o.length)&&(this.moreResultsAvailableFollowing=!1);for(const s of o){const n=s.tags?s.tags:[];for(const l of n)"Wallet"===l.name&&(this._arweave.validateAddress(l.value)?(this.following.has(l.value)||(this.data.filterList.indexOf(l.value)>=0?this.addAliasFollowing(l.value):this.addAliasFollowing("")),this.following.add(l.value)):console.error("Invalid Substory tag",l))}this.loadingFollowing=!1},error:o=>{this.loadingFollowing=!1,this.moreResultsAvailableFollowing=!1,this._utils.message(o,"error")}})}moreResultsFollowing(){this.loadingFollowing=!0,this._nextResultsFollowingSubscription=this._follow.nextFollowing().subscribe({next:e=>{(!e||!e.length)&&(this.moreResultsAvailableFollowing=!1);for(const o of e){const s=o.tags?o.tags:[];for(const n of s)if("Wallet"===n.name)if(this._arweave.validateAddress(n.value)){if(!this.following.has(n.value)){const l=this.getIndexFromFollowers(n.value);l>=0&&this.aliasesFollowers.controls[l].value||this.data.filterList.indexOf(n.value)>=0?this.addAliasFollowing(n.value):this.addAliasFollowing("")}this.following.add(n.value)}else console.error("Invalid Substory tag",n)}this.loadingFollowing=!1},error:e=>{this.loadingFollowing=!1,this._utils.message(e,"error")}})}onSubmit(){for(const o of this.aliasesFollowing.controls)this._arweave.validateAddress(o.value)&&this.addressList.add(o.value);for(const o of this.aliasesFollowers.controls)this._arweave.validateAddress(o.value)&&this.addressList.add(o.value);const e=this.data.filterList.length;for(let o=0;o<e;o++){const s=this.getIndexFromFollowers(this.data.filterList[o]),n=this.getIndexFromFollowing(this.data.filterList[o]);s<0&&n<0&&this.addressList.add(this.data.filterList[o])}this.close(Array.from(this.addressList))}followingChange(e,o,s,n=!1){if(this.aliasesFollowing.controls[o].setValue(""),e&&this.aliasesFollowing.controls[o].setValue(s),n){const l=this.getIndexFromFollowers(s);l>=0&&this.followersChange(e,l,s,!1)}}getIndexFromFollowers(e){const o=Array.from(this.followers),s=o.length;for(let n=0;n<s;n++)if(o[n]===e)return n;return-1}getIndexFromFollowing(e){const o=Array.from(this.following),s=o.length;for(let n=0;n<s;n++)if(o[n]===e)return n;return-1}followersChange(e,o,s,n=!1){if(this.aliasesFollowers.controls[o].setValue(""),e&&this.aliasesFollowers.controls[o].setValue(s),n){const l=this.getIndexFromFollowing(s);l>=0&&this.followingChange(e,l,s,!1)}}}return i.\u0275fac=function(e){return new(e||i)(t.Y36(v.N),t.Y36(Z.R),t.Y36(F.F),t.Y36(h.so),t.Y36(h.WI),t.Y36(M.H),t.Y36(u.qu))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-filter-dialog"]],decls:28,vars:11,consts:[[3,"formGroup","ngSubmit"],[1,"content"],["color","accent","mat-align-tabs","center"],["label","Following","formGroupName","following"],["formArrayName","aliases"],["class","following-list-col",4,"ngFor","ngForOf"],[1,"more-results-container","clear-both"],["color","accent","diameter","32",4,"ngIf"],["class","no-results",4,"ngIf"],["matRipple","",1,"more-results-card","mat-elevation-z0",3,"click"],[1,"more-results","text-center"],["label","Followers","formGroupName","followers"],["class","followers-list-col",4,"ngFor","ngForOf"],["align","start"],["type","button","mat-button","","cdkFocusInitial","",3,"click"],[1,"spacer"],["type","submit","mat-flat-button","","color","accent"],[1,"following-list-col"],[1,"col-chk"],[1,"text-center"],[3,"formControlName","change"],[1,"col-user-card",3,"disableNavigateToProfile","hideSecondaryAddressess","address","click"],["color","accent","diameter","32"],[1,"no-results"],[1,"followers-list-col"],[1,"col-user-card",3,"address","disableNavigateToProfile","click"]],template:function(e,o){1&e&&(t.TgZ(0,"form",0),t.NdJ("ngSubmit",function(){return o.onSubmit()}),t.TgZ(1,"mat-dialog-content",1)(2,"mat-tab-group",2)(3,"mat-tab",3)(4,"div",4),t.YNc(5,O,5,4,"div",5),t.TgZ(6,"div",6),t.YNc(7,N,1,0,"mat-spinner",7),t.YNc(8,Y,2,0,"div",8),t.TgZ(9,"mat-card",9),t.NdJ("click",function(){return o.moreResultsFollowing()}),t.TgZ(10,"mat-card-content",10),t._uU(11," Show more results "),t.qZA()()()()(),t.TgZ(12,"mat-tab",11)(13,"div",4),t.YNc(14,H,5,3,"div",12),t.TgZ(15,"div",6),t.YNc(16,I,1,0,"mat-spinner",7),t.YNc(17,L,2,0,"div",8),t.TgZ(18,"mat-card",9),t.NdJ("click",function(){return o.moreResultsFollowers()}),t.TgZ(19,"mat-card-content",10),t._uU(20," Show more results "),t.qZA()()()()()()(),t.TgZ(21,"mat-dialog-actions",13)(22,"button",14),t.NdJ("click",function(){return o.close()}),t._uU(23,"Clear"),t.qZA(),t._UZ(24,"div",15),t.TgZ(25,"button",16)(26,"span"),t._uU(27,"Apply"),t.qZA()()()()),2&e&&(t.Q6J("formGroup",o.filterForm),t.xp6(5),t.Q6J("ngForOf",o.following),t.xp6(2),t.Q6J("ngIf",o.loadingFollowing),t.xp6(1),t.Q6J("ngIf",!o.following.size&&!o.loadingFollowing),t.xp6(1),t.Udp("visibility",!o.loadingFollowing&&o.moreResultsAvailableFollowing?"visible":"hidden"),t.xp6(5),t.Q6J("ngForOf",o.followers),t.xp6(2),t.Q6J("ngIf",o.loadingFollowers),t.xp6(1),t.Q6J("ngIf",!o.followers.size&&!o.loadingFollowers),t.xp6(1),t.Udp("visibility",!o.loadingFollowers&&o.moreResultsAvailableFollowers?"visible":"hidden"))},dependencies:[f.sg,f.O5,R.oG,m.a8,m.dn,u._Y,u.JJ,u.JL,u.sg,u.u,u.x0,u.CE,b.lW,x.wG,C.SP,C.uX,T.Ou,h.xY,h.H8,y.r],styles:[".content[_ngcontent-%COMP%]{min-height:428px;max-width:666px}.more-results[_ngcontent-%COMP%]{cursor:pointer;font-weight:700;font-style:italic;font-size:12px}.mat-spinner[_ngcontent-%COMP%]{margin:20px auto 0}.no-results[_ngcontent-%COMP%]{padding:20px;font-size:12px;text-align:center}.col-chk[_ngcontent-%COMP%]{float:left;width:20%;min-height:100px}.col-user-card[_ngcontent-%COMP%]{float:left;width:80%;min-height:100px}section[_ngcontent-%COMP%]{margin-top:20px}"]}),i})();var E=r(4135),U=r(3745),D=r(608),Q=r(1250),G=r(5089),j=r(3683),z=r(7392),$=r(4850),B=r(130),k=r(3275),K=r(4463);const W=["moreResultsCard"];function V(i,a){1&i&&(t.TgZ(0,"mat-icon",18),t._uU(1,"filter_list"),t.qZA())}function X(i,a){1&i&&(t.TgZ(0,"mat-icon",19),t._uU(1,"filter_list_off"),t.qZA())}function q(i,a){if(1&i){const e=t.EpF();t.TgZ(0,"button",15),t.NdJ("click",function(){t.CHM(e);const s=t.oxw();return t.KtG(s.openFilterDialog())}),t.YNc(1,V,2,0,"mat-icon",16),t.YNc(2,X,2,0,"mat-icon",17),t.TgZ(3,"span"),t._uU(4,"Filter"),t.qZA()()}if(2&i){const e=t.oxw();t.xp6(1),t.Q6J("ngIf",e.filterList.length),t.xp6(1),t.Q6J("ngIf",!e.filterList.length)}}function tt(i,a){if(1&i){const e=t.EpF();t.TgZ(0,"div",20)(1,"app-create-post-card",21),t.NdJ("newStoryEvent",function(s){t.CHM(e);const n=t.oxw();return t.KtG(n.newStoryCreated(s))}),t.qZA()()}if(2&i){const e=t.oxw();t.xp6(1),t.Q6J("account",e.account)}}function ot(i,a){1&i&&t._UZ(0,"mat-divider")}function et(i,a){1&i&&t._UZ(0,"app-post-card",22),2&i&&t.Q6J("post",a.$implicit)}function st(i,a){1&i&&t._UZ(0,"mat-spinner",23)}function it(i,a){1&i&&(t.TgZ(0,"div",24),t._uU(1),t.ALo(2,"translate"),t.qZA()),2&i&&(t.xp6(1),t.hij(" ",t.lcZ(2,1,"GENERAL.LABELS.NO_RESULTS")," "))}const nt=[{path:"",component:(()=>{class i{constructor(e,o,s,n,l,c,g,ct,gt){this._post=e,this._pendingPosts=o,this._auth=s,this._appSettings=n,this._utils=l,this._arweave=c,this._ngZone=g,this._dialog=ct,this._userSettings=gt,this._postSubscription=d.w0.EMPTY,this._nextResultsSubscription=d.w0.EMPTY,this._pendingPostsSubscription=d.w0.EMPTY,this.posts=[],this.maxPosts=10,this.loadingPosts=!1,this.account="",this.version="",this.moreResultsAvailable=!0,this.filterList=[],this.version=this._appSettings.appVersion}ngOnInit(){this.account=this._auth.getMainAddressSnapshot(),this._auth.account$.subscribe(e=>{this.account=e,this._pendingPostsSubscription=this._pendingPosts.getPendingPosts([this.account]).subscribe(o=>{const s=Array.isArray(o)&&o.length?o.filter(n=>{for(const l of this.posts)if(l.id==n.id)return!1;return!0}):[];this.posts.unshift(...s)})}),this.loadPosts(),this._appSettings.scrollTopStream.subscribe(e=>{this._ngZone.run(()=>{const o=this.moreResultsCard.nativeElement.offsetTop-this.moreResultsCard.nativeElement.scrollTop;e>o-700&&o&&!this.loadingPosts&&this.moreResultsAvailable&&this.moreResults()})})}loadPosts(e=[]){this.loadingPosts=!0,this.posts=[],this._postSubscription=this._arweave.getNetworkInfo().pipe((0,p.w)(o=>this._post.getLatestPosts(e,this.maxPosts,o.height)),(0,S.z)(o=>this.account?this._pendingPosts.getPendingPosts(e.length?e:[this.account]).pipe((0,P.U)(n=>n.filter(c=>{for(const g of this.posts)if(g.id==c.id)return!1;return!0}).concat(o))):(0,A.of)(o))).subscribe({next:o=>{o&&o.length?this.posts.push(...o):this.moreResultsAvailable=!1,this.loadingPosts=!1},error:o=>{this.loadingPosts=!1,this.moreResultsAvailable=!1,this._utils.message(o,"error")}})}moreResults(){this.loadingPosts=!0,this._nextResultsSubscription=this._post.next().subscribe({next:e=>{(!e||!e.length)&&(this.moreResultsAvailable=!1),this.posts=this.posts.concat(e),this.loadingPosts=!1},error:e=>{this.loadingPosts=!1,this.moreResultsAvailable=!1,this._utils.message(e,"error")}})}ngOnDestroy(){this._postSubscription.unsubscribe(),this._nextResultsSubscription.unsubscribe(),this._pendingPostsSubscription.unsubscribe()}newStoryCreated(e){this.posts.unshift({id:e,owner:this.account})}openFilterDialog(){const e=this._userSettings.getDefaultLang(),o=this._userSettings.getLangObject(e);this._dialog.open(J,{restoreFocus:!1,autoFocus:!1,disableClose:!1,data:{address:this.account,filterList:this.filterList},direction:o&&"LTR"===o.writing_system?"ltr":"rtl",width:"480px"}).afterClosed().subscribe(l=>{l&&l.length?(this.filterList=l,this.loadPosts(l)):(this.filterList=[],this.loadPosts())})}}return i.\u0275fac=function(e){return new(e||i)(t.Y36(E.L),t.Y36(U.q),t.Y36(D.H),t.Y36(Q.X),t.Y36(F.F),t.Y36(v.N),t.Y36(t.R0b),t.Y36(h.uw),t.Y36(G.s))},i.\u0275cmp=t.Xpm({type:i,selectors:[["ng-component"]],viewQuery:function(e,o){if(1&e&&t.Gf(W,5,t.SBq),2&e){let s;t.iGM(s=t.CRH())&&(o.moreResultsCard=s.first)}},decls:24,vars:14,consts:[["color","primary",1,"secondary-toolbar"],["mat-icon-button",""],[1,"spacer"],["color","primary","class","btn-filter","mat-flat-button","",3,"click",4,"ngIf"],[1,"col-body","fadeIn"],["class","post-card-container",4,"ngIf"],[4,"ngIf"],[1,"post-list-container"],[3,"post",4,"ngFor","ngForOf"],[1,"more-results-container"],["color","accent","diameter","32",4,"ngIf"],["class","no-results",4,"ngIf"],["matRipple","",1,"more-results-card","mat-elevation-z0",3,"click"],["moreResultsCard",""],[1,"more-results","text-center"],["color","primary","mat-flat-button","",1,"btn-filter",3,"click"],["color","accent","class","material-icons-outlined",4,"ngIf"],["color","warn","class","material-icons-outlined",4,"ngIf"],["color","accent",1,"material-icons-outlined"],["color","warn",1,"material-icons-outlined"],[1,"post-card-container"],[3,"account","newStoryEvent"],[3,"post"],["color","accent","diameter","32"],[1,"no-results"]],template:function(e,o){1&e&&(t.TgZ(0,"div")(1,"p")(2,"mat-toolbar",0)(3,"button",1)(4,"mat-icon"),t._uU(5,"house"),t.qZA()(),t.TgZ(6,"span"),t._uU(7),t.ALo(8,"translate"),t.qZA(),t._UZ(9,"div",2),t.YNc(10,q,5,2,"button",3),t.qZA()(),t.TgZ(11,"div",4),t.YNc(12,tt,2,1,"div",5),t.YNc(13,ot,1,0,"mat-divider",6),t.TgZ(14,"div",7),t.YNc(15,et,1,1,"app-post-card",8),t.qZA(),t.TgZ(16,"div",9),t.YNc(17,st,1,0,"mat-spinner",10),t.YNc(18,it,3,3,"div",11),t.TgZ(19,"mat-card",12,13),t.NdJ("click",function(){return o.moreResults()}),t.TgZ(21,"mat-card-content",14),t._uU(22),t.ALo(23,"translate"),t.qZA()()()()()),2&e&&(t.xp6(7),t.Oqu(t.lcZ(8,10,"MAIN_MENU.HOME")),t.xp6(3),t.Q6J("ngIf",o.account),t.xp6(2),t.Q6J("ngIf",o.account),t.xp6(1),t.Q6J("ngIf",o.account),t.xp6(2),t.Q6J("ngForOf",o.posts),t.xp6(2),t.Q6J("ngIf",o.loadingPosts),t.xp6(1),t.Q6J("ngIf",!o.posts.length&&!o.loadingPosts),t.xp6(1),t.Udp("visibility",!o.loadingPosts&&o.moreResultsAvailable?"visible":"hidden"),t.xp6(3),t.hij(" ",t.lcZ(23,12,"GENERAL.LABELS.SHOW_OLDER_RESULTS")," "))},dependencies:[f.sg,f.O5,j.Ye,z.Hw,b.lW,$.d,m.a8,m.dn,x.wG,T.Ou,B.b,k.i,K.X$],styles:[".col-body[_ngcontent-%COMP%]{width:100%;float:left;border-right:solid 1px rgba(250,250,250,.12);min-height:100%;position:relative}.col-side-features[_ngcontent-%COMP%]{display:none;position:relative;min-height:100%}.col-wrap[_ngcontent-%COMP%]{width:100%;min-height:100%;padding:20px}@media (min-width: 600px){.col-body[_ngcontent-%COMP%]{width:100%}.col-side-features[_ngcontent-%COMP%]{width:28%;float:left;display:block}.post-card-container[_ngcontent-%COMP%]{margin-left:52px!important;margin-right:52px!important}}.col-side-features[_ngcontent-%COMP%]   mat-card[_ngcontent-%COMP%]{margin-bottom:20px}mat-divider[_ngcontent-%COMP%]{margin-top:20px;margin-bottom:0}.post-card-container[_ngcontent-%COMP%]{margin:20px}.more-results[_ngcontent-%COMP%]{font-weight:700;font-style:italic}.more-results-card[_ngcontent-%COMP%]{cursor:pointer;border-radius:0;width:100%;margin-top:20px;height:50px;margin-bottom:60px}.more-results-container[_ngcontent-%COMP%]{padding-top:20px}.mat-spinner[_ngcontent-%COMP%]{margin:0 auto}.no-results[_ngcontent-%COMP%]{padding:20px;text-align:center;font-style:italic}.version-container[_ngcontent-%COMP%]   .mat-card-content[_ngcontent-%COMP%]{font-size:10px;text-align:right;font-style:italic;color:#ccc}.btn-filter[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{margin-left:6px}.btn-filter[_ngcontent-%COMP%]   .mat-accent[_ngcontent-%COMP%]{color:#50cb82!important}"]}),i})()}];let lt=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({imports:[_.Bz.forChild(nt),_.Bz]}),i})();var rt=r(4466);let at=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({imports:[f.ez,lt,rt.m]}),i})()}}]);