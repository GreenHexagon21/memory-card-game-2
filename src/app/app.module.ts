import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {InputSwitchModule} from 'primeng/inputswitch';
import {DropdownModule} from 'primeng/dropdown';
import {SelectButtonModule} from 'primeng/selectbutton';
import {DialogModule} from 'primeng/dialog';
import {BadgeModule} from 'primeng/badge';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/pages/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardComponent } from './components/elements/card/card.component';
import { BoardComponent } from './components/elements/board/board.component';
import { HeaderComponent } from './components/elements/header/header.component';
import { TimerComponent } from './components/elements/timer/timer.component';
import { SourcesComponent } from './components/elements/sources/sources.component';
import { HistoryComponent } from './components/elements/history/history.component';
import { OptionsComponent } from './components/elements/options/options.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CardComponent,
    BoardComponent,
    HeaderComponent,
    TimerComponent,
    SourcesComponent,
    HistoryComponent,
    OptionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatGridListModule,
    MatInputModule,
    FormsModule,
    SidebarModule,
    ButtonModule,
    RouterModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
    InputSwitchModule,
    DropdownModule,
    SelectButtonModule,
    DialogModule,
    BadgeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
